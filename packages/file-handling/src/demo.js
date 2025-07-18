import {createInstance} from './i18n';
import {html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {FileSource} from './file-source';
import {FileSink} from './file-sink';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class FileSourceDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.auth = {};
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;

        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.nextcloudName = 'Nextcloud';
        this.nextcloudFileURL = '';
    }

    static get scopedElements() {
        return {
            'dbp-file-source': FileSource,
            'dbp-file-sink': FileSink,
        };
    }

    static get properties() {
        return {
            url: {type: String},
            selectedFiles: {type: Array, attribute: false},
            selectedFilesCount: {type: Number, attribute: false},
            auth: {type: Object},
            nextcloudAuthUrl: {type: String, attribute: 'nextcloud-auth-url'},
            nextcloudWebDavUrl: {type: String, attribute: 'nextcloud-web-dav-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
        };
    }

    update(changedProperties) {
        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.shadowRoot.querySelectorAll('.file-source').forEach((element) => {
                // TODO: remove orphaned event listeners
                element.addEventListener(
                    'dbp-file-source-file-selected',
                    this.addLogEntry.bind(this),
                );
            });
        });
    }

    authenticated() {
        return (this.auth.token || '') !== '';
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

        let base = html`
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
                </div>
                <div class="content">
                    <h2 class="subtitle">Selected files</h2>
                    ${this.getSelectedFilesHtml()}

                    <h2 class="subtitle">Send files via event</h2>

                    <p>There is no restriction for a specific file type:</p>
                    <button
                        @click="${() => {
                            this._('#file-source1').setAttribute('dialog-open', '');
                        }}"
                        class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source
                        id="file-source1"
                        class="file-source"
                        allowed-mime-types="*/*"
                        subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                        lang="en"
                        enabled-targets="local,nextcloud"></dbp-file-source>

                    <p>Only images are allowed here (JPG, PNG, GIF, TIF, ...):</p>
                    <button
                        @click="${() => {
                            this._('#file-source2').setAttribute('dialog-open', '');
                        }}"
                        class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source
                        id="file-source2"
                        lang="en"
                        url="${this.url}"
                        class="file-source"
                        allowed-mime-types="image/*"
                        subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                        enabled-targets="local,nextcloud"></dbp-file-source>

                    <p>This is for PDF only:</p>
                    <button
                        @click="${() => {
                            this._('#file-source3').setAttribute('dialog-open', '');
                        }}"
                        class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source
                        id="file-source3"
                        lang="en"
                        url="${this.url}"
                        class="file-source"
                        allowed-mime-types="application/pdf"
                        subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                        enabled-targets="local,nextcloud"
                        button-label="PDF auswählen"></dbp-file-source>

                    <p>Text and images (JPG, PNG, GIF, TIF, ...) :</p>
                    <button
                        @click="${() => {
                            this._('#file-source4').setAttribute('dialog-open', '');
                        }}"
                        class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source
                        id="file-source4"
                        lang="en"
                        url="${this.url}"
                        class="file-source"
                        allowed-mime-types="text/plain,image/*"
                        subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                        enabled-targets="local,nextcloud"></dbp-file-source>

                    <p>PDFs also in ZIPS :</p>
                    <button
                        @click="${() => {
                            this._('#file-source5').setAttribute('dialog-open', '');
                        }}"
                        class="button is-primary">
                        Open dialog
                    </button>
                    <dbp-file-source
                        id="file-source5"
                        lang="en"
                        url="${this.url}"
                        class="file-source"
                        allowed-mime-types="application/pdf"
                        decompress-zip
                        subscribe="nextcloud-auth-url:nextcloud-auth-url,nextcloud-web-dav-url:nextcloud-web-dav-url,nextcloud-name:nextcloud-name,nextcloud-file-url:nextcloud-file-url"
                        enabled-targets="local,nextcloud"></dbp-file-source>

                    <p>Download uploaded files :</p>
                    <button
                        @click="${() => {
                            this._('#file-sink').files = this.selectedFiles;
                        }}"
                        class="button is-primary">
                        Open download dialog
                    </button>
                    <dbp-file-sink id="file-sink" lang="en"></dbp-file-sink>
                </div>
            </section>
        `;

        let streamHtml = html`
            <br />
            <br />
            <h2 class="subtitle">Client-side streamed zip downloads</h2>
            <p>
                This is a demo for zip downloads where the zip is created in a RAM-friendly way on
                the client-side.
            </p>
            <p>
                Every input field shown below corresponds to a svg file, just for demonstration
                purposes.
                <br />
                A input field expects some kind of file name or directory structure (as shown by the
                placeholder) which will be used in the zip file
            </p>
            <p>Define the zip directory structure of a streamed download:</p>
            <form id="inputs-list">
                <input placeholder="dir/filename.svg" required />
                <br />
                <br />
            </form>
            <button
                @click="${() => {
                    let input = document.createElement('input');
                    let br1 = document.createElement('br');
                    let br2 = document.createElement('br');
                    input.placeholder = 'dir/filename.svg';
                    input.required = true;
                    let parent = this.shadowRoot.getElementById('inputs-list');
                    parent.appendChild(input);
                    parent.appendChild(br1);
                    parent.appendChild(br2);
                }}"
                class="button is-primary">
                Add new input field
            </button>
            <p>Download the zip:</p>
            <button
                @click="${() => {
                    let logo = document.getElementsByClassName('logo-light')[0].src;
                    let files = [];
                    let inputsParent = this.parentNode
                        .querySelector('#demo')
                        .shadowRoot.querySelector('#inputs-list');
                    let valid = inputsParent.checkValidity();
                    if (valid) {
                        while (inputsParent.hasChildNodes()) {
                            if (
                                inputsParent.firstChild.tagName === 'INPUT' &&
                                inputsParent.firstChild.value !== ''
                            ) {
                                let path = inputsParent.firstChild.value;
                                files.push({name: path, url: logo});
                            }
                            inputsParent.firstChild.remove();
                        }
                        this._('#file-sink1').files = files;
                    }
                }}"
                class="button is-primary">
                Open download dialog
            </button>
            <dbp-file-sink id="file-sink1" lang="en" streamed></dbp-file-sink>
        `;

        let end = html`
                </div>
            </section>
        `;

        if (!this.authenticated()) {
            return html`
                ${base}
                <p><b>Please login to see the client-side streaming demo!</b></p>
                ${end}
            `;
        } else {
            return html`
                ${base}${streamHtml}${end}
            `;
        }
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }
}

commonUtils.defineCustomElement('dbp-file-source-demo', FileSourceDemo);
