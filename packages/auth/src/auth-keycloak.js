import {i18n} from './i18n.js';
import JSONLD from 'dbp-common/jsonld';
import * as commonUtils from 'dbp-common/utils';
import {EventBus} from 'dbp-common';
import  {KeycloakWrapper} from './keycloak.js';
import {LitElement} from "lit-element";
import {LoginStatus} from './util.js';


/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Dispatches an event `dbp-auth-init` and sets some global variables:
 *   window.DBPAuthSubject: Keycloak username
 *   window.DBPAuthToken: Keycloak token to send with your requests
 *   window.DBPAuthTokenParsed: Keycloak token content
 *   window.DBPUserFullName: Full name of the user
 *   window.DBPPersonId: Person identifier of the user
 *   window.DBPPerson: Person json object of the user (optional, enable by setting the `load-person` attribute,
 *                     which will dispatch a `dbp-auth-person-init` event when loaded)
 */
export class AuthKeycloak extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.forceLogin = false;
        this.loadPerson = false;
        this.token = "";
        this.tokenParsed = null;
        this.subject = "";
        this.name = "";
        this.personId = "";
        this.tryLogin = false;
        this.person = null;
        this.entryPointUrl = commonUtils.getAPiUrl();
        this._loginStatus = LoginStatus.UNKNOWN;

        // Keycloak config
        this.keycloakUrl = null;
        this.realm = null;
        this.clientId = null;
        this.silentCheckSsoRedirectUri = null;
        this.scope = null;

        // Create the events
        this.initEvent = new CustomEvent("dbp-auth-init", { "detail": "KeyCloak init event", bubbles: true, composed: true });
        this.personInitEvent = new CustomEvent("dbp-auth-person-init", { "detail": "KeyCloak person init event", bubbles: true, composed: true });
        this.keycloakDataUpdateEvent = new CustomEvent("dbp-auth-keycloak-data-update", { "detail": "KeyCloak data was updated", bubbles: true, composed: true });

        this._onKCChanged = this._onKCChanged.bind(this);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    _onKCChanged(event) {
        const kc = event.detail;
        let newPerson = false;

        if (kc.authenticated) {
            let tokenChanged = (this.token !== kc.token);
            this.tokenParsed = kc.tokenParsed;
            this.name = kc.idTokenParsed.name;
            this.token = kc.token;

            this.subject = kc.subject;
            const personId = kc.idTokenParsed.preferred_username;
            if (personId !== this.personId) {
                this.person = null;
                newPerson = true;
            }
            this.personId = personId;

            window.DBPAuthSubject = this.subject;
            window.DBPAuthToken = this.token;
            window.DBPAuthTokenParsed = this.tokenParsed;
            window.DBPUserFullName = this.name;
            window.DBPPersonId = this.personId;
            window.DBPPerson = this.person;

            this._setLoginStatus(LoginStatus.LOGGED_IN, tokenChanged || newPerson);
        } else {
            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
            }
            this.name = "";
            this.token = "";
            this.tokenParsed = null;
            this.subject = "";
            this.personId = "";
            this.person = null;

            window.DBPAuthSubject = this.subject;
            window.DBPAuthToken = this.token;
            window.DBPAuthTokenParsed = this.tokenParsed;
            window.DBPUserFullName = this.name;
            window.DBPPersonId = this.personId;
            window.DBPPerson = this.person;

            this._setLoginStatus(LoginStatus.LOGGED_OUT);
        }

        const that = this;

        if (newPerson) {
            this.dispatchEvent(this.initEvent);
        }

        if (newPerson && this.loadPerson) {
            JSONLD.initialize(this.entryPointUrl, (jsonld) => {
                // find the correct api url for the current person
                // we are fetching the logged-in person directly to respect the REST philosophy
                // see: https://github.com/api-platform/api-platform/issues/337
                const apiUrl = jsonld.getApiUrlForEntityName("Person") + '/' + that.personId;

                fetch(apiUrl, {
                    headers: {
                        'Content-Type': 'application/ld+json',
                        'Authorization': 'Bearer ' + that.token,
                    },
                })
                .then(response => response.json())
                .then((person) => {
                    that.person = person;
                    window.DBPPerson = person;
                    that.dispatchEvent(that.personInitEvent);
                    this._setLoginStatus(this._loginStatus, true);
                });
            }, {}, that.lang);
        }

        this.dispatchEvent(this.keycloakDataUpdateEvent);
    }

    _setLoginStatus(status, force) {
        if (this._loginStatus === status && !force)
            return;

        this._loginStatus = status;

        this._bus.publish('auth-update', {
            status: this._loginStatus,
            token: this.token,
            name: this.name,
            person: this.person,
        }, {
            retain: true,
        });
    }

    static get properties() {
        return {
            lang: { type: String },
            forceLogin: { type: Boolean, attribute: 'force-login' },
            tryLogin: { type: Boolean, attribute: 'try-login' },
            loadPerson: { type: Boolean, attribute: 'load-person' },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            name: { type: String, attribute: false },
            token: { type: String, attribute: false },
            subject: { type: String, attribute: false },
            personId: { type: String, attribute: false },
            person: { type: Object, attribute: false },
            _loginStatus: { type: String, attribute: false },
            keycloakUrl: { type: String, attribute: 'url' },
            realm: { type: String },
            clientId: { type: String, attribute: 'client-id' },
            silentCheckSsoRedirectUri: { type: String, attribute: 'silent-check-sso-redirect-uri' },
            scope: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.keycloakUrl)
            throw Error("url not set");
        if (!this.realm)
            throw Error("realm not set");
        if (!this.clientId)
            throw Error("client-id not set");

        this._bus = new EventBus();
        this._kcwrapper = new KeycloakWrapper(this.keycloakUrl, this.realm, this.clientId, this.silentCheckSsoRedirectUri);
        this._kcwrapper.addEventListener('changed', this._onKCChanged);

        this._bus.subscribe('auth-login', () => {
            this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
        });

        this._bus.subscribe('auth-logout', () => {
            // Keycloak will redirect right away without emitting events, so we have
            // to do this manually here
            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
            }
            this._kcwrapper.logout();
            // In case logout was aborted, for example with beforeunload,
            // revert back to being logged in
            if (this._loginStatus === LoginStatus.LOGGING_OUT) {
                this._setLoginStatus(LoginStatus.LOGGED_IN);
            }
        });

        const handleLogin = async () => {
            if (this.forceLogin || this._kcwrapper.isLoggingIn()) {
                this._setLoginStatus(LoginStatus.LOGGING_IN);
                await this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
            } else if (this.tryLogin) {
                this._setLoginStatus(LoginStatus.LOGGING_IN);
                await this._kcwrapper.tryLogin();
                if (this._loginStatus === LoginStatus.LOGGING_IN)
                    this._setLoginStatus(LoginStatus.LOGGED_OUT);
            } else {
                this._setLoginStatus(LoginStatus.LOGGED_OUT);
            }
        };

        handleLogin();
    }

    disconnectedCallback() {
        this._kcwrapper.removeEventListener('changed', this._onKCChanged);
        this._bus.close();

        super.disconnectedCallback();
    }
}