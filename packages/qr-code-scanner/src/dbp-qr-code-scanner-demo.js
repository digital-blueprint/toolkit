import {i18n} from './i18n';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from "dbp-common/styles";
import {QrCodeScanner} from './qr-code-scanner.js';

class QrCodeScannerDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get scopedElements() {
        return {
            'dbp-qr-code-scanner': QrCodeScanner,
        };
      }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
    }

    static get styles() {
        // language=css
        return css`        
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        return html`
             <section class="section">
                <div class="container">
                    <h1 class="title">QR-Code-Scanner-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-centered">
                        <div class="column">
                            <dbp-qr-code-scanner clip-mask lang="${this.lang}"></dbp-qr-code-scanner>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo', QrCodeScannerDemo);
