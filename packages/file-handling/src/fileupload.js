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
export class FileUpload extends ScopedElementsMixin(VPULitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.url = '';
        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.dropArea = null;
        this.allowedMimeTypes = '*/*';
        this.text = '';
        this.buttonLabel = '';
        this.uploadInProgress = false;
        this.multipleUploadInProgress = false;
        this.alwaysSendFile = false;
        this.isDeferred = false;
        this.queuedFiles = [];
        this.queuedFilesCount = 0;
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
            url: { type: String },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            nextcloudAuthUrl: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavUrl: { type: String, attribute: 'nextcloud-web-dav-url' },
            text: { type: String },
            buttonLabel: { type: String, attribute: 'button-label' },
            uploadInProgress: { type: Boolean, attribute: false },
            multipleUploadInProgress: { type: Boolean, attribute: false },
            alwaysSendFile: { type: Boolean, attribute: 'always-send-file' },
            isDeferred: { type: Boolean, attribute: 'deferred' },
            queuedFilesCount: { type: Number, attribute: false },
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
                case "queuedFilesCount":
                    const data = { "queuedFilesCount": this.queuedFilesCount, "queuedFiles": this.queuedFiles };
                    const event = new CustomEvent("vpu-fileupload-queued-files-changed",
                        { "detail": data, bubbles: true, composed: true });
                    this.dispatchEvent(event);
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
        if (this.uploadInProgress) {
            return;
        }

        this.dropArea.classList.add('highlight')
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight')
    }

    handleDrop(e) {
        if (this.uploadInProgress || this.disabled) {
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
        this.multipleUploadInProgress = true;

        this.dispatchEvent(new CustomEvent("vpu-fileupload-all-start",
            { "detail": {}, bubbles: true, composed: true }));

        // we need to copy the files to another array or else they will be gone in the setTimeout function!
        let tempFilesToHandle = [];
        await commonUtils.asyncArrayForEach(files, async (file) => {
            if (file.size === 0) {
                console.log('file \'' + file.name + '\' has size=0 and is denied!')
                return;
            }

            // check if we want to decompress the zip and queue the contained files
            if (this.decompressZip && file.type === "application/zip") {
                // add decompressed files to tempFilesToHandle
                tempFilesToHandle = tempFilesToHandle.concat(await this.decompressZIP(file));

                return;
            } else if (this.allowedMimeTypes && !this.checkFileType(file)) {
                return;
            }

            tempFilesToHandle.push(file);
        });

        // the browsers don't render updates to the dom while these files are handled!
        // if we set a small delay the dom changes will be rendered
        setTimeout(async () => {
            // we need to wait for each upload until we start the next one
            await commonUtils.asyncArrayForEach(tempFilesToHandle, async (file) =>
                this.isDeferred ? this.queueFile(file) : this.uploadFile(file));

            this.multipleUploadInProgress = false;

            this.dispatchEvent(new CustomEvent("vpu-fileupload-all-finished",
                { "detail": {}, bubbles: true, composed: true }));
        }, 100);
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
     * @returns {Promise<number>} key of the queued item
     */
    async queueFile(file) {
        this._queueKey++;
        const key = this._queueKey;
        this.queuedFiles[key] = file;
        this.updateQueuedFilesCount();

        const data = {"file": file};
        const event = new CustomEvent("vpu-fileupload-file-queued", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);

        return key;
    }

    /**
     * Takes a file off of the queue
     *
     * @param key
     */
    takeFileFromQueue(key) {
        const file = this.queuedFiles[key];
        delete this.queuedFiles[key];
        this.updateQueuedFilesCount();

        return file;
    }

    uploadOneQueuedFile() {
        const file = this.takeFileFromQueue();

        return this.uploadFile(file);
    }

    getQueuedFile(key) {
        return this.queuedFiles[key];
    }

    getQueuedFiles() {
        return this.queuedFiles;
    }

    clearQueuedFiles() {
        this.queuedFiles = [];
        this.queuedFilesCount = 0;
    }

    updateQueuedFilesCount() {
        return this.queuedFilesCount = Object.keys(this.queuedFiles).length;
    }

    getQueuedFilesCount() {
        return this.queuedFilesCount;
    }

    /**
     * @param file
     * @param params
     * @returns {Promise<void>}
     */
    async uploadFile(file, params = {}) {
        this.uploadInProgress = true;
        this.sendStartEvent(file);
        let url = new URL(this.url)
        url.search = new URLSearchParams(params).toString();
        let formData = new FormData();
        formData.append('file', file);

        // I got a 60s timeout in Google Chrome and found no way to increase that
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
                this.sendFinishedEvent(response, file, response.status !== 201 || this.alwaysSendFile);
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
            ${commonStyles.getButtonCSS()}

            .hidden { display: none; }

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
        `;
    }

    render() {
        let allowedMimeTypes = this.allowedMimeTypes;

        if (this.decompressZip) {
            allowedMimeTypes += ",application/zip";
        }

        return html`
            <div id="dropArea">
                <div title="${this.uploadInProgress ? i18n.t('upload-disabled-title') : ''}">
                    <p>${this.text || i18n.t('intro')}</p>
                    <input ?disabled="${this.uploadInProgress || this.disabled}"
                           type="file"
                           id="fileElem"
                           multiple
                           accept="${mimeTypesToAccept(allowedMimeTypes)}"
                           name='file'>
                    <vpu-nextcloud-file-picker class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                               ?disabled="${this.uploadInProgress || this.disabled}"
                                               lang="${this.lang}"
                                               auth-url="${this.nextcloudAuthUrl}"
                                               web-dav-url="${this.nextcloudWebDavUrl}"
                                               @vpu-nextcloud-file-picker-file-downloaded="${(event) => {
                                                   this.queueFile(event.detail.file);
                                               }}"></vpu-nextcloud-file-picker>
                    <label class="button is-primary" for="fileElem" ?disabled="${this.disabled}">
                        <vpu-icon style="display: ${this.uploadInProgress ? "inline-block" : "none"}" name="lock"></vpu-icon>
                        ${this.buttonLabel || i18n.t('upload-label')}
                    </label>
                    <vpu-mini-spinner style="display: ${this.multipleUploadInProgress ? "inline-block" : "none"}"></vpu-mini-spinner>
                </div>
            </div>
        `;
    }
}