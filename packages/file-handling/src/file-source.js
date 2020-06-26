import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
// import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element';
import * as commonUtils from "vpu-common/utils";
import {Icon, MiniSpinner} from 'vpu-common';
import * as commonStyles from 'vpu-common/styles';
import {NextcloudFilePicker} from "./vpu-nextcloud-file-picker";
import {classMap} from 'lit-html/directives/class-map.js';


function mimeTypesToAccept(mimeTypes) {
    // Some operating systems can't handle mime types and
    // need file extensions, this tries to add them for some..
    let mapping = {
        'application/pdf': ['.pdf'],
        'application/zip': ['.zip'],
    };
    let accept = [];
    mimeTypes.split(',').forEach((mime) => {
        accept.push(mime);
        if (mime.trim() in mapping) {
            accept = accept.concat(mapping[mime.trim()]);
        }
    });
    return accept.join(',');
}


/**
 * KnowledgeBaseWebPageElementView web component
 */
export class FileSource extends ScopedElementsMixin(VPULitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.dropArea = null;
        this.allowedMimeTypes = '*/*';
        this.text = '';
        this.buttonLabel = '';
        this.disabled = false;
        this.decompressZip = false;
        this._queueKey = 0;
    }

    static get scopedElements() {
        return {
            'vpu-icon': Icon,
            'vpu-mini-spinner': MiniSpinner,
            'vpu-nextcloud-file-picker': NextcloudFilePicker,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            nextcloudAuthUrl: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavUrl: { type: String, attribute: 'nextcloud-web-dav-url' },
            text: { type: String },
            buttonLabel: { type: String, attribute: 'button-label' },
            disabled: { type: Boolean },
            decompressZip: { type: Boolean, attribute: 'decompress-zip' },
        };
    }


    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
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
        this.dropArea.classList.add('highlight')
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight')
    }

    handleDrop(e) {
        if (this.disabled) {
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

    /**
     * Handles files that were dropped to or selected in the component
     *
     * @param files
     * @returns {Promise<void>}
     */
    async handleFiles(files) {
        console.log('handleFiles: files.length = ' + files.length);
        // this.dispatchEvent(new CustomEvent("vpu-file-source-selection-start",
        //     { "detail": {}, bubbles: true, composed: true }));

        await commonUtils.asyncArrayForEach(files, async (file) => {
            if (file.size === 0) {
                console.log('file \'' + file.name + '\' has size=0 and is denied!')
                return;
            }

            // check if we want to decompress the zip and queue the contained files
            if (this.decompressZip && file.type === "application/zip") {
                // add decompressed files to tempFilesToHandle
                await commonUtils.asyncArrayForEach(
                    await this.decompressZIP(file), (file) => this.sendFileEvent(file));

                return;
            } else if (this.allowedMimeTypes && !this.checkFileType(file)) {
                return;
            }

            await this.sendFileEvent(file);
        });

        // this.dispatchEvent(new CustomEvent("vpu-file-source-selection-finished",
        //     { "detail": {}, bubbles: true, composed: true }));
    }

    /**
     * @param file
     */
    sendFileEvent(file) {
        const data = {"file": file};
        const event = new CustomEvent("vpu-file-source-file-selected", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    checkFileType(file) {
        // check if file is allowed
        const [fileMainType, fileSubType] = file.type.split('/');
        const mimeTypes = this.allowedMimeTypes.split(',');
        let deny = true;

        mimeTypes.forEach((str) => {
            const [mainType, subType] = str.split('/');
            deny = deny && ((mainType !== '*' && mainType !== fileMainType) || (subType !== '*' && subType !== fileSubType));
        });

        if (deny) {
            console.log(`mime type ${file.type} of file '${file.name}' is not compatible with ${this.allowedMimeTypes}`);

            return false;
        }

        return true;
    }

    /**
     * Decompress files synchronously
     *
     * @param file
     * @returns {Promise<[]>}
     */
    async decompressZIP(file) {
        // see: https://stuk.github.io/jszip/
        let JSZip = (await import('jszip/dist/jszip.js')).default;
        let filesToHandle = [];

        // load zip file
        await JSZip.loadAsync(file)
            .then(async (zip) => {
                // we are not using zip.forEach because we need to handle those files synchronously which
                // isn't supported by JSZip (see https://github.com/Stuk/jszip/issues/281)
                // using zip.files directly works great!
                await commonUtils.asyncObjectForEach(zip.files, async (zipEntry) => {
                    // skip directory entries
                    if (zipEntry.dir) {
                        return;
                    }

                    await zipEntry.async("blob")
                        .then(async (blob) => {
                            // get mime type of Blob, see https://github.com/Stuk/jszip/issues/626
                            const mimeType = await commonUtils.getMimeTypeOfFile(blob);

                            // create new file with name and mime type
                            const zipEntryFile = new File([blob], zipEntry.name, { type: mimeType });

                            // check mime type
                            if (!this.checkFileType(zipEntryFile)) {
                                return;
                            }

                            filesToHandle.push(zipEntryFile);
                        }, (e) => {
                            // handle the error
                            console.error("Decompressing of file in " + file.name + " failed: " + e.message);
                        });
                    });
            }, function (e) {
                // handle the error
                console.error("Loading of " + file.name + " failed: " + e.message);
            });

        return filesToHandle;
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

        const event = new CustomEvent("vpu-file-source-file-finished", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            #dropArea {
                border: var(--FUBorderWidth, 2px) var(--FUBorderStyle, dashed) var(--FUBBorderColor, black);
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

            #fileElem {
                display: none;
            }

            #nextcloud-file-picker {
                display: inline-block;
                margin-left: 8px;
            }

            #nextcloud-file-picker.hidden {
                display: none;
            }

            .block {
                margin-bottom: 10px;
            }
        `;
    }

    render() {
        let allowedMimeTypes = this.allowedMimeTypes;

        if (this.decompressZip) {
            allowedMimeTypes += ",application/zip";
        }

        return html`
            <div id="dropArea">
                <div>
                    <div class="block">
                        ${this.text || i18n.t('intro')}
                    </div>
                    <input ?disabled="${this.disabled}"
                           type="file"
                           id="fileElem"
                           multiple
                           accept="${mimeTypesToAccept(allowedMimeTypes)}"
                           name='file'>
                    <label class="button is-primary" for="fileElem" ?disabled="${this.disabled}">
                        ${this.buttonLabel || i18n.t('upload-label')}
                    </label>
                    <vpu-nextcloud-file-picker id="nextcloud-file-picker"
                                               class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                               ?disabled="${this.disabled}"
                                               lang="${this.lang}"
                                               auth-url="${this.nextcloudAuthUrl}"
                                               web-dav-url="${this.nextcloudWebDavUrl}"
                                               @vpu-nextcloud-file-picker-file-downloaded="${(event) => {
                                                   this.sendFileEvent(event.detail.file);
                                               }}"></vpu-nextcloud-file-picker>
                </div>
            </div>
        `;
    }
}