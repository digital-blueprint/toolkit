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
     * @param {Function} options.getDefaultState Function which should return the default state
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
    async setStateFromCurrentLocation() {
        let page;
        try {
            page = await this._getStateForPath(location.pathname);
        } catch{
            // In case we can't resolve the location, just leave things as is.
            // This happens when a user enters a wrong URL or when testing with karma.
            return;
        }

        this.setState(page);
    }

    /**
     * Update the router after some internal state change.
     */
    async update() {
        // Queue updates so we can call this multiple times when changing state
        // without it resulting in multiple location changes
        await new Promise(resolve => setTimeout(resolve));

        let page;
        try {
            page = await this._getStateForPath(location.pathname);
        } catch {
            // In case we can't resolve the location, just leave things as is.
            // This happens when a user enters a wrong URL or when testing with karma.
            return;
        }

        const newState = this.getState();

        // if the state has changed we update
        if (!stateMatches(newState, page)) {
            const newPathname = this.getPathname();
            const referrerUrl = location.href;
            window.history.pushState({}, '', newPathname);
            this._dispatchLocationChanged(referrerUrl);
        }
    }

    /**
     * Given a new routing URL set the location and the app state.
     *
     * @param {string} relUrl
     */
    async updateFromUrl(relUrl) {
        // FIXME: we throw out the search and hash part of the URL since the router can't deal with
        // them yet.
        let url = new URL(relUrl, location.href);
        let pathname = url.pathname;

        let page;
        try {
            page = await this._getStateForPath(pathname);
        } catch {
            // In case we can't resolve the location, just leave things as is.
            // This happens when a user enters a wrong URL or when testing with karma.
            return;
        }

        const oldState = this.getState();

        if (!stateMatches(oldState, page)) {
            const referrerUrl = location.href;
            window.history.pushState({}, '', pathname);
            this.setState(page);
            this._dispatchLocationChanged(referrerUrl);
        }
    }

    /**
     * Pass some new router state to get a new router path that can
     * be passed to updateFromUrl() later on. If nothing is
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
