/**
 * Imports the keycloak JS API as if it was a module.
 *
 * @param baseUrl {string}
 */
async function importKeycloak(baseUrl) {
    const keycloakSrc = baseUrl + '/js/keycloak.js';
    // Importing will write it to window so we take it from there
    await import(keycloakSrc);
    if (importKeycloak._keycloakMod !== undefined)
        return importKeycloak._keycloakMod;
    importKeycloak._keycloakMod = {Keycloak: window.Keycloak};
    delete window.Keycloak;
    return importKeycloak._keycloakMod;
}


async function kcMakeAsync(promise) {
    // the native keycloak promise implementation is broken, wrap it instead
    // https://stackoverflow.com/questions/58436689/react-keycloak-typeerror-kc-updatetoken-success-is-not-a-function
    return new Promise(function(resolve, reject) {
        promise.success((...args) => { resolve(...args); }).error((...args) => { reject(...args)});
    });
}


/**
 * Wraps the keycloak API to support async/await, adds auto token refreshing and consolidates all
 * events into one native "changed" event
 * 
 * The "changed" event has the real keycloak instance as "detail"
 */
export class KeycloakWrapper extends EventTarget {

    constructor(baseURL, realm, clientId) {
        super();

        this._baseURL = baseURL;
        this._realm = realm;
        this._clientId = clientId;
        this._keycloak = null;
        this._initDone = false;
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
            refreshed = await kcMakeAsync(that._keycloak.updateToken(5));
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

        const module = await importKeycloak(this._baseURL)

        this._keycloak = module.Keycloak({
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
        await kcMakeAsync(this._keycloak.init());
    }

    /**
     * Returns true in case we just got redirected from the login page
     */
    isLoggingIn() {
        const href = window.location.href;
        return (href.search('[&#]state=') >= 0 && href.search('[&#]session_state=') >= 0);
    }

    async login(options) {
        await this._ensureInit();

        options = options || {};
        const language = options['lang'] || 'en';

        if (!this._keycloak.authenticated) {
            await kcMakeAsync(this._keycloak.login({
                kcLocale: language,
            }));
        }
    }

    async clearToken() {
        this._keycloak.clearToken();
    }

    async logout() {
        await this._ensureInit();
        this._keycloak.logout();
    }
}