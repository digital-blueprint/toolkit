import {createInstance} from './i18n';
import {html, LitElement} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {FileSource} from './file-source.js';
import {FileSink} from './file-sink.js';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class FileSourceDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
    }

    static get scopedElements() {
        return {
          'dbp-file-source': FileSource,
          'dbp-file-sink': FileSink,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
            url: { type: String },
            selectedFiles: { type: Array, attribute: false },
            selectedFilesCount: { type: Number, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.shadowRoot.querySelectorAll('.file-source')
                .forEach(element => {
                    // TODO: remove orphaned event listeners
                    element.addEventListener('dbp-file-source-file-selected', this.addLogEntry.bind(this));
                });
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    getSelectedFilesHtml() {
        if (this.selectedFilesCount === 0) {
            return `No files were selected`;
        }

        let results = [];

        this.selectedFiles.forEach((file) => {
            results.push(html`
                <div class="file-block">
                    <strong>${file.name}</strong> (${file.type})</span>
                </div>
            `);
        });

        return results;
    }

    addLogEntry(ev) {
        this.selectedFiles.push(ev.detail.file);
        this.selectedFilesCount = this.selectedFiles.length;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <style>
                dbp-file-source.clean {
                    --FUBorderWidth: initial;
                    --FUBorderStyle: initial;
                    --FUBorderColor: initial;
                    --FUBorderColorHighlight: initial;
                    --FUBorderRadius: initial;
                    --FUMargin: initial;
                    --FUPadding: initial;
                    --FUWidth: initial;
                }
                dbp-file-source.opt {
                    --FUBorder: 2px solid blue;
                }
            </style>
 
            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <!-- <p>${unsafeHTML(i18n.t('required-server', { url: this.url}))}</p> -->
                </div>
                <div class="content">
                    <h2 class="subtitle">Selected files</h2>
                    ${this.getSelectedFilesHtml()}

                    <h2 class="subtitle">Send files via event</h2>

                    <p>There is no restriction for a specific file type:</p>
                    <button @click="${() => { this._("#file-source1").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source1"
                                     class="file-source"
                                     allowed-mime-types="*/*"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     lang="en"
                                     enabled-targets="local,nextcloud"></dbp-file-source>

                    <p>Only images are allowed here (JPG, PNG, GIF, TIF, ...):</p>
                    <button @click="${() => { this._("#file-source2").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source2" lang="en" url="${this.url}"
                                     class="file-source"
                                     allowed-mime-types="image/*"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-targets="local,nextcloud"
                                     text="Please select images"></dbp-file-source>

                    <p>This is for PDF only:</p>
                    <button @click="${() => { this._("#file-source3").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source3" lang="en" url="${this.url}"
                                     class="file-source"
                                     allowed-mime-types="application/pdf"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-targets="local,nextcloud"
                                     text="Submit only PDF files" button-label="PDF auswählen"></dbp-file-source>

                    <p>Text and images (JPG, PNG, GIF, TIF, ...) :</p>
                    <button @click="${() => { this._("#file-source4").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source4" lang="en" url="${this.url}"
                                     class="file-source"
                                     allowed-mime-types="text/plain,image/*"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-targets="local,nextcloud"
                                     text="Please select text or images"></dbp-file-source>

                    <p>PDFs also in ZIPS :</p>
                    <button @click="${() => { this._("#file-source5").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source5" lang="en" url="${this.url}"
                                     class="file-source"
                                     allowed-mime-types="application/pdf"
                                     decompress-zip
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-targets="local,nextcloud"
                                     text="Please select PDF(s) or ZIP(s) with PDF(s)"></dbp-file-source>

                    <dbp-file-sink lang="en"></dbp-file-sink>
               </div>
            </section>
        `;
    }

    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }
}

commonUtils.defineCustomElement('dbp-file-source-demo', FileSourceDemo);
