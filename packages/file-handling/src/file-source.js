import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonUtils from "@dbp-toolkit/common/utils";
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import {send as notify} from '@dbp-toolkit/common/notification';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {NextcloudFilePicker} from "./dbp-nextcloud-file-picker";
import {classMap} from 'lit-html/directives/class-map.js';
import MicroModal from './micromodal.es';
import * as fileHandlingStyles from './styles';
import Tabulator from "tabulator-tables";
import {humanFileSize} from "@dbp-toolkit/common/i18next";
import {name as pkgName} from "../package.json";

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
export class FileSource extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.context = '';
        this.lang = 'de';
        this.nextcloudAuthUrl = '';
        this.nextcloudName ='Nextcloud';
        this.nextcloudWebDavUrl = '';
        this.nextcloudPath = '';
        this.nextcloudFileURL = '';
        this.dropArea = null;
        this.allowedMimeTypes = '*/*';
        this.enabledTargets = 'local';
        this.text = '';
        this.buttonLabel = '';
        this.disabled = false;
        this.decompressZip = false;
        this._queueKey = 0;
        this.activeTarget = 'local';
        this.isDialogOpen = false;
        this.firstOpen = true;
        this.tabulatorTable = null;
        this.maxSelectedItems = true;
        this.showSelectAllButton = true;
        this.clipboardSelectBtnDisabled = true;
        this.showClipboard = false;

        this.initialFileHandlingState = {target: '', path: ''};
        this.clipboardFiles = {files: ''};
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-nextcloud-file-picker': NextcloudFilePicker,
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
            text: { type: String },
            buttonLabel: { type: String, attribute: 'button-label' },
            disabled: { type: Boolean },
            decompressZip: { type: Boolean, attribute: 'decompress-zip' },
            activeTarget: { type: String, attribute: 'active-target' },
            isDialogOpen: { type: Boolean, attribute: 'dialog-open' },
            showSelectAllButton: { type: Boolean, attribute: true },
            clipboardSelectBtnDisabled: { type: Boolean, attribute: true },
            showClipboard: { type: Boolean, attribute: 'show-clipboard' },

            initialFileHandlingState: {type: Object, attribute: 'initial-file-handling-state'},
            clipboardFiles: {type: Object, attribute: 'clipboard-files'},

        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
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
                case "clipboardFiles":
                    this.generateClipboardTable();
                    break;

            }
        });
        super.update(changedProperties);

    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
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

            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new Tabulator(this._("#clipboard-content-table"), {
                layout: "fitColumns",
                selectable: this.maxSelectedItems,
                selectableRangeMode: "drag",
                responsiveLayout: true,
                placeholder: i18n.t('nextcloud-file-picker.no-data-type'),
                resizableColumns:false,
                columns: [
                    {title: "", field: "type", align:"center", headerSort:false, width:50, responsive:1, formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag =  that.constructor.getScopedTagName("dbp-icon");
                            let icon = `<${icon_tag} name="empty-file" class="nextcloud-picker-icon"></${icon_tag}>`;
                            return icon;
                        }},
                    {title: i18n.t('nextcloud-file-picker.filename'), responsive: 0, widthGrow:5,  minWidth: 150, field: "name", sorter: "alphanum",
                        formatter: (cell) => {
                            let data = cell.getRow().getData();
                            if (data.edit) {
                                cell.getElement().classList.add("fokus-edit");
                            }
                            return cell.getValue();
                        }},
                    {title: i18n.t('nextcloud-file-picker.size'), responsive: 4, widthGrow:1, minWidth: 50, field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());
                        }},
                    {title: i18n.t('nextcloud-file-picker.mime-type'), responsive: 2, widthGrow:1, minWidth: 20, field: "type", formatter: (cell, formatterParams, onRendered) => {
                            if (typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }},
                    {title: i18n.t('nextcloud-file-picker.last-modified'), responsive: 3, widthGrow:1, minWidth: 150, field: "lastModified",sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
                        }, formatter:function(cell, formatterParams, onRendered) {
                            const timestamp = new Date(cell.getValue());
                            const year = timestamp.getFullYear();
                            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ("0" + timestamp.getDate()).slice(-2);
                            const hours = ("0" + timestamp.getHours()).slice(-2);
                            const minutes = ("0" + timestamp.getMinutes()).slice(-2);
                            return date + "." + month + "." + year + " " + hours + ":" + minutes;
                        }},
                    {title: "file", field: "file", visible: false}
                ],
                initialSort:[
                    {column:"name", dir:"asc"},
                    {column:"type", dir:"asc"},
                ],
                rowClick: (e, row) => {
                    if (this.tabulatorTable !== null
                        && this.tabulatorTable.getSelectedRows().length === this.tabulatorTable.getRows().filter(row => this.checkFileType(row.getData())).length) {
                        this.showSelectAllButton = false;
                    } else {
                        this.showSelectAllButton = true;
                    }
                },
                rowSelectionChanged: (data, rows) => {
                    if (this.tabulatorTable && this.tabulatorTable.getSelectedRows().length > 0) {
                        this.clipboardSelectBtnDisabled = false;
                    } else {
                        this.clipboardSelectBtnDisabled = true;
                    }
                }
            });
        });
    }
    

    /**
     * Select all files from tabulator table
     *
     */
    selectAll() {
        this.tabulatorTable.selectRow(this.tabulatorTable.getRows().filter(row => this.checkFileType(row.getData())));
        if (this.tabulatorTable.getSelectedRows().length > 0) {
            this.showSelectAllButton = false;
            console.log("Show Select All Button:", this.showSelectAllButton);
        }
    }

    /**
     * Deselect files from tabulator table
     *
     */
    deselectAll() {
        this.tabulatorTable.deselectRow();
        this.showSelectAllButton = true;
        console.log("Show Select All Button:", this.showSelectAllButton);
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
        if (filePicker && filePicker.webDavClient !== null) {
            filePicker.loadDirectory(filePicker.directoryPath);
        }
    }

    openDialog() {
        if (this.enabledTargets.includes('nextcloud')) {
            this.loadWebdavDirectory();
        }

        const filePicker = this._('#modal-picker');

        // check if element is already^ in the dom (for example if "dialog-open" attribute is set)
        if (filePicker) {
            MicroModal.show(filePicker, {
                disableScroll: true,
                onClose: modal => { this.isDialogOpen = false;
                    this._('#nextcloud-file-picker').selectAllButton = true;}
            });
        }


        //check if default source is set
        if (this.initialFileHandlingState.target !== '' && typeof this.initialFileHandlingState.target !== 'undefined' && this.firstOpen) {
            this.activeDestination = this.initialFileHandlingState.target;
            this.nextcloudPath = this.initialFileHandlingState.path;
            if (this._('#nextcloud-file-picker').webDavClient !== null) {
                this._('#nextcloud-file-picker').loadDirectory(this.initialFileHandlingState.path);
                //console.log("load default nextcloud source", this.initialFileHandlingState.target);
            }
            this.firstOpen = false;
        }
    }

    closeDialog() {
        this.sendSource();
        this._('#nextcloud-file-picker').selectAllButton = true;
        MicroModal.close(this._('#modal-picker'));
    }



    generateClipboardTable() {
        let data = [];
        for (let i = 0; i < this.clipboardFiles.files.length; i++){
            data[i] = {
                name: this.clipboardFiles.files[i].name,
                size: this.clipboardFiles.files[i].size,
                type: this.clipboardFiles.files[i].type,
                lastModified: this.clipboardFiles.files[i].lastModified,
                file: this.clipboardFiles.files[i]
            };
        }

        if (this.tabulatorTable !== null){
            this.tabulatorTable.clearData();
            this.tabulatorTable.setData(data);
        }
    }


    async sendClipboardFiles(files) {

        for(let i = 0; i < files.length; i ++)
        {
            await this.sendFileEvent(files[i].file);
        }
        this.tabulatorTable.deselectRow();
        this.closeDialog();

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
            }
    
            #dropArea.highlight {
                border-color: var(--FUBorderColorHighlight, purple);
            }

            .clipboard-container{
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: var(--FUPadding, 20px);
                width: 100%;
                height: 100%;
                position: relative;
            }

            .clipboard-container .wrapper{
                overflow-y: auto;
                text-align: center;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .clipboard-container .wrapper .inner{
                overflow-y: auto;
                text-align: center;
                width: 100%;
            }
            
            .clipboard-footer{
                align-self: end;
            }
            
            #select-all-wrapper{
                text-align: right;
            }
            
            
             @media only screen
            and (orientation: portrait)
            and (max-device-width: 800px) {
                #dropArea{
                    height: 100%;
                }
            
            }
            
        `;
    }

    render() {
        let allowedMimeTypes = this.allowedMimeTypes;
        const isClipboardHidden = !this.showClipboard;

        if (this.decompressZip) {
            allowedMimeTypes += ",application/zip,application/x-zip-compressed";
        }

        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');

        return html`
