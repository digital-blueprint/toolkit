import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpButtonDemo} from '@dbp-toolkit/common/src/demo/button-demo.js';
import {DbpSelectDemo} from '@dbp-toolkit/common/src/demo/dbp-select-demo.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/common/README.input.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpCommonInputDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-button-demo': DbpButtonDemo,
            'dbp-select-demo': DbpSelectDemo,
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
            ${demoStyles.renderMarkdown(readme)}
            <dbp-button-demo></dbp-button-demo>
            <dbp-select-demo></dbp-select-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-input-demo-activity', DbpCommonInputDemoActivity);
