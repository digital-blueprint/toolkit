import {i18n} from './i18n';
import {html} from 'lit-element';
// import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'
import "vpu-common/vpu-mini-spinner.js";
import * as commonUtils from "vpu-common/utils";
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import 'vpu-common/vpu-icon.js';

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUFileUpload extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            url: { type: String },
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


    render() {
        return html`
            <style>
        #drop-area {
            border: 2px dashed #ccc;
            border-radius: 20px;
            width: 480px;
            font-family: sans-serif;
            margin: 100px auto;
            padding: 20px;
        }
        #drop-area.highlight {
            border-color: purple;
        }
        p {
            margin-top: 0;
        }
        .my-form {
            margin-bottom: 10px;
        }
        #gallery {
            margin-top: 10px;
        }
        #gallery img {
            width: 150px;
            margin-bottom: 10px;
            margin-right: 10px;
            vertical-align: middle;
        }
        .button {
            display: inline-block;
            padding: 10px;
            background: #ccc;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        .button:hover {
            background: #ddd;
        }
        #fileElem {
            display: none;
        }
            </style>
            <div id="drop-area">
                <form class="my-form">
                    <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
                    <input type="file" id="fileElem" multiple accept="image/*" name='my_file' onchange="handleFiles(this.files)">
                    <label class="button" for="fileElem">Select some files</label>
                </form>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-fileupload', VPUFileUpload);
