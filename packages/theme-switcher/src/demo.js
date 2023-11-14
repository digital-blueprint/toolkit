import {createInstance, setOverridesByGlobalCache} from './i18n';
import {html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {ThemeSwitcher} from './theme-switcher';
import {Themed} from './themed';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class ThemeSwitcherDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-theme-switcher': ThemeSwitcher,
            'dbp-themed': Themed,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
            langDir: {type: String, attribute: "lang-dir"},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.langDir) {
          setOverridesByGlobalCache(this._i18n, this);
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    render() {
        const i18n = this._i18n;

        return html`
            <style>
                .light-theme{
                    --dbp-override-background: white;
                    --dbp-override-content: black;

                    --dbp-override-primary: #2a4491;
                    --dbp-override-secondary: black;
                    --dbp-override-secondary-surface: white;
                    --dbp-override-on-secondary-surface: black;
                    --dbp-override-secondary-surface-border-color: black;

                    --dbp-override-muted: #767676;
                    --dbp-override-accent: #c24f68;
                    --dbp-override-info: #2a4491;
                    --dbp-override-success: #188018;
                    --dbp-override-warning: #c15500;
                    --dbp-override-warning-surface: #ffad4d;
                    --dbp-override-on-warning-surface: black;
                    --dbp-override-danger: #de3535;

                    --dbp-override-border: 1px solid black;

                    --dbp-override-hover-background-color: black;
                    --dbp-override-hover-color: white;
                }

                .dark-theme{
                    --dbp-override-background: #151515;
                    --dbp-override-content: white;

                    --dbp-override-primary: #8ca4eb;
                    --dbp-override-secondary: white;
                    --dbp-override-secondary-surface: #151515;
                    --dbp-override-on-secondary-surface: white;
                    --dbp-override-secondary-surface-border-color: #151515;

                    --dbp-override-muted: #666666;
                    --dbp-override-accent: #c24f68;
                    --dbp-override-info: #8ca4eb;
                    --dbp-override-success: #7acc79;
                    --dbp-override-warning: #f99a41;
                    --dbp-override-on-warning-surface: black;
                    --dbp-override-danger: #de3535;

                    --dbp-override-border: 1px solid white;

                    --dbp-override-hover-background-color: white;
                    --dbp-override-hover-color: #151515;
                }
            </style>

            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <p>${i18n.t('intro')}</p>
                </div>
                <div class="content">
                    <dbp-theme-switcher subscribe="lang, lang-dir"
                        themes='[{"class": "light-theme", "icon": "sun", "name": "Light Mode"}, {"class": "dark-theme", "icon": "night", "name": "Dark Mode"}]'></dbp-theme-switcher>
                </div>

                This is a <b><dbp-themed><span slot="light">light</span><span slot="dark">dark</span></dbp-themed></b> theme.
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-theme-switcher-demo', ThemeSwitcherDemo);
