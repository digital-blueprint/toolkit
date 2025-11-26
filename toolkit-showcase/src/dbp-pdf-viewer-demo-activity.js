import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {PdfViewerDemo} from '@dbp-toolkit/pdf-viewer/src/dbp-pdf-viewer-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/pdf-viewer/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpPdfViewerDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-pdf-viewer-demo': PdfViewerDemo,
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
            <dbp-pdf-viewer-demo id="demo" lang="${this.lang}"></dbp-pdf-viewer-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-pdf-viewer-demo-activity', DbpPdfViewerDemoActivity);
