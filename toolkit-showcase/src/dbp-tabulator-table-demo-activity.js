import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {TabulatorTableDemo} from '@dbp-toolkit/tabulator-table/src/demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/tabulator-table/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpTabulatorTableDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-tabulator-table-demo': TabulatorTableDemo,
            'dbp-markdown': MarkdownElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
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
            <dbp-tabulator-table-demo
                id="demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"
                no-auth></dbp-tabulator-table-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tabulator-table-demo-activity', DbpTabulatorTableDemoActivity);
