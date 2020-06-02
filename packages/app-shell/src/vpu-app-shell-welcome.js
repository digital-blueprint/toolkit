import {createI18nInstance} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';

const i18n = createI18nInstance();

class AppShellWelcome extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
        this.lang = i18n.language;
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
                i18n.changeLanguage(this.lang);
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
            .item {padding-top: 0.5em;}
            .description {padding-left: 2em;}

            h2 a:hover {
                color: #E4154B;
            }
        `;
    }

    render() {
        const app = AppShellWelcome._app;
        let metadata = app.metadata;
        let itemTemplates = [];

        const switchActivity = (e, data) => {
            e.preventDefault();
            app.switchComponent(data.routing_name);
        };

        for (let [key, data] of Object.entries(metadata)) {

            if (data['visible'] && (key !== "welcome")) {
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
    "element": "vpu-app-shell-welcome",
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
      "de": "",
      "en": ""
    },
    visible: true
};

commonUtils.defineCustomElement('vpu-app-shell-welcome', AppShellWelcome);
