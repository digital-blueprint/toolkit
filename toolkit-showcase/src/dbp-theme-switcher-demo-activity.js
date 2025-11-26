import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {ThemeSwitcherDemo} from '@dbp-toolkit/theme-switcher/src/demo';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as commonUtils from '@dbp-toolkit/common/utils';
import readme from '@dbp-toolkit/theme-switcher/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

export class DbpThemeSwitcherDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-theme-switcher-demo': ThemeSwitcherDemo,
            'dbp-markdown': MarkdownElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
        };
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
            <dbp-markdown .markdown=${readme}></dbp-markdown>
            <dbp-theme-switcher-demo
                id="demo"
                lang="${this.lang}"
                lang-dir="${this.langDir}"></dbp-theme-switcher-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-theme-switcher-demo-activity', DbpThemeSwitcherDemoActivity);
