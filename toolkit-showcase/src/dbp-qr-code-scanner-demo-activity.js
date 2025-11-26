import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {QrCodeScannerDemo} from '@dbp-toolkit/qr-code-scanner/src/dbp-qr-code-scanner-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/qr-code-scanner/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpQrCodeScannerDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-qr-code-scanner-demo': QrCodeScannerDemo,
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
                #scanner-demo {
                    display: block;
                    padding-top: 50px;
                }
            `,
        ];
    }

    render() {
        return html`
            <dbp-markdown .markdown=${readme}></dbp-markdown>
            <dbp-qr-code-scanner-demo
                id="scanner-demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"></dbp-qr-code-scanner-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo-activity', DbpQrCodeScannerDemoActivity);
