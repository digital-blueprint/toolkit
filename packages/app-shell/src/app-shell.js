import {createInstance} from './i18n.js';
import {html, css} from 'lit';
import {ScopedElementsMixin, LangMixin, sendNotification} from '@dbp-toolkit/common';
import {LanguageSelect} from '@dbp-toolkit/language-select';
import {Icon} from '@dbp-toolkit/common';
import {AuthKeycloak} from '@dbp-toolkit/auth';
import {AuthMenuButton} from './auth-menu-button.js';
import {Notification} from '@dbp-toolkit/notification';
import {ThemeSwitcher} from '@dbp-toolkit/theme-switcher';
import {Themed} from '@dbp-toolkit/theme-switcher';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {classMap} from 'lit/directives/class-map.js';
import {Router} from './router.js';
import {BuildInfo} from './build-info.js';
import {appWelcomeMeta} from './dbp-app-shell-welcome.js';
import {MatomoElement} from '@dbp-toolkit/matomo/src/matomo';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {FeatureFlagDropdown} from './feature-flag-dropdown.js';

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
        sendNotification({
            body: i18n.t('page-updated-needs-reload'),
            type: 'info',
            icon: 'warning',
        });
        throw error;
    }
};

export class AppShell extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
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
        this._extra = undefined;

        this.matomoUrl = '';
        this.matomoSiteId = -1;

        this._attrObserver = new MutationObserver(this.onAttributeObserved);
        this._onShowActivityEvent = this._onShowActivityEvent.bind(this);

        this.boundCloseMenuHandler = this.hideMenu.bind(this);
        this.initateOpenMenu = false;

        this.auth = null;
        this.langDir = '';
        this.routingBaseUrl = null;
        this.isScrollTopButtonVisible = false;
        this.isScrollBottomButtonVisible = true;
    }

    static get scopedElements() {
        return {
            'dbp-language-select': LanguageSelect,
            'dbp-build-info': BuildInfo,
            'dbp-feature-flag-dropdown': FeatureFlagDropdown,
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-auth-menu-button': AuthMenuButton,
            'dbp-theme-switcher': ThemeSwitcher,
            'dbp-themed': Themed,
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
            const actURL = new URL(activity.path, new URL(topicURL, window.location.href).href)
                .href;
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

    firstUpdated() {
        super.firstUpdated();

        if (!this.isMenuFloating()) {
            this.toggleMenu();
        }

        // Wait for all updates to complete before initializing scroll buttons
        this.updateComplete.then(() => {
            this.initializeScrollToTopButton();
        });
    }

    initRouter() {
        const routes = [
            {
                path: '',
                action: (context) => {
                    return {
                        lang: this.lang,
                        component: '',
                        extra: undefined,
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
                                extra: undefined,
                            };
                        },
                    },
                    {
                        name: 'mainRoute',
                        path: ['/:component{/*extra}'],
                        action: (context, params) => {
                            let componentTag = params.component.toLowerCase();
                            let extra = params.extra ?? undefined;
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
                    this.sendRoutingUrl();
                },
                getDefaultState: () => {
                    return {
                        lang: 'de',
                        component: this.routes[0],
                        extra: undefined,
                    };
                },
            },
            {
                baseUrl: new URL(this.basePath, window.location.href).pathname.replace(/\/$/, ''),
            },
        );

        this.router.setStateFromCurrentLocation();
    }

    sendRoutingUrl() {
        const routingBaseUrl =
            new URL(this.basePath, window.location.href) +
            encodeURIComponent(this.lang) +
            '/' +
            encodeURIComponent(this.activeView);
        this.sendSetPropertyEvent('routing-base-url', routingBaseUrl, true);

        let path = (this._extra ?? []).join('/');

        // Lit element does not seem to react on empty strings when pressing the back button
        if (path === '') {
            path = '/';
        }

        let routingUrl = path + window.location.search + window.location.hash;

        console.log('sendRoutingUrl routingUrl', routingUrl);
        this.sendSetPropertyEvent('routing-url', routingUrl, true);
    }

    static get properties() {
        return {
            ...super.properties,
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
            langDir: {type: String, attribute: 'lang-dir'},
            routingUrl: {type: String, attribute: 'routing-url'},
            routingBaseUrl: {type: String, attribute: 'routing-base-url'},
            isScrollTopButtonVisible: {type: Boolean, attribute: false},
            isScrollBottomButtonVisible: {type: Boolean, attribute: false},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.initRouter();
        if (this.src) {
            this.fetchMetadata(this.src);
        }

        this._boundResizeHandler = () => this.updateMenuIcon();
        window.addEventListener('resize', this._boundResizeHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._boundResizeHandler) {
            window.removeEventListener('resize', this._boundResizeHandler);
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
                        }),
                    );
                    break;
                case 'metadata':
                    {
                        this._updateVisibleRoutes();
                    }
                    break;
                case 'auth':
                    {
                        // kill event if auth gets default
                        if (this.auth === null) {
                            break;
                        }

                        this._roles = this.auth._roles;
                        this._updateVisibleRoutes();

                        const loginStatus = this.auth['login-status'];

                        if (loginStatus !== this._loginStatus) {
                            console.log('Login status: ' + loginStatus);
                        }

                        if (loginStatus !== undefined) {
                            this._loginStatus = loginStatus;
                        }

                        // Clear the session storage when the user logs out
                        if (this._loginStatus === 'logging-out') {
                            sessionStorage.clear();
                        }
                    }
                    break;
                case 'routingUrl':
                    this.handleRoutingUrlChange();
                    break;
            }
        });

        super.update(changedProperties);
    }

    handleRoutingUrlChange() {
        if (!this.activeView || !this.lang || this.lang === '' || this.routingUrl === undefined) {
            return;
        }

        console.log('handleRoutingUrlChange this.routingUrl', this.routingUrl);
        let routingUrl = this.routingUrl.startsWith('/') ? this.routingUrl : `/${this.routingUrl}`;

        // Generate a full routing URL from the routingUrl
        const fullUrl = this.basePath + this.lang + '/' + this.activeView + routingUrl;
        console.log('handleRoutingUrlChange fullUrl', fullUrl);
        this.router.updateFromUrl(fullUrl);
    }

    isMenuFloating() {
        const menu = this.shadowRoot.querySelector('ul.menu');
        if (!menu) return false;
        const computedStyle = window.getComputedStyle(menu);
        return computedStyle.position === 'fixed';
    }

    updateMenuIcon() {
        const menu = this.shadowRoot.querySelector('ul.menu');
        const burger = this.shadowRoot.querySelector('#menu-burger-icon');
        if (!menu || !burger) return;

        const isOpen = menu.classList.contains('is-open');
        if (isOpen) {
            burger.name = this.isMenuFloating() ? 'chevron-up' : 'chevron-left';
        } else {
            burger.name = 'menu';
        }
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
        this.router.updateFromUrl(location);
        this.hideMenu();
    }

    /**
     * Scroll the page to the top of the active view. Used when switching views.
     */
    _scrollToTop() {
        let offset = window.pageYOffset;
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
    }

    switchComponent(componentTag) {
        const changed = componentTag !== this.activeView;
        this.activeView = componentTag;
        if (changed) this.router.update();
        const metadata = this.metadata[componentTag];

        if (metadata === undefined) {
            return;
        }

        if (changed) {
            this._scrollToTop();
        }
        this.updatePageTitle();
        this.updatePageMetaDescription();
        this.subtitle = this.activeMetaDataText('short_name');
        this.description = this.activeMetaDataText('description');

        // If it is empty assume the element is already registered through other means
        if (!metadata.module_src) {
            return;
        }

        importNotify(this._i18n, import(metadata.module_src)).catch((e) => {
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
        let title;
        if (this.activeView === 'welcome') {
            title = `${this.topicMetaDataText('short_name')}`;
        } else {
            title = `${this.activeMetaDataText('short_name')} | ${this.topicMetaDataText('short_name')}`;
        }
        document.title = title;
    }

    updatePageMetaDescription() {
        let metaDesc;
        if (this.activeView === 'welcome') {
            metaDesc = `${this.topicMetaDataText('description')}`;
        } else {
            metaDesc = `${this.activeMetaDataText('description')}`;
        }
        const metaDescElement = document.querySelector('meta[name="description"]');
        if (metaDescElement) {
            metaDescElement.setAttribute('content', metaDesc);
        }
    }

    toggleMenu() {
        const menu = this.shadowRoot.querySelector('ul.menu');
        const menuButton = this.shadowRoot.querySelector('.hd1-left-menu');
        const burger = this.shadowRoot.querySelector('#menu-burger-icon');
        const mainGrid = this.shadowRoot.querySelector('#main');

        if (!menu) return;

        const isOpening = !menu.classList.contains('is-open');
        menu.classList.toggle('is-open', isOpening);

        mainGrid?.classList.toggle('menu-open', isOpening);
        this.updateMenuIcon();
        menuButton?.setAttribute('aria-expanded', String(isOpening));

        // Outside click + initial click guard
        if (this._boundCloseMenuHandler) {
            document.removeEventListener('click', this._boundCloseMenuHandler);
            this._boundCloseMenuHandler = null;
        }
        if (this._boundEscHandler) {
            document.removeEventListener('keydown', this._boundEscHandler);
            this._boundEscHandler = null;
        }

        if (isOpening) {
            this._boundCloseMenuHandler = (evt) => {
                const path = evt.composedPath?.() || [];
                const clickedInside =
                    path.includes(menu) || path.includes(menuButton) || path.includes(burger);
                if (!clickedInside) this.hideMenu();
            };

            setTimeout(() => {
                document.addEventListener('click', this._boundCloseMenuHandler);
            }, 0);

            this._boundEscHandler = (e) => {
                if (e.key === 'Escape') this.hideMenu();
            };
            document.addEventListener('keydown', this._boundEscHandler);
        }
    }

    hideMenu() {
        if (!this.isMenuFloating()) {
            return;
        }
        const menu = this.shadowRoot.querySelector('ul.menu');
        if (!menu?.classList.contains('is-open')) return;
        // Close without re-toggling
        menu.classList.remove('is-open');
        this.shadowRoot.querySelector('#main')?.classList.remove('menu-open');
        this.shadowRoot.querySelector('#menu-burger-icon')?.setAttribute('name', 'menu');
        this.shadowRoot.querySelector('h2.subtitle')?.setAttribute('aria-expanded', 'false');

        if (this._boundCloseMenuHandler) {
            document.removeEventListener('click', this._boundCloseMenuHandler);
            this._boundCloseMenuHandler = null;
        }
        if (this._boundEscHandler) {
            document.removeEventListener('keydown', this._boundEscHandler);
            this._boundEscHandler = null;
        }
    }

    initializeScrollToTopButton() {
        const buttonDisplayOffset = 600;
        const scrollTopBtn = this.shadowRoot.getElementById('scroll-top');
        const scrollBottomBtn = this.shadowRoot.getElementById('scroll-bottom');
        if (!scrollTopBtn || !scrollBottomBtn) return;

        const toggleScrollButton = () => {
            const pageHeight = document.documentElement.scrollHeight;
            let distanceFromTop = window.scrollY;
            let distanceFromBottom = pageHeight - (window.scrollY + window.innerHeight);

            // Only show the scroll top button if we scroll down buttonDisplayOffset px
            if (distanceFromTop < buttonDisplayOffset) {
                this.isScrollTopButtonVisible = false;
            } else {
                this.isScrollTopButtonVisible = true;
            }

            // Only show the scroll bottom button if we start scrolling down or
            // we are at least buttonDisplayOffset px away from the bottom
            if (window.scrollY < 100 || distanceFromBottom < buttonDisplayOffset) {
                this.isScrollBottomButtonVisible = false;
            } else {
                this.isScrollBottomButtonVisible = true;
            }
        };

        // Debounce scroll event for better performance
        let scrollTimeout;
        const debouncedToggleScrollButton = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(toggleScrollButton, 100);
        };

        window.addEventListener('scroll', debouncedToggleScrollButton, {passive: true});

        scrollTopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
        scrollBottomBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
            });
        });
        debouncedToggleScrollButton();
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getLinkCss()}


            h1.title {
                margin-bottom: 0;
                font-weight: bold;
            }

            .title {
                color: var(--dbp-content);
                font-size: 1em;
                line-height: 1.125;
            }

            #main {
                /*display: grid;*/
                grid-template-columns: minmax(0, 1fr);
                grid-template-rows: min-content min-content 1fr min-content;
                grid-template-areas: 'header' 'headline' 'main' 'footer';
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
                grid-template-columns: 50% 0.5em auto;
                grid-template-rows: 60px;
                grid-template-areas: 'hd1-left hd1-middle hd1-right';
                width: 100%;
                margin: 0 auto;
            }

            aside {
                grid-area: sidebar;
                margin: 15px 15px;
                display: contents;
            }

            #headline {
                grid-area: headline;
                margin: 20px 0 20px 0;
                text-align: center;
                padding: 0 5px;
            }

            main {
                grid-area: main;
                margin: 15px 15px;
            }

            footer {
                grid-area: footer;
                margin: 15px;
                text-align: right;
                align-items: end;
            }

            header .hd1-left {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                -webkit-justify-content: space-between;
                grid-area: hd1-left;
                text-align: right;
                padding-right: 20px;
                padding-left: 15px;
                align-items: center;
                -webkit-align-items: center;
                gap: 10px;
            }

            .hd1-left-menu {
                /*display: flex;*/
                gap: 10px;
                justify-self: center;
                align-self: center;
                cursor: pointer;
                padding: 10px 5px;
                margin: -10px -5px;
                color: var(--dbp-content);
                align-items: baseline;
                background: none;
                border: none;
                font: inherit;
            }

            .hd1-left-menu:focus-visible {
                outline: 2px solid var(--dbp-accent);
                outline-offset: 2px;
            }

            .hd1-left-switches {
                display: flex;
                min-width: 60px;
                justify-content: space-between;
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
                width: 0.1em;
            }

            header .hd1-right {
                grid-area: hd1-right;
                display: flex;
                justify-content: space-between;
                -webkit-justify-content: space-between;
                padding: 0 10px 0 10px;
                min-width: 0;
                align-items: center;
                -webkit-align-items: center;
            }

            header .hd1-right .auth-button {
                min-width: 0;
            }

            header .hd1-right .logo {
                height: 100%;
                overflow: hidden;
                flex-grow: 1;
            }

            .default-logo {
                display: flex;
                justify-content: end;
                height: 100%;
            }

            header a {
                color: var(--dbp-content);
                display: inline;
            }

            aside ul.menu,
            footer ul.menu {
                list-style: none;
                max-height: calc(100vh - 30px);
                overflow-y: auto;
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

            aside h2.subtitle {
                grid-area: headline;
                justify-self: center;
                display: inline-block;
                cursor: pointer;
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

            ul.menu {
                display: none;
            }

            ul.menu.is-open {
                display: block;
                list-style-type: none;
            }

            a {
                transition:
                    background-color 0.15s ease 0s,
                    color 0.15s ease 0s;
            }

            .description {
                text-align: left;
                margin-bottom: 1rem;
                display: none;
            }

            #dbp-notification {
                z-index: 99999;
            }

            #main.menu-open {
                grid-template-columns: 240px minmax(0, 1fr);
                grid-template-areas:
                    'header header'
                    'headline headline'
                    'sidebar main'
                    'footer footer';
            }

            #main.menu-open aside {
                display: block;
            }

            #main.menu-open aside h2.subtitle {
                grid-area: auto;
            }

            ul.menu:not(.is-open) {
                visibility: hidden;
            }

            /* scroll to top*/

            .scroll-top-wrapper {
                pointer-events: none;
                display: flex;
                flex-direction: column;
                gap: 2px;
                z-index: 1000;
                position: fixed;
                bottom: 8rem;
                right: max(1.5rem, calc((90vw - 1100px) / 2 + 1.5rem));
                align-items: center;
            }

            .scroll-button {
                padding: 0.5em;
                opacity: 0;
                pointer-events: none;
                color: var(--dbp-background);
                font-size: 1.25em;
                transition:
                    opacity 0.3s ease,
                    color 0.3s ease;
                cursor: pointer;
                background-color: var(--dbp-accent);
                border: none;
            }

            .scroll-button.visible {
                opacity: 1;
                pointer-events: auto;
            }

            @media (max-width: 1100px) {
                .scroll-top-wrapper {
                    right: 1rem;
                }

                header .hd1-right .logo {
                    display: none;
                }

                header .hd1-right {
                    padding-left: 0px;
                }

                header .hd1-left {
                    padding-right: 10px;
                }

                #main,
                #main.menu-open {
                    grid-template-columns: minmax(0, 1fr);
                    grid-template-areas: 'header' 'headline' 'main' 'footer';
                }

                header {
                    z-index: 2000;
                    background-color: var(--dbp-background);
                }

                aside {
                    margin: 0;
                }

                aside ul.menu {
                    display: block;
                    position: fixed;
                    visibility: hidden;
                    width: 25vw;
                    min-width: 250px;
                    left: 0;
                    right: auto;
                    top: 0;
                    max-height: 100dvh;
                    margin: 3.5rem 0 0 0;
                    box-sizing: border-box;
                    transform: translateY(-110%);
                    transition:
                        transform 0.28s ease,
                        box-shadow 0.28s ease,
                        visibility 0s linear 0.28s;
                    overflow-y: auto;
                    padding-block: 0.5rem 1rem;
                    padding-inline: 0;
                    z-index: 1500;
                    background-color: var(--dbp-background);
                    color: var(--dbp-content);
                }

                aside ul.menu.is-open {
                    transform: translateY(0);
                    visibility: visible;
                    box-shadow: 0px 0px 0.4em rgba(0, 0, 0, 0.2);
                    transition-delay: 0s;
                }

                #main.menu-open {
                    overflow: hidden;
                    touch-action: none;
                    pointer-events: auto;
                    height: 100vh;
                    overflow-y: hidden;
                }

                .menu li {
                    padding: 7px 10px;
                }
                .menu a {
                    padding: 8px;
                }
                .menu a:active {
                    opacity: 0.8;
                }
            }
            @media (max-width: 490px) {
                aside ul.menu {
                    width: 100vw;
                    z-index: 1000;
                    margin: 3.5rem 0 0 0;
                }
                header {
                    z-index: 2500;
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

    // TODO: This maybe could also be done with static html together with unsafeStatic, see https://lit.dev/docs/templates/expressions/#non-literal-statics
    // Like in https://github.com/digital-blueprint/cabinet-app/commit/8dde8efab6e65a93026289c7ed6b50c0369a55dd
    _renderActivity() {
        const act = this.metadata[this.activeView];
        if (act === undefined) return html``;

        const elm = this._createActivityElement(act);

        // add subscriptions for the provider component
        if (act.subscribe !== undefined) {
            elm.setAttribute('subscribe', act.subscribe);
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
            // if app is loaded correctly, remove spinner
            this.updateComplete.then(() => {
                const slot = this.shadowRoot.querySelector('slot:not([name])');

                // remove for safari 12 support. safari 13+ supports display: none on slots.
                if (slot) slot.remove();
            });
        }

        const prodClassMap = classMap({
            hidden: this.env === 'production' || this.env === 'staging' || this.env === '',
        });

        this.updatePageTitle();
        this.updatePageMetaDescription();

        // build the menu
        let menuTemplates = [];
        for (let routingName of this.visibleRoutes) {
            let partialState = {
                component: routingName,
            };
            // clear the extra state for everything but the current activity
            if (this.activeView !== routingName) {
                partialState['extra'] = undefined;
            }
            menuTemplates.push(html`
                <li>
                    <a
                        @click="${(e) => this.onMenuItemClick(e)}"
                        href="${this.router.getPathname(partialState)}"
                        data-nav
                        class="${getSelectClasses(routingName)}"
                        title="${this.metaDataText(routingName, 'description')}">
                        ${this.metaDataText(routingName, 'short_name')}
                    </a>
                </li>
            `);
        }
        let style;
        const kc = this.keycloakConfig;
        return html`
            ${style}
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
                ?no-check-login-iframe="${kc.noCheckLoginIframe ?? false}"
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
                                <div class="hd1-left-switches">
                                    <dbp-theme-switcher
                                        subscribe="themes,dark-mode-theme-override"
                                        lang="${this.lang}"></dbp-theme-switcher>
                                    <dbp-language-select
                                        id="lang-select"
                                        lang="${this.lang}"></dbp-language-select>
                                </div>
                            </div>
                            <div class="hd1-middle"></div>
                            <div class="hd1-right">
                                <dbp-auth-menu-button
                                    data-testid="dbp-auth-menu-button"
                                    subscribe="auth"
                                    class="auth-button"
                                    lang="${this.lang}"></dbp-auth-menu-button>
                                <div class="logo">
                                    <slot name="logo">
                                        <dbp-themed>
                                            <div slot="light" class="default-logo">
                                                <svg
                                                    id="Ebene_1"
                                                    data-name="Ebene 1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                                    viewBox="0 0 400 400">
                                                    <defs>
                                                        <style>
                                                            .cls-1 {
                                                                fill: none;
                                                            }

                                                            .cls-2 {
                                                                clip-path: url(#clippath);
                                                            }

                                                            .cls-3 {
                                                                fill: url(#Unbenannter_Verlauf_24-2);
                                                            }

                                                            .cls-4 {
                                                                fill: #002a60;
                                                            }

                                                            .cls-5 {
                                                                fill: #fff;
                                                            }

                                                            .cls-6 {
                                                                clip-path: url(#clippath-1);
                                                            }

                                                            .cls-7 {
                                                                clip-path: url(#clippath-2);
                                                            }

                                                            .cls-8 {
                                                                opacity: 0.23;
                                                            }

                                                            .cls-9 {
                                                                opacity: 0.43;
                                                            }

                                                            .cls-10 {
                                                                fill: url(#Unbenannter_Verlauf_25);
                                                            }

                                                            .cls-11 {
                                                                fill: url(#Unbenannter_Verlauf_23);
                                                            }

                                                            .cls-12 {
                                                                fill: url(#Unbenannter_Verlauf_24);
                                                            }

                                                            .cls-13 {
                                                                fill: url(#Unbenannter_Verlauf_26);
                                                            }

                                                            .cls-14 {
                                                                fill: url(#Unbenannter_Verlauf_29);
                                                            }

                                                            .cls-15 {
                                                                fill: url(#Unbenannter_Verlauf_27);
                                                            }

                                                            .cls-16 {
                                                                fill: url(#Unbenannter_Verlauf_28);
                                                            }

                                                            .cls-17 {
                                                                fill: url(#Unbenannter_Verlauf_22);
                                                            }

                                                            .cls-18 {
                                                                fill: url(#Unbenannter_Verlauf_20);
                                                            }

                                                            .cls-19 {
                                                                fill: url(#Unbenannter_Verlauf_7);
                                                            }

                                                            .cls-20 {
                                                                fill: url(#Unbenannter_Verlauf_21);
                                                                opacity: 0.29;
                                                            }

                                                            .cls-20,
                                                            .cls-21,
                                                            .cls-22,
                                                            .cls-23 {
                                                                isolation: isolate;
                                                            }

                                                            .cls-21 {
                                                                fill: url(#Unbenannter_Verlauf_18);
                                                                opacity: 0.9;
                                                            }

                                                            .cls-22 {
                                                                fill: url(#Unbenannter_Verlauf_17);
                                                                opacity: 0.5;
                                                            }

                                                            .cls-23 {
                                                                fill: url(#Unbenannter_Verlauf_19);
                                                                opacity: 0.61;
                                                            }
                                                        </style>
                                                        <clipPath id="clippath">
                                                            <rect
                                                                class="cls-1"
                                                                x="71.91"
                                                                y="102.74"
                                                                width="197.49"
                                                                height="197.49"
                                                                transform="translate(-92.48 179.68) rotate(-45)" />
                                                        </clipPath>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_24"
                                                            data-name="Unbenannter Verlauf 24"
                                                            x1="113.84"
                                                            y1="-794.55"
                                                            x2="113.84"
                                                            y2="-1126.95"
                                                            gradientTransform="translate(57.31 1166.62)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop offset="0" stop-color="#c2244e" />
                                                            <stop
                                                                offset=".03"
                                                                stop-color="#b42855" />
                                                            <stop
                                                                offset=".15"
                                                                stop-color="#8a346a" />
                                                            <stop
                                                                offset=".25"
                                                                stop-color="#693d7a" />
                                                            <stop
                                                                offset=".36"
                                                                stop-color="#524486" />
                                                            <stop
                                                                offset=".45"
                                                                stop-color="#44488d" />
                                                            <stop
                                                                offset=".54"
                                                                stop-color="#3f498f" />
                                                            <stop
                                                                offset=".88"
                                                                stop-color="#2c8ae1" />
                                                            <stop offset="1" stop-color="#25a1ff" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_29"
                                                            data-name="Unbenannter Verlauf 29"
                                                            x1="-165.83"
                                                            y1="-964.7"
                                                            x2="113.75"
                                                            y2="-964.7"
                                                            gradientTransform="translate(57.31 1166.62)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".22"
                                                                stop-color="#0051b4" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <radialGradient
                                                            id="Unbenannter_Verlauf_28"
                                                            data-name="Unbenannter Verlauf 28"
                                                            cx="9160.09"
                                                            cy="-564.48"
                                                            fx="9160.09"
                                                            fy="-564.48"
                                                            r="68.82"
                                                            gradientTransform="translate(6760.46 19576.59) rotate(-105.23) scale(2.23 2.04) skewX(.89)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".1"
                                                                stop-color="#002a60" />
                                                            <stop
                                                                offset=".32"
                                                                stop-color="#042d65"
                                                                stop-opacity=".76" />
                                                            <stop
                                                                offset=".57"
                                                                stop-color="#113672"
                                                                stop-opacity=".48" />
                                                            <stop
                                                                offset=".83"
                                                                stop-color="#254589"
                                                                stop-opacity=".19" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </radialGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_27"
                                                            data-name="Unbenannter Verlauf 27"
                                                            x1="1979.02"
                                                            y1="-1764.25"
                                                            x2="1979.02"
                                                            y2="-1917.19"
                                                            gradientTransform="translate(-1952.58 2473.57) rotate(-9.17) scale(1.25 1)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop offset="0" stop-color="#c2244e" />
                                                            <stop
                                                                offset=".54"
                                                                stop-color="#703f7c"
                                                                stop-opacity=".61" />
                                                            <stop
                                                                offset=".54"
                                                                stop-color="#6e407d"
                                                                stop-opacity=".6" />
                                                            <stop
                                                                offset=".88"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_26"
                                                            data-name="Unbenannter Verlauf 26"
                                                            x1="1151.48"
                                                            y1="791.85"
                                                            x2="1138.92"
                                                            y2="932.97"
                                                            gradientTransform="translate(-1089.46 -1621.51) rotate(4.97) scale(1.22 2.01)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".05"
                                                                stop-color="#25a1ff" />
                                                            <stop
                                                                offset=".47"
                                                                stop-color="#108fff"
                                                                stop-opacity=".74" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#0037d3"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_25"
                                                            data-name="Unbenannter Verlauf 25"
                                                            x1="118.66"
                                                            y1="-796.84"
                                                            x2="118.66"
                                                            y2="-986.06"
                                                            gradientTransform="translate(57.31 1166.62)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".15"
                                                                stop-color="#c2244e" />
                                                            <stop
                                                                offset=".61"
                                                                stop-color="#703f7c"
                                                                stop-opacity=".61" />
                                                            <stop
                                                                offset=".88"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <clipPath id="clippath-1">
                                                            <rect
                                                                class="cls-1"
                                                                x="102.72"
                                                                y="102.72"
                                                                width="197.51"
                                                                height="197.51"
                                                                transform="translate(-83.46 201.48) rotate(-45)" />
                                                        </clipPath>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_24-2"
                                                            data-name="Unbenannter Verlauf 24"
                                                            x1="144.67"
                                                            y1="1426.07"
                                                            x2="144.67"
                                                            y2="1758.51"
                                                            gradientTransform="translate(57.31 1798.16) scale(1 -1)"
                                                            xlink:href="#Unbenannter_Verlauf_24" />
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_23"
                                                            data-name="Unbenannter Verlauf 23"
                                                            x1="217.53"
                                                            y1="1716.77"
                                                            x2="137.96"
                                                            y2="1521.21"
                                                            gradientTransform="translate(57.31 1798.16) scale(1 -1)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".08"
                                                                stop-color="#25a1ff" />
                                                            <stop
                                                                offset=".23"
                                                                stop-color="#1b81d5" />
                                                            <stop
                                                                offset=".4"
                                                                stop-color="#1162ab" />
                                                            <stop
                                                                offset=".57"
                                                                stop-color="#0a4a8a" />
                                                            <stop
                                                                offset=".72"
                                                                stop-color="#043873" />
                                                            <stop
                                                                offset=".87"
                                                                stop-color="#012e65" />
                                                            <stop offset="1" stop-color="#002a60" />
                                                        </linearGradient>
                                                        <radialGradient
                                                            id="Unbenannter_Verlauf_22"
                                                            data-name="Unbenannter Verlauf 22"
                                                            cx="4353.28"
                                                            cy="-101.73"
                                                            fx="4353.28"
                                                            fy="-101.73"
                                                            r="182.49"
                                                            gradientTransform="translate(-8977.34 -70.94) scale(2.11 -1.56)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset="0"
                                                                stop-color="#002a60"
                                                                stop-opacity="0" />
                                                            <stop
                                                                offset=".1"
                                                                stop-color="#082a5f"
                                                                stop-opacity=".1" />
                                                            <stop
                                                                offset=".27"
                                                                stop-color="#1e295d"
                                                                stop-opacity=".27" />
                                                            <stop
                                                                offset=".47"
                                                                stop-color="#43285a"
                                                                stop-opacity=".47" />
                                                            <stop
                                                                offset=".7"
                                                                stop-color="#752655"
                                                                stop-opacity=".7" />
                                                            <stop
                                                                offset=".95"
                                                                stop-color="#b5244f"
                                                                stop-opacity=".95" />
                                                            <stop offset="1" stop-color="#c2244e" />
                                                        </radialGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_21"
                                                            data-name="Unbenannter Verlauf 21"
                                                            x1="2393.8"
                                                            y1="-9473.74"
                                                            x2="2747.55"
                                                            y2="-9473.74"
                                                            gradientTransform="translate(9117.66 -3987.06) rotate(80.2) scale(1 -1)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset="0"
                                                                stop-color="#002a60"
                                                                stop-opacity="0" />
                                                            <stop
                                                                offset=".1"
                                                                stop-color="#082a5f"
                                                                stop-opacity=".1" />
                                                            <stop
                                                                offset=".27"
                                                                stop-color="#1e295d"
                                                                stop-opacity=".27" />
                                                            <stop
                                                                offset=".47"
                                                                stop-color="#43285a"
                                                                stop-opacity=".47" />
                                                            <stop
                                                                offset=".7"
                                                                stop-color="#752655"
                                                                stop-opacity=".7" />
                                                            <stop
                                                                offset=".89"
                                                                stop-color="#b5244f"
                                                                stop-opacity=".95" />
                                                            <stop offset="1" stop-color="#c2244e" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_20"
                                                            data-name="Unbenannter Verlauf 20"
                                                            x1="1466.29"
                                                            y1="-43.44"
                                                            x2="1453.98"
                                                            y2="-141.33"
                                                            gradientTransform="translate(-1539.01 -194.46) rotate(4.97) scale(1.22 -2.01)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".18"
                                                                stop-color="#25a1ff" />
                                                            <stop
                                                                offset=".46"
                                                                stop-color="#1a7cd5"
                                                                stop-opacity=".74" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_19"
                                                            data-name="Unbenannter Verlauf 19"
                                                            x1="4295.4"
                                                            y1="1392.88"
                                                            x2="4304.34"
                                                            y2="1306.2"
                                                            gradientTransform="translate(1543.83 5899.22) rotate(-76.71) scale(1.22 -2.01)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".05"
                                                                stop-color="#25a1ff" />
                                                            <stop
                                                                offset=".28"
                                                                stop-color="#1a7cd5"
                                                                stop-opacity=".74" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#37529c"
                                                                stop-opacity="0" />
                                                        </linearGradient>
                                                        <clipPath id="clippath-2">
                                                            <rect
                                                                id="rect62862-7"
                                                                class="cls-1"
                                                                x="133.56"
                                                                y="102.74"
                                                                width="197.49"
                                                                height="197.49"
                                                                transform="translate(-74.43 223.27) rotate(-45)" />
                                                        </clipPath>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_18"
                                                            data-name="Unbenannter Verlauf 18"
                                                            x1="-1269.43"
                                                            y1="584.37"
                                                            x2="-1071.94"
                                                            y2="584.37"
                                                            gradientTransform="translate(1402.98 785.85) scale(1 -1)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop offset="0" stop-color="#073d84" />
                                                            <stop
                                                                offset=".84"
                                                                stop-color="#003c8b"
                                                                stop-opacity=".64" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#004eb5"
                                                                stop-opacity=".6" />
                                                        </linearGradient>
                                                        <radialGradient
                                                            id="Unbenannter_Verlauf_17"
                                                            data-name="Unbenannter Verlauf 17"
                                                            cx="322.24"
                                                            cy="482.42"
                                                            fx="322.24"
                                                            fy="482.42"
                                                            r="98.74"
                                                            gradientTransform="translate(275.77 2247.32) rotate(-4.61) scale(.69 -4.38)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset="0"
                                                                stop-color="#2295ff"
                                                                stop-opacity=".65" />
                                                            <stop
                                                                offset="1"
                                                                stop-color="#2295ff"
                                                                stop-opacity="0" />
                                                        </radialGradient>
                                                        <radialGradient
                                                            id="Unbenannter_Verlauf_7"
                                                            data-name="Unbenannter Verlauf 7"
                                                            cx="774.18"
                                                            cy="435.49"
                                                            fx="774.18"
                                                            fy="435.49"
                                                            r="98.74"
                                                            gradientTransform="translate(-7732.23 487.42) rotate(16.19) scale(9.86 -6.01)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset="0"
                                                                stop-color="#b34d4d"
                                                                stop-opacity="0" />
                                                            <stop offset="1" stop-color="red" />
                                                        </radialGradient>
                                                    </defs>
                                                    <rect
                                                        id="white_background_1"
                                                        data-name="white background 1"
                                                        class="cls-5"
                                                        x="71.91"
                                                        y="102.74"
                                                        width="197.49"
                                                        height="197.49"
                                                        transform="translate(-92.48 179.68) rotate(-45)" />
                                                    <rect
                                                        id="white_background_2"
                                                        data-name="white background 2"
                                                        class="cls-5"
                                                        x="102.72"
                                                        y="102.72"
                                                        width="197.51"
                                                        height="197.51"
                                                        transform="translate(-83.46 201.48) rotate(-45)" />
                                                    <rect
                                                        id="white_background_3"
                                                        data-name="white background 3"
                                                        class="cls-5"
                                                        x="133.56"
                                                        y="102.74"
                                                        width="197.49"
                                                        height="197.49"
                                                        transform="translate(-74.43 223.27) rotate(-45)" />
                                                    <g class="cls-8">
                                                        <g class="cls-2">
                                                            <rect
                                                                id="rect35896-3-4-6-6-2"
                                                                class="cls-4"
                                                                x="31.36"
                                                                y="16.45"
                                                                width="279.59"
                                                                height="355.63" />
                                                            <rect
                                                                id="rect35917-90-7-5-4-2"
                                                                class="cls-12"
                                                                x="31.36"
                                                                y="39.67"
                                                                width="279.59"
                                                                height="332.41" />
                                                            <rect
                                                                id="rect35924-9-9-9-42-2"
                                                                class="cls-14"
                                                                x="-108.52"
                                                                y="62.13"
                                                                width="279.59"
                                                                height="279.59" />
                                                            <polygon
                                                                id="polygon35937-3-9-0-7-2"
                                                                class="cls-16"
                                                                points="199.72 410.27 119.89 111.41 397.36 37.26 477.25 336.06 199.72 410.27" />
                                                            <polygon
                                                                id="polygon35948-65-4-8-5-2"
                                                                class="cls-15"
                                                                points="11.85 214.45 356.22 158.86 380.63 309.84 36.25 365.42 11.85 214.45" />
                                                            <polygon
                                                                id="polygon35957-1-3-2-4-2"
                                                                class="cls-13"
                                                                points="-1.06 12.44 339.71 51.32 321.26 329.76 -19.51 290.79 -1.06 12.44" />
                                                            <rect
                                                                id="rect35968-1-9-3-10-2"
                                                                class="cls-10"
                                                                x="-7.66"
                                                                y="180.56"
                                                                width="367.25"
                                                                height="189.22" />
                                                        </g>
                                                    </g>
                                                    <g class="cls-9">
                                                        <g class="cls-6">
                                                            <rect
                                                                id="rect35803-7-5-9-32-2"
                                                                class="cls-4"
                                                                x="62.17"
                                                                y="16.42"
                                                                width="279.62"
                                                                height="355.67" />
                                                            <rect
                                                                id="rect35824-0-2-8-75-2"
                                                                class="cls-3"
                                                                x="62.17"
                                                                y="39.65"
                                                                width="279.62"
                                                                height="332.44" />
                                                            <rect
                                                                id="rect35826-6-7-8-5-2"
                                                                class="cls-4"
                                                                x="-24.02"
                                                                y="16.66"
                                                                width="365.51"
                                                                height="365.51" />
                                                            <rect
                                                                id="rect35843-7-8-8-7-2"
                                                                class="cls-11"
                                                                x="8.99"
                                                                y="-10.46"
                                                                width="460.61"
                                                                height="358.44" />
                                                            <path
                                                                id="path35860-8-7-6-4-2"
                                                                class="cls-17"
                                                                d="M592.99,445.31H-189.74V-260.66H592.99V445.31Z" />
                                                            <polygon
                                                                id="polygon35877-4-4-8-9-2"
                                                                class="cls-20"
                                                                points="370.32 -46.84 430.51 301.7 69.12 364.13 8.93 15.54 370.32 -46.84" />
                                                            <polygon
                                                                id="polygon35886-19-00-4-03-3"
                                                                class="cls-18"
                                                                points="57.04 4.45 397.85 34.11 371.79 347.98 32.69 246.22 57.04 4.45" />
                                                            <polygon
                                                                id="polygon35886-19-00-4-03-4"
                                                                class="cls-23"
                                                                points="-43.83 280.89 19.72 11.82 233.28 54.62 169.67 323.62 -43.83 280.89" />
                                                        </g>
                                                    </g>
                                                    <g class="cls-7">
                                                        <rect
                                                            id="rect62862-8"
                                                            class="cls-21"
                                                            x="133.56"
                                                            y="102.74"
                                                            width="197.49"
                                                            height="197.49"
                                                            transform="translate(-74.43 223.27) rotate(-45)" />
                                                        <rect
                                                            id="rect62862"
                                                            class="cls-22"
                                                            x="133.56"
                                                            y="102.74"
                                                            width="197.49"
                                                            height="197.49"
                                                            transform="translate(-74.43 223.27) rotate(-45)" />
                                                        <rect
                                                            id="rect62862-7-2"
                                                            data-name="rect62862-7"
                                                            class="cls-19"
                                                            x="133.56"
                                                            y="102.74"
                                                            width="197.49"
                                                            height="197.49"
                                                            transform="translate(-74.43 223.27) rotate(-45)" />
                                                    </g>
                                                </svg>
                                            </div>

                                            <div slot="dark" class="default-logo">
                                                <svg
                                                    id="Ebene_2"
                                                    data-name="Ebene 2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                                    viewBox="0 0 402.96 402.96">
                                                    <defs>
                                                        <style>
                                                            .cls-1 {
                                                                fill: url(#Unbenannter_Verlauf_10);
                                                                opacity: 0.3;
                                                            }

                                                            .cls-2 {
                                                                fill: url(#Unbenannter_Verlauf_10-2);
                                                                opacity: 0.5;
                                                            }

                                                            .cls-3 {
                                                                fill: url(#Unbenannter_Verlauf_10-3);
                                                                opacity: 0.85;
                                                            }
                                                        </style>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_10"
                                                            data-name="Unbenannter Verlauf 10"
                                                            x1="170.82"
                                                            y1="-1500.86"
                                                            x2="170.82"
                                                            y2="-1780.18"
                                                            gradientTransform="translate(-1109.99 1240.71) rotate(45)"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop
                                                                offset=".01"
                                                                stop-color="#bfbfbf" />
                                                            <stop offset=".7" stop-color="#fff" />
                                                        </linearGradient>
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_10-2"
                                                            data-name="Unbenannter Verlauf 10"
                                                            x1="201.48"
                                                            y1="-1500.86"
                                                            x2="201.48"
                                                            y2="-1780.18"
                                                            gradientTransform="translate(-1101.02 1219.03) rotate(45)"
                                                            xlink:href="#Unbenannter_Verlauf_10" />
                                                        <linearGradient
                                                            id="Unbenannter_Verlauf_10-3"
                                                            data-name="Unbenannter Verlauf 10"
                                                            x1="232.13"
                                                            y1="-1500.86"
                                                            x2="232.13"
                                                            y2="-1780.18"
                                                            gradientTransform="translate(-1092.04 1197.36) rotate(45)"
                                                            xlink:href="#Unbenannter_Verlauf_10" />
                                                    </defs>
                                                    <rect
                                                        class="cls-1"
                                                        x="72.06"
                                                        y="102.72"
                                                        width="197.51"
                                                        height="197.51"
                                                        transform="translate(-92.44 179.8) rotate(-45)" />
                                                    <rect
                                                        class="cls-2"
                                                        x="102.72"
                                                        y="102.72"
                                                        width="197.51"
                                                        height="197.51"
                                                        transform="translate(-83.46 201.48) rotate(-45)" />
                                                    <rect
                                                        class="cls-3"
                                                        x="133.38"
                                                        y="102.72"
                                                        width="197.51"
                                                        height="197.51"
                                                        transform="translate(-74.48 223.16) rotate(-45)" />
                                                </svg>
                                            </div>
                                        </dbp-themed>
                                    </slot>
                                </div>
                            </div>
                        </slot>
                    </header>

                    <div id="headline">
                        <p class="title">
                            <slot name="title">
                                ${this.activeView === 'welcome'
                                    ? html`
                                          &#160;
                                      `
                                    : this.topicMetaDataText('name')}
                            </slot>
                        </p>
                        <h1 title="${this.description}">
                            ${this.activeView === 'welcome'
                                ? this.topicMetaDataText('name')
                                : this.subtitle}
                        </h1>
                        <button
                            class="hd1-left-menu"
                            @click="${this.toggleMenu}"
                            aria-expanded="false"
                            aria-label="${this._i18n.t('main-page.menu')}">
                            <dbp-icon
                                class="burger-menu-icon"
                                name="menu"
                                id="menu-burger-icon"></dbp-icon>
                            <span class="menu-label">${this._i18n.t('main-page.menu')}</span>
                        </button>
                        <ul class="menu hidden">
                            ${menuTemplates}
                        </ul>
                    </div>
                    <!--<aside id="mobileMenu">
                        <ul class="menu hidden">
                            ${menuTemplates}
                        </ul>
                    </aside>-->

                    <main>
                        <div
                            style="display: ${!this.metadata[this.activeView] ? 'block' : 'none'};">
                            <h2>${i18n.t('page-not-found')}</h2>
                            <p>${i18n.t('choose-from-menu')}</p>
                        </div>
                        <p class="description">${this.description}</p>

                        ${this._renderActivity()}

                        <div class="scroll-top-wrapper">
                            <button
                                id="scroll-top"
                                class="scroll-button button is-secondary ${classMap({
                                    visible: this.isScrollTopButtonVisible,
                                })}"
                                title="${i18n.t('buttons.scroll-to-top-button-label')}"
                                aria-label="${i18n.t('buttons.scroll-to-top-button-label')}">
                                <dbp-icon name="chevron-up" aria-hidden="true"></dbp-icon>
                            </button>
                            <button
                                id="scroll-bottom"
                                class="scroll-button button is-secondary ${classMap({
                                    visible: this.isScrollBottomButtonVisible,
                                })}"
                                title="${i18n.t('buttons.scroll-to-bottom-button-label')}"
                                aria-label="${i18n.t('buttons.scroll-to-bottom-button-label')}">
                                <dbp-icon name="chevron-down" aria-hidden="true"></dbp-icon>
                            </button>
                        </div>
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
                            <dbp-feature-flag-dropdown
                                class="${prodClassMap}"></dbp-feature-flag-dropdown>
                        </slot>
                    </footer>
                </div>
            </div>
        `;
    }
}
