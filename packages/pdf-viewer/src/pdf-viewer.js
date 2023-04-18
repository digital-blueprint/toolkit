import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {live} from 'lit/directives/live.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {MiniSpinner, Icon} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import pdfjs from 'pdfjs-dist/legacy/build/pdf';
import {name as pkgName} from './../package.json';
import {readBinaryFileContent} from './utils.js';

/**
 * PdfViewer web component
 */
export class PdfViewer extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.pdfDoc = null;
        this.currentPage = 0;
        this.totalPages = 0;
        this.isShowPage = false;
        this.isPageLoaded = false;
        this.showErrorMessage = false;
        this.isPageRenderingInProgress = false;
        this.isShowPlacement = true;
        this.canvas = null;
        this.annotationLayer = null;
        this.canvasToPdfScale = 1.0;
        this.currentPageOriginalHeight = 0;
        this.currentPageOriginalWidth = 0;
        this.pdfMainContainer = null;
        this.initialClientWidth = 0;
        this.initialClientHeight = 0;
        this.isFirstRendering = true;
        this.autoResize = 'cover';

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
            lang: {type: String},
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
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    _onWindowResize() {
        this.showPage(this.currentPage);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._onWindowResize);
        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
        pdfjs.GlobalWorkerOptions.workerSrc = commonUtils.getAssetURL(
            pkgName,
            'pdfjs/pdf.worker.js'
        );

        window.addEventListener('resize', this._onWindowResize);

        this.updateComplete.then(async () => {
            that.annotationLayer = that._('#annotation-layer');
            that.canvas = that._('#pdf-canvas');
            that.pdfMainContainer = that._('#pdf-main-container');

            // this._('#upload-pdf-input').addEventListener('change', function() {
            //     that.showPDF(this.files[0]);
            // });
        });
    }

    enforceCanvasBoundaries(obj) {
        // top-left corner
        if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
            obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
        }

        // bottom-right corner
        if (
            obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height ||
            obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
        ) {
            obj.top = Math.min(
                obj.top,
                obj.canvas.height -
                obj.getBoundingRect().height +
                obj.top -
                obj.getBoundingRect().top
            );
            obj.left = Math.min(
                obj.left,
                obj.canvas.width -
                obj.getBoundingRect().width +
                obj.left -
                obj.getBoundingRect().left
            );
        }
    }

    async onPageNumberChanged(e) {
        let obj = e.target;
        const page_no = parseInt(obj.value);
        console.log('page_no = ', page_no);

        if (page_no > 0 && page_no <= this.totalPages) {
            await this.showPage(page_no);
        }
    }

    /**
     * Initialize and load the PDF
     *
     * @param file
     * @param placementData
     */
    async showPDF(file, placementData = {}) {
        this.isPageLoaded = false; // prevent redisplay of previous pdf
        this.showErrorMessage = false;

        this.isShowPage = true;

        const data = await readBinaryFileContent(file);

        // get handle of pdf document
        try {
            this.pdfDoc = await pdfjs.getDocument({data: data}).promise;
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

        // fix width adaption after "this.isPageLoaded = true"
        await this.showPage(page);
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
                    console.log("that._('#pdf-meta').clientHeight", that._('#pdf-meta').clientHeight);
                    console.log("that._('#pdf-meta')", that._('#pdf-meta'));
                    console.log("that._('#pdf-meta').getBoundingClientRect().height", that._('#pdf-meta').getBoundingClientRect().height);
                    console.log("this.initialClientWidth", that.initialClientWidth);
                    console.log("this.initialClientHeight", that.initialClientHeight);
                }

                // original width of the pdf page at scale 1
                const originalViewport = page.getViewport({scale: 1});
                this.currentPageOriginalHeight = originalViewport.height;
                this.currentPageOriginalWidth = originalViewport.width;
                // const proportion = this.currentPageOriginalWidth / this.currentPageOriginalHeight;

                // set the canvas width to the width of the container (minus the borders)
                // let clientWidth = this.pdfMainContainer.clientWidth - 2;
                // let clientHeight = this.pdfMainContainer.clientHeight - 2;
                let clientWidth = that.initialClientWidth;
                let clientHeight = that.initialClientHeight - that._('#pdf-meta').clientHeight;
                console.log("clientWidth", clientWidth);
                console.log("clientHeight", clientHeight);

                // let proposedCanvasWidth = clientWidth;
                // let proposedCanvasHeight = clientHeight;
                this.canvas.width = clientWidth;

                // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
                this.canvasToPdfScale = clientWidth / originalViewport.width;

                console.log('this.canvasToPdfScale: ' + this.canvasToPdfScale);

                // get viewport to render the page at required scale
                let viewport = page.getViewport({scale: this.canvasToPdfScale});

                // if the height of the viewport is higher than the height of the container and the autoResize is set
                // to 'contain', then we need to adjust the scale again
                if (this.autoResize === 'contain' && viewport.height > clientHeight) {
                    // this.canvasToPdfScale = this.canvasToPdfScale * (clientHeight / viewport.height);
                    this.canvasToPdfScale = clientHeight / originalViewport.height;
                    console.log("viewport.height to high, new this.canvasToPdfScale", this.canvasToPdfScale);

                    // get viewport to render the page at required scale
                    viewport = page.getViewport({scale: this.canvasToPdfScale});
                }

                // set canvas height same as viewport height
                this.canvas.height = viewport.height;
                this.canvas.width = viewport.width;

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
                    await page
                        .render(render_context)
                        .promise.then(() => {
                            console.log('Page rendered');
                            that.isPageRenderingInProgress = false;

                            return page.getAnnotations();
                        })
                        .then(function (annotationData) {
                            // remove all child nodes
                            that.annotationLayer.innerHTML = '';
                            // update size
                            that.annotationLayer.style.height = that.canvas.height + 'px';
                            that.annotationLayer.style.width = that.canvas.width + 'px';

                            // create all supported annotations
                            annotationData.forEach((annotation) => {
                                const subtype = annotation.subtype;
                                let text = '';
                                switch (subtype) {
                                    case 'Text':
                                    case 'FreeText':
                                        // Annotations by Adobe Acrobat already have an appearance that can be viewed by pdf.js
                                        if (annotation.hasAppearance) {
                                            return;
                                        }

                                        text = annotation.contents;
                                        break;
                                    case 'Widget':
                                        // Annotations by Adobe Acrobat already have an appearance that can be viewed by pdf.js
                                        if (annotation.hasAppearance) {
                                            return;
                                        }

                                        text = annotation.alternativeText;
                                        break;
                                    default:
                                        // we don't support other types
                                        return;
                                }

                                const annotationDiv = document.createElement('div');
                                const annotationDivInner = document.createElement('div');
                                annotationDiv.className = 'annotation annotation-' + subtype;
                                annotationDiv.style.left =
                                    annotation.rect[0] * that.canvasToPdfScale + 'px';
                                annotationDiv.style.bottom =
                                    annotation.rect[1] * that.canvasToPdfScale + 'px';
                                annotationDiv.style.width =
                                    (annotation.rect[2] - annotation.rect[0]) *
                                    that.canvasToPdfScale +
                                    'px';
                                annotationDiv.style.height =
                                    (annotation.rect[3] - annotation.rect[1]) *
                                    that.canvasToPdfScale +
                                    'px';
                                annotationDivInner.innerText = text === '' ? subtype : text;

                                annotationDiv.appendChild(annotationDivInner);
                                that.annotationLayer.appendChild(annotationDiv);
                            });

                            // console.log("annotationData render", annotationData);
                        });
                } catch (error) {
                    console.error(error.message);
                    that.isPageRenderingInProgress = false;
                }
            });
        } catch (error) {
            console.error(error.message);
            that.isPageRenderingInProgress = false;
        }
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

            /* it's too risky to adapt the height */
            /*
            #pdf-meta button, #pdf-meta input {
                max-height: 15px;
            }
            */

            #canvas-wrapper {
                position: relative;
                /*align-items: center;*/
                /*justify-content: center;*/
                /*display: flex;*/
                border: var(--dbp-border);
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

            #annotation-layer {
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
            }

            #annotation-layer > div {
                position: absolute;
                border: dashed 2px red;
                padding: 6px;
                background-color: rgba(255, 255, 255, 0.5);
            }

            #annotation-layer > div > div {
                overflow: hidden;
                font-size: 0.8em;
                height: 100%;
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
                border: var(--dbp-border);
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

            input[type='number'] {
                background-color: var(--dbp-background);
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
            <!--
            <form>
                <input type="file" name="pdf" id="upload-pdf-input">
            </form>
-->
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
                                <div id="annotation-layer"></div>
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
