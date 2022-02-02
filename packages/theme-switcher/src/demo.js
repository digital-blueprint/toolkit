import {createInstance} from './i18n';
import {html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {ThemeSwitcher} from './theme-switcher';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class ThemeSwitcherDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
    }

    static get scopedElements() {
        return {
            'dbp-theme-switcher': ThemeSwitcher,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    connectedCallback() {
        super.connectedCallback();
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
                .light-theme {
                    /* You must not fill out all vars, if they are not filled in, it would take an appropriate default value */
                    --dbp-override-base: white;
                    --dbp-override-base-inverted: black;
                    --dbp-override-text: black;
                    --dbp-override-text-inverted: white;
                    --dbp-override-text-muted: #767676;
                    --dbp-override-accent: #c24f68;
                    --dbp-override-primary-base: #2a4491;
                    --dbp-override-primary-text: white;
                    --dbp-override-primary-border: 1px solid #2a4491;
                    --dbp-override-secondary-base: white;
                    --dbp-override-secondary-text: black;
                    --dbp-override-secondary-border: 1px solid black;
                    --dbp-override-info: #2a4491;
                    --dbp-override-success: #188018;
                    --dbp-override-warning-as-text: #c15500;
                    --dbp-override-warning: #f99a41;
                    --dbp-override-danger: #de3535;
                    --dbp-override-border: 1px solid black;
                    --dbp-override-border-radius: 0px;

                    /* Remove hover vars if you don't want a hover effect */

                    --dbp-override-hover-base: black;
                    --dbp-override-hover-text: white;
                }

                .dark-theme {
                    /* If you don't want to use an additional theme, then delete the "themes" attribute */
                    /* You have to fill out all vars, if you want to use the dark theme, the default values would be the light theme. */

                    --dbp-override-base: #151515;
                    --dbp-override-base-inverted: white;
                    --dbp-override-text: white;
                    --dbp-override-text-inverted: #151515;
                    --dbp-override-text-muted: #666666;
                    --dbp-override-accent: #c24f68;
                    --dbp-override-primary-base: #8ca4eb;
                    --dbp-override-primary-text: #151515;
                    --dbp-override-primary-border: 1px solid #8ca4eb;
                    --dbp-override-secondary-base: #151515;
                    --dbp-override-secondary-text: white;
                    --dbp-override-secondary-border: 1px solid white;
                    --dbp-override-info: #8ca4eb;
                    --dbp-override-success: #7acc79;
                    --dbp-override-warning-as-text: #f99a41;
                    --dbp-override-warning: #f99a41;
                    --dbp-override-danger: #de3535;
                    --dbp-override-border: 1px solid white;
                    --dbp-override-border-radius: 0px;

                    /* Remove hover vars if you don't want a hover effect */

                    --dbp-override-hover-base: white;
                    --dbp-override-hover-text: #151515;
                }
            </style>

            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <p>${i18n.t('intro')}</p>
                </div>
                <div class="content">
                    <dbp-theme-switcher
                        themes='[{"class": "light-theme", "icon": "sun", "name": "Light Mode"}, {"class": "dark-theme", "icon": "night", "name": "Dark Mode"}]'></dbp-theme-switcher>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-theme-switcher-demo', ThemeSwitcherDemo);
