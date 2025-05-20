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
                        this.loginCallback(currentAuth);
                    }
                    if (!wasLoggedOut && isLoggedOut) {
                        this.logoutCallback();
                    }
                    this._previousAuthState = {...currentAuth};
                }
                super.update(changedProps);
            }

            /**
             * Called when user logs in
             * @param {object} auth - The auth state with login information
             */
            loginCallback(auth) {}

            /**
             * Called when user logs out or was logged out
             */
            logoutCallback() {}
        },
);
