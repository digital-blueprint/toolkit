import {createInstance, setOverridesByGlobalCache} from './i18n';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {QrCodeScanner} from './qr-code-scanner.js';

export class QrCodeScannerDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-qr-code-scanner': QrCodeScanner,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    connectedCallback() {
      if (this.langDir != '') {
        setOverridesByGlobalCache(this._i18n, this);
      }
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
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
                                lang="${this.lang}"></dbp-qr-code-scanner>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo', QrCodeScannerDemo);
