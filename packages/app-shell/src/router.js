import UniversalRouter from 'universal-router';
import generateUrls from 'universal-router/generateUrls';

function stateMatches(a, b) {
    return JSON.stringify(a, Object.keys(a).sort()) === JSON.stringify(b, Object.keys(b).sort());
}

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
            this._dispatchLocationChanged();
        });
    }

    async _getStateForPath(pathname) {
        let isBasePath = pathname.replace(/\/$/, '') === this.router.baseUrl.replace(/\/$/, '');
        if (isBasePath) {
            return this.getDefaultState();
        }
        return this.router.resolve({pathname: pathname});
    }

    /**
     * In case something else has changed the location, update the app state accordingly.
     */
    setStateFromCurrentLocation() {
        this._getStateForPath(location.pathname)
            .then((page) => {
                this.setState(page);
            })
            .catch((e) => {
                // In case we can't resolve the location, just leave things as is.
                // This happens when a user enters a wrong URL or when testing with karma.
            });
    }

    /**
     * Update the router after some internal state change.
     */
    update() {
        // Queue updates so we can call this multiple times when changing state
        // without it resulting in multiple location changes
        setTimeout(() => {
            this._getStateForPath(location.pathname)
                .then((page) => {
                    const newState = this.getState();
                    // if the state has changed we update
                    if (!stateMatches(newState, page)) {
                        const newPathname = this.getPathname();
                        const referrerUrl = location.href;
                        window.history.pushState({}, '', newPathname);
                        this._dispatchLocationChanged(referrerUrl);
                    }
                })
                .catch((e) => {
                    // In case we can't resolve the location, just leave things as is.
                    // This happens when a user enters a wrong URL or when testing with karma.
                });
        });
    }

    /**
     * Given a new routing path set the location and the app state.
     *
     * @param {string} pathname
     */
    updateFromPathname(pathname) {
        this._getStateForPath(pathname)
            .then((page) => {
                const oldState = this.getState();
                if (!stateMatches(oldState, page)) {
                    const referrerUrl = location.href;
                    window.history.pushState({}, '', pathname);
                    this.setState(page);
                    this._dispatchLocationChanged(referrerUrl);
                }
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
        if (partialState === undefined) {
            partialState = {};
        }
        let combined = {...currentState, ...partialState};

        try {
            return generateUrls(this.router)(this.routeName, combined);
        } catch {
            // XXX: In case we have partial state this will fail, just return the old path
            return location.pathname;
        }
    }

    _dispatchLocationChanged(referrerUrl = '') {
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
