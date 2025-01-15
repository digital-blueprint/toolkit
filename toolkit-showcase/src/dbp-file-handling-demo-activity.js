import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {FileSourceDemo} from '@dbp-toolkit/file-handling/src/demo';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import readme from '@dbp-toolkit/file-handling/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

export class DbpFileHandlingDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-file-source-demo': FileSourceDemo,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
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
            <dbp-file-source-demo
                id="demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"></dbp-file-source-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-file-handling-demo-activity', DbpFileHandlingDemoActivity);
