var e = class {
    #e = [];
    #t;
    #n = !0;
    #r;
    #i = this.#O(console.info);
    #a = this.#O(console.warn);
    #o = {enable: !0, callbackList: [], interval: 5};
    #s;
    didInitialize = !1;
    authenticated = !1;
    loginRequired = !1;
    responseMode = `fragment`;
    responseType = `code`;
    flow = `standard`;
    timeSkew = null;
    redirectUri;
    silentCheckSsoRedirectUri;
    silentCheckSsoFallback = !0;
    pkceMethod = `S256`;
    enableLogging = !1;
    logoutMethod = `GET`;
    scope;
    messageReceiveTimeout = 1e4;
    idToken;
    idTokenParsed;
    token;
    tokenParsed;
    refreshToken;
    refreshTokenParsed;
    clientId;
    sessionId;
    subject;
    authServerUrl;
    realm;
    realmAccess;
    resourceAccess;
    profile;
    userInfo;
    endpoints;
    tokenTimeoutHandle;
    onAuthSuccess;
    onAuthError;
    onAuthRefreshSuccess;
    onAuthRefreshError;
    onTokenExpired;
    onAuthLogout;
    onReady;
    onActionUpdate;
    constructor(e) {
        if (typeof e != `string` && !_(e))
            throw Error(
                `The 'Keycloak' constructor must be provided with a configuration object, or a URL to a JSON configuration file.`,
            );
        if (_(e)) {
            let t = `oidcProvider` in e ? [`clientId`] : [`url`, `realm`, `clientId`];
            for (let n of t)
                if (!(n in e))
                    throw Error(
                        `The configuration object is missing the required '${n}' property.`,
                    );
        }
        (globalThis.isSecureContext ||
            this
                .#a(`[KEYCLOAK] Keycloak JS must be used in a 'secure context' to function properly as it relies on browser APIs that are otherwise not available.
Continuing to run your application insecurely will lead to unexpected behavior and breakage.

For more information see: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts`),
            (this.#s = e));
    }
    init = async (e = {}) => {
        if (this.didInitialize) throw Error(`A 'Keycloak' instance can only be initialized once.`);
        if (
            ((this.didInitialize = !0),
            (this.#r = c()),
            typeof e.adapter == `string` &&
            [`default`, `cordova`, `cordova-native`].includes(e.adapter)
                ? (this.#t = this.#c(e.adapter))
                : typeof e.adapter == `object`
                  ? (this.#t = e.adapter)
                  : `Cordova` in window || `cordova` in window
                    ? (this.#t = this.#c(`cordova`))
                    : (this.#t = this.#c(`default`)),
            e.useNonce !== void 0 && (this.#n = e.useNonce),
            e.checkLoginIframe !== void 0 && (this.#o.enable = e.checkLoginIframe),
            e.checkLoginIframeInterval && (this.#o.interval = e.checkLoginIframeInterval),
            e.onLoad === `login-required` && (this.loginRequired = !0),
            e.responseMode)
        )
            if (e.responseMode === `query` || e.responseMode === `fragment`)
                this.responseMode = e.responseMode;
            else throw Error(`Invalid value for responseMode`);
        if (e.flow) {
            switch (e.flow) {
                case `standard`:
                    this.responseType = `code`;
                    break;
                case `implicit`:
                    this.responseType = `id_token token`;
                    break;
                case `hybrid`:
                    this.responseType = `code id_token token`;
                    break;
                default:
                    throw Error(`Invalid value for flow`);
            }
            this.flow = e.flow;
        }
        if (
            (typeof e.timeSkew == `number` && (this.timeSkew = e.timeSkew),
            e.redirectUri && (this.redirectUri = e.redirectUri),
            e.silentCheckSsoRedirectUri &&
                (this.silentCheckSsoRedirectUri = e.silentCheckSsoRedirectUri),
            typeof e.silentCheckSsoFallback == `boolean` &&
                (this.silentCheckSsoFallback = e.silentCheckSsoFallback),
            e.pkceMethod !== void 0)
        ) {
            if (e.pkceMethod !== `S256` && e.pkceMethod !== !1)
                throw TypeError(
                    `Invalid value for pkceMethod', expected 'S256' or false but got ${e.pkceMethod}.`,
                );
            this.pkceMethod = e.pkceMethod;
        }
        return (
            typeof e.enableLogging == `boolean` && (this.enableLogging = e.enableLogging),
            e.logoutMethod === `POST` && (this.logoutMethod = `POST`),
            typeof e.scope == `string` && (this.scope = e.scope),
            typeof e.messageReceiveTimeout == `number` &&
                e.messageReceiveTimeout > 0 &&
                (this.messageReceiveTimeout = e.messageReceiveTimeout),
            await this.#f(),
            await this.#g(),
            await this.#_(e),
            this.onReady?.(this.authenticated),
            this.authenticated
        );
    };
    #c(e) {
        if (e === `default`) return this.#l();
        if (e === `cordova`) return ((this.#o.enable = !1), this.#u());
        if (e === `cordova-native`) return ((this.#o.enable = !1), this.#d());
        throw Error(`invalid adapter type: ` + e);
    }
    #l() {
        let e = (e) => e?.redirectUri || this.redirectUri || globalThis.location.href;
        return {
            login: async (e) => (
                window.location.assign(await this.createLoginUrl(e)),
                await new Promise(() => {})
            ),
            logout: async (t) => {
                if ((t?.logoutMethod ?? this.logoutMethod) === `GET`) {
                    window.location.replace(this.createLogoutUrl(t));
                    return;
                }
                let n = document.createElement(`form`);
                (n.setAttribute(`method`, `POST`),
                    n.setAttribute(`action`, this.createLogoutUrl(t)),
                    (n.style.display = `none`));
                let r = {
                    id_token_hint: this.idToken,
                    client_id: this.clientId,
                    post_logout_redirect_uri: e(t),
                };
                for (let [e, t] of Object.entries(r)) {
                    let r = document.createElement(`input`);
                    (r.setAttribute(`type`, `hidden`),
                        r.setAttribute(`name`, e),
                        r.setAttribute(`value`, t),
                        n.appendChild(r));
                }
                (document.body.appendChild(n), n.submit());
            },
            register: async (e) => (
                window.location.assign(await this.createRegisterUrl(e)),
                await new Promise(() => {})
            ),
            accountManagement: async () => {
                let e = this.createAccountUrl();
                if (e !== void 0) window.location.href = e;
                else throw Error(`Not supported by the OIDC server`);
                return await new Promise(() => {});
            },
            redirectUri: e,
        };
    }
    #u() {
        let e = (e, t, n) =>
                window.cordova && window.cordova.InAppBrowser
                    ? window.cordova.InAppBrowser.open(e, t, n)
                    : window.open(e, t, n),
            t = (e) =>
                e && e.cordovaOptions
                    ? Object.keys(e.cordovaOptions).reduce(
                          (t, n) => ((t[n] = e.cordovaOptions[n]), t),
                          {},
                      )
                    : {},
            n = (e) =>
                Object.keys(e)
                    .reduce((t, n) => (t.push(n + `=` + e[n]), t), [])
                    .join(`,`),
            r = (e) => {
                let r = t(e);
                return ((r.location = `no`), e && e.prompt === `none` && (r.hidden = `yes`), n(r));
            },
            i = () => this.redirectUri || `http://localhost`;
        return {
            login: async (t) => {
                let n = r(t),
                    a = e(await this.createLoginUrl(t), `_blank`, n),
                    o = !1,
                    s = !1;
                function c() {
                    ((s = !0), a.close());
                }
                return await new Promise((e, t) => {
                    (a.addEventListener(`loadstart`, async (n) => {
                        if (n.url.indexOf(i()) === 0) {
                            let r = this.#x(n.url);
                            try {
                                (await this.#w(r), e());
                            } catch (e) {
                                t(e);
                            }
                            (c(), (o = !0));
                        }
                    }),
                        a.addEventListener(`loaderror`, async (n) => {
                            if (!o)
                                if (n.url.indexOf(i()) === 0) {
                                    let r = this.#x(n.url);
                                    try {
                                        (await this.#w(r), e());
                                    } catch (e) {
                                        t(e);
                                    }
                                    (c(), (o = !0));
                                } else (t(Error(`Unable to process login.`)), c());
                        }),
                        a.addEventListener(`exit`, function (e) {
                            s || t(Error(`User closed the login window.`));
                        }));
                });
            },
            logout: async (t) => {
                let n = e(
                        this.createLogoutUrl(t),
                        `_blank`,
                        `location=no,hidden=yes,clearcache=yes`,
                    ),
                    r = !1;
                (n.addEventListener(`loadstart`, (e) => {
                    e.url.indexOf(i()) === 0 && n.close();
                }),
                    n.addEventListener(`loaderror`, (e) => {
                        (e.url.indexOf(i()) === 0 || (r = !0), n.close());
                    }),
                    await new Promise((e, t) => {
                        n.addEventListener(`exit`, () => {
                            r
                                ? t(Error(`User closed the login window.`))
                                : (this.clearToken(), e());
                        });
                    }));
            },
            register: async (t) => {
                let n = e(await this.createRegisterUrl(), `_blank`, r(t));
                await new Promise((e, t) => {
                    n.addEventListener(`loadstart`, async (r) => {
                        if (r.url.indexOf(i()) === 0) {
                            n.close();
                            let i = this.#x(r.url);
                            try {
                                (await this.#w(i), e());
                            } catch (e) {
                                t(e);
                            }
                        }
                    });
                });
            },
            accountManagement: async () => {
                let t = this.createAccountUrl();
                if (t !== void 0) {
                    let n = e(t, `_blank`, `location=no`);
                    n.addEventListener(`loadstart`, function (e) {
                        e.url.indexOf(i()) === 0 && n.close();
                    });
                } else throw Error(`Not supported by the OIDC server`);
            },
            redirectUri: () => i(),
        };
    }
    #d() {
        return {
            login: async (e) => {
                let t = await this.createLoginUrl(e);
                await new Promise((e, n) => {
                    (universalLinks.subscribe(`keycloak`, async (t) => {
                        (universalLinks.unsubscribe(`keycloak`),
                            window.cordova.plugins.browsertab.close());
                        let r = this.#x(t.url);
                        try {
                            (await this.#w(r), e());
                        } catch (e) {
                            n(e);
                        }
                    }),
                        window.cordova.plugins.browsertab.openUrl(t));
                });
            },
            logout: async (e) => {
                let t = this.createLogoutUrl(e);
                await new Promise((e) => {
                    (universalLinks.subscribe(`keycloak`, () => {
                        (universalLinks.unsubscribe(`keycloak`),
                            window.cordova.plugins.browsertab.close(),
                            this.clearToken(),
                            e());
                    }),
                        window.cordova.plugins.browsertab.openUrl(t));
                });
            },
            register: async (e) => {
                let t = await this.createRegisterUrl(e);
                await new Promise((e, n) => {
                    (universalLinks.subscribe(`keycloak`, async (t) => {
                        (universalLinks.unsubscribe(`keycloak`),
                            window.cordova.plugins.browsertab.close());
                        let r = this.#x(t.url);
                        try {
                            (await this.#w(r), e());
                        } catch (e) {
                            n(e);
                        }
                    }),
                        window.cordova.plugins.browsertab.openUrl(t));
                });
            },
            accountManagement: async () => {
                let e = this.createAccountUrl();
                if (e !== void 0) window.cordova.plugins.browsertab.openUrl(e);
                else throw Error(`Not supported by the OIDC server`);
            },
            redirectUri: (e) =>
                e && e.redirectUri
                    ? e.redirectUri
                    : this.redirectUri
                      ? this.redirectUri
                      : `http://localhost`,
        };
    }
    async #f() {
        if (typeof this.#s == `string`) {
            let e = await v(this.#s);
            ((this.authServerUrl = e[`auth-server-url`]),
                (this.realm = e.realm),
                (this.clientId = e.resource),
                this.#p());
        } else
            ((this.clientId = this.#s.clientId),
                `oidcProvider` in this.#s
                    ? await this.#m(this.#s.oidcProvider)
                    : ((this.authServerUrl = this.#s.url),
                      (this.realm = this.#s.realm),
                      this.#p()));
    }
    #p() {
        this.endpoints = {
            authorize: () => this.#D() + `/protocol/openid-connect/auth`,
            token: () => this.#D() + `/protocol/openid-connect/token`,
            logout: () => this.#D() + `/protocol/openid-connect/logout`,
            checkSessionIframe: () =>
                this.#D() + `/protocol/openid-connect/login-status-iframe.html`,
            thirdPartyCookiesIframe: () =>
                this.#D() + `/protocol/openid-connect/3p-cookies/step1.html`,
            register: () => this.#D() + `/protocol/openid-connect/registrations`,
            userinfo: () => this.#D() + `/protocol/openid-connect/userinfo`,
        };
    }
    async #m(e) {
        if (typeof e == `string`) {
            let t = await y(`${T(e)}/.well-known/openid-configuration`);
            this.#h(t);
        } else this.#h(e);
    }
    #h(e) {
        this.endpoints = {
            authorize() {
                return e.authorization_endpoint;
            },
            token() {
                return e.token_endpoint;
            },
            logout() {
                if (!e.end_session_endpoint) throw Error(`Not supported by the OIDC server`);
                return e.end_session_endpoint;
            },
            checkSessionIframe() {
                if (!e.check_session_iframe) throw Error(`Not supported by the OIDC server`);
                return e.check_session_iframe;
            },
            register() {
                throw Error(
                    `Redirection to "Register user" page not supported in standard OIDC mode`,
                );
            },
            userinfo() {
                if (!e.userinfo_endpoint) throw Error(`Not supported by the OIDC server`);
                return e.userinfo_endpoint;
            },
        };
    }
    async #g() {
        if (
            (!this.#o.enable && !this.silentCheckSsoRedirectUri) ||
            typeof this.endpoints.thirdPartyCookiesIframe != `function`
        )
            return;
        let e = document.createElement(`iframe`);
        return (
            e.setAttribute(`src`, this.endpoints.thirdPartyCookiesIframe()),
            e.setAttribute(
                `sandbox`,
                `allow-storage-access-by-user-activation allow-scripts allow-same-origin`,
            ),
            e.setAttribute(`title`, `keycloak-3p-check-iframe`),
            (e.style.display = `none`),
            document.body.appendChild(e),
            await s(
                new Promise((t) => {
                    let n = (r) => {
                        e.contentWindow === r.source &&
                            ((r.data !== `supported` && r.data !== `unsupported`) ||
                                (r.data === `unsupported` &&
                                    (this
                                        .#a(`[KEYCLOAK] Your browser is blocking access to 3rd-party cookies, this means:

 - It is not possible to retrieve tokens without redirecting to the Keycloak server (a.k.a. no support for silent authentication).
 - It is not possible to automatically detect changes to the session status (such as the user logging out in another tab).

For more information see: https://www.keycloak.org/securing-apps/javascript-adapter#_modern_browsers`),
                                    (this.#o.enable = !1),
                                    this.silentCheckSsoFallback &&
                                        (this.silentCheckSsoRedirectUri = void 0)),
                                document.body.removeChild(e),
                                window.removeEventListener(`message`, n),
                                t()));
                    };
                    window.addEventListener(`message`, n, !1);
                }),
                this.messageReceiveTimeout,
                `Timeout when waiting for 3rd party check iframe message.`,
            )
        );
    }
    async #_(e) {
        let t = this.#x(window.location.href);
        if (
            (t?.newUrl && window.history.replaceState(window.history.state, ``, t.newUrl),
            t && t.valid)
        ) {
            (await this.#v(), await this.#w(t));
            return;
        }
        let n = async (t) => {
                let n = {};
                (t || (n.prompt = `none`), e.locale && (n.locale = e.locale), await this.login(n));
            },
            r = async () => {
                switch (e.onLoad) {
                    case `check-sso`:
                        this.#o.enable
                            ? (await this.#v(),
                              (await this.#y()) ||
                                  (this.silentCheckSsoRedirectUri ? await this.#b() : await n(!1)))
                            : this.silentCheckSsoRedirectUri
                              ? await this.#b()
                              : await n(!1);
                        break;
                    case `login-required`:
                        await n(!0);
                        break;
                    default:
                        throw Error(`Invalid value for onLoad`);
                }
            };
        if (e.token && e.refreshToken)
            if ((this.#E(e.token, e.refreshToken, e.idToken), this.#o.enable))
                (await this.#v(), (await this.#y()) && (this.onAuthSuccess?.(), this.#T()));
            else
                try {
                    (await this.updateToken(-1), this.onAuthSuccess?.());
                } catch (t) {
                    if ((this.onAuthError?.(), e.onLoad)) await r();
                    else throw t;
                }
        else e.onLoad && (await r());
    }
    async #v() {
        if (!this.#o.enable || this.#o.iframe) return;
        let e = document.createElement(`iframe`);
        ((this.#o.iframe = e),
            e.setAttribute(`src`, this.endpoints.checkSessionIframe()),
            e.setAttribute(
                `sandbox`,
                `allow-storage-access-by-user-activation allow-scripts allow-same-origin`,
            ),
            e.setAttribute(`title`, `keycloak-session-iframe`),
            (e.style.display = `none`),
            document.body.appendChild(e),
            window.addEventListener(
                `message`,
                (e) => {
                    if (
                        e.origin !== this.#o.iframeOrigin ||
                        this.#o.iframe?.contentWindow !== e.source ||
                        !(e.data === `unchanged` || e.data === `changed` || e.data === `error`)
                    )
                        return;
                    e.data !== `unchanged` && this.clearToken();
                    let t = this.#o.callbackList;
                    this.#o.callbackList = [];
                    for (let n of t.reverse())
                        e.data === `error`
                            ? n(Error(`Error while checking login iframe`))
                            : n(null, e.data === `unchanged`);
                },
                !1,
            ),
            await new Promise((t) => {
                e.addEventListener(`load`, () => {
                    let e = this.endpoints.authorize();
                    (e.startsWith(`/`)
                        ? (this.#o.iframeOrigin = globalThis.location.origin)
                        : (this.#o.iframeOrigin = new URL(e).origin),
                        t());
                });
            }));
    }
    async #y() {
        if (!this.#o.iframe || !this.#o.iframeOrigin) return;
        let e = `${this.clientId} ${this.sessionId ? this.sessionId : ``}`,
            t = this.#o.iframeOrigin;
        return await new Promise((n, r) => {
            (this.#o.callbackList.push((e, t) => (e ? r(e) : n(t))),
                this.#o.callbackList.length === 1 &&
                    this.#o.iframe?.contentWindow?.postMessage(e, t));
        });
    }
    async #b() {
        let e = document.createElement(`iframe`),
            t = await this.createLoginUrl({
                prompt: `none`,
                redirectUri: this.silentCheckSsoRedirectUri,
            });
        return (
            e.setAttribute(`src`, t),
            e.setAttribute(
                `sandbox`,
                `allow-storage-access-by-user-activation allow-scripts allow-same-origin`,
            ),
            e.setAttribute(`title`, `keycloak-silent-check-sso`),
            (e.style.display = `none`),
            document.body.appendChild(e),
            await new Promise((t, n) => {
                let r = async (i) => {
                    if (i.origin !== window.location.origin || e.contentWindow !== i.source) return;
                    let a = this.#x(i.data);
                    try {
                        (await this.#w(a), t());
                    } catch (e) {
                        n(e);
                    }
                    (document.body.removeChild(e), window.removeEventListener(`message`, r));
                };
                window.addEventListener(`message`, r);
            })
        );
    }
    #x(e) {
        let t = this.#S(e);
        if (!t) return;
        let n = this.#r.get(t.state);
        return (
            n &&
                ((t.valid = !0),
                (t.redirectUri = n.redirectUri),
                (t.storedNonce = n.nonce),
                (t.prompt = n.prompt),
                (t.pkceCodeVerifier = n.pkceCodeVerifier),
                (t.loginOptions = n.loginOptions)),
            t
        );
    }
    #S(e) {
        let t = [];
        switch (this.flow) {
            case `standard`:
                t = [`code`, `state`, `session_state`, `kc_action_status`, `kc_action`, `iss`];
                break;
            case `implicit`:
                t = [
                    `access_token`,
                    `token_type`,
                    `id_token`,
                    `state`,
                    `session_state`,
                    `expires_in`,
                    `kc_action_status`,
                    `kc_action`,
                    `iss`,
                ];
                break;
            case `hybrid`:
                t = [
                    `access_token`,
                    `token_type`,
                    `id_token`,
                    `code`,
                    `state`,
                    `session_state`,
                    `expires_in`,
                    `kc_action_status`,
                    `kc_action`,
                    `iss`,
                ];
                break;
        }
        (t.push(`error`), t.push(`error_description`), t.push(`error_uri`));
        let n = new URL(e),
            r = ``,
            i;
        if (
            (this.responseMode === `query` && n.searchParams.size > 0
                ? ((i = this.#C(n.search, t)), (n.search = i.paramsString), (r = n.toString()))
                : this.responseMode === `fragment` &&
                  n.hash.length > 0 &&
                  ((i = this.#C(n.hash.substring(1), t)),
                  (n.hash = i.paramsString),
                  (r = n.toString())),
            i?.oauthParams)
        ) {
            if (this.flow === `standard` || this.flow === `hybrid`) {
                if ((i.oauthParams.code || i.oauthParams.error) && i.oauthParams.state)
                    return ((i.oauthParams.newUrl = r), i.oauthParams);
            } else if (
                this.flow === `implicit` &&
                (i.oauthParams.access_token || i.oauthParams.error) &&
                i.oauthParams.state
            )
                return ((i.oauthParams.newUrl = r), i.oauthParams);
        }
    }
    #C(e, t) {
        let n = e.split(`&`),
            r = {},
            i = ``;
        for (let e of n.reverse()) {
            let n = new URLSearchParams(e).entries().next().value;
            if (!n) {
                i = `&` + i;
                continue;
            }
            let [a, o] = n;
            t.includes(a) && !(a in r) ? (r[a] = o) : (i = i.length === 0 ? e : e + `&` + i);
        }
        return {paramsString: i, oauthParams: r};
    }
    async #w(e) {
        let {code: t, error: n, prompt: r} = e,
            i = new Date().getTime(),
            a = (t, n, r) => {
                if (
                    ((i = (i + new Date().getTime()) / 2),
                    this.#E(t, n, r, i),
                    this.#n && this.idTokenParsed && this.idTokenParsed.nonce !== e.storedNonce)
                )
                    throw (
                        this.#i(`[KEYCLOAK] Invalid nonce, clearing token`),
                        this.clearToken(),
                        Error(`Invalid nonce.`)
                    );
            };
        if (
            (e.kc_action_status &&
                this.onActionUpdate &&
                this.onActionUpdate(e.kc_action_status, e.kc_action),
            n)
        ) {
            if (r !== `none`)
                if (e.error_description && e.error_description === `authentication_expired`)
                    await this.login(e.loginOptions);
                else {
                    let t = {error: n, error_description: e.error_description};
                    throw (this.onAuthError?.(t), t);
                }
            return;
        } else
            this.flow !== `standard` &&
                (e.access_token || e.id_token) &&
                (a(e.access_token, void 0, e.id_token), this.onAuthSuccess?.());
        if (this.flow !== `implicit` && t)
            try {
                let n = await b(
                    this.endpoints.token(),
                    t,
                    this.clientId,
                    e.redirectUri,
                    e.pkceCodeVerifier,
                );
                (a(n.access_token, n.refresh_token, n.id_token),
                    this.flow === `standard` && this.onAuthSuccess?.(),
                    this.#T());
            } catch (e) {
                throw (this.onAuthError?.(), e);
            }
    }
    async #T() {
        this.#o.enable &&
            this.token &&
            (await D(this.#o.interval * 1e3), (await this.#y()) && (await this.#T()));
    }
    login = (e) => this.#t.login(e);
    createLoginUrl = async (e) => {
        let a = t(),
            o = t(),
            s = this.#t.redirectUri(e),
            c = {state: a, nonce: o, redirectUri: s, loginOptions: e};
        e?.prompt && (c.prompt = e.prompt);
        let l = e?.action === `register` ? this.endpoints.register() : this.endpoints.authorize(),
            u = e?.scope || this.scope,
            d = u ? u.split(` `) : [];
        (d.includes(`openid`) || d.unshift(`openid`), (u = d.join(` `)));
        let f = new URLSearchParams([
            [`client_id`, this.clientId],
            [`redirect_uri`, s],
            [`state`, a],
            [`response_mode`, this.responseMode],
            [`response_type`, this.responseType],
            [`scope`, u],
        ]);
        if (
            (this.#n && f.append(`nonce`, o),
            e?.prompt && f.append(`prompt`, e.prompt),
            typeof e?.maxAge == `number` && f.append(`max_age`, e.maxAge.toString()),
            e?.loginHint && f.append(`login_hint`, e.loginHint),
            e?.idpHint && f.append(`kc_idp_hint`, e.idpHint),
            e?.action && e.action !== `register` && f.append(`kc_action`, e.action),
            e?.locale && f.append(`ui_locales`, e.locale),
            e?.acr && f.append(`claims`, n(e.acr)),
            e?.acrValues && f.append(`acr_values`, e.acrValues),
            this.pkceMethod)
        )
            try {
                let e = r(96),
                    t = await i(this.pkceMethod, e);
                ((c.pkceCodeVerifier = e),
                    f.append(`code_challenge`, t),
                    f.append(`code_challenge_method`, this.pkceMethod));
            } catch (e) {
                throw Error(`Failed to generate PKCE challenge.`, {cause: e});
            }
        return (this.#r.add(c), `${l}?${f.toString()}`);
    };
    logout = (e) => this.#t.logout(e);
    createLogoutUrl = (e) => {
        let t = e?.logoutMethod ?? this.logoutMethod,
            n = this.endpoints.logout();
        if (t === `POST`) return n;
        let r = new URLSearchParams([
            [`client_id`, this.clientId],
            [`post_logout_redirect_uri`, this.#t.redirectUri(e)],
        ]);
        return (this.idToken && r.append(`id_token_hint`, this.idToken), `${n}?${r.toString()}`);
    };
    register = (e) => this.#t.register(e);
    createRegisterUrl = (e) => this.createLoginUrl({...e, action: `register`});
    createAccountUrl = (e) => {
        let t = this.#D();
        if (!t)
            throw Error(
                `Unable to create account URL, make sure the adapter is not configured using a generic OIDC provider.`,
            );
        return `${t}/account?${new URLSearchParams([
            [`referrer`, this.clientId],
            [`referrer_uri`, this.#t.redirectUri(e)],
        ]).toString()}`;
    };
    accountManagement = () => this.#t.accountManagement();
    hasRealmRole = (e) => {
        let t = this.realmAccess;
        return !!t && t.roles.indexOf(e) >= 0;
    };
    hasResourceRole = (e, t) => {
        if (!this.resourceAccess) return !1;
        let n = this.resourceAccess[t || this.clientId];
        return !!n && n.roles.indexOf(e) >= 0;
    };
    loadUserProfile = async () => {
        let e = this.#D();
        if (!e)
            throw Error(
                `Unable to load user profile, make sure the adapter is not configured using a generic OIDC provider.`,
            );
        return (this.profile = await S(`${e}/account`, {headers: [w(this.token)]}));
    };
    loadUserInfo = async () =>
        (this.userInfo = await S(this.endpoints.userinfo(), {headers: [w(this.token)]}));
    isTokenExpired = (e) => {
        if (!this.tokenParsed || (!this.refreshToken && this.flow !== `implicit`))
            throw Error(`Not authenticated`);
        if (this.timeSkew == null)
            return (
                this.#i(
                    `[KEYCLOAK] Unable to determine if token is expired as timeskew is not set`,
                ),
                !0
            );
        if (typeof this.tokenParsed.exp != `number`) return !1;
        let t = this.tokenParsed.exp - Math.ceil(new Date().getTime() / 1e3) + this.timeSkew;
        if (e) {
            if (isNaN(e)) throw Error(`Invalid minValidity`);
            t -= e;
        }
        return t < 0;
    };
    updateToken = async (e) => {
        if (!this.refreshToken) throw Error(`Unable to update token, no refresh token available.`);
        ((e ||= 5), this.#o.enable && (await this.#y()));
        let t = !1;
        if (
            (e === -1
                ? ((t = !0), this.#i(`[KEYCLOAK] Refreshing token: forced refresh`))
                : (!this.tokenParsed || this.isTokenExpired(e)) &&
                  ((t = !0), this.#i(`[KEYCLOAK] Refreshing token: token expired`)),
            !t)
        )
            return !1;
        let {promise: n, resolve: r, reject: i} = Promise.withResolvers();
        if ((this.#e.push({resolve: r, reject: i}), this.#e.length === 1)) {
            let e = this.endpoints.token(),
                t = new Date().getTime();
            try {
                let n = await x(e, this.refreshToken, this.clientId);
                (this.#i(`[KEYCLOAK] Token refreshed`),
                    (t = (t + new Date().getTime()) / 2),
                    this.#E(n.access_token, n.refresh_token, n.id_token, t),
                    this.onAuthRefreshSuccess?.());
                for (let e = this.#e.pop(); e != null; e = this.#e.pop()) e.resolve(!0);
            } catch (e) {
                (this.#a(`[KEYCLOAK] Failed to refresh token`),
                    e instanceof E && e.response.status === 400 && this.clearToken(),
                    this.onAuthRefreshError?.());
                for (let t = this.#e.pop(); t != null; t = this.#e.pop()) t.reject(e);
            }
        }
        return await n;
    };
    clearToken = () => {
        this.token && (this.#E(), this.onAuthLogout?.(), this.loginRequired && this.login());
    };
    #E(e, t, n, r) {
        if (
            ((this.tokenTimeoutHandle &&= (clearTimeout(this.tokenTimeoutHandle), void 0)),
            t
                ? ((this.refreshToken = t), (this.refreshTokenParsed = m(t)))
                : (delete this.refreshToken, delete this.refreshTokenParsed),
            n
                ? ((this.idToken = n), (this.idTokenParsed = m(n)))
                : (delete this.idToken, delete this.idTokenParsed),
            e)
        ) {
            if (
                ((this.token = e),
                (this.tokenParsed = m(e)),
                (this.sessionId = this.tokenParsed.sid),
                (this.authenticated = !0),
                (this.subject = this.tokenParsed.sub),
                (this.realmAccess = this.tokenParsed.realm_access),
                (this.resourceAccess = this.tokenParsed.resource_access),
                r && (this.timeSkew = Math.floor(r / 1e3) - this.tokenParsed.iat),
                this.timeSkew !== null &&
                    (this.#i(
                        `[KEYCLOAK] Estimated time difference between browser and server is ` +
                            this.timeSkew +
                            ` seconds`,
                    ),
                    this.onTokenExpired))
            ) {
                let e = (this.tokenParsed.exp - new Date().getTime() / 1e3 + this.timeSkew) * 1e3;
                (this.#i(`[KEYCLOAK] Token expires in ` + Math.round(e / 1e3) + ` s`),
                    e <= 0
                        ? this.onTokenExpired()
                        : (this.tokenTimeoutHandle = window.setTimeout(this.onTokenExpired, e)));
            }
        } else
            (delete this.token,
                delete this.tokenParsed,
                delete this.subject,
                delete this.realmAccess,
                delete this.resourceAccess,
                (this.authenticated = !1));
    }
    #D() {
        if (this.authServerUrl !== void 0)
            return `${T(this.authServerUrl)}/realms/${encodeURIComponent(this.realm)}`;
    }
    #O(e) {
        return (t) => {
            this.enableLogging && e.call(console, t);
        };
    }
};
function t() {
    if (typeof crypto > `u` || crypto.randomUUID === void 0)
        throw Error(`Web Crypto API is not available.`);
    return crypto.randomUUID();
}
function n(e) {
    return JSON.stringify({id_token: {acr: e}});
}
function r(e) {
    return a(e, `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`);
}
async function i(e, t) {
    if (e !== `S256`)
        throw TypeError(`Invalid value for 'pkceMethod', expected 'S256' but got '${e}'.`);
    return f(new Uint8Array(await p(t)))
        .replace(/\+/g, `-`)
        .replace(/\//g, `_`)
        .replace(/=/g, ``);
}
function a(e, t) {
    let n = o(e),
        r = Array(e);
    for (let i = 0; i < e; i++) r[i] = t.charCodeAt(n[i] % t.length);
    return String.fromCharCode.apply(null, r);
}
function o(e) {
    if (typeof crypto > `u` || crypto.getRandomValues === void 0)
        throw Error(`Web Crypto API is not available.`);
    return crypto.getRandomValues(new Uint8Array(e));
}
function s(e, t, n) {
    let r,
        i = new Promise(function (e, i) {
            r = window.setTimeout(function () {
                i(Error(n || `Promise is not settled within timeout of ` + t + `ms`));
            }, t);
        });
    return Promise.race([e, i]).finally(function () {
        clearTimeout(r);
    });
}
function c() {
    try {
        return new u();
    } catch {
        return new d();
    }
}
const l = `kc-callback-`;
var u = class {
        constructor() {
            (globalThis.localStorage.setItem(`kc-test`, `test`),
                globalThis.localStorage.removeItem(`kc-test`));
        }
        get(e) {
            if (!e) return null;
            this.#e();
            let t = l + e,
                n = globalThis.localStorage.getItem(t);
            return n ? (globalThis.localStorage.removeItem(t), JSON.parse(n)) : null;
        }
        add(e) {
            this.#e();
            let t = l + e.state,
                n = JSON.stringify({...e, expires: Date.now() + 3600 * 1e3});
            try {
                globalThis.localStorage.setItem(t, n);
            } catch {
                (this.#t(), globalThis.localStorage.setItem(t, n));
            }
        }
        #e() {
            let e = Date.now();
            for (let [t, n] of this.#n()) {
                let r = this.#r(n);
                (r === null || r < e) && globalThis.localStorage.removeItem(t);
            }
        }
        #t() {
            for (let [e] of this.#n()) globalThis.localStorage.removeItem(e);
        }
        #n() {
            return Object.entries(globalThis.localStorage).filter(([e]) => e.startsWith(l));
        }
        #r(e) {
            let t;
            try {
                t = JSON.parse(e);
            } catch {
                return null;
            }
            return _(t) && `expires` in t && typeof t.expires == `number` ? t.expires : null;
        }
    },
    d = class {
        get(e) {
            if (!e) return null;
            let t = this.#e(l + e);
            return (this.#t(l + e, ``, this.#n(-100)), t ? JSON.parse(t) : null);
        }
        add(e) {
            this.#t(l + e.state, JSON.stringify(e), this.#n(60));
        }
        #e(e) {
            let t = e + `=`,
                n = document.cookie.split(`;`);
            for (let e = 0; e < n.length; e++) {
                let r = n[e];
                for (; r.charAt(0) === ` `; ) r = r.substring(1);
                if (r.indexOf(t) === 0) return r.substring(t.length, r.length);
            }
            return ``;
        }
        #t(e, t, n) {
            let r = e + `=` + t + `; expires=` + n.toUTCString() + `; `;
            document.cookie = r;
        }
        #n(e) {
            let t = new Date();
            return (t.setTime(t.getTime() + e * 60 * 1e3), t);
        }
    };
function f(e) {
    let t = String.fromCodePoint(...e);
    return btoa(t);
}
async function p(e) {
    let t = new TextEncoder().encode(e);
    if (typeof crypto > `u` || crypto.subtle === void 0)
        throw Error(`Web Crypto API is not available.`);
    return await crypto.subtle.digest(`SHA-256`, t);
}
function m(e) {
    let [, t] = e.split(`.`);
    if (typeof t != `string`) throw Error(`Unable to decode token, payload not found.`);
    let n;
    try {
        n = h(t);
    } catch (e) {
        throw Error(`Unable to decode token, payload is not a valid Base64URL value.`, {cause: e});
    }
    try {
        return JSON.parse(n);
    } catch (e) {
        throw Error(`Unable to decode token, payload is not a valid JSON value.`, {cause: e});
    }
}
function h(e) {
    let t = e.replaceAll(`-`, `+`).replaceAll(`_`, `/`);
    switch (t.length % 4) {
        case 0:
            break;
        case 2:
            t += `==`;
            break;
        case 3:
            t += `=`;
            break;
        default:
            throw Error(`Input is not of the correct length.`);
    }
    try {
        return g(t);
    } catch {
        return atob(t);
    }
}
function g(e) {
    return decodeURIComponent(
        atob(e).replace(/(.)/g, (e, t) => {
            let n = t.charCodeAt(0).toString(16).toUpperCase();
            return (n.length < 2 && (n = `0` + n), `%` + n);
        }),
    );
}
function _(e) {
    return typeof e == `object` && !!e;
}
async function v(e) {
    return await S(e);
}
async function y(e) {
    return await S(e);
}
async function b(e, t, n, r, i) {
    let a = new URLSearchParams([
        [`code`, t],
        [`grant_type`, `authorization_code`],
        [`client_id`, n],
        [`redirect_uri`, r],
    ]);
    return (
        i && a.append(`code_verifier`, i),
        await S(e, {method: `POST`, credentials: `include`, body: a})
    );
}
async function x(e, t, n) {
    return await S(e, {
        method: `POST`,
        credentials: `include`,
        body: new URLSearchParams([
            [`grant_type`, `refresh_token`],
            [`refresh_token`, t],
            [`client_id`, n],
        ]),
    });
}
async function S(e, t = {}) {
    let n = new Headers(t.headers);
    return (n.set(`Accept`, `application/json`), await (await C(e, {...t, headers: n})).json());
}
async function C(e, t) {
    let n = await fetch(e, t);
    if (!n.ok) throw new E(`Server responded with an invalid status.`, {response: n});
    return n;
}
function w(e) {
    if (!e)
        throw Error(
            `Unable to build authorization header, token is not set, make sure the user is authenticated.`,
        );
    return [`Authorization`, `bearer ${e}`];
}
function T(e) {
    return e.endsWith(`/`) ? e.slice(0, -1) : e;
}
var E = class extends Error {
    response;
    constructor(e, t) {
        (super(e, t), (this.response = t.response));
    }
};
const D = (e) => new Promise((t) => setTimeout(t, e));
export {e as default};
//# sourceMappingURL=keycloak.CEtdvogm.js.map
