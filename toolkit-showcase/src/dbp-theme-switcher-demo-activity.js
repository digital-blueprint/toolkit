import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {ThemeSwitcherDemo} from '@dbp-toolkit/theme-switcher/src/demo';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import readme from '@dbp-toolkit/theme-switcher/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/provider/src/adapter-lit-element';

export class DbpThemeSwitcherDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
    }

    static get scopedElements() {
        return {
            'dbp-theme-switcher-demo': ThemeSwitcherDemo,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {});
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }

                #demo {
                    display: block;
                    padding-top: 50px;
                }
            `,
        ];
    }

    render() {
        return html`
            ${unsafeHTML(readme)}
            <dbp-theme-switcher-demo id="demo" lang="${this.lang}"></dbp-theme-switcher-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-theme-switcher-demo-activity', DbpThemeSwitcherDemoActivity);
