import {createInstance} from './i18n.js';
import {html, css} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {LanguageSelect} from '@dbp-toolkit/language-select';
import {Icon} from '@dbp-toolkit/common';
import {AuthKeycloak} from '@dbp-toolkit/auth';
import {AuthMenuButton} from './auth-menu-button.js';
import {Notification} from '@dbp-toolkit/notification';
import {ThemeSwitcher} from '@dbp-toolkit/theme-switcher';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {classMap} from 'lit/directives/class-map.js';
import {Router} from './router.js';
import {BuildInfo} from './build-info.js';
import {send as notify} from '@dbp-toolkit/common/notification';
import {appWelcomeMeta} from './dbp-app-shell-welcome.js';
import {MatomoElement} from '@dbp-toolkit/matomo/src/matomo';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

/**
 * In case the application gets updated future dynamic imports might fail.
 * This sends a notification suggesting the user to reload the page.
 *
 * usage: importNotify(import('<path>'));
 *
 * @param i18n
 * @param {Promise} promise
 */
const importNotify = async (i18n, promise) => {
    try {
        return await promise;
    } catch (error) {
        console.log(error);
        notify({
            body: i18n.t('page-updated-needs-reload'),
            type: 'info',
            icon: 'warning',
        });
        throw error;
    }
};

