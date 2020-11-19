import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {QrCodeScannerDemo} from '@dbp-toolkit/qr-code-scanner/src/dbp-qr-code-scanner-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from '@dbp-toolkit/qr-code-scanner/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';
import * as demoStyles from './styles';

class DbpQrCodeScannerDemoActivity extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
            'dbp-qr-code-scanner-demo': QrCodeScannerDemo,
        };
    }

    static get properties() {
        return {
        };
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
            <dbp-qr-code-scanner-demo id="scanner-demo" lang="en"></dbp-qr-code-scanner-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo-activity', DbpQrCodeScannerDemoActivity);
