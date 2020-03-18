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
            this.dropArea = this.shadowRoot.querySelector('#dropArea');
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
            this.shadowRoot.querySelector('#fileElem').addEventListener('change', this.handleChange.bind(this));

        });
    }

    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        this.dropArea.classList.add('highlight')
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight')
    }

    handleDrop(e) {
        let dt = e.dataTransfer;
        console.dir(dt);
        let files = dt.files;

        this.handleFiles(files);
    }

    handleChange(e) {
        this.handleFiles(this.shadowRoot.querySelector('#fileElem').files);
    }

    handleFiles(files) {
        console.log('handleFiles: files.length = ' + files.length);
        ([...files]).forEach(this.uploadFile.bind(this))
    }

    sendFinishedEvent(status, filename) {
        const data =  {
            status: status,
            filename: filename
        };
        const event = new CustomEvent("vpu-fileupload-finished", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    uploadFile(file) {
        let url = this.url;
        let formData = new FormData();

        formData.append('file', file);

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
            body: formData
        })
            .then((response) => {
                /* Done. Inform the user */
                console.log(`Status: ${response.status} for file ${file.name}`);
                this.sendFinishedEvent(response.status, file.name);
            })
            .catch((response) => {
                /* Error. Inform the user */
                console.log(`Status: ${response.status} for file ${file.name}`);
                this.sendFinishedEvent(response.status, file.name);
            })
    }

    static get styles() {
        // language=css
        return css`
            #dropArea {
                border: var(--FUBorderWidth, 2px) var(--FUBorderStyle, dashed) var(--FUBBorderColor, #ccc);
                border-radius: var(--FUBorderRadius, 0);
                width: var(--FUWidth, auto);
                margin: var(--FUMargin, 10px);
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
                <form class="my-form">
                    <p>${this.text || i18n.t('intro')}</p>
                    <input type="file" id="fileElem" multiple accept="${ifDefined(this.accept)}" name='file'>
                    <label class="button" for="fileElem">${this.buttonLabel || i18n.t('upload-label')}</label>
                </form>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-fileupload', VPUFileUpload);
