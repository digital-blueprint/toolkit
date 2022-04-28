import {createInstance} from './i18n.js';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

class AppShellWelcome extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;

        this._onVisibilityChanged = this._onVisibilityChanged.bind(this);
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    static set app(app) {
        this._app = app;
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}

            p {
                line-height: 1.8em;
            }
            .item {
                padding-top: 0.5em;
            }
            .description {
                padding-left: 2em;
                font-style: italic;
                margin-top: -1px;
                line-height: initial;
            }

            h2 a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
            }

            h2 a {
                cursor: pointer;
                text-decoration: none;
            }

            h2 a {
                white-space: nowrap;
            }
            h2 a > span {
                white-space: normal;
                padding-right: 5px;
            }

            h2 a::after {
                content: '\\00a0\\00a0';
                background-color: var(--dbp-content);
                -webkit-mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2014.8%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2014.8%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M383%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C383.4%2C380.4%2C383.2%2C380.5%2C383%2C380.5z%22%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
                mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2014.8%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2014.8%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M383%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C383.4%2C380.4%2C383.2%2C380.5%2C383%2C380.5z%22%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-position: center center;
                mask-position: center center;
                margin: 0 2px 0 0px;
                padding: 0 0 0.25% 0;
                -webkit-mask-size: 100%;
                mask-size: 100%;
            }

            h2 a:hover::after {
                background-color: var(--dbp-hover-color, var(--dbp-content));
            }
        `;
    }
    _onVisibilityChanged() {
        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback();

        const app = AppShellWelcome._app;
        app.addEventListener('visibility-changed', this._onVisibilityChanged);
    }

    disconnectedCallback() {
        const app = AppShellWelcome._app;
        app.removeEventListener('visibility-changed', this._onVisibilityChanged);

        super.disconnectedCallback();
    }

    render() {
        const i18n = this._i18n;
        const app = AppShellWelcome._app;
        let itemTemplates = [];

        const switchActivity = (e, data) => {
            e.preventDefault();
            app.switchComponent(data.routing_name);
        };

        for (let routeName of app.visibleRoutes) {
            let data = app.metadata[routeName];

            if (routeName !== 'welcome') {
                itemTemplates.push(html`
                    <div class="item">
                        <h2>
                            <a
                                href="#"
                                @click=${(e) => {
                                    switchActivity(e, data);
                                }}>
                                <span>${data.name[this.lang]}</span>
                            </a>
                        </h2>
                        <p class="description">${data.description[this.lang]}</p>
                    </div>
                `);
            }
        }

        return html`
            <p>
                ${i18n.t('welcome.headline', {appname: app.topic.name[this.lang]})}
                ${app.topic.description[this.lang]}
            </p>
            <br />
            ${itemTemplates}
        `;
    }
}

export const appWelcomeMeta = {
    element: 'dbp-app-shell-welcome',
    module_src: '',
    routing_name: 'welcome',
    name: {
        de: 'Willkommen',
        en: 'Welcome',
    },
    short_name: {
        de: 'Willkommen',
        en: 'Welcome',
    },
    description: {
        de: 'Willkommen',
        en: 'Welcome',
    },
    visible: true,
    required_roles: [],
};

commonUtils.defineCustomElement('dbp-app-shell-welcome', AppShellWelcome);
