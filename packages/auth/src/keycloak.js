import {EventTarget} from "event-target-shim";  // Because EventTarget() doesn't exist on Safari
import Keycloak from "keycloak-js";


const promiseTimeout = function(ms, promise) {
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in '+ ms + 'ms.');
      }, ms);
    });

    return Promise.race([
      promise,
      timeout
    ]);
};


/**
 * Wraps the keycloak API to support async/await, adds auto token refreshing and consolidates all
 * events into one native "changed" event
 * 
 * The "changed" event has the real keycloak instance as "detail"
 */
export class KeycloakWrapper extends EventTarget {

    constructor(baseURL, realm, clientId, silentCheckSsoUri) {
        super();

        this._baseURL = baseURL;
        this._realm = realm;
        this._clientId = clientId;
        this._keycloak = null;
        this._initDone = false;
        this._silentCheckSsoUri = silentCheckSsoUri;
    }

    _onChanged() {
        const event = new CustomEvent("changed", {
            detail: this._keycloak,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    _onReady(authenticated) {
        // Avoid emitting changed when nothing has changed on init()
        if (authenticated)
            this._onChanged();
    }

    async _onTokenExpired() {
        console.log('Token has expired');
        let refreshed = false;

        try {
            refreshed = await this._keycloak.updateToken(5);
        } catch (error) {
            console.log('Failed to refresh the token', error);
            return;
        }

        if (refreshed) {
            console.log('Token was successfully refreshed');
        } else {
            console.log('Token is still valid');
        }
    }

    async _ensureInstance() {
        if (this._keycloak !== null)
            return;

        this._keycloak = Keycloak({
            url: this._baseURL,
            realm: this._realm,
            clientId: this._clientId,
        });

        this._keycloak.onTokenExpired = this._onTokenExpired.bind(this);
        this._keycloak.onAuthRefreshSuccess = this._onChanged.bind(this);
        this._keycloak.onAuthRefreshError = this._onChanged.bind(this);
        this._keycloak.onAuthLogout = this._onChanged.bind(this);
        this._keycloak.onAuthSuccess = this._onChanged.bind(this);
        this._keycloak.onAuthError = this._onChanged.bind(this);
        this._keycloak.onReady = this._onReady.bind(this);
    }

    async _ensureInit() {
        await this._ensureInstance();
        if (this._initDone)
            return;
        this._initDone = true;

        const options = {promiseType: 'native'};
        if (this._silentCheckSsoUri) {
            options['onLoad'] = 'check-sso';
            options['silentCheckSsoRedirectUri'] = this._silentCheckSsoUri;

            // When silent-sso-check is active but the iframe doesn't load/work we will
            // never return here, so add a timeout and emit a signal so the app can continue
            await promiseTimeout(5000, this._keycloak.init(options)).catch(() => {
                console.log('Login timed out');
                this._onChanged();
            });
        } else {
            await this._keycloak.init(options);
        }
    }

    /**
     * If this returns true you need to call login() at one point to finish the login process.
     */
    isLoggingIn() {
        const href = window.location.href;
        return (href.search('[&#]state=') >= 0 && href.search('[&#]session_state=') >= 0);
    }

    /**
     * Logs the user in. Might lead to a site refresh or the user needing to authenticate.
     *
     * @param {object} options
     * @param {string} [options.lang] - The locale to use on the keycloak login page
     */
    async login(options) {
        await this._ensureInit();

        options = options || {};
        const language = options['lang'] || 'en';

        if (!this._keycloak.authenticated) {
            await this._keycloak.login({
                kcLocale: language,
            });
        }
    }

    /**
     * Logs the user in if it is possible without leaving the page or the user needing to authenticate again.
     */
    async tryLogin() {
        await this._ensureInit();
    }

    /**
     * Logs the user out locally, but not with keycloak. Login will instantly log the user back in without
     * requiring a re-auth.
     */
    async localLogout() {
        this._keycloak.clearToken();
    }

    /**
     * Log the user out from keycloak.
     */
    async logout() {
        await this._ensureInit();
        this._keycloak.logout();
    }
}