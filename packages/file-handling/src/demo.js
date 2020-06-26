import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {FileSource} from './file-source.js';
import * as commonUtils from 'vpu-common/utils';

class FileSourceDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
    }

    static get scopedElements() {
        return {
          'vpu-file-source': FileSource,
        };
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
            this.shadowRoot.querySelectorAll('vpu-file-source')
                .forEach(element => {
                    element.addEventListener('vpu-file-source-file-finished', this.addLogEntry.bind(this));
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
                vpu-file-source.clean {
                    --FUBorderWidth: initial;
                    --FUBorderStyle: initial;
                    --FUBorderColor: initial;
                    --FUBorderColorHighlight: initial;
                    --FUBorderRadius: initial;
                    --FUMargin: initial;
                    --FUPadding: initial;
                    --FUWidth: initial;
                }
                vpu-file-source.opt {
                    --FUBorder: 2px solid blue;
                }
            </style>
 
            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <p>${unsafeHTML(i18n.t('required-server', { url: this.url}))}</p>
                </div>
                <div class="content">
                    <h2 class="subtitle">Send files via event</h2>
                    <p>There is no restriction for a specific file type:</p>
                    <vpu-file-source lang="de" url="${this.url}" allowed-mime-types="*/*"></vpu-file-source>
                    <p>Only images are allowed here (JPG, PNG, GIF, TIF, ...):</p>
                    <vpu-file-source lang="de" url="${this.url}" allowed-mime-types="image/*"
                        text="Abgabe nur für Bilder "></vpu-file-source>
                    <p>This is for PDF only:</p>
                    <vpu-file-source lang="de" url="${this.url}" allowed-mime-types="application/pdf"
                        text="Einreichung als PDF" button-label="PDF auswählen"></vpu-file-source>
                     <p>Text and images (JPG, PNG, GIF, TIF, ...) :</p>
                    <vpu-file-source lang="de" url="${this.url}" allowed-mime-types="text/plain,image/*"
                        text="Abgabe für Text und Bilder "></vpu-file-source>
               </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-file-source-demo', FileSourceDemo);
