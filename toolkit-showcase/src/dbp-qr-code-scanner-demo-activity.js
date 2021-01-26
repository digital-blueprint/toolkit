import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {QrCodeScannerDemo} from '@dbp-toolkit/qr-code-scanner/src/dbp-qr-code-scanner-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from '@dbp-toolkit/qr-code-scanner/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';
import * as demoStyles from './styles';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

class DbpQrCodeScannerDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-qr-code-scanner-demo': QrCodeScannerDemo,
        };
    }

    static get properties() {
        return this.getProperties({
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(()=>{
        });
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
            
            #scanner-demo{
                display: block;
                padding-top: 50px;
            }
            `
        ];
    }

    render() {
        return html`
            ${unsafeHTML(readme)}
            <dbp-qr-code-scanner-demo id="scanner-demo" lang="${this.lang}" entry-point-url="${this.entryPointUrl}"></dbp-qr-code-scanner-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo-activity', DbpQrCodeScannerDemoActivity);
