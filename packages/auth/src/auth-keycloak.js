import {i18n} from './i18n.js';
import JSONLD from '@dbp-toolkit/common/jsonld';
import {EventBus} from '@dbp-toolkit/common';
import  {KeycloakWrapper} from './keycloak.js';
import {LoginStatus} from './util.js';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";


/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Emits a set-property event for the attribute "auth":
 *   auth.subject: Keycloak username
 *   auth.token: Keycloak token to send with your requests
 *   auth.user-full-name: Full name of the user
 *   auth.person-id: Person identifier of the user
 *   auth.person: Person json object of the user (optional, enable by setting the `load-person` attribute)
 */
export class AuthKeycloak extends AdapterLitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.forceLogin = false;
        this.loadPerson = false;
        this.token = "";
        this.subject = "";
        this.name = "";
        this.personId = "";
        this.tryLogin = false;
        this.person = null;
        this.entryPointUrl = '';
        this._loginStatus = LoginStatus.UNKNOWN;

        // Keycloak config
        this.keycloakUrl = null;
        this.realm = null;
        this.clientId = null;
        this.silentCheckSsoRedirectUri = null;
        this.scope = null;
        this.idpHint = '';

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
            this.name = kc.idTokenParsed.name;
            this.token = kc.token;

            this.subject = kc.subject;
            const personId = kc.idTokenParsed.preferred_username;
            if (personId !== this.personId) {
                this.person = null;
                newPerson = true;
            }
            this.personId = personId;

            this.sendSetPropertyEvents();
            this._setLoginStatus(LoginStatus.LOGGED_IN, tokenChanged || newPerson);
        } else {
            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
            }
            this.name = "";
            this.token = "";
            this.subject = "";
            this.personId = "";
            this.person = null;

            this.sendSetPropertyEvents();
            this._setLoginStatus(LoginStatus.LOGGED_OUT);
        }

        const that = this;

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
                    this.sendSetPropertyEvents();
                    this._setLoginStatus(this._loginStatus, true);
                });
            }, {}, that.lang);
        }
    }

    sendSetPropertyEvents() {
        this.sendSetPropertyEvent('auth', {
            'subject': this.subject,
            'token': this.token,
            'user-full-name': this.name,
            'person-id': this.personId,
            'person': this.person,
        });

        // this.sendSetPropertyEvent('auth-subject', this.subject);
        // this.sendSetPropertyEvent('auth-token', this.token);
        // this.sendSetPropertyEvent('user-full-name', this.name);
        // this.sendSetPropertyEvent('person-id', this.personId);
        // this.sendSetPropertyEvent('person', this.person);
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
            ...super.properties,
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
            idpHint: { type: String, attribute: 'idp-hint' },
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
        this._kcwrapper = new KeycloakWrapper(this.keycloakUrl, this.realm, this.clientId, this.silentCheckSsoRedirectUri, this.idpHint);
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
        this._kcwrapper.close();
        this._kcwrapper.removeEventListener('changed', this._onKCChanged);
        this._bus.close();

        super.disconnectedCallback();
    }
}