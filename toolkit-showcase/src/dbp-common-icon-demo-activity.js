import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpIconDemo} from '@dbp-toolkit/common/src/demo/icon-demo.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/common/README.icon.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpCommonIconDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-icon-demo': DbpIconDemo,
            'dbp-markdown': MarkdownElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
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
            <dbp-icon-demo></dbp-icon-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-icon-demo-activity', DbpCommonIconDemoActivity);
