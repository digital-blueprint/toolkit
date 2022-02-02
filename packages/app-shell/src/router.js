import UniversalRouter from 'universal-router';
import generateUrls from 'universal-router/generateUrls';

/**
 * A wrapper around UniversalRouter which adds history integration
 */
export class Router {
    /**
     * @param {Array} routes The routes passed to UniversalRouter
     * @param {object} options Options
     * @param {string} options.routeName The main route name
     * @param {Function} options.getState Function which should return the current state
     * @param {Function} options.setState Function which gets passed the new state based on the route
     * @param {object} unioptions options passed to UniversalRouter
     */
    constructor(routes, options, unioptions) {
        this.getState = options.getState;
        this.setState = options.setState;
        this.getDefaultState = options.getDefaultState;
        // XXX: We only have one route atm
        // If we need more we need to pass the route name to each function
        this.routeName = options.routeName;

        console.assert(this.getState);
        console.assert(this.setState);
        console.assert(this.getDefaultState);
        console.assert(this.routeName);

        // https://github.com/kriasoft/universal-router
        this.router = new UniversalRouter(routes, unioptions);

        window.addEventListener('popstate', (event) => {
            this.setStateFromCurrentLocation();
            this.dispatchLocationChanged();
        });
    }

    /**
     * In case something else has changed the location, update the app state accordingly.
     */
    setStateFromCurrentLocation() {
        const oldPathName = location.pathname;

        this.router
            .resolve({pathname: oldPathName})
            .then((page) => {
                const newPathname = this.getPathname(page);
                // In case of a router redirect, set the new location
                if (newPathname !== oldPathName) {
                    const referrerUrl = location.href;
                    window.history.replaceState({}, '', newPathname);
                    this.dispatchLocationChanged(referrerUrl);
                } else if (this.isBasePath(oldPathName)) {
                    page = this.getDefaultState();
                }
                this.setState(page);
            })
            .catch((e) => {
                // In case we can't resolve the location, just leave things as is.
                // This happens when a user enters a wrong URL or when testing with karma.
            });
    }

    isBasePath(pathname) {
        return pathname.replace(/\/$/, '') === this.router.baseUrl.replace(/\/$/, '');
    }

    /**
     * Update the router after some internal state change.
     */
    update() {
        // Queue updates so we can call this multiple times when changing state
        // without it resulting in multiple location changes
        setTimeout(() => {
            const newPathname = this.getPathname();
            const oldPathname = location.pathname;
            if (newPathname === oldPathname) return;

            const defaultPathname = this.getPathname(this.getDefaultState());
            if (newPathname === defaultPathname && this.isBasePath(oldPathname)) {
                return;
            }

            const referrerUrl = location.href;
            window.history.pushState({}, '', newPathname);
            this.dispatchLocationChanged(referrerUrl);
        });
    }

    /**
     * Given a new routing path set the location and the app state.
     *
     * @param {string} pathname
     */
    updateFromPathname(pathname) {
        this.router
            .resolve({pathname: pathname})
            .then((page) => {
                if (location.pathname === pathname) return;
                const referrerUrl = location.href;
                window.history.pushState({}, '', pathname);
                this.setState(page);
                this.dispatchLocationChanged(referrerUrl);
            })
            .catch((err) => {
                throw new Error(`Route not found: ${pathname}: ${err}`);
            });
    }

    /**
     * Pass some new router state to get a new router path that can
     * be passed to updateFromPathname() later on. If nothing is
     * passed the current state is used.
     *
     * @param {object} [partialState] The optional partial new state
     * @returns {string} The new path
     */
    getPathname(partialState) {
        const currentState = this.getState();
        if (partialState === undefined) partialState = {};
        let combined = {...currentState, ...partialState};

        try {
            return generateUrls(this.router)(this.routeName, combined);
        } catch {
            // XXX: In case we have partial state this will fail, just return the old path
            return location.pathname;
        }
    }

    dispatchLocationChanged(referrerUrl = '') {
        // fire a locationchanged event
        window.dispatchEvent(
            new CustomEvent('locationchanged', {
                detail: {
                    referrerUrl: referrerUrl,
                },
                bubbles: true,
            })
        );
    }
}
