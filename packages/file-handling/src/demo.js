import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import './vpu-fileupload';
import * as commonUtils from 'vpu-common/utils';

class FileUploadDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
    }

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
                vpu-fileupload.clean {
                    --FUBorder: initial;
                    --FUBorderRadius: initial;
                    --FUMargin: initial;
                    --FUPadding: initial;
                }
                vpu-fileupload.opt {
                    --FUBorder: 2px solid blue;
                }
            </style>
 
            <section class="section">
                <div class="content">
                    <h1 class="title">File-Upload-Demo</h1>
                    <p>You need an upload server listening at <tt>${this.url}</tt> to receive the files...</p>
                </div>
                <div class="content">
                    <h2 class="subtitle">Send to Server</h2>
                    <p>Drop some files here:</p>
                    <vpu-fileupload lang="de" url="${this.url}"></vpu-fileupload>
                </div>
                <div class="content">
                    <h2>Log of uploads</h2>
                    <ul id="log"></ul>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-fileupload-demo', FileUploadDemo);
