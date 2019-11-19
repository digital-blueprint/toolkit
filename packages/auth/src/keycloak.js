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

        const Keycloak = await import('keycloak-js').then((mod) => { return mod.default; });

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
        }

        await this._keycloak.init(options);
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
            await this._keycloak.login({
                kcLocale: language,
            });
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