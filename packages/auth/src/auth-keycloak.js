import {createInstance} from './i18n.js';
import JSONLD from '@dbp-toolkit/common/jsonld';
import {KeycloakWrapper} from './keycloak.js';
import {LoginStatus} from './util.js';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {send} from '@dbp-toolkit/common/notification';

/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Emits a dbp-set-property event for the attribute "auth":
 *   auth.subject: Keycloak username
 *   auth.login-status: Login status (see object LoginStatus)
 *   auth.token: Keycloak token to send with your requests
 *   auth.user-full-name: Full name of the user
 *   auth.user-id: Identifier of the user
 */
export class AuthKeycloak extends AdapterLitElement {
    constructor() {
        super();
        this.forceLogin = false;
        this.token = '';
        this.subject = '';
        this.name = '';
        this.tryLogin = false;
        this.entryPointUrl = '';
        this._user = null;
        this._userId = '';
        this._authenticated = false;
        this._loginStatus = LoginStatus.UNKNOWN;
        this.requestedLoginStatus = LoginStatus.UNKNOWN;
        this._i18n = createInstance();
        this.lang = this._i18n.language;

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
        // console.log("changedProperties", changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
                case 'entryPointUrl':
                    // for preloading the instance
                    JSONLD.getInstance(this.entryPointUrl, this.lang);
                    break;
                case 'requestedLoginStatus':
                    console.log('requested-login-status changed', this.requestedLoginStatus);
                    switch (this.requestedLoginStatus) {
                        case LoginStatus.LOGGED_IN:
                            this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
                            break;
                        case LoginStatus.LOGGED_OUT:
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
                            break;
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }

    async _fetchUser(userId) {
        let jsonld;
        jsonld = await JSONLD.getInstance(this.entryPointUrl, this.lang);
        let baseUrl = '';
        try {
            baseUrl = jsonld.getApiUrlForEntityName('FrontendUser');
        } catch (error) {
            // backwards compat
            baseUrl = jsonld.getApiUrlForEntityName('Person');
        }
        const apiUrl = baseUrl + '/' + encodeURIComponent(userId);

        let response = await fetch(apiUrl, {
            headers: {
                Authorization: 'Bearer ' + this.token,
            },
        });
        if (!response.ok) {
            throw response;
        }
        let user = await response.json();
        let dummyUser = {
            roles: user['roles'] ?? [],
        };
        return dummyUser;
    }

    async _onKCChanged(event) {
        const kc = event.detail;

        this._authenticated = kc.authenticated;
        if (kc.authenticated) {
            let tokenChanged = this.token !== kc.token;
            this.name = kc.idTokenParsed.name;
            this.token = kc.token;

            this.subject = kc.subject;
            const userId = kc.idTokenParsed.preferred_username;
            let userChanged = userId !== this._userId;
            if (userChanged) {
                this._userId = userId;
                let user;
                try {
                    user = await this._fetchUser(userId);
                } catch (error) {
                    // In case fetching the user failed then likely the API backend
                    // is not set up or broken. Return a user without any roles so we
                    // can show something at least.
                    console.error(error);
                    user = {roles: []};
                }
                if (userId === this._userId) {
                    this._user = user;
                }
            }
            if (this._user !== null) {
                this._setLoginStatus(LoginStatus.LOGGED_IN, tokenChanged || userChanged);
            }
        } else {
            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
            }
            this.name = '';
            this.token = '';
            this.subject = '';
            this._userId = '';
            this._user = null;

            this._setLoginStatus(LoginStatus.LOGGED_OUT);
        }
    }

    sendSetPropertyEvents() {
        const auth = {
            'login-status': this._loginStatus,
            subject: this.subject,
            token: this.token,
            'user-full-name': this.name,
            'user-id': this._userId,
            // Deprecated
            'person-id': this._userId,
            person: this._user,
        };

        this.setAttribute("data-auth-set", "");

        // inject a window.DBPAuth variable for Cypress/Playwright
        if (window.Cypress || window.playwright) {
            window.DBPAuth = auth;
            console.log("Cypress/Playwright detected");
        }

        this.sendSetPropertyEvent('auth', auth);
    }

    _setLoginStatus(status, force) {
        if (this._loginStatus === status && !force) return;

        this._loginStatus = status;
        this.sendSetPropertyEvents();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            forceLogin: {type: Boolean, attribute: 'force-login'},
            tryLogin: {type: Boolean, attribute: 'try-login'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            name: {type: String, attribute: false},
            token: {type: String, attribute: false},
            subject: {type: String, attribute: false},
            _userId: {type: String, attribute: false},
            _user: {type: Object, attribute: false},
            _loginStatus: {type: String, attribute: false},
            keycloakUrl: {type: String, attribute: 'url'},
            realm: {type: String},
            clientId: {type: String, attribute: 'client-id'},
            silentCheckSsoRedirectUri: {type: String, attribute: 'silent-check-sso-redirect-uri'},
            scope: {type: String},
            idpHint: {type: String, attribute: 'idp-hint'},
            requestedLoginStatus: {type: String, attribute: 'requested-login-status'},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.keycloakUrl) throw Error('url not set');
        if (!this.realm) throw Error('realm not set');
        if (!this.clientId) throw Error('client-id not set');
        this._kcwrapper = new KeycloakWrapper(
            this.keycloakUrl,
            this.realm,
            this.clientId,
            this.silentCheckSsoRedirectUri,
            this.idpHint
        );
        this._kcwrapper.addEventListener('changed', this._onKCChanged);

        const handleLogin = async () => {
            try {
                if (this.forceLogin || this._kcwrapper.isLoggingIn()) {
                    this._setLoginStatus(LoginStatus.LOGGING_IN);
                    await this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
                } else if (this.tryLogin) {
                    this._setLoginStatus(LoginStatus.LOGGING_IN);
                    await this._kcwrapper.tryLogin();
                    if (!this._authenticated) {
                        this._setLoginStatus(LoginStatus.LOGGED_OUT);
                    }
                } else {
                    this._setLoginStatus(LoginStatus.LOGGED_OUT);
                }
            } catch (error) {
                // In case the keycloak server is offline for example
                this._setLoginStatus(LoginStatus.LOGGED_OUT);
                send({
                    summary: this._i18n.t('login-failed'),
                    type: 'danger',
                    timeout: 5,
                });
                throw error;
            }
        };

        handleLogin();
    }

    disconnectedCallback() {
        this._kcwrapper.close();
        this._kcwrapper.removeEventListener('changed', this._onKCChanged);

        super.disconnectedCallback();
    }
}
