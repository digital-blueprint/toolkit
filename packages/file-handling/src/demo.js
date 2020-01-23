import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
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

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.shadowRoot.querySelectorAll('vpu-fileupload')
                .forEach(element => {
                    element.addEventListener('vpu-fileupload-finished', this.addLogEntry.bind(this));
                });
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    addLogEntry(ev) {
        const ul = this.shadowRoot.querySelector('#log');
        const li = document.createElement('li');
        li.innerHTML = `<li><b>${ev.detail.status}</b> <tt>${ev.detail.filename}</tt>`;

        ul.appendChild(li);
    }

    render() {
        return html`
            <style>
                vpu-fileupload.clean {
                    --FUBorderWidth: initial;
                    --FUBorderStyle: initial;
                    --FUBorderColor: initial;
                    --FUBorderColorHighlight: initial;
                    --FUBorderRadius: initial;
                    --FUMargin: initial;
                    --FUPadding: initial;
                    --FUWidth: initial;
                }
                vpu-fileupload.opt {
                    --FUBorder: 2px solid blue;
                }
            </style>
 
            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <p>${unsafeHTML(i18n.t('required-server', { url: this.url}))}</p>
                </div>
                <div class="content">
                    <h2 class="subtitle">Send any File to Server</h2>
                    <p>There is no restriction for a specific file type:</p>
                    <vpu-fileupload lang="de" url="${this.url}"></vpu-fileupload>
                    <p>Only images are allowed here (JPG, PNG, GIF, TIF, ...):</p>
                    <vpu-fileupload lang="de" url="${this.url}" accept="image/*"
                        text="Abgabe nur für Bilder "></vpu-fileupload>
                    <p>This is for PDF only:</p>
                    <vpu-fileupload lang="de" url="${this.url}" accept="application/pdf"
                        text="Einreichung als PDF" button-label="PDF auswählen"></vpu-fileupload>
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
