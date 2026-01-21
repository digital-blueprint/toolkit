import {createInstance} from './i18n';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin, LangMixin, Button} from '@dbp-toolkit/common';
import {PdfViewer} from './pdf-viewer.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class PdfViewerDemo extends LangMixin(ScopedElementsMixin(LitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-pdf-viewer': PdfViewer,
            'dbp-button': Button,
        };
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            #dbp-pdf-viewer-contain {
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
                background-color: var(--dbp-primary);
                overflow-y: auto;
            }

            .container,
            p {
                margin: 20px auto;
            }

            .sample-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 10px;
            }
        `;
    }

    _(selector) {
        return this.renderRoot.querySelector(selector);
    }

    /**
     * @param e
     * @returns {Promise<void>}
     */
    async openFileContain(e) {
        if (e.target.files.length === 0) {
            return;
        }

        let file = e.target.files[0];
        console.log('file', file);

        this._('#modal-container').style.display = 'flex';

        await this._('#dbp-pdf-viewer-contain').showPDF(file);
    }

    /**
     * @param e
     * @returns {Promise<void>}
     */
    async openFileCover(e) {
        if (e.target.files.length === 0) {
            return;
        }

        let file = e.target.files[0];
        console.log('file', file);

        await this._('#dbp-pdf-viewer-cover').showPDF(file);
    }

    async closeModal(e) {
        if (e.target.id !== 'modal-container') {
            return;
        }

        console.log('e', e);
        this._('#modal-container').style.display = 'none';
        e.preventDefault();
    }

    async loadSamplePDF(filename, viewer) {
        let url = commonUtils.getAssetURL('@dbp-toolkit/pdf-viewer', `pdfs/${filename}`);
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], filename, {type: 'application/pdf'});

        if (viewer === 'contain') {
            this._('#modal-container').style.display = 'flex';
            await this._('#dbp-pdf-viewer-contain').showPDF(file);
        } else {
            await this._('#dbp-pdf-viewer-cover').showPDF(file);
        }
    }

    render() {
        // const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">PdfViewer-Demo</h1>
                </div>
                <h2>Cover</h2>
                <div class="container">
                    <div class="columns is-vcentered">
                        <p>
                            The PDF will be resized fit the container horizontally only, vertically
                            the PDF can exceed the container.
                        </p>
                        <div class="column">
                            <input @change=${this.openFileCover} type="file" />
                            <div class="sample-buttons">
                                <dbp-button
                                    no-spinner-on-click
                                    type="is-primary"
                                    @click=${() =>
                                        this.loadSamplePDF('example_patterns.pdf', 'cover')}>
                                    Patterns
                                </dbp-button>
                                <dbp-button
                                    no-spinner-on-click
                                    type="is-primary"
                                    @click=${() => this.loadSamplePDF('example_text.pdf', 'cover')}>
                                    Text
                                </dbp-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <dbp-pdf-viewer
                        id="dbp-pdf-viewer-cover"
                        lang="${this.lang}"
                        auto-resize="cover"></dbp-pdf-viewer>
                </div>
                <h2>Contain</h2>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <p>
                                The PDF will be resized to fit the container horizontally and
                                vertically.
                            </p>

                            <p>
                                <input @change=${this.openFileContain} type="file" />
                            </p>
                            <div class="sample-buttons">
                                <dbp-button
                                    no-spinner-on-click
                                    type="is-primary"
                                    @click=${() =>
                                        this.loadSamplePDF('example_patterns.pdf', 'contain')}>
                                    Patterns
                                </dbp-button>
                                <dbp-button
                                    no-spinner-on-click
                                    type="is-primary"
                                    @click=${() =>
                                        this.loadSamplePDF('example_text.pdf', 'contain')}>
                                    Text
                                </dbp-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container" id="modal-container" @click=${this.closeModal}>
                    <div class="container" id="pdf-container">
                        <dbp-pdf-viewer
                            id="dbp-pdf-viewer-contain"
                            lang="${this.lang}"
                            auto-resize="contain"></dbp-pdf-viewer>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-pdf-viewer-demo', PdfViewerDemo);
