import {dedupeMixin} from '@open-wc/dedupe-mixin';

export const AuthMixin = dedupeMixin(
    (superClass) =>
        class extends superClass {
            static properties = {
                auth: {type: Object},
                ...superClass.properties,
            };

            constructor() {
                super();
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
                    if (!wasLoggedOut && isLoggedOut && !this._authPending) {
                        this._authPending = false;
                        this.logoutCallback();
                    }
                    this._previousAuthState = {...currentAuth};
                }
                super.update(changedProps);
            }

            /**
             * @returns {boolean} - True if the auth state is not settled yet, i.e.
             * loginCallback or logoutCallback has not been called yet.
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
             * @param {object} auth - The auth state with login information, same as this.auth
             */
            loginCallback(auth) {}

            /**
             * Called when user logs out or was logged out. Only gets called if loginCallback()
             * was called before.
             */
            logoutCallback() {}
        },
);