<!--
            <button class="button"
                ?disabled="${this.disabled}"
                @click="${() => { this.openDialog(); }}">${i18n.t('file-source.open-menu')}</button>
-->
            <div class="modal micromodal-slide" id="modal-picker" aria-hidden="true">
                <link rel="stylesheet" href="${tabulatorCss}">
                <div class="modal-overlay" tabindex="-1" data-micromodal-close>
                    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-picker-title">
                        <nav class="modal-nav">
                            <div title="${i18n.t('file-source.nav-local')}"
                                 @click="${() => { this.activeTarget = "local"; }}"
                                 class="${classMap({"active": this.activeTarget === "local", hidden: !this.hasEnabledSource("local")})}">
                                <dbp-icon class="nav-icon" name="laptop"></dbp-icon>
                                <p>${i18n.t('file-source.nav-local')}</p>
                            </div>
                            <div title="Nextcloud"
                                 @click="${() => { this.activeTarget = "nextcloud"; this.loadWebdavDirectory();}}"
                                 class="${classMap({"active": this.activeTarget === "nextcloud", hidden: !this.hasEnabledSource("nextcloud") || this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}">
                                <dbp-icon class="nav-icon" name="cloud"></dbp-icon>
                                <p> ${this.nextcloudName} </p>
                            </div>
                            <div title="Clipboard"
                                 @click="${() => { this.activeTarget = "clipboard"; }}"
                                 class="${classMap({"active": this.activeTarget === "clipboard", hidden: !this.hasEnabledSource("clipboard") || isClipboardHidden })}">
                                <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                                <p>Clipboard</p>
                            </div>
                            
                        </nav>
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
                                        <p>${this.text || i18n.t('intro')}</p>
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
                                <dbp-nextcloud-file-picker id="nextcloud-file-picker"
                                       class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                       ?disabled="${this.disabled}"
                                       lang="${this.lang}"
                                       auth-url="${this.nextcloudAuthUrl}"
                                       web-dav-url="${this.nextcloudWebDavUrl}"
                                       nextcloud-name="${this.nextcloudName}"
                                       nextcloud-file-url="${this.nextcloudFileURL}"
                                       allowed-mime-types="${this.allowedMimeTypes}"
                                       @dbp-nextcloud-file-picker-file-downloaded="${(event) => {
                                    this.sendFileEvent(event.detail.file);
                                }}"></dbp-nextcloud-file-picker>
                            </div>
                            <div class="source-main ${classMap({"hidden": (this.activeTarget !== "clipboard" || isClipboardHidden)})}">
                                <div class="block clipboard-container">
                                    <div class="wrapper">
                                        <div class="inner">
                                            <h3>${i18n.t('file-source.clipboard-title')}</h3>
                                            <p>${i18n.t('file-source.clipboard-body')}<br><br></p>
                                            <p class="${classMap({"hidden": this.clipboardFiles.files.length !== 0})}">${i18n.t('file-source.clipboard-no-files')}</p>
                                            <div class="clipboard-table ${classMap({"hidden": this.clipboardFiles.files.length === 0})}">
                                                <div id="select-all-wrapper">
                                                    <button class="button ${classMap({"hidden": !this.showSelectAllButton})}"
                                                            title="${i18n.t('nextcloud-file-picker.select-all-title')}"
                                                            @click="${() => { this.selectAll(); }}">
                                                            ${i18n.t('nextcloud-file-picker.select-all')}
                                                    </button>
                                                    <button class="button ${classMap({"hidden": this.showSelectAllButton})}"
                                                            title="${i18n.t('nextcloud-file-picker.select-nothing-title')}"
                                                            @click="${() => { this.deselectAll(); }}">
                                                            ${i18n.t('nextcloud-file-picker.select-nothing')}
                                                    </button>
                                                </div>
                                                <table id="clipboard-content-table" class="force-no-select"></table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clipboard-footer  ${classMap({"hidden": this.clipboardFiles.files.length === 0 })}">
                                        <button class="button select-button is-primary" ?disabled="${ this.clipboardSelectBtnDisabled }"
                                                @click="${() => { this.sendClipboardFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
          `;
    }
}