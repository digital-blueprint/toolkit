import {createInstance} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from "@dbp-toolkit/common/utils";
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import {send as notify} from '@dbp-toolkit/common/notification';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {NextcloudFilePicker} from "./nextcloud-file-picker";
import {classMap} from 'lit-html/directives/class-map.js';
import MicroModal from './micromodal.es';
import * as fileHandlingStyles from './styles';
import {Clipboard} from "@dbp-toolkit/file-handling/src/clipboard";
import DbpFileHandlingLitElement from "./dbp-file-handling-lit-element";

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
 * FileSource web component
 */
export class FileSource extends ScopedElementsMixin(DbpFileHandlingLitElement) {
    constructor() {
        super();
        this.context = '';
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.nextcloudAuthUrl = '';
        this.nextcloudName ='Nextcloud';
        this.nextcloudWebDavUrl = '';
        this.nextcloudPath = '';
        this.nextcloudFileURL = '';
        this.dropArea = null;
        this.allowedMimeTypes = '*/*';
        this.enabledTargets = 'local';
        this.buttonLabel = '';
        this.disabled = false;
        this.decompressZip = false;
        this._queueKey = 0;
        this.activeTarget = 'local';
        this.isDialogOpen = false;
        this.firstOpen = true;
        this.nextcloudAuthInfo = '';

        this.initialFileHandlingState = {target: '', path: ''};
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-nextcloud-file-picker': NextcloudFilePicker,
            'dbp-clipboard': Clipboard,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            context: { type: String, attribute: 'context'},
            lang: { type: String },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            enabledTargets: { type: String, attribute: 'enabled-targets' },
            nextcloudAuthUrl: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavUrl: { type: String, attribute: 'nextcloud-web-dav-url' },
            nextcloudName: { type: String, attribute: 'nextcloud-name' },
            nextcloudFileURL: { type: String, attribute: 'nextcloud-file-url' },
            nextcloudAuthInfo: {type: String, attribute: 'nextcloud-auth-info'},
            buttonLabel: { type: String, attribute: 'button-label' },
            disabled: { type: Boolean },
            decompressZip: { type: Boolean, attribute: 'decompress-zip' },
            activeTarget: { type: String, attribute: 'active-target' },
            isDialogOpen: { type: Boolean, attribute: 'dialog-open' },

            initialFileHandlingState: {type: Object, attribute: 'initial-file-handling-state'},
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    this._i18n.changeLanguage(this.lang);
                    break;
                case "enabledTargets":
                    if (!this.hasEnabledSource(this.activeTarget)) {
                        this.activeTarget = this.enabledTargets.split(",")[0];
                    }
                    break;
                case "isDialogOpen":
                    if (this.isDialogOpen) {
                        // this.setAttribute("dialog-open", "");
                        this.openDialog();
                    } else {
                        this.removeAttribute("dialog-open");
                        // this.closeDialog();
                    }
                    break;
                case "initialFileHandlingState":
                    //check if default destination is set
                    if (this.firstOpen) {
                        this.nextcloudPath = this.initialFileHandlingState.path;
                    }
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
                this.dropArea.addEventListener(eventName, this.preventDefaults, false);
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.highlight.bind(this), false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.unhighlight.bind(this), false);
            });
            this.dropArea.addEventListener('drop', this.handleDrop.bind(this), false);
            this._('#fileElem').addEventListener('change', this.handleChange.bind(this));

            this._('nav.modal-nav').addEventListener("scroll", this.handleScroll.bind(this));

            this._('.right-paddle').addEventListener("click", this.handleScrollRight.bind(this, this._('nav.modal-nav')));

            this._('.left-paddle').addEventListener("click", this.handleScrollLeft.bind(this, this._('nav.modal-nav')));
        });

    }

    disconnectedCallback() {

        super.disconnectedCallback();
    }



    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        this.dropArea.classList.add('highlight');
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight');
    }

    handleDrop(e) {
        if (this.disabled) {
            return;
        }

        let dt = e.dataTransfer;
        // console.dir(dt);
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
        // console.log('handleFiles: files.length = ' + files.length);
        // this.dispatchEvent(new CustomEvent("dbp-file-source-selection-start",
        //     { "detail": {}, bubbles: true, composed: true }));

        await commonUtils.asyncArrayForEach(files, async (file) => {
            if (file.size === 0) {
                console.log('file \'' + file.name + '\' has size=0 and is denied!');
                return;
            }

            // check if we want to decompress the zip and queue the contained files
            if (this.decompressZip
                && (file.type === "application/zip" || file.type === "application/x-zip-compressed")) {
                // add decompressed files to tempFilesToHandle
                await commonUtils.asyncArrayForEach(
                    await this.decompressZIP(file), (file) => this.sendFileEvent(file));

                return;
            } else if (this.allowedMimeTypes && !this.checkFileType(file)) {
                return;
            }

            await this.sendFileEvent(file);
        });

        // this.dispatchEvent(new CustomEvent("dbp-file-source-selection-finished",
        //     { "detail": {}, bubbles: true, composed: true }));
        const event = new CustomEvent("dbp-file-source-file-upload-finished", { "detail": {count: files.length}, bubbles: true, composed: true });
        this.dispatchEvent(event);
        this.closeDialog();
    }

    /**
     * @param file
     */
    sendFileEvent(file) {
        this.sendSource();
        MicroModal.close(this._('#modal-picker'));
        const data = {"file": file};
        const event = new CustomEvent("dbp-file-source-file-selected", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    sendSource() {
        let data = {};
        if (this.activeTarget == 'nextcloud') {
            data = {"target": this.activeTarget, "path": this._("#nextcloud-file-picker").directoryPath};

        } else {
            data = {"target": this.activeTarget};
        }

        this.sendSetPropertyEvent('initial-file-handling-state', data);
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

    hasEnabledSource(source) {
        return this.enabledTargets.split(',').includes(source);
    }

    /**
     * Decompress files synchronously
     *
     * @param file
     * @returns {Promise<Array>}
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

        // no suitable files found
        if (filesToHandle.length === 0) {
            const i18n = this._i18n;
            console.error('ZIP file does not contain any files of ' + this.allowedMimeTypes);
            //throw new Error('ZIP file does not contain any files of ' + this.allowedMimeTypes);
            notify({
                "summary": i18n.t('file-source.no-usable-files-in-zip'),
                "body": i18n.t('file-source.no-usable-files-hint') + this.allowedMimeTypes,
                "type": 'danger',
                "timeout": 0,
            });
        }
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
        } catch (e) {
            //
        }

        if (sendFile) {
            data.file = file;
        }

        const event = new CustomEvent("dbp-file-source-file-finished", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    loadWebdavDirectory() {
        const filePicker = this._('#nextcloud-file-picker');
        // check if element is already in the dom (for example if "dialog-open" attribute is set)
        if (filePicker) {
            filePicker.checkSessionStorage().then(contents => {
                if (filePicker.webDavClient !== null) {
                    filePicker.loadDirectory(filePicker.directoryPath);
                }
            });
        }

    }

    openDialog() {

        if (this.enabledTargets.includes('nextcloud')) {
            this.loadWebdavDirectory();
        }

        if (this.enabledTargets.includes('clipboard') && this._("#clipboard-file-picker")) {
            this._("#clipboard-file-picker").generateClipboardTable();
        }

        const filePicker = this._('#modal-picker');

        // check if element is already^ in the dom (for example if "dialog-open" attribute is set)
        if (filePicker) {
            MicroModal.show(filePicker, {
                disableScroll: true,
                onClose: modal => {
                    this.isDialogOpen = false;

                    const filePicker = this._('#nextcloud-file-picker');

                    if (filePicker) {
                        filePicker.selectAllButton = true;}
                    }
            });
        }


        //check if default source is set
        if (this.initialFileHandlingState.target !== '' && typeof this.initialFileHandlingState.target !== 'undefined' && this.firstOpen) {
            this.activeDestination = this.initialFileHandlingState.target;
            this.nextcloudPath = this.initialFileHandlingState.path;
            const filePicker = this._('#nextcloud-file-picker');

            if (filePicker && filePicker.webDavClient !== null) {
                filePicker.loadDirectory(this.initialFileHandlingState.path);
                //console.log("load default nextcloud source", this.initialFileHandlingState.target);
            }
            this.firstOpen = false;
        }
    }

    closeDialog() {
        this.sendSource();
        if (this.enabledTargets.includes('nextcloud')) {
            const filePicker = this._('#nextcloud-file-picker');
            if (filePicker && filePicker.tabulatorTable) {

                filePicker.tabulatorTable.deselectRow();
                if (filePicker._('#select_all')) {
                    filePicker._("#select_all").checked = false;
                }
            }
        }

        if (this.enabledTargets.includes('clipboard')) {
            const filePicker = this._('#clipboard-file-picker');
            if (filePicker && filePicker.tabulatorTable) {
                filePicker.tabulatorTable.deselectRow();
                if (filePicker._('#select_all')) {
                    filePicker._("#select_all").checked = false;
                }
            }
        }
        MicroModal.close(this._('#modal-picker'));
    }

    getClipboardHtml() {
        if (this.enabledTargets.includes('clipboard')) {
            return html`
                <dbp-clipboard 
                   id="clipboard-file-picker"
                   mode="file-source"
                   subscribe="clipboard-files:clipboard-files"
                   lang="${this.lang}"
                   auth-url="${this.nextcloudAuthUrl}"
                   enabled-targets="${this.enabledTargets}"
                   nextcloud-auth-url="${this.nextcloudAuthUrl}"
                   nextcloud-web-dav-url="${this.nextcloudWebDavUrl}"
                   nextcloud-name="${this.nextcloudName}"
                   nextcloud-file-url="${this.nextcloudFileURL}"
                   allowed-mime-types="${this.allowedMimeTypes}"
                   @dbp-clipboard-file-picker-file-downloaded="${(event) => {
                    this.sendFileEvent(event.detail.file);}}">
                </dbp-clipboard>`;
        }
        return html``;
    }

    getNextcloudHtml() {
        if (this.enabledTargets.includes('nextcloud') && this.nextcloudWebDavUrl !== "" && this.nextcloudAuthUrl !== "") {
            return html`
                <dbp-nextcloud-file-picker id="nextcloud-file-picker"
                   class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                   ?disabled="${this.disabled}"
                   lang="${this.lang}"
                   subscribe="html-overrides"
                   auth-url="${this.nextcloudAuthUrl}"
                   web-dav-url="${this.nextcloudWebDavUrl}"
                   nextcloud-name="${this.nextcloudName}"
                   nextcloud-file-url="${this.nextcloudFileURL}"
                   auth-info="${this.nextcloudAuthInfo}"
                   allowed-mime-types="${this.allowedMimeTypes}"
                   @dbp-nextcloud-file-picker-file-downloaded="${(event) => {
                    this.sendFileEvent(event.detail.file);}}">
                </dbp-nextcloud-file-picker>`;
        }
        return html``;
    }




    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            ${commonStyles.getModalDialogCSS()}
            ${fileHandlingStyles.getFileHandlingCss()}

           

            p {
                margin-top: 0;
            }
            
            .block {
                margin-bottom: 10px;
            }
            
            #dropArea {
                border: var(--FUBorderWidth, 2px) var(--FUBorderStyle, dashed) var(--FUBBorderColor, black);
                border-radius: var(--FUBorderRadius, 0);
                width: auto;
                margin: var(--FUMargin, 0px);
                padding: var(--FUPadding, 20px);
                flex-grow: 1;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
    
            #dropArea.highlight {
                border-color: var(--FUBorderColorHighlight, purple);
            }
            
            #clipboard-file-picker{
                width: 100%;
                height: 100%;
            }
            
            .paddle {
                position: absolute;
                background-color: #ffffffd1;
                top: 0px;
                padding: 0px 5px;
                box-sizing: content-box;
                height: 100%;
            }
            
            .right-paddle{
                right: 0px;
            }

            .left-paddle{
                left: 0px;
            }
            
            .nav-wrapper{
                position: relative;
                display: block;
                overflow-x: auto;
                border:none;
            }
            
            .paddles{
                display: none;
            }
            
            .modal-nav{
                height: 100%;
            }


            @media only screen
            and (orientation: portrait)
            and (max-width: 768px) {
                #dropArea{
                    height: 100%;
                }
                
                .paddles{
                    display: inherit;
                }
            
            }
        `;
    }

    render() {
        const i18n = this._i18n;
        let allowedMimeTypes = this.allowedMimeTypes;

        if (this.decompressZip && this.allowedMimeTypes !== "*/*") {
            allowedMimeTypes += ",application/zip,application/x-zip-compressed";
        }


        return html`
<!--
            <button class="button"
                ?disabled="${this.disabled}"
                @click="${() => { this.openDialog(); }}">${i18n.t('file-source.open-menu')}</button>
-->
            <div class="modal micromodal-slide" id="modal-picker" aria-hidden="true">
                <div class="modal-overlay" tabindex="-1" data-micromodal-close>
                    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-picker-title">
                        <div class="nav-wrapper modal-nav">
                            <nav class="modal-nav">
                                <div title="${i18n.t('file-source.nav-local')}"
                                     @click="${() => { this.activeTarget = "local"; }}"
                                     class="${classMap({"active": this.activeTarget === "local", hidden: !this.hasEnabledSource("local")})}">
                                    <dbp-icon class="nav-icon" name="laptop"></dbp-icon>
                                    <p>${i18n.t('file-source.nav-local')}</p>
                                </div>
                                <div title="Nextcloud"
                                     @click="${() => { this.activeTarget = "nextcloud";}}"
                                     class="${classMap({"active": this.activeTarget === "nextcloud", hidden: !this.hasEnabledSource("nextcloud") || this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}">
                                    <dbp-icon class="nav-icon" name="cloud"></dbp-icon>
                                    <p> ${this.nextcloudName} </p>
                                </div>
                                <div title="${i18n.t('file-source.clipboard')}"
                                     @click="${() => { this.activeTarget = "clipboard"; }}"
                                     class="${classMap({"active": this.activeTarget === "clipboard", hidden: !this.hasEnabledSource("clipboard") })}">
                                    <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                                    <p>${i18n.t('file-source.clipboard')}</p>
                                </div>
                            </nav>
                            <div class="paddles">
                                <dbp-icon class="left-paddle paddle hidden" name="chevron-left" class="close-icon"></dbp-icon>
                                <dbp-icon class="right-paddle paddle" name="chevron-right" class="close-icon"></dbp-icon>
                            </div>
                        </div>
                        <div class="modal-header">
                            <button title="${i18n.t('file-source.modal-close')}" class="modal-close"  aria-label="Close modal"  @click="${() => {this.closeDialog();}}">
                                    <dbp-icon name="close" class="close-icon"></dbp-icon>
                            </button>
                       
                            <p class="modal-context"> ${this.context}</p>
                        </div>
                        <main class="modal-content" id="modal-picker-content">
                            
                            <div class="source-main ${classMap({"hidden": this.activeTarget !== "local"})}">
                                <div id="dropArea">
                                    <div class="block">
                                        <p>${i18n.t('intro')}</p>
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
                                </div>
                            </div>
                            <div class="source-main ${classMap({"hidden": this.activeTarget !== "nextcloud" || this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}">
                                ${this.getNextcloudHtml()}
                            </div>
                            <div class="source-main ${classMap({"hidden": (this.activeTarget !== "clipboard")})}">
                                ${this.getClipboardHtml()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
          `;
    }
}