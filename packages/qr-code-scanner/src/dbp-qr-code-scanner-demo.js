import {createInstance} from './i18n';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {QrCodeScanner} from './qr-code-scanner.js';

export class QrCodeScannerDemo extends LangMixin(ScopedElementsMixin(LitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-qr-code-scanner': QrCodeScanner,
        };
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            
            h1 {
                margin-bottom: 20px;
            }

            .section {
                margin-bottom: 50px;
            }
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
                            <dbp-qr-code-scanner
                                @code-detected="${(e) => console.log(e)}"
                                @scan-started="${(e) => console.log(e)}"
                                show-output
                                stop-scan
                                lang="${this.lang}"></dbp-qr-code-scanner>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo', QrCodeScannerDemo);
