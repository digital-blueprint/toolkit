const promiseTimeout = function (ms, promise) {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    return Promise.race([promise, timeout]);
};

/**
 * Returns a URL for a relative path or URL
 *
 * @param {string} urlOrPath
 */
const ensureURL = function (urlOrPath) {
    try {
        return new URL(urlOrPath).href;
    } catch {
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
    /**
     * @param {string} baseURL
     * @param {string} realm
     * @param {string} clientId
     * @param {string} silentCheckSsoUri
     * @param {boolean} checkLoginIframe
     * @param {string} idpHint
     */
    constructor(baseURL, realm, clientId, silentCheckSsoUri, checkLoginIframe, idpHint) {
        super();

        this._baseURL = baseURL;
        this._realm = realm;
        this._clientId = clientId;
        this._keycloak = null;
        this._initPromise = null;
        this._silentCheckSsoUri = silentCheckSsoUri;
        this._checkLoginIframe = checkLoginIframe;
        this._idpHint = idpHint;
        this._checkId = null;

        /* Minimum validity of the token in seconds */
        this.MIN_VALIDITY = 20;

        /* Interval at which the token validity is checked, in seconds */
        this.CHECK_INTERVAL = 10;

        /* Enables extra debug logging */
        this.DEBUG = false;

        this._onVisibilityChanged = this._onVisibilityChanged.bind(this);
        document.addEventListener('visibilitychange', this._onVisibilityChanged);
    }

    /**
     * This needs to be called or the instance will leak;
     */
    close() {
        document.removeEventListener('visibilitychange', this._onVisibilityChanged);
    }

    _onVisibilityChanged() {
        let isVisible = document.visibilityState === 'visible';
        if (isVisible && this._keycloak.authenticated) {
            this._checkTokeHasExpired();
        }
    }

    _onChanged() {
        const event = new CustomEvent('changed', {
            detail: this._keycloak,
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    _onReady(authenticated) {
        // Avoid emitting changed when nothing has changed on init()
        if (authenticated) this._onChanged();
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

        console.assert(refreshed, 'token should have been refreshed');
    }

    async _checkTokeHasExpired() {
        let refreshed;

        let minValidity = this.MIN_VALIDITY + this.CHECK_INTERVAL;
        if (this.DEBUG) {
            console.log(`Updating token if not valid for at least ${minValidity}s`);
        }
        try {
            refreshed = await this._keycloak.updateToken(minValidity);
        } catch (error) {
            console.log('Failed to refresh the token', error);
        }

        if (this.DEBUG && refreshed) console.log('token has been refreshed');
    }

    async _onAuthSuccess() {
        // We check every once in a while if the token is still valid and
        // and refresh it if needed.
        if (this._checkId !== null) {
            clearInterval(this._checkId);
            this._checkId = null;
        }
        this._checkId = setInterval(
            this._checkTokeHasExpired.bind(this),
            this.CHECK_INTERVAL * 1000
        );

        this._onChanged();
    }

    async _onAuthLogout() {
        if (this._checkId !== null) {
            clearInterval(this._checkId);
            this._checkId = null;
        }

        this._onChanged();
    }

    async _init() {
        const Keycloak = (await import('keycloak-js')).default;

        this._keycloak = new Keycloak({
            url: this._baseURL,
            realm: this._realm,
            clientId: this._clientId,
        });

        this._keycloak.onTokenExpired = this._onTokenExpired.bind(this);
        this._keycloak.onAuthRefreshSuccess = this._onChanged.bind(this);
        this._keycloak.onAuthRefreshError = this._onChanged.bind(this);
        this._keycloak.onAuthLogout = this._onAuthLogout.bind(this);
        this._keycloak.onAuthSuccess = this._onAuthSuccess.bind(this);
        this._keycloak.onAuthError = this._onChanged.bind(this);
        this._keycloak.onReady = this._onReady.bind(this);

        const options = {
            promiseType: 'native',
            pkceMethod: 'S256',
        };

        if (this.DEBUG) {
            options['enableLogging'] = true;
        }

        options['checkLoginIframe'] = this._checkLoginIframe;

        if (this._silentCheckSsoUri) {
            options['onLoad'] = 'check-sso';
            options['silentCheckSsoRedirectUri'] = ensureURL(this._silentCheckSsoUri);

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

    async _ensureInit() {
        if (this._initPromise === null) {
            this._initPromise = this._init();
        }
        return this._initPromise;
    }

    /**
     * If this returns true you need to call login() at one point to finish the login process.
     */
    isLoggingIn() {
        const href = window.location.href;
        return href.search('[&#]state=') >= 0 && href.search('[&#]session_state=') >= 0;
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
                kcLocale: language, // Keycloak < 9.0
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
