import {dedupeMixin} from '@open-wc/dedupe-mixin';

/**
 * @typedef {{token?: string, 'login-status'?: string, 'person-id'?: string} & Record<string, unknown>} AuthState
 * @typedef {{auth: AuthState | null, isAuthPending: () => boolean, isLoggedIn: () => boolean}} AuthMixinHost
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} LitElementConstructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<AuthMixinHost>} AuthMixinHostConstructor
 */

/**
 * @template {LitElementConstructor} T
 * @param {T} superClass
 * @returns {T & AuthMixinHostConstructor}
 */
const AuthMixinImplementation = (superClass) => {
    const AuthMixinClass = class extends superClass {
        static properties = {
            auth: {type: Object},
            .../** @type {{properties?: object}} */ (superClass).properties,
        };

        constructor(...args) {
            super(...args);
            this.auth = null;
            this._previousAuthState = null;
            this._authPending = true;
        }

        update(changedProps) {
            if (changedProps.has('auth')) {
                const prevAuth = this._previousAuthState || {};
                const currentAuth = this.auth || {};

                const wasLoggedIn = prevAuth['login-status'] === 'logged-in';
                const wasLoggedOut = prevAuth['login-status'] === 'logged-out';
                const isLoggedIn = currentAuth['login-status'] === 'logged-in';
                const isLoggedOut = currentAuth['login-status'] === 'logged-out';

                if (!wasLoggedIn && isLoggedIn) {
                    this._authPending = false;
                    this.loginCallback(currentAuth);
                }
                if (!wasLoggedOut && isLoggedOut) {
                    if (this._authPending) {
                        this._authPending = false;
                    } else {
                        this.logoutCallback();
                    }
                }
                this._previousAuthState = {...currentAuth};
            }
            super.update(changedProps);
        }

        /**
         * @returns {boolean} - True if the auth state is not settled yet.
         */
        isAuthPending() {
            return this._authPending;
        }

        /**
         * @returns {boolean} - True if the user is logged in, false otherwise.
         */
        isLoggedIn() {
            return this.auth && this.auth['login-status'] === 'logged-in';
        }

        /**
         * Called when user logs in, or on load when the user is logged in.
         * @param {AuthState} auth - The auth state with login information, same as this.auth
         */
        loginCallback(auth) {}

        /**
         * Called when user logs out or was logged out. Only gets called if loginCallback()
         * was called before.
         */
        logoutCallback() {}
    };

    return AuthMixinClass;
};

export const AuthMixin = dedupeMixin(AuthMixinImplementation);
