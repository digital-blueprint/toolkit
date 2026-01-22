import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {live} from 'lit/directives/live.js';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {MiniSpinner, Icon} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {name as pkgName} from './../package.json';
import {readBinaryFileContent} from './utils.js';

let pdfjsPromise = null;

/**
 * Dynamically imports the PDF.js library and sets up the worker source.
 * This can be used separately from the PdfViewer component to ensure that PDF.js
 * is loaded and set up.
 *
 * @async
 * @returns {Promise<object>} A promise that resolves to the imported PDF.js module.
 */
export async function importPdfJs() {
    if (!pdfjsPromise) {
        pdfjsPromise = (async () => {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            pdfjs.GlobalWorkerOptions.workerSrc = commonUtils.getAssetURL(
                pkgName,
                'pdfjs/pdf.worker.mjs',
            );
            return pdfjs;
        })();
    }
    return pdfjsPromise;
}

/**
 * Loads a PDF document using PDF.js with default configuration options.
 *
 * This sets various default options for loading the PDF document, such as the
 * cmap URL and cmap packed setting, as well as disabling eval for security
 * reasons unless explicitly enabled.
 *
 * @param {import('pdfjs-dist/legacy/build/pdf.mjs')} pdfjs - The PDF.js library instance.
 * @param {object} [src] - The source configuration object for the PDF document.
 * @returns {import('pdfjs-dist/legacy/build/pdf.mjs').PDFDocumentLoadingTask}
 */
export function getPdfJsDocument(pdfjs, src = {}) {
    // Set for cmaps we ship by default
    let cmaps = commonUtils.getAssetURL(pkgName, 'pdfjs/cmaps/');
    if (src.cMapUrl === undefined) src.cMapUrl = cmaps;

    // Set wasm path we ship by default
    let wasm = commonUtils.getAssetURL(pkgName, 'pdfjs/wasm/');
    if (src.wasmUrl === undefined) src.wasmUrl = wasm;

    // Disable eval by default for security reasons, unless explicitly enabled
    if (src.isEvalSupported === undefined) src.isEvalSupported = false;

    return pdfjs.getDocument(src);
}

/**
 * PdfViewer web component
 */
