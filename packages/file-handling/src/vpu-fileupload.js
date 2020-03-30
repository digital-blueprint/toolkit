import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined';
// import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'
import "vpu-common/vpu-mini-spinner.js";
import * as commonUtils from "vpu-common/utils";
import 'vpu-common/vpu-icon.js';

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUFileUpload extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
        this.dropArea = null;
        this.accept = '';
        this.text = '';
        this.buttonLabel = '';
        this.uploadInProgress = false;
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            url: { type: String },
            accept: { type: String },
            text: { type: String },
            buttonLabel: { type: String, attribute: 'button-label'},
            uploadInProgress: { type: Boolean, attribute: false},
        };
    }


    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.dropArea = this._('#dropArea');
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.preventDefaults, false)
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.highlight.bind(this), false)
            });
            ['dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.unhighlight.bind(this), false)
            });
            this.dropArea.addEventListener('drop', this.handleDrop.bind(this), false);
            this._('#fileElem').addEventListener('change', this.handleChange.bind(this));
        });
    }

    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        if (this.uploadInProgress) {
            return;
        }

        this.dropArea.classList.add('highlight')
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight')
    }

    handleDrop(e) {
        if (this.uploadInProgress) {
            return;
        }

        let dt = e.dataTransfer;
        console.dir(dt);
        let files = dt.files;

        this.handleFiles(files);
    }

    async handleChange(e) {
        let fileElem = this._('#fileElem');

        if (fileElem.files.length === 0) {
            return;
        }

        await this.handleFiles(fileElem.files);

        // reset the element's value so the user can upload the same file(s) again
        fileElem.value = '';
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async handleFiles(files) {
        console.log('handleFiles: files.length = ' + files.length);

        this.dispatchEvent(new CustomEvent("vpu-fileupload-all-start",
            { "detail": {}, bubbles: true, composed: true }));

        // we need to wait for each upload until we start the next one
        await this.asyncForEach(files, async (file) => this.uploadFile(file));

        this.dispatchEvent(new CustomEvent("vpu-fileupload-all-finished",
            { "detail": {}, bubbles: true, composed: true }));
    }

    async sendFinishedEvent(response, file, sendFile = false) {
        if (response === undefined) {
            return;
        }

        let data =  {
            fileName: file.name,
            status: response.status,
            json: {"hydra:description": ""}
        };

        try {
            await response.json().then((json) => {
                data.json = json;
            });
        } catch (e) {}

        if (sendFile) {
            data.file = file;
        }

        const event = new CustomEvent("vpu-fileupload-file-finished", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    sendStartEvent(file) {
        let data =  {
            fileName: file.name,
            fileSize: file.size,
        };

        this.dispatchEvent(new CustomEvent("vpu-fileupload-file-start",
            { "detail": data, bubbles: true, composed: true }));
    }

    /**
     * @param file
     * @returns {Promise<void>}
     */
    async uploadFile(file) {
        this.uploadInProgress = true;
        this.sendStartEvent(file);
        let url = this.url;
        let formData = new FormData();

        formData.append('file', file);

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
            body: formData
        })
            .then((response) => {
                /* Done. Inform the user */
                console.log(`Status: ${response.status} for file ${file.name}`);
                this.sendFinishedEvent(response, file, response.status !== 201);
            })
            .catch((response) => {
                /* Error. Inform the user */
                console.log(`Error status: ${response.status} for file ${file.name}`);
                this.sendFinishedEvent(response, file, true);
            });

        this.uploadInProgress = false;
    }

    static get styles() {
        // language=css
        return css`
            #dropArea {
                border: var(--FUBorderWidth, 2px) var(--FUBorderStyle, dashed) var(--FUBBorderColor, #ccc);
                border-radius: var(--FUBorderRadius, 0);
                width: var(--FUWidth, auto);
                margin: var(--FUMargin, 0px);
                padding: var(--FUPadding, 20px);
            }
            #dropArea.highlight {
                border-color: var(--FUBorderColorHighlight, purple);
            }
            p {
                margin-top: 0;
            }
            .my-form {
                margin-bottom: 10px;
            }
            .button {
                display: inline-block;
                padding: 10px;
                background: #ccc;
                cursor: pointer;
                border-radius: calc(var(--FUBorderRadius, 0)/2);
                border: 1px solid #ccc;
            }
            .button:hover {
                background: #ddd;
            }
            #fileElem {
                display: none;
            }
        `;
    }

    render() {
        return html`
            <div id="dropArea">
                <div class="my-form" title="${this.uploadInProgress ? i18n.t('upload-disabled-title') : ''}">
                    <p>${this.text || i18n.t('intro')}</p>
                    <input ?disabled="${this.uploadInProgress}" type="file" id="fileElem" multiple accept="${ifDefined(this.accept)}" name='file'>
                    <label class="button" for="fileElem"><vpu-icon style="display: ${this.uploadInProgress ? "inline-block" : "none"}" name="lock"></vpu-icon> ${this.buttonLabel || i18n.t('upload-label')}</label>
                </div>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-fileupload', VPUFileUpload);
