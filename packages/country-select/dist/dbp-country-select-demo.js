import {
    _ as e,
    a as t,
    c as n,
    d as r,
    f as i,
    g as a,
    h as o,
    i as s,
    l as c,
    m as l,
    n as u,
    o as d,
    p as f,
    r as p,
    s as m,
    t as h,
    u as g,
} from './shared/country-select.DDIhTD_g.js';
var _ = {
        'logging-in': `Anmeldung läuft`,
        login: `Anmelden`,
        'login-failed': `Kommunikation mit dem Anmeldeserver fehlgeschlagen`,
        logout: `Abmelden`,
    },
    v = {
        'logging-in': `Logging in`,
        login: `Login`,
        'login-failed': `Communication with the login server failed`,
        logout: `Logout`,
    };
function y() {
    return m({en: v, de: _}, `de`, `en`);
}
const b = function (e, t) {
        let n = new Promise((t, n) => {
            let r = setTimeout(() => {
                (clearTimeout(r), n(`Timed out in ` + e + `ms.`));
            }, e);
        });
        return Promise.race([t, n]);
    },
    x = function (e) {
        try {
            return new URL(e).href;
        } catch {
            return new URL(e, window.location.href).href;
        }
    };
var S = class extends EventTarget {
    constructor(e, t, n, r, i, a) {
        (super(),
            (this._baseURL = e),
            (this._realm = t),
            (this._clientId = n),
            (this._keycloak = null),
            (this._initPromise = null),
            (this._silentCheckSsoUri = r),
            (this._checkLoginIframe = i),
            (this._idpHint = a),
            (this._checkId = null),
            (this.MIN_VALIDITY = 20),
            (this.CHECK_INTERVAL = 10),
            (this.DEBUG = !1),
            (this._onVisibilityChanged = this._onVisibilityChanged.bind(this)),
            document.addEventListener(`visibilitychange`, this._onVisibilityChanged));
    }
    close() {
        document.removeEventListener(`visibilitychange`, this._onVisibilityChanged);
    }
    _onVisibilityChanged() {
        document.visibilityState === `visible` && this._checkTokeHasExpired();
    }
    _onChanged() {
        let e = new CustomEvent(`changed`, {detail: this._keycloak, bubbles: !0, composed: !0});
        this.dispatchEvent(e);
    }
    _onReady(e) {
        e && this._onChanged();
    }
    async _onTokenExpired() {
        console.log(`Token has expired`);
        let e;
        try {
            e = await this._keycloak.updateToken(-1);
        } catch (e) {
            console.log(`Failed to refresh the token`, e);
            return;
        }
        console.assert(e, `token should have been refreshed`);
    }
    async _checkTokeHasExpired() {
        let e;
        if (this._keycloak === null || !this._keycloak.authenticated) return;
        let t = this.MIN_VALIDITY + this.CHECK_INTERVAL;
        this.DEBUG && console.log(`Updating token if not valid for at least ${t}s`);
        try {
            e = await this._keycloak.updateToken(t);
        } catch (e) {
            console.log(`Failed to refresh the token`, e);
        }
        this.DEBUG && e && console.log(`token has been refreshed`);
    }
    async _onAuthSuccess() {
        (this._checkId !== null && (clearInterval(this._checkId), (this._checkId = null)),
            (this._checkId = setInterval(
                this._checkTokeHasExpired.bind(this),
                this.CHECK_INTERVAL * 1e3,
            )),
            this._onChanged());
    }
    async _onAuthLogout() {
        (this._checkId !== null && (clearInterval(this._checkId), (this._checkId = null)),
            this._onChanged());
    }
    async _init() {
        let e = (await import(`./shared/keycloak.CEtdvogm.js`)).default;
        ((this._keycloak = new e({
            url: this._baseURL,
            realm: this._realm,
            clientId: this._clientId,
        })),
            (this._keycloak.onTokenExpired = this._onTokenExpired.bind(this)),
            (this._keycloak.onAuthRefreshSuccess = this._onChanged.bind(this)),
            (this._keycloak.onAuthRefreshError = this._onChanged.bind(this)),
            (this._keycloak.onAuthLogout = this._onAuthLogout.bind(this)),
            (this._keycloak.onAuthSuccess = this._onAuthSuccess.bind(this)),
            (this._keycloak.onAuthError = this._onChanged.bind(this)),
            (this._keycloak.onReady = this._onReady.bind(this)));
        let t = {};
        ((t.pkceMethod = `S256`),
            this.DEBUG && (t.enableLogging = !0),
            (t.checkLoginIframe = this._checkLoginIframe),
            this._silentCheckSsoUri
                ? ((t.onLoad = `check-sso`),
                  (t.silentCheckSsoRedirectUri = x(this._silentCheckSsoUri)),
                  await b(5e3, this._keycloak.init(t)).catch(() => {
                      (console.log(`Login timed out`), this._onChanged());
                  }))
                : await this._keycloak.init(t));
    }
    async _ensureInit() {
        return (
            this._initPromise === null && (this._initPromise = this._init()),
            this._initPromise
        );
    }
    isLoggingIn() {
        let e = window.location.href;
        return e.search(`[&#]state=`) >= 0 && e.search(`[&#]session_state=`) >= 0;
    }
    async login(e) {
        (await this._ensureInit(), (e ||= {}));
        let t = e.lang || `en`,
            n = e.scope || ``;
        this._keycloak.authenticated ||
            (await this._keycloak.login({locale: t, scope: n, idpHint: this._idpHint}));
    }
    async tryLogin() {
        await this._ensureInit();
    }
    async localLogout() {
        this._keycloak.clearToken();
    }
    async logout() {
        (await this._ensureInit(), this._keycloak.logout());
    }
};
const C = Object.freeze({
    UNKNOWN: `unknown`,
    LOGGING_IN: `logging-in`,
    LOGGED_IN: `logged-in`,
    LOGGING_OUT: `logging-out`,
    LOGGED_OUT: `logged-out`,
});
var w = class extends d(g, y) {
        constructor() {
            (super(),
                (this.forceLogin = !1),
                (this.token = ``),
                (this.subject = ``),
                (this.name = ``),
                (this.tryLogin = !1),
                (this.entryPointUrl = ``),
                (this._user = null),
                (this._userId = ``),
                (this._authenticated = !1),
                (this._loginStatus = C.UNKNOWN),
                (this.requestedLoginStatus = C.UNKNOWN),
                (this.keycloakUrl = null),
                (this.realm = null),
                (this.clientId = null),
                (this.silentCheckSsoRedirectUri = null),
                (this.noCheckLoginIframe = !1),
                (this.scope = null),
                (this.idpHint = ``),
                (this._onKCChanged = this._onKCChanged.bind(this)),
                window.playwright && this.setAttribute(`data-testid`, `dbp-auth-keycloak`));
        }
        update(e) {
            (e.forEach((e, t) => {
                switch (t) {
                    case `requestedLoginStatus`: {
                        console.log(`requested-login-status changed`, this.requestedLoginStatus);
                        let e = this.requestedLoginStatus;
                        switch (((this.requestedLoginStatus = C.UNKNOWN), e)) {
                            case C.LOGGED_IN:
                                this._kcwrapper.login({lang: this.lang, scope: this.scope || ``});
                                break;
                            case C.LOGGED_OUT:
                                (this._loginStatus === C.LOGGED_IN &&
                                    this._setLoginStatus(C.LOGGING_OUT),
                                    this._kcwrapper.logout(),
                                    this._loginStatus === C.LOGGING_OUT &&
                                        this._setLoginStatus(C.LOGGED_IN));
                                break;
                        }
                        break;
                    }
                }
            }),
                super.update(e));
        }
        async _fetchUser(e, n) {
            let r = t(this.entryPointUrl, `/frontend/users/${encodeURIComponent(e)}`),
                i = await fetch(r, {headers: {Authorization: `Bearer ` + n}});
            if (!i.ok) throw i;
            return {roles: (await i.json()).roles ?? []};
        }
        async _onKCChanged(e) {
            let t = e.detail;
            if (((this._authenticated = t.authenticated), t.authenticated)) {
                if (t.subject !== this.subject) {
                    this._loginStatus === C.LOGGED_IN &&
                        (this._setLoginStatus(C.LOGGING_OUT), this._setLoggedOut());
                    let e = t.idTokenParsed.preferred_username;
                    this._userId = e;
                    let n;
                    try {
                        n = await this._fetchUser(e, t.token);
                    } catch (e) {
                        (console.error(e), (n = {roles: []}));
                    }
                    e === this._userId && (this._user = n);
                }
                let e = this.token !== t.token;
                ((this.token = t.token),
                    (this.name = t.idTokenParsed.name),
                    (this.subject = t.subject),
                    this._user !== null && this._setLoginStatus(C.LOGGED_IN, e));
            } else
                (this._loginStatus === C.LOGGED_IN && this._setLoginStatus(C.LOGGING_OUT),
                    this._setLoggedOut());
        }
        _setLoggedOut() {
            ((this.name = ``),
                (this.token = ``),
                (this.subject = ``),
                (this._userId = ``),
                (this._user = null),
                this._setLoginStatus(C.LOGGED_OUT));
        }
        sendSetPropertyEvents() {
            let e = {
                'login-status': this._loginStatus,
                subject: this.subject,
                token: this.token,
                'user-full-name': this.name,
                'user-id': this._userId,
                'person-id': this._userId,
                person: this._user,
                _roles: this._user ? this._user.roles : [],
            };
            this.sendSetPropertyEvent(`auth`, e);
        }
        _setLoginStatus(e, t) {
            (this._loginStatus === e && !t) ||
                ((this._loginStatus = e), this.sendSetPropertyEvents());
        }
        static get properties() {
            return {
                ...super.properties,
                lang: {type: String},
                forceLogin: {type: Boolean, attribute: `force-login`},
                tryLogin: {type: Boolean, attribute: `try-login`},
                entryPointUrl: {type: String, attribute: `entry-point-url`},
                name: {type: String, attribute: !1},
                token: {type: String, attribute: !1},
                subject: {type: String, attribute: !1},
                _userId: {type: String, attribute: !1},
                _user: {type: Object, attribute: !1},
                _loginStatus: {type: String, attribute: !1},
                keycloakUrl: {type: String, attribute: `url`},
                realm: {type: String},
                clientId: {type: String, attribute: `client-id`},
                silentCheckSsoRedirectUri: {
                    type: String,
                    attribute: `silent-check-sso-redirect-uri`,
                },
                scope: {type: String},
                idpHint: {type: String, attribute: `idp-hint`},
                requestedLoginStatus: {type: String, attribute: `requested-login-status`},
                noCheckLoginIframe: {type: Boolean, attribute: `no-check-login-iframe`},
            };
        }
        connectedCallback() {
            if ((super.connectedCallback(), !this.keycloakUrl)) throw Error(`url not set`);
            if (!this.realm) throw Error(`realm not set`);
            if (!this.clientId) throw Error(`client-id not set`);
            ((this._kcwrapper = new S(
                this.keycloakUrl,
                this.realm,
                this.clientId,
                this.silentCheckSsoRedirectUri,
                !this.noCheckLoginIframe,
                this.idpHint,
            )),
                this._kcwrapper.addEventListener(`changed`, this._onKCChanged),
                (async () => {
                    try {
                        this.forceLogin || this._kcwrapper.isLoggingIn()
                            ? (this._setLoginStatus(C.LOGGING_IN),
                              await this._kcwrapper.login({
                                  lang: this.lang,
                                  scope: this.scope || ``,
                              }))
                            : this.tryLogin
                              ? (this._setLoginStatus(C.LOGGING_IN),
                                await this._kcwrapper.tryLogin(),
                                this._authenticated || this._setLoginStatus(C.LOGGED_OUT))
                              : this._setLoginStatus(C.LOGGED_OUT);
                    } catch (e) {
                        throw (
                            this._setLoginStatus(C.LOGGED_OUT),
                            p({summary: this._i18n.t(`login-failed`), type: `danger`, timeout: 5}),
                            e
                        );
                    }
                })());
        }
        disconnectedCallback() {
            (this._kcwrapper.close(),
                this._kcwrapper.removeEventListener(`changed`, this._onKCChanged),
                super.disconnectedCallback());
        }
    },
    T = class extends s(d(f(g), y)) {
        static get scopedElements() {
            return {'dbp-mini-spinner': l};
        }
        _onLoginClicked(e) {
            (this.sendSetPropertyEvent(`requested-login-status`, C.LOGGED_IN), e.preventDefault());
        }
        _onLogoutClicked(e) {
            (this.sendSetPropertyEvent(`requested-login-status`, C.LOGGED_OUT), e.preventDefault());
        }
        static get styles() {
            return [
                i(),
                a`
                :host {
                    display: inline-block;
                }

                a {
                    color: var(--dbp-content);
                    fill: var(--dbp-content);
                    cursor: pointer;
                    text-decoration: none;
                }

                .login-box {
                    display: flex;
                    align-items: center;
                    padding: 0.3em 0.4em;
                    transition:
                        background-color 0.15s,
                        color 0.15s;
                }

                .login-box svg,
                .icon {
                    width: 1.1em;
                    height: 1.1em;
                }

                .login-box svg,
                .spinner {
                    display: flex;
                }

                .login-box:hover svg path {
                    fill: var(--dbp-hover-color);
                }

                .login-box:hover {
                    color: var(--dbp-hover-color, var(--dbp-content));
                    background-color: var(--dbp-hover-background-color);
                    cursor: pointer;
                    transition: none;
                }

                .login-box .label {
                    padding-left: 0.2em;
                }
            `,
            ];
        }
        render() {
            let e = this._i18n;
            return this.isAuthPending()
                ? o`
                <a href="#">
                    <div class="login-box login-button" aria-busy="true">
                        <div class="icon" aria-hidden="false" aria-label="${e.t(`logging-in`)}">
                            <dbp-mini-spinner class="spinner"></dbp-mini-spinner>
                        </div>
                        <div class="label" aria-hidden="true">&#8203;</div>
                    </div>
                </a>
            `
                : this.isLoggedIn()
                  ? o`
                <a href="#" @click="${this._onLogoutClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${n(`
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
  <path
     d="m 20.749313,38.894934 -5.885859,6.967885 h 43.408213 c 1.839331,0 3.433418,1.741972 3.433418,4.064599 0,2.322628 -1.471465,4.064599 -3.433418,4.064599 H 14.863454 l 5.885859,6.967883 c 1.348843,1.596808 1.348843,4.064599 0,5.661406 -1.348843,1.596808 -3.433418,1.596808 -4.782261,0 L 1.9881356,49.927418 15.967052,33.378693 c 1.348843,-1.596806 3.433418,-1.596806 4.782261,0 1.348843,1.596807 1.348843,4.064599 0,5.516241 z"
     id="path2"
     style="stroke-width:1.33417916"
     inkscape:connector-curvature="0" />
  <path
     style="stroke-width:0.67017764"
     d="M 61.663665,16.308792 C 48.158763,16.560171 35.913199,25.828579 30.896087,38.197464 34.816744,37.806184 40.033349,39.91491 41.470306,35.017776 50.594944,21.215302 72.517616,20.362655 82.800384,33.07637 93.497261,44.618596 90.228387,65.093356 76.499603,72.791214 64.104901,80.786232 45.895432,75.593227 39.470306,62.310745 35.613955,62.60637 27.974792,60.593775 32.925384,66.267776 41.232037,82.878292 64.023613,89.46919 79.876556,79.765823 96.140149,70.989504 102.10102,48.145494 91.970306,32.629104 85.705979,22.257901 73.793809,15.772382 61.663665,16.308792 Z"
     id="path4"
     inkscape:connector-curvature="0" />
</g>
</svg>
`)}</div>
                        <div class="label">${e.t(`logout`)}</div>
                    </div>
                </a>
            `
                  : o`
                <a href="#" @click="${this._onLoginClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${n(`
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
    <path
   style="stroke-width:1.33417916"
   id="path2"
   d="m 42.943908,38.894934 5.885859,6.967885 H 5.4215537 c -1.8393311,0 -3.4334181,1.741972 -3.4334181,4.064599 0,2.322628 1.4714649,4.064599 3.4334181,4.064599 H 48.829767 L 42.943908,60.9599 c -1.348843,1.596808 -1.348843,4.064599 0,5.661406 1.348843,1.596808 3.433418,1.596808 4.782261,0 L 61.705085,49.927418 47.726169,33.378693 c -1.348843,-1.596806 -3.433418,-1.596806 -4.782261,0 -1.348843,1.596807 -1.348843,4.064599 0,5.516241 z" />
    <path
   id="path4"
   d="m 50,2.3007812 c -18.777325,0 -35.049449,10.9124408 -42.8261719,26.7246098 H 13.390625 C 20.672112,16.348362 34.336876,7.8007812 50,7.8007812 73.3,7.8007812 92.300781,26.7 92.300781,50 92.300781,73.3 73.3,92.300781 50,92.300781 c -15.673389,0 -29.345175,-8.60579 -36.623047,-21.326172 H 7.1640625 C 14.942553,86.8272 31.242598,97.800781 50.099609,97.800781 76.399609,97.800781 97.900391,76.4 97.900391,50 97.800391,23.7 76.3,2.3007812 50,2.3007812 Z" />
</g>
</svg>
`)}</div>
                        <div class="label">${e.t(`login`)}</div>
                    </div>
                </a>
            `;
        }
    },
    E = class extends d(f(c), u) {
        constructor() {
            (super(), (this.entryPointUrl = ``), (this.noAuth = !1));
        }
        static get scopedElements() {
            return {'dbp-auth-keycloak': w, 'dbp-login-button': T, 'dbp-country-select': h};
        }
        static get properties() {
            return {
                ...super.properties,
                entryPointUrl: {type: String, attribute: `entry-point-url`},
                noAuth: {type: Boolean, attribute: `no-auth`},
            };
        }
        static get styles() {
            return [
                i(),
                r(),
                a`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }
            `,
            ];
        }
        getAuthComponentHtml() {
            return this.noAuth
                ? o`
                  <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
              `
                : o`
                  <div class="container">
                      <dbp-auth-keycloak
                          subscribe="requested-login-status"
                          lang="${this.lang}"
                          entry-point-url="${this.entryPointUrl}"
                          silent-check-sso-redirect-uri="/silent-check-sso.html"
                          url="https://auth-dev.tugraz.at/auth"
                          realm="tugraz-vpu"
                          client-id="auth-dev-mw-frontend-local"
                          try-login></dbp-auth-keycloak>
                      <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                  </div>
              `;
        }
        render() {
            return o`
            <section class="section">
                <div class="container">
                    <h1 class="title">Country-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Country 1</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"></dbp-country-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Country 2</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Country 3 unsubscribed</label>
                            <div class="control">
                                <dbp-country-select
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                            <p>
                                This component doesn't get any notification about user's login and
                                will not become active.
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Country 4 disabled</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    disabled
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                            <p>This component is disabled.</p>
                        </div>
                    </form>
                </div>
            </section>
        `;
        }
    };
e(`dbp-country-select-demo`, E);
export {E as CountrySelectDemo};
//# sourceMappingURL=dbp-country-select-demo.js.map
