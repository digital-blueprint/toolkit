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

            h2 { margin: inherit; }
            p { margin: 0 0 10px 0; }
            div.item { margin: 30px 0; }
        `;
    }

    render() {
        const app = AppShellWelcome._app;
        let metadata = app.metadata;
        let itemTemplates = [];

        for (let [key, data] of Object.entries(metadata)) {

            if (data['visible'] && (key !== "welcome")) {
                itemTemplates.push(html`
                    <div class="item">
                        <h2>${data.name[this.lang]}</h2>
                        ${data.description[this.lang]}
                    </div>`);
            }
        }

        return html`
            <p>${i18n.t('welcome.headline', {appname: app.topic.name[this.lang]})}</p>
            <p>${app.topic.description[this.lang]}</p>
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