export class PdfViewer extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.pdfDoc = null;
        this.currentPage = 0;
        this.totalPages = 0;
        this.isShowPage = false;
        this.isPageLoaded = false;
        this.showErrorMessage = false;
        this.isPageRenderingInProgress = false;
        this.isShowPlacement = true;
        this.canvas = null;
        this.canvasToPdfScale = 1.0;
        this.currentPageOriginalHeight = 0;
        this.currentPageOriginalWidth = 0;
        this.pdfMainContainer = null;
        this.initialClientWidth = 0;
        this.initialClientHeight = 0;
        this.isFirstRendering = true;
        this.autoResize = 'cover';
        this.textLayer = null;

        this._onWindowResize = this._onWindowResize.bind(this);
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
            'dbp-icon': Icon,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            autoResize: {type: String, attribute: 'auto-resize'},
            currentPage: {type: Number, attribute: false},
            totalPages: {type: Number, attribute: false},
            isShowPage: {type: Boolean, attribute: false},
            isPageRenderingInProgress: {type: Boolean, attribute: false},
            isPageLoaded: {type: Boolean, attribute: false},
            showErrorMessage: {type: Boolean, attribute: false},
        };
    }

    update(changedProperties) {
        super.update(changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'autoResize':
                    this._onWindowResize();
                    break;
            }
        });
    }

    _onWindowResize() {
        this.isFirstRendering = true;
        this.showPage(this.currentPage);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._onWindowResize);
        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        window.addEventListener('resize', this._onWindowResize);

        this.updateComplete.then(async () => {
            that.canvas = that._('#pdf-canvas');
            that.pdfMainContainer = that._('#pdf-main-container');
        });
    }

    async onPageNumberChanged(e) {
        let obj = e.target;
        const page_no = parseInt(obj.value);

        if (page_no > 0 && page_no <= this.totalPages) {
            await this.showPage(page_no);
        }
    }

    /**
     * Initialize and load the PDF
     *
     * @param file
     * @param placementData
     * @param fixWidthAdaption
     */
    async showPDF(file, placementData = {}, fixWidthAdaption = false) {
        this.isPageLoaded = false; // prevent redisplay of previous pdf
        this.showErrorMessage = false;

        this.isShowPage = true;

        const data = await readBinaryFileContent(file);

        if (this.pdfDoc !== null) {
            this.pdfDoc.destroy();
            this.pdfDoc = null;
        }

        // get handle of pdf document
        try {
            let pdfjs = await importPdfJs();
            this.pdfDoc = await getPdfJsDocument(pdfjs, {data: data}).promise;
        } catch (error) {
            console.error(error);
            this.showErrorMessage = true;
            return;
        }

        // total pages in pdf
        this.totalPages = this.pdfDoc.numPages;
        const page = placementData.currentPage || 1;

        // show the first page
        // if the placementData has no values we want to initialize the signature position
        await this.showPage(page);

        this.isPageLoaded = true;

        if (fixWidthAdaption) {
            // fix width adaption after "this.isPageLoaded = true"
            setTimeout(() => {
                this._onWindowResize();
            }, 100);
        }
    }

    /**
     * Load and render specific page of the PDF
     *
     * @param pageNumber
     */
    async showPage(pageNumber) {
        // we need to wait until the last rendering is finished
        if (this.isPageRenderingInProgress || this.pdfDoc === null) {
            return;
        }

        const that = this;
        this.isPageRenderingInProgress = true;
        this.currentPage = pageNumber;

        try {
            // get handle of page
            await this.pdfDoc.getPage(pageNumber).then(async (page) => {
                if (that.isFirstRendering) {
                    that.isFirstRendering = false;

                    // we weren't able to get the initial width and height of the container in the connectedCallback (this.updateComplete)
                    // clientWidth and clientHeight were also not set correctly, getBoundingClientRect() was the only way to get the correct values
                    that.initialClientWidth = that.getBoundingClientRect().width - 2;
                    that.initialClientHeight = that.getBoundingClientRect().height - 2;
                }

                // original width of the pdf page at scale 1
                const originalViewport = page.getViewport({scale: 1});
                this.currentPageOriginalHeight = originalViewport.height;
                this.currentPageOriginalWidth = originalViewport.width;
                // const proportion = this.currentPageOriginalWidth / this.currentPageOriginalHeight;

                // set the canvas width to the width of the container (minus the borders)
                let clientWidth = that.initialClientWidth;
                let clientHeight = that.initialClientHeight - that._('#pdf-meta').clientHeight;

                this.canvas.width = clientWidth;

                // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
                this.canvasToPdfScale = clientWidth / originalViewport.width;
                // get viewport to render the page at required scale
                let viewport = page.getViewport({scale: this.canvasToPdfScale});

                // if the height of the viewport is higher than the height of the container and the autoResize is set
                // to 'contain', then we need to adjust the scale again
                if (this.autoResize === 'contain' && viewport.height > clientHeight) {
                    // this.canvasToPdfScale = this.canvasToPdfScale * (clientHeight / viewport.height);
                    this.canvasToPdfScale = clientHeight / originalViewport.height;

                    // get viewport to render the page at required scale
                    viewport = page.getViewport({scale: this.canvasToPdfScale});
                }

                // set canvas height same as viewport height
                this.canvas.height = viewport.height;
                this.canvas.width = viewport.width;

                this._('#canvas-wrapper-inner').style.width = this.canvas.width + 'px';
                this._('#canvas-wrapper-inner').style.height = this.canvas.height + 'px';

                // setting page loader height for smooth experience
                this._('#page-loader').style.height = this.canvas.height + 'px';
                this._('#page-loader').style.lineHeight = this.canvas.height + 'px';

                // setting wrapper height, so that the absolute positions of the pdf-canvas and
                // the annotation-layer don't disturb the page layout
                this._('#canvas-wrapper').style.height = this.canvas.height + 'px';

                // page is rendered on <canvas> element
                const render_context = {
                    canvasContext: this.canvas.getContext('2d'),
                    viewport: viewport,
                };

                // render the page contents in the canvas
                try {
                    await page.render(render_context).promise;
                    await that._renderTextLayer(page, viewport);
                } catch (error) {
                    console.error(error.message);
                } finally {
                    that.isPageRenderingInProgress = false;
                }
            });
        } catch (error) {
            console.error(error.message);
            that.isPageRenderingInProgress = false;
        }
    }

    async _renderTextLayer(page, viewport) {
        if (this.textLayer) {
            this.textLayer.cancel();
            this.textLayer = null;
        }
        const textLayerDiv = this._('#text-layer');
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = viewport.width + 'px';
        textLayerDiv.style.height = viewport.height + 'px';
        textLayerDiv.style.setProperty('--scale-factor', this.canvasToPdfScale);
        textLayerDiv.style.setProperty('--user-unit', viewport.userUnit);
        const textContent = await page.getTextContent();
        const pdfjs = await importPdfJs();
        this.textLayer = new pdfjs.TextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
        });
        await this.textLayer.render();
        // XXX: pdfjs touches the global DOM
        // see https://github.com/mozilla/pdf.js/issues/18086
        document
            .querySelectorAll('.hiddenCanvasElement')
            .forEach((e) => e.setAttribute('style', 'display: none'));
    }

    sendCancelEvent() {
        const event = new CustomEvent('dbp-pdf-viewer-cancel', {
            detail: {},
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            #pdf-meta input[type=number] {
                max-width: 50px;
            }

            #page-loader {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #canvas-wrapper {
                border: var(--dbp-border);
                display: flex;
                align-items: center;
                flex-direction: column;
                background-color: var(--dbp-muted-surface);
            }

            #canvas-wrapper-inner {
                display: block;
                position: relative;
            }

            #canvas-wrapper canvas {
                position: absolute;
                top: 0;
                left: 0;
            }

            .textLayer {
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                line-height: 1;

                --total-scale-factor: calc(var(--scale-factor) * var(--user-unit));
                --scale-round-x: 1px;
                --scale-round-y: 1px;
            }

            .textLayer :is(span, br) {
                color: transparent;
                position: absolute;
                white-space: pre;
                cursor: text;
                transform-origin: 0% 0%;

                --font-height: 0;
                --min-font-size: 1;
                --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
                --min-font-size-inv: calc(1 / var(--min-font-size));
                --scale-x: 1;
                --rotate: 0deg;
                font-size: calc(var(--text-scale-factor) * var(--font-height));
                transform: rotate(var(--rotate)) scaleX(var(--scale-x));
            }

            .textLayer br {
                user-select: none;
            }

            .textLayer span::selection {
                color: transparent;
                background: rgba(0, 0, 255, 0.25);
            }

            .buttons {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                justify-content: center;
                align-items: center;
            }

            .nav-buttons {
                display: flex;
                justify-content: center;
                flex-grow: 1;
                flex-wrap: wrap;
            }

            .buttons .page-info {
                align-self: center;
                white-space: nowrap;
            }

            .nav-buttons > * {
                margin: 2px;
            }

            input[type='number'] {
                background-color: var(--dbp-background);
                border: var(--dbp-border);
                color: var(--dbp-content);
                padding: 0 0.3em;
            }

            #pdf-meta {
                border: var(--dbp-border);
                padding: 0.54em;
                border-bottom-width: 0;
            }

            .button.is-cancel {
                color: var(--dbp-danger);
            }

            .error-message {
                text-align: center;
                border: 1px solid black;
                border-top: 0px;
                padding: 15px;
            }

            dbp-mini-spinner {
                margin: auto;
                display: block;
                width: 17px;
            }
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <div id="pdf-main-container" class="${classMap({hidden: !this.isShowPage})}">
                <dbp-mini-spinner
                    class="${classMap({
                        hidden: this.isPageLoaded || this.showErrorMessage,
                    })}"></dbp-mini-spinner>
                <div
                    class="error-message ${classMap({
                        hidden: !this.showErrorMessage || this.isPageLoaded,
                    })}">
                    ${i18n.t('pdf-viewer.error-message')}
                </div>
                <div class="${classMap({hidden: !this.isPageLoaded})}">
                    <div id="pdf-meta">
                        <div class="buttons ${classMap({hidden: !this.isPageLoaded})}">
                            <div class="nav-buttons">
                                <button
                                    class="button is-icon"
                                    title="${i18n.t('pdf-viewer.first-page')}"
                                    @click="${async () => {
                                        await this.showPage(1);
                                    }}"
                                    ?disabled="${this.isPageRenderingInProgress ||
                                    this.currentPage === 1}">
                                    <dbp-icon name="angle-double-left"></dbp-icon>
                                </button>
                                <button
                                    class="button is-icon"
                                    title="${i18n.t('pdf-viewer.previous-page')}"
                                    @click="${async () => {
                                        if (this.currentPage > 1)
                                            await this.showPage(--this.currentPage);
                                    }}"
                                    ?disabled="${this.isPageRenderingInProgress ||
                                    this.currentPage === 1}">
                                    <dbp-icon name="chevron-left"></dbp-icon>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="${this.totalPages}"
                                    @input="${this.onPageNumberChanged}"
                                    .value="${live(this.currentPage)}" />
                                <div class="page-info">
                                    ${i18n.t('pdf-viewer.page-count', {
                                        totalPages: this.totalPages,
                                    })}
                                </div>
                                <button
                                    class="button is-icon"
                                    title="${i18n.t('pdf-viewer.next-page')}"
                                    @click="${async () => {
                                        if (this.currentPage < this.totalPages)
                                            await this.showPage(++this.currentPage);
                                    }}"
                                    ?disabled="${this.isPageRenderingInProgress ||
                                    this.currentPage === this.totalPages}">
                                    <dbp-icon name="chevron-right"></dbp-icon>
                                </button>
                                <button
                                    class="button is-icon"
                                    title="${i18n.t('pdf-viewer.last-page')}"
                                    @click="${async () => {
                                        await this.showPage(this.totalPages);
                                    }}"
                                    ?disabled="${this.isPageRenderingInProgress ||
                                    this.currentPage === this.totalPages}">
                                    <dbp-icon name="angle-double-right"></dbp-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        id="canvas-wrapper"
                        class="${classMap({hidden: this.isPageRenderingInProgress})}">
                        <div id="canvas-wrapper-inner">
                            <canvas id="pdf-canvas"></canvas>
                            <div id="text-layer" class="textLayer"></div>
                        </div>
                    </div>
                    <div class="${classMap({hidden: !this.isPageRenderingInProgress})}">
                        <dbp-mini-spinner id="page-loader"></dbp-mini-spinner>
                    </div>
                </div>
            </div>
        `;
    }
}
