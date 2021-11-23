import {createInstance} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
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
            lang: { type: String },
        };
    }

    static set app(app) {
        this._app = app;
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
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

            p { line-height: 1.8em }
            .item { padding-top: 0.5em;}
            .description {
                padding-left: 2em;
                font-style: italic;
                margin-top: -1px;
                line-height: initial;
            }

            h2 a:hover {
                color: #E4154B;
            }
            
            h2 a {
                cursor: pointer;
                text-decoration: none;
            }

            h2 a::after {
                content: "\\00a0\\00a0\\00a0";
                background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%228.6836mm%22%20width%3D%225.2043mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2018.440707%2030.768605%22%3E%3Cg%20transform%3D%22translate(-382.21%20-336.98)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-miterlimit%3A10%3Bstroke-width%3A2%3Bfill%3Anone%22%20d%3D%22m383.22%20366.74%2016.43-14.38-16.43-14.37%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
                background-size: 60%;
                background-repeat: no-repeat;
                background-position: center center;
                margin: 0 0 0 6px;
                padding: 0 0 -0.75% 0px;
                animation: 0.15s linkIconOut;
                font-size: 100%;
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

            if (routeName !== "welcome") {
                itemTemplates.push(html`
                    <div class="item">
                        <h2><a href="#" @click=${(e) => {switchActivity(e, data);}}>${data.name[this.lang]}</a></h2>
                        <p class="description">${data.description[this.lang]}</p>
                    </div>`);
            }
        }

        return html`
            <p>${i18n.t('welcome.headline', {appname: app.topic.name[this.lang]})}
            ${app.topic.description[this.lang] }</p>
            <br>
            ${itemTemplates}
        `;
    }
}

export const appWelcomeMeta = {
    "element": "dbp-app-shell-welcome",
    "module_src": "",
    "routing_name": "welcome",
    "name": {
      "de": "Willkommen",
      "en": "Welcome"
    },
    "short_name": {
      "de": "Willkommen",
      "en": "Welcome"
    },
    "description": {
      "de": "Willkommen",
      "en": "Welcome"
    },
    visible: true,
    required_roles: [],
};

commonUtils.defineCustomElement('dbp-app-shell-welcome', AppShellWelcome);
