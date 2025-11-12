import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpMiscDemo} from '@dbp-toolkit/common/src/demo/misc-demo.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/common/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpCommonMiscDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-misc-demo': DbpMiscDemo,
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
            <dbp-misc-demo
                id="demo"
                lang="${this.lang}"
                lang-dir="${this.langDir}"
                entry-point-url="${this.entryPointUrl}"></dbp-misc-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-misc-demo-activity', DbpCommonMiscDemoActivity);
