import {EventTarget} from "event-target-shim";  // Because EventTarget() doesn't exist on Safari


/**
 * Imports the keycloak JS API as if it was a module.
 *
 * @param baseUrl {string}
 */
async function importKeycloak(baseUrl) {
    const keycloakSrc = baseUrl + '/js/keycloak.min.js';
    // Importing will write it to window so we take it from there
    await import(keycloakSrc);
    if (importKeycloak._keycloakMod !== undefined)
        return importKeycloak._keycloakMod;
    importKeycloak._keycloakMod = window.Keycloak;
    delete window.Keycloak;
    return importKeycloak._keycloakMod;
}


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
 * Returns a URL for a relative path or URL
 *
 * @param {string} urlOrPath
 */
const ensureURL = function(urlOrPath) {
    try {
        return new URL(urlOrPath).href;
    } catch (e) {
        return new URL(urlOrPath, window.location.href).href;
    }
};


/**
 * Wraps the keycloak API to support async/await, adds auto token refreshing and consolidates all
 * events into one native "changed" event
 * 
 * The "changed" event has the real keycloak instance as "detail"
 */
export class KeycloakWrapper extends EventTarget {

    constructor(baseURL, realm, clientId, silentCheckSsoUri, idpHint) {
        super();

        this._baseURL = baseURL;
        this._realm = realm;
        this._clientId = clientId;
        this._keycloak = null;
        this._initDone = false;
        this._silentCheckSsoUri = silentCheckSsoUri;
        this._idpHint = idpHint;
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
            // -1 means force a refresh
            refreshed = await this._keycloak.updateToken(-1);
        } catch (error) {
            console.log('Failed to refresh the token', error);
            return;
        }

        console.assert(refreshed, "token should have been refreshed");
    }

    async _ensureInstance() {
        if (this._keycloak !== null)
            return;

        const Keycloak = await importKeycloak(this._baseURL);

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

    async _keycloakInit(options) {
        // https://gitlab.tugraz.at/dbp/apps/library/issues/41
        // retry the keycloak init in case it fails, maybe it helps :/
        try {
            return await this._keycloak.init(options);
        } catch (e) {
            return await this._keycloak.init(options);
        }
    }

    async _ensureInit() {
        await this._ensureInstance();
        if (this._initDone)
            return;
        this._initDone = true;

        const options = {
            promiseType: 'native',
            pkceMethod: 'S256',
        };


        if (this._silentCheckSsoUri) {

            options['onLoad'] = 'check-sso';
            options['silentCheckSsoRedirectUri'] = ensureURL(this._silentCheckSsoUri);

            // When silent-sso-check is active but the iframe doesn't load/work we will
            // never return here, so add a timeout and emit a signal so the app can continue
            await promiseTimeout(5000, this._keycloakInit(options)).catch(() => {
                console.log('Login timed out');
                this._onChanged();
            });
        } else {
            await this._keycloakInit(options);
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
        const scope = options['scope'] || '';

        if (!this._keycloak.authenticated) {
            await this._keycloak.login({
                kcLocale: language,  // Keycloak < 9.0
                locale: language,
                scope: scope,
                idpHint: this._idpHint,
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