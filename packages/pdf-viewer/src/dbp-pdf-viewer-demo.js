import {createInstance} from './i18n';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {PdfViewer} from './pdf-viewer.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class PdfViewerDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-pdf-viewer': PdfViewer,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            dbp-pdf-viewer {
                width: 100%;
                height: 100%;
                display: block;
            }

            #modal-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                align-items: center;
                justify-content: center;
                display: none;
            }

            #pdf-container {
                width: 80%;
                height: 80%;
                position: relative;
                background: #8ca0e8;
                overflow-y: auto;
            }
        `;
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }

    async openFile(e) {
        if (e.target.files.length === 0) {
            return;
        }

        let file = e.target.files[0];
        console.log("file", file);

        this._('#modal-container').style.display = 'flex';

        const previewTag = this.getScopedTagName('dbp-pdf-viewer');
        await this._(previewTag).showPDF(file);
    }

    render() {
        // const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">PdfViewer-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <input @change=${this.openFile} type="file" />
                        </div>
                    </div>
                </div>
                <h2>Cover</h2>
                <div class="container" id="modal-container">
                    <div class="container" id="pdf-container">
                        <dbp-pdf-viewer lang="${this.lang}" auto-resize="cover"></dbp-pdf-viewer>
                    </div>
                </div>
                <h2>Contain</h2>
                <div class="container" id="modal-container">
                    <div class="container" id="pdf-container">
                        <dbp-pdf-viewer lang="${this.lang}" auto-resize="contain"></dbp-pdf-viewer>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-pdf-viewer-demo', PdfViewerDemo);