export class AppShell extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.activeView = '';
        this.entryPointUrl = '';
        this.subtitle = '';
        this.description = '';
        this.routes = [];
        this.visibleRoutes = [];
        this.metadata = {};
        this.topic = {};
        this.basePath = '/';
        this.keycloakConfig = null;
        this.noWelcomePage = false;
        this.menuHeight = -1;
        this.gitInfo = '';
        this.env = '';
        this.buildUrl = '';
        this.buildTime = '';
        this._loginStatus = 'unknown';
        this._roles = [];
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this._extra = [];

        this.matomoUrl = '';
        this.matomoSiteId = -1;

        this._attrObserver = new MutationObserver(this.onAttributeObserved);
        this._onShowActivityEvent = this._onShowActivityEvent.bind(this);

        this.boundCloseMenuHandler = this.hideMenu.bind(this);
        this.initateOpenMenu = false;

        this.auth = {};
        this.langFiles = '';
        this.overrideFiles = '';
    }

    static get scopedElements() {
        return {
            'dbp-language-select': LanguageSelect,
            'dbp-build-info': BuildInfo,
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-auth-menu-button': AuthMenuButton,
            'dbp-theme-switcher': ThemeSwitcher,
            'dbp-notification': Notification,
            'dbp-icon': Icon,
            'dbp-matomo': MatomoElement,
        };
    }

    onAttributeObserved(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                const key = mutation.attributeName;
                const value = mutation.target.getAttribute(key);
                sessionStorage.setItem('dbp-attr-' + key, value);
            }
        }
    }

    /**
     * Fetches the metadata of the components we want to use in the menu, dynamically imports the js modules for them,
     * then triggers a rebuilding of the menu and resolves the current route
     *
     * @param {string} topicURL The topic metadata URL or relative path to load things from
     */
    async fetchMetadata(topicURL) {
        let metadata = {};
        let routes = [];

        const result = await (
            await fetch(topicURL, {
                headers: {'Content-Type': 'application/json'},
            })
        ).json();

        this.topic = result;

        const fetchOne = async (url) => {
            const result = await fetch(url, {
                headers: {'Content-Type': 'application/json'},
            });
            if (!result.ok) throw result;

            const jsondata = await result.json();
            if (jsondata['element'] === undefined)
                throw new Error('no element defined in metadata');

            return jsondata;
        };

        let promises = [];
        for (const activity of result.activities) {
            const actURL = new URL(activity.path, new URL(topicURL, window.location).href).href;
            promises.push([
                activity.visible === undefined || activity.visible,
                actURL,
                fetchOne(actURL),
            ]);
        }

        for (const [visible, actURL, p] of promises) {
            try {
                const activity = await p;
                activity.visible = visible;
                // Resolve module_src relative to the location of the json file
                activity.module_src = new URL(activity.module_src, actURL).href;
                activity.required_roles = activity.required_roles || [];
                metadata[activity.routing_name] = activity;
                routes.push(activity.routing_name);
            } catch (error) {
                console.log(error);
            }
        }

        if (!this.noWelcomePage) {
            // Inject the welcome activity
            routes.unshift('welcome');
            metadata = Object.assign(metadata, {
                welcome: appWelcomeMeta,
            });
            customElements.get('dbp-app-shell-welcome').app = this;
        }

        // this also triggers a rebuilding of the menu
        this.metadata = metadata;
        this.routes = routes;

        // Switch to the first route if none is selected
        if (!this.activeView) this.switchComponent(routes[0]);
        else this.switchComponent(this.activeView);
    }

    initRouter() {
        const routes = [
            {
                path: '',
                action: (context) => {
                    return {
                        lang: this.lang,
                        component: '',
                        extra: [],
                    };
                },
            },
            {
                path: '/:lang',
                children: [
                    {
                        path: '',
                        action: (context, params) => {
                            return {
                                lang: params.lang,
                                component: '',
                                extra: [],
                            };
                        },
                    },
                    {
                        name: 'mainRoute',
                        path: ['/:component', '/:component/(.*)'],
                        action: (context, params) => {
                            let componentTag = params.component.toLowerCase();
                            let extra = params[0] ? params[0].split('/') : [];
                            return {
                                lang: params.lang,
                                component: componentTag,
                                extra: extra,
                            };
                        },
                    },
                ],
            },
        ];

        this.router = new Router(
            routes,
            {
                routeName: 'mainRoute',
                getState: () => {
                    let state = {
                        component: this.activeView,
                        lang: this.lang,
                        extra: this._extra,
                    };
                    return state;
                },
                setState: (state) => {
                    this.updateLangIfChanged(state.lang);
                    this.switchComponent(state.component);
                    this._extra = state.extra;
                },
                getDefaultState: () => {
                    return {
                        lang: 'de',
                        component: this.routes[0],
                        extra: [],
                    };
                },
            },
            {
                baseUrl: new URL(this.basePath, window.location).pathname.replace(/\/$/, ''),
            }
        );

        this.router.setStateFromCurrentLocation();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String, reflect: true},
            src: {type: String},
            basePath: {type: String, attribute: 'base-path'},
            activeView: {type: String, attribute: false},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            keycloakConfig: {type: Object, attribute: 'keycloak-config'},
            metadata: {type: Object, attribute: false},
            visibleRoutes: {type: Array, attribute: false},
            topic: {type: Object, attribute: false},
            subtitle: {type: String, attribute: false},
            description: {type: String, attribute: false},
            _loginStatus: {type: Boolean, attribute: false},
            _roles: {type: Array, attribute: false},
            matomoUrl: {type: String, attribute: 'matomo-url'},
            matomoSiteId: {type: Number, attribute: 'matomo-site-id'},
            noWelcomePage: {type: Boolean, attribute: 'no-welcome-page'},
            gitInfo: {type: String, attribute: 'git-info'},
            buildUrl: {type: String, attribute: 'build-url'},
            buildTime: {type: String, attribute: 'build-time'},
            env: {type: String},
            auth: {type: Object},
            langFiles: {type: String, attribute: 'lang-files'},
            overrideFiles: {type: String, attribute: 'override-files'},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.initRouter();
        if (this.src) {
            this.fetchMetadata(this.src);
        }
    }

    /**
     * Switches language if another language is requested
     *
     * @param {string} lang
     */
    updateLangIfChanged(lang) {
        // in case the language is unknown, fall back to the default
        if (!this._i18n.languages.includes(lang)) {
            lang = this.lang;
        }
        if (this.lang !== lang) {
            this.lang = lang;
            this.router.update();

            // tell a dbp-provider to update the "lang" property
            this.sendSetPropertyEvent('lang', lang, true);
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    // For screen readers
                    document.documentElement.setAttribute('lang', this.lang);

                    this.router.update();
                    this.subtitle = this.activeMetaDataText('short_name');
                    this.description = this.activeMetaDataText('description');

                    // send a dbp-lang event with the language
                    this.dispatchEvent(
                        new CustomEvent('dbp-lang', {
                            bubbles: true,
                            composed: true,
                            detail: this.lang,
                        })
                    );
                    break;
                case 'metadata':
                    {
                        this._updateVisibleRoutes();
                    }
                    break;
                case 'auth':
                    {
                        if (this.auth.person) {
                            this._roles = this.auth.person['roles'];
                        } else {
                            this._roles = [];
                        }
                        this._updateVisibleRoutes();

                        const loginStatus = this.auth['login-status'];
                        if (loginStatus !== this._loginStatus) {
                            console.log('Login status: ' + loginStatus);
                        }

                        this._loginStatus = loginStatus;

                        // Clear the session storage when the user logs out
                        if (this._loginStatus === 'logging-out') {
                            sessionStorage.clear();
                        }
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }

    onMenuItemClick(e) {
        e.preventDefault();

        // if not the current page was clicked we need to check if the page can be left
        if (!e.currentTarget.className.includes('selected')) {
            // simulate a "beforeunload" event
            const event = new CustomEvent('beforeunload', {
                bubbles: true,
                cancelable: true,
            });

            const eventResult = window.dispatchEvent(event);

            // if someone canceled the "beforeunload" event we don't want to leave the page
            if (!eventResult) {
                return;
            }
        }

        const link = e.composedPath()[0];
        const location = link.getAttribute('href');
        this.router.updateFromPathname(location);
        this.hideMenu();
    }

    onLanguageChanged(e) {
        const newLang = e.detail.lang;
        const changed = this.lang !== newLang;
        this.lang = newLang;
        if (changed) {
            this.router.update();
            this.subtitle = this.activeMetaDataText('short_name');
            this.description = this.activeMetaDataText('description');
        }
    }

    switchComponent(componentTag) {
        let offset = window.pageYOffset;
        const changed = componentTag !== this.activeView;
        this.activeView = componentTag;
        if (changed) this.router.update();
        const metadata = this.metadata[componentTag];

        if (metadata === undefined) {
            return;
        }

        let updateFunc = () => {
            if (offset > 0) {
                const header = this.shadowRoot.querySelector('header');
                const title = this.shadowRoot.querySelector('#headline');

                if (header === null || title === null) {
                    return;
                }

                let style = getComputedStyle(title);
                let marginTop = isNaN(parseInt(style.marginTop, 10))
                    ? 0
                    : parseInt(style.marginTop, 10);
                let marginBottom = isNaN(parseInt(style.marginBottom, 10))
                    ? 0
                    : parseInt(style.marginBottom, 10);

                let topValue =
                    header.getBoundingClientRect().height +
                    title.getBoundingClientRect().height +
                    marginTop +
                    marginBottom;

                if (offset < topValue) {
                    window.scrollTo(0, offset);
                } else {
                    window.scrollTo(0, topValue);
                }
            }
            this.updatePageTitle();
            this.subtitle = this.activeMetaDataText('short_name');
            this.description = this.activeMetaDataText('description');
        };

        // If it is empty assume the element is already registered through other means
        if (!metadata.module_src) {
            updateFunc();
            return;
        }

        importNotify(this._i18n, import(metadata.module_src))
            .then(() => {
                updateFunc();
            })
            .catch((e) => {
                console.error(`Error loading ${metadata.element}`);
                throw e;
            });
    }

    metaDataText(routingName, key) {
        const metadata = this.metadata[routingName];
        return metadata !== undefined && metadata[key] !== undefined
            ? metadata[key][this.lang]
            : '';
    }

    topicMetaDataText(key) {
        return this.topic[key] !== undefined ? this.topic[key][this.lang] : '';
    }

    activeMetaDataText(key) {
        return this.metaDataText(this.activeView, key);
    }

    updatePageTitle() {
        document.title = `${this.topicMetaDataText('name')} - ${this.activeMetaDataText(
            'short_name'
        )}`;
    }

    toggleMenu() {
        const menu = this.shadowRoot.querySelector('ul.menu');
        const subtitle = this.shadowRoot.querySelector('h2.subtitle');

        if (menu === null || subtitle === null) {
            return;
        }

        menu.classList.toggle('hidden');

        if (this.menuHeight === -1) {
            this.menuHeight = menu.clientHeight;
        }

        let topValue = subtitle.getBoundingClientRect().bottom;
        let isMenuOverflow = this.menuHeight + topValue >= window.innerHeight ? true : false;

        if (isMenuOverflow && !menu.classList.contains('hidden')) {
            menu.setAttribute(
                'style',
                'position: fixed;top: ' +
                    topValue +
                    'px;bottom: 0;border-bottom: 0;overflow-y: auto;'
            );
            menu.scrollTop = 0;
            document.body.setAttribute('style', 'overflow:hidden;');
        } else if (isMenuOverflow && menu.classList.contains('hidden')) {
            document.body.removeAttribute('style', 'overflow:hidden;');
            menu.removeAttribute('style');
        }

        const chevron = this.shadowRoot.querySelector('#menu-chevron-icon');
        if (chevron !== null) {
            chevron.name = menu.classList.contains('hidden') ? 'chevron-down' : 'chevron-up';
        }

        if (!menu.classList.contains('hidden')) {
            document.addEventListener('click', this.boundCloseMenuHandler);
            this.initateOpenMenu = true;
        } else {
            document.removeEventListener('click', this.boundCloseMenuHandler);
            menu.removeAttribute('style');
        }
    }

    hideMenu() {
        if (this.initateOpenMenu) {
            this.initateOpenMenu = false;
            return;
        }
        const menu = this.shadowRoot.querySelector('ul.menu');
        if (menu && !menu.classList.contains('hidden')) this.toggleMenu();
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getLinkCss()}

            .hidden {
                display: none;
            }

            h1.title {
                margin-bottom: 0;
                font-weight: 300;
            }

            #main {
                display: grid;
                grid-template-columns: minmax(180px, 17%) minmax(0, auto);
                grid-template-rows: min-content min-content 1fr min-content;
                grid-template-areas: 'header header' 'headline headline' 'sidebar main' 'footer footer';
                max-width: 1400px;
                margin: auto;
                min-height: 100vh;
            }

            #main-logo {
                padding: 0 50px 0 0;
            }

            header {
                grid-area: header;
                display: grid;
                grid-template-columns: 50% 1px auto;
                grid-template-rows: 60px 60px;
                grid-template-areas: 'hd1-left hd1-middle hd1-right' 'hd2-left . hd2-right';
                width: 100%;
                max-width: 1060px;
                margin: 0 auto;
            }

            aside {
                grid-area: sidebar;
                margin: 15px 15px;
            }
            #headline {
                grid-area: headline;
                margin: 20px 0 30px 0;
                text-align: center;
            }
            main {
                grid-area: main;
                margin: 15px 15px;
            }
            footer {
                grid-area: footer;
                margin: 15px;
                text-align: right;
            }

            header .hd1-left {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                -webkit-justify-content: flex-end;
                grid-area: hd1-left;
                text-align: right;
                padding-right: 20px;
                align-items: center;
                -webkit-align-items: center;
                gap: 10px;
            }

            header .hd1-left #lang-select {
                padding-left: 10px;
            }

            header .hd1-middle {
                grid-area: hd1-middle;
                background-color: var(--dbp-content);
                background: linear-gradient(
                    180deg,
                    var(--dbp-content) 0%,
                    var(--dbp-content) 85%,
                    rgba(0, 0, 0, 0) 90%
                );
            }

            header .hd1-right {
                grid-area: hd1-right;
                display: flex;
                justify-content: flex-start;
                -webkit-justify-content: flex-start;
                padding: 0 20px;
                min-width: 0;
                align-items: center;
                -webkit-align-items: center;
            }

            header .hd1-right .auth-button {
                min-width: 0;
            }

            header .hd2-left {
                grid-area: hd2-left;
                display: flex;
                flex-direction: column;
                white-space: nowrap;
            }

            header .hd2-left .header {
                margin-left: 50px;
            }

            header .hd2-left a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
            }

            header .hd2-right {
                grid-area: hd2-right;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: right;
            }

            header a {
                color: var(--dbp-content);
                display: inline;
            }

            aside ul.menu,
            footer ul.menu {
                list-style: none;
            }

            ul.menu li.close {
                display: none;
            }

            footer {
                display: flex;
                justify-content: flex-end;
                flex-wrap: wrap;
            }

            footer > *,
            footer slot > * {
                margin: 0.5em 0 0 1em;
            }

            footer a {
                border-bottom: var(--dbp-border);
                padding: 0;
            }

            footer a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
                border-color: var(--dbp-hover-color, var(--dbp-content));
            }

            /* We don't allow inline-svg */
            /*
            footer .int-link-external::after {
                content: "\\00a0\\00a0\\00a0\\00a0";
                background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%225.6842mm%22%20width%3D%225.6873mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2020.151879%2020.141083%22%3E%3Cg%20transform%3D%22translate(-258.5%20-425.15)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A1.2%3Bfill%3Anone%22%20d%3D%22m266.7%20429.59h-7.5029v15.002h15.002v-7.4634%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A1.2%3Bfill%3Anone%22%20d%3D%22m262.94%20440.86%2015.002-15.002%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A1.2%3Bfill%3Anone%22%20d%3D%22m270.44%20425.86h7.499v7.499%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
                background-size:contain;
                background-repeat: no-repeat;
                background-position:center center;
                margin: 0 0.5% 0 1.5%;
                font-size:94%;
            }
            */

            .menu a {
                padding: 0.3em;
                font-weight: 300;
                color: var(--dbp-content);
                display: block;
                padding-right: 13px;
                word-break: break-word;
            }

            .menu a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
            }

            .menu a.selected {
                border-left: 3px solid var(--dbp-accent);
                font-weight: bolder;
                padding-left: 0.5em;
                padding-right: 0.3em;
            }

            aside .subtitle {
                display: none;
                color: var(--dbp-content);
                font-size: 1.25rem;
                font-weight: 300;
                line-height: 1.25;
                cursor: pointer;
                text-align: center;
            }

            ul.menu.hidden {
                display: block;
            }

            a {
                transition: background-color 0.15s ease 0s, color 0.15s ease 0s;
            }

            .description {
                text-align: left;
                margin-bottom: 1rem;
                display: none;
            }

            #dbp-notification {
                z-index: 99999;
            }

            @media (max-width: 768px) {
                #main {
                    grid-template-columns: minmax(0, auto);
                    grid-template-rows: min-content min-content min-content 1fr min-content;
                    grid-template-areas: 'header' 'headline' 'sidebar' 'main' 'footer';
                }

                header {
                    grid-template-rows: 40px;
                    grid-template-areas: 'hd1-left hd1-middle hd1-right';
                }

                header .hd2-left,
                header .hd2-right {
                    display: none;
                }

                aside {
                    margin: 0;
                    position: sticky;
                    top: 0;
                    width: 100%;
                    background-color: var(--dbp-background);
                    z-index: 10;
                }

                aside h2.subtitle {
                    display: block;
                    border-bottom: var(--dbp-border);
                    padding: 0.5em 0.5em;
                }

                aside .menu {
                    border-bottom: var(--dbp-border);
                    border-top-width: 0;
                    width: 100%;
                    position: absolute;
                    background-color: var(--dbp-background);
                    z-index: 10;
                }

                .menu li {
                    padding: 7px;
                }

                .menu a {
                    padding: 8px;
                }

                ul.menu li.close {
                    display: block;
                    padding: 0 15px 15px 15px;
                    text-align: right;
                    cursor: pointer;
                }

                ul.menu.hidden {
                    display: none;
                }
            }
        `;
    }

    _createActivityElement(activity) {
        // We have to create elements dynamically based on a tag name which isn't possible with lit-html.
        // This means we pass the finished element to lit-html and have to handle element caching and
        // event binding ourselves.

        if (this._lastElm !== undefined) {
            if (this._lastElm.tagName.toLowerCase() == activity.element.toLowerCase()) {
                return this._lastElm;
            } else {
                this._onActivityRemoved(this._lastElm);
                this._lastElm = undefined;
            }
        }

        this.track('renderActivity', activity.element);

        // After it is loaded and registered globally, we get it and register it locally
        customElements.whenDefined(activity.element).then(() => {
            this.defineScopedElement(activity.element, customElements.get(activity.element));
        });

        let elm = this.createScopedElement(activity.element);

        this._onActivityAdded(elm);
        this._lastElm = elm;
        return elm;
    }

    _onShowActivityEvent(e) {
        this.switchComponent(e.detail.name);
    }

    _onActivityAdded(element) {
        for (const key of this.topic.attributes || []) {
            let value = sessionStorage.getItem('dbp-attr-' + key);
            if (value !== null) {
                element.setAttribute(key, value);
            }
        }
        this._attrObserver.observe(element, {
            attributes: true,
            attributeFilter: this.topic.attributes,
        });
        element.addEventListener('dbp-show-activity', this._onShowActivityEvent);
    }

    _onActivityRemoved(element) {
        this._attrObserver.disconnect();
        element.removeEventListener('dbp-show-activity', this._onShowActivityEvent);
    }

    track(action, message) {
        this.sendSetPropertyEvent('analytics-event', {category: action, action: message}, true);
    }

    _renderActivity() {
        const act = this.metadata[this.activeView];
        if (act === undefined) return html``;

        const elm = this._createActivityElement(act);

        // add subscriptions for the provider component
        if (act.subscribe !== undefined) {
            elm.setAttribute('subscribe', act.subscribe);
        }

        // only add the entry-point-url attribute if it isn't subscribed
        if (act.subscribe === undefined || !act.subscribe.includes('entry-point-url:')) {
            elm.setAttribute('entry-point-url', this.entryPointUrl);
        }

        // only add the lang attribute if it isn't subscribed
        if (act.subscribe === undefined || !act.subscribe.includes('lang:')) {
            elm.setAttribute('lang', this.lang);
        }
        return elm;
    }

    _updateVisibleRoutes() {
        let visibleRoutes = [];

        for (let routingName of this.routes) {
            const data = this.metadata[routingName];
            const requiredRoles = data['required_roles'];
            let visible = data['visible'];

            // Hide them until the user is logged in and we know the roles of the user
            for (let role of requiredRoles) {
                if (!this._roles.includes(role)) {
                    visible = false;
                    break;
                }
            }

            if (visible) {
                visibleRoutes.push(routingName);
            }
        }

        this.visibleRoutes = visibleRoutes;

        const event = new CustomEvent('visibility-changed', {
            bubbles: false,
            cancelable: true,
        });
        this.dispatchEvent(event);
    }

    render() {
        let i18n = this._i18n;

        const getSelectClasses = (name) => {
            return classMap({selected: this.activeView === name});
        };

        // We hide the app until we are either fully logged in or logged out
        // At the same time when we hide the main app we show the main slot (e.g. a loading spinner)
        const appHidden = this._loginStatus === 'unknown' || this._loginStatus === 'logging-in';
        const mainClassMap = classMap({hidden: appHidden});
        const slotClassMap = classMap({hidden: !appHidden});

        if (!appHidden) {
            this.updateComplete.then(() => {
                // XXX: Safari 11 doesn't like CSS being applied to slots or via HTML,
                // so we have to remove the slot instead of hiding it
                // select slots with no name attribute
                const slot = this.shadowRoot.querySelector('slot:not([name])');
                if (slot) slot.remove();
            });
        }

        const prodClassMap = classMap({
            hidden: this.env === 'production' || this.env === 'demo' || this.env === '',
        });

        this.updatePageTitle();

        // build the menu
        let menuTemplates = [];
        for (let routingName of this.visibleRoutes) {
            menuTemplates.push(
                html`
                    <li>
                        <a
                            @click="${(e) => this.onMenuItemClick(e)}"
                            href="${this.router.getPathname({component: routingName})}"
                            data-nav
                            class="${getSelectClasses(routingName)}"
                            title="${this.metaDataText(routingName, 'description')}">
                            ${this.metaDataText(routingName, 'short_name')}
                        </a>
                    </li>
                `
            );
        }

        const kc = this.keycloakConfig;
        return html`
            <slot class="${slotClassMap}"></slot>
            <dbp-auth-keycloak
                subscribe="requested-login-status"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"
                url="${kc.url}"
                realm="${kc.realm}"
                client-id="${kc.clientId}"
                silent-check-sso-redirect-uri="${kc.silentCheckSsoRedirectUri || ''}"
                scope="${kc.scope || ''}"
                idp-hint="${kc.idpHint || ''}"
                ?force-login="${kc.forceLogin}"
                ?try-login="${!kc.forceLogin}"></dbp-auth-keycloak>
            <dbp-matomo
                subscribe="auth,analytics-event"
                endpoint="${this.matomoUrl}"
                site-id="${this.matomoSiteId}"
                git-info="${this.gitInfo}"></dbp-matomo>
            <div class="${mainClassMap}" id="root">
                <div id="main">
                    <dbp-notification id="dbp-notification" lang="${this.lang}"></dbp-notification>
                    <header>
                        <slot name="header">
                            <div class="hd1-left">
                                <dbp-theme-switcher
                                    subscribe="themes,dark-mode-theme-override"
                                    lang="${this.lang}"></dbp-theme-switcher>
                                <dbp-language-select
                                    id="lang-select"
                                    lang="${this.lang}"></dbp-language-select>
                            </div>
                            <div class="hd1-middle"></div>
                            <div class="hd1-right">
                                <dbp-auth-menu-button
                                    subscribe="auth"
                                    class="auth-button"
                                    lang="${this.lang}"></dbp-auth-menu-button>
                            </div>
                            <div class="hd2-left">
                                <div class="header">
                                    <slot name="name">
                                        DBP
                                        <br />
                                        Digital Blueprint
                                    </slot>
                                </div>
                            </div>
                            <div class="hd2-right">
                                <slot name="logo">
                                    <div id="main-logo">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            height="70"
                                            viewBox="0 0 13.197 11.828"
                                            xmlns:v="https://vecta.io/nano">
                                            <style>
                                                <![CDATA[.B{fill:#c8c7c7}.C{fill:#231f20}]]>
                                            </style>
                                            <path
                                                d="M0 4.942v.313l5.866 3.295 5.927-3.295v-.313L5.896 8.237z"
                                                class="B" />
                                            <path
                                                d="M5.865 8.549l5.927-3.295v-.313L5.896 8.237z"
                                                class="C" />
                                            <path
                                                d="M0 6.581v.312l5.866 3.295 5.927-3.295v-.312L5.896 9.876z"
                                                class="B" />
                                            <path
                                                d="M5.865 10.188l5.927-3.295v-.312L5.896 9.876z"
                                                class="C" />
                                            <path
                                                d="M0 8.22v.313l5.866 3.295 5.927-3.295V8.22l-5.896 3.295z"
                                                class="B" />
                                            <path
                                                d="M5.865 11.827l5.927-3.295V8.22l-5.897 3.295z"
                                                class="C" />
                                            <path
                                                d="M8.844 4.991L7.37 4.167l1.474-.824 1.474.824z"
                                                class="B" />
                                            <use xlink:href="#B" class="C" />
                                            <path
                                                d="M8.774 3.295L7.3 2.471l1.474-.824 1.474.824z"
                                                fill="#656263" />
                                            <use xlink:href="#B" x="-1.474" y="0.823" class="C" />
                                            <use xlink:href="#B" x="-2.948" class="B" />
                                            <g fill="#7b7979">
                                                <use xlink:href="#B" x="-1.474" y="-0.824" />
                                                <use xlink:href="#B" x="-1.474" y="-2.471" />
                                                <path
                                                    d="M4.422 2.471l-1.474-.824L4.422.823l1.474.824z" />
                                            </g>
                                            <use xlink:href="#B" x="-4.422" y="-0.824" class="B" />
                                            <path
                                                d="M11.722 1.647L10.249.823 11.722 0l1.474.824z"
                                                class="C" />
                                            <g class="B">
                                                <path
                                                    d="M8.844 6.589L7.37 5.766l1.474-.824 1.474.824z" />
                                                <use xlink:href="#B" y="1.647" />
                                            </g>
                                            <use xlink:href="#B" x="-4.422" y="0.823" class="C" />
                                            <defs>
                                                <path
                                                    id="B"
                                                    d="M7.37 5.766l-1.474-.824 1.474-.824 1.474.824z" />
                                            </defs>
                                        </svg>
                                    </div>
                                </slot>
                            </div>
                        </slot>
                    </header>
                    <div id="headline">
                        <h1 class="title">
                            <slot name="title">${this.topicMetaDataText('name')}</slot>
                        </h1>
                    </div>
                    <aside>
                        <h2 class="subtitle" @click="${this.toggleMenu}">
                            ${this.subtitle}
                            <dbp-icon
                                name="chevron-down"
                                style="color: var(--dbp-accent)"
                                id="menu-chevron-icon"></dbp-icon>
                        </h2>
                        <ul class="menu hidden">
                            ${menuTemplates}
                            <li class="close" @click="${this.hideMenu}">
                                <dbp-icon name="close" style="color: var(--dbp-accent)"></dbp-icon>
                            </li>
                        </ul>
                    </aside>

                    <main>
                        <div
                            style="display: ${!this.metadata[this.activeView] ? 'block' : 'none'};">
                            <h2>${i18n.t('page-not-found')}</h2>
                            <p>${i18n.t('choose-from-menu')}</p>
                        </div>
                        <p class="description">${this.description}</p>
                        ${this._renderActivity()}
                    </main>

                    <footer>
                        <slot name="footer">
                            <slot name="footer-links">
                                <a rel="noopener" class="" href="#use-your-privacy-policy-link">
                                    ${i18n.t('privacy-policy')}
                                </a>
                                <a rel="noopener" class="" href="#use-your-imprint-link">
                                    ${i18n.t('imprint')}
                                </a>
                                <a rel="noopener" class="" href="#use-your-imprint-link">
                                    ${i18n.t('contact')}
                                </a>
                            </slot>
                            <dbp-build-info
                                class="${prodClassMap}"
                                git-info="${this.gitInfo}"
                                env="${this.env}"
                                build-url="${this.buildUrl}"
                                build-time="${this.buildTime}"></dbp-build-info>
                        </slot>
                    </footer>
                </div>
            </div>
        `;
    }
}
