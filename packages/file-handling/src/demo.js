import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {FileSource} from './file-source.js';
import {FileSink} from './file-sink.js';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class FileSourceDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
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
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.shadowRoot.querySelectorAll('dbp-file-source')
                .forEach(element => {
                    element.addEventListener('dbp-file-source-file-finished', this.addLogEntry.bind(this));
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
                    <p>${unsafeHTML(i18n.t('required-server', { url: this.url}))}</p>
                </div>
                <div class="content">
                    <h2 class="subtitle">Send files via event</h2>
                    <p>There is no restriction for a specific file type:</p>
                    <button @click="${() => { this._("#file-source1").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source1"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     lang="en"
                                     enabled-sources="local,nextcloud"
                                     allowed-mime-types="*/*"></dbp-file-source>
                    <p>Only images are allowed here (JPG, PNG, GIF, TIF, ...):</p>
                    <button @click="${() => { this._("#file-source2").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source2" lang="en" url="${this.url}" allowed-mime-types="image/*"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-sources="local,nextcloud"
                                     text="Please select images"></dbp-file-source>
                    <p>This is for PDF only:</p>
                    <button @click="${() => { this._("#file-source3").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source3" lang="en" url="${this.url}" allowed-mime-types="application/pdf"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-sources="local,nextcloud"
                                     text="Einreichung als PDF" button-label="PDF auswählen"></dbp-file-source>
                     <p>Text and images (JPG, PNG, GIF, TIF, ...) :</p>
                    <button @click="${() => { this._("#file-source4").setAttribute("dialog-open", ""); }}"
                            class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source id="file-source4" lang="en" url="${this.url}" allowed-mime-types="text/plain,image/*"
                                     subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                                     enabled-sources="local,nextcloud"
                                     text="Please select text or images"></dbp-file-source>

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
