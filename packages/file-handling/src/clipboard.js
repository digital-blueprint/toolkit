import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as fileHandlingStyles from '@dbp-toolkit/file-handling/src/styles';
import {Icon} from '@dbp-toolkit/common';
import Tabulator from "tabulator-tables";
import {humanFileSize} from "@dbp-toolkit/common/i18next";
import {FileSink} from "@dbp-toolkit/file-handling/src/file-sink";
import {FileSource} from "@dbp-toolkit/file-handling/src/file-source";
import {name as pkgName} from "@dbp-toolkit/file-handling/package.json";
import {send} from "@dbp-toolkit/common/notification";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";


export class Clipboard extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.allowedMimeTypes = '*/*';
        this.clipboardFiles = {files: ''};
        this.clipboardSelectBtnDisabled = true;
        this.tabulatorTable = null;
        this._onReceiveBeforeUnload = this.onReceiveBeforeUnload.bind(this);
        this.filesToSave = [];
        this.numberOfSelectedFiles = 0;
        this.showAdditionalButtons = false;
        this.enabledTargets = 'local';

        this.nextcloudWebAppPasswordURL = "";
        this.nextcloudWebDavURL = "";
        this.nextcloudName = "";
        this.nextcloudFileURL = "";

        this.isFileSource = false;
        this.isFileSink = false;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-file-sink': FileSink,
            'dbp-file-source': FileSource,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            clipboardSelectBtnDisabled: { type: Boolean, attribute: true },
            clipboardFiles: {type: Object, attribute: 'clipboard-files'},
            filesToSave: {type: Array, attribute: 'files-to-save'},
            numberOfSelectedFiles: {type: Number, attribute: false },
            showAdditionalButtons: {type: Boolean, attribute: 'show-additional-buttons' },
            enabledTargets: {type: String, attribute: 'enabled-targets'},

            nextcloudWebAppPasswordURL: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavURL: { type: String, attribute: 'nextcloud-web-dav-url' },
            nextcloudName: { type: String, attribute: 'nextcloud-name' },
            nextcloudFileURL: { type: String, attribute: 'nextcloud-file-url' },

            isFileSource: {type: Boolean, attribute: 'file-source' },
            isFileSink: {type: Boolean, attribute: 'file-sink' },
        };
    }

    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
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

            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new Tabulator(this._("#clipboard-content-table"), {
                layout: "fitColumns",
                selectable: true,
                selectableRangeMode: "drag",
                responsiveLayout: true,
                resizableColumns: false,
                placeholder: i18n.t("clipboard.no-data"),
                columns: [
                    {
                        title: "",
                        field: "type",
                        align: "center",
                        headerSort: false,
                        width: 50,
                        responsive: 1,
                        formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag = that.getScopedTagName("dbp-icon");
                            let icon = `<${icon_tag} name="empty-file" class="nextcloud-picker-icon"></${icon_tag}>`;
                            return icon;
                        }
                    },
                    {
                        title: i18n.t("clipboard.file-name"),
                        responsive: 0,
                        widthGrow: 5,
                        minWidth: 150,
                        field: "name",
                        sorter: "alphanum",
                        formatter: (cell) => {
                            let data = cell.getRow().getData();
                            if (data.edit) {
                                cell.getElement().classList.add("fokus-edit");
                            }
                            return cell.getValue();
                        }
                    },
                    {
                        title: i18n.t("clipboard.file-size"),
                        responsive: 4,
                        widthGrow: 1,
                        minWidth: 50,
                        field: "size",
                        formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());
                        }
                    },
                    {
                        title: i18n.t("clipboard.file-type"),
                        responsive: 2,
                        widthGrow: 1,
                        minWidth: 20,
                        field: "type",
                        formatter: (cell, formatterParams, onRendered) => {
                            if (typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }
                    },
                    {
                        title: i18n.t("clipboard.file-mod"),
                        responsive: 3,
                        widthGrow: 1,
                        minWidth: 150,
                        field: "lastModified",
                        sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            const timestamp = new Date(cell.getValue());
                            const year = timestamp.getFullYear();
                            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ("0" + timestamp.getDate()).slice(-2);
                            const hours = ("0" + timestamp.getHours()).slice(-2);
                            const minutes = ("0" + timestamp.getMinutes()).slice(-2);
                            return date + "." + month + "." + year + " " + hours + ":" + minutes;
                        }
                    },
                    {title: "file", field: "file", visible: false}
                ],
                initialSort: [
                    {column: "name", dir: "asc"},
                    {column: "type", dir: "asc"},
                ],
                rowClick: (e, row) => {
                    this.numberOfSelectedFiles = this.tabulatorTable !== null ? this.tabulatorTable.getSelectedRows().length : 0;
                    if (this.tabulatorTable !== null
                        && this.tabulatorTable.getSelectedRows().length === this.tabulatorTable.getRows().filter(row => this.checkFileType(row.getData())).length) {
                        this._("#select_all").checked = true;

                    } else {
                        this._("#select_all").checked = false;

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
            that.generateClipboardTable();

        });
        if(!window.clipboardWarning)  {
            window.addEventListener('beforeunload', this._onReceiveBeforeUnload, false);
            window.clipboardWarning = true;
        }

    }

    disconnectedCallback() {

        //We doesn't want to deregister this event, because we want to use this event over activities
        //window.removeEventListener('beforeunload', this._onReceiveBeforeUnload);

        super.disconnectedCallback();
    }

    /**
     * Select or deselect all files from tabulator table
     *
     */
    selectAllFiles() {
        let maxSelected = this.tabulatorTable.getRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)).length;
        let selected = this.tabulatorTable.getSelectedRows().length;

        if (selected === maxSelected) {
            this.tabulatorTable.getSelectedRows().forEach(row => row.deselect());
            this.numberOfSelectedFiles = 0;
        } else {
            this.tabulatorTable.selectRow(this.tabulatorTable.getRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)));
            this.numberOfSelectedFiles = maxSelected;
        }
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

    generateClipboardTable() {
        if (this.clipboardFiles.files) {
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
    }

    async sendClipboardFiles(files) {

        for(let i = 0; i < files.length; i ++)
        {
            await this.sendFileEvent(files[i].file);
        }
        this.tabulatorTable.deselectRow();

    }

    async sendFileEvent(file) {
        const data = {"file": file, "data": file};

        const event = new CustomEvent("dbp-clipboard-file-picker-file-downloaded",
            { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }


    /**
     * Decides if the "beforeunload" event needs to be canceled
     *
     * @param event
     */
    onReceiveBeforeUnload(event){
        // we don't need to stop if there are no signed files
        if (this.clipboardFiles.files.length === 0) {
            return;
        }

        // we need to handle custom events ourselves
        if(event.target && event.target.activeElement && event.target.activeElement.nodeName) {

            send({
                "summary": i18n.t('clipboard.file-warning'),
                "body": i18n.t('clipboard.file-warning-body', {count: this.clipboardFiles.files.length}),
                "type": "warning",
                "timeout": 5,
            });
            if (!event.isTrusted) {
                // note that this only works with custom event since calls of "confirm" are ignored
                // in the non-custom event, see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
                const result = confirm("##carefulsaveialuge");
                // don't stop the page leave if the user wants to leave
                if (result) {
                    return;
                }
            }
            // Cancel the event as stated by the standard
            event.preventDefault();
            // Chrome requires returnValue to be set
            event.returnValue = '';
        }
    }

    saveFilesToClipboardEvent(ev)
    {
        //save it
        let data = {};
        let files = [];
        if (this.clipboardFiles && this.clipboardFiles.files.length !== 0) {
            files = files.concat(this.clipboardFiles.files);
            files = files.concat(ev.detail.file);
        } else {
            files = files.concat(ev.detail.file);
        }
        this.filesToSave = files;
        if (files && files.length !== 0) {
            data = {"files": files};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent("dbp-clipboard-file-picker-file-uploaded",
                {  bubbles: true, composed: true });
            this.dispatchEvent(event);
        }
    }

    saveFilesToClipboard()
    {
        //save it
        console.log("clipboard", this.clipboardFiles);
        console.log("filesToSave", this.filesToSave);
        let data = {};
        let files = [];
        if (this.clipboardFiles && this.clipboardFiles.files.length !== 0) {
            files = files.concat(this.clipboardFiles.files);
            files = files.concat(this.filesToSave);
        } else {
            files = files.concat(this.filesToSave);
        }
        console.log("files", files);
        if (this.filesToSave && this.filesToSave.length !== 0) {
            data = {"files": files};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent("dbp-clipboard-file-picker-file-uploaded",
                {  bubbles: true, composed: true });
            this.dispatchEvent(event);
        }
    }


    finishedSaveFilesToClipboard(ev) {
        send({
            "summary": i18n.t('clipboard.saved-files-title', {count: ev.detail.count}),
            "body": i18n.t('clipboard.saved-files-body', {count: ev.detail.count}),
            "type": "success",
            "timeout": 5,
        });
    }

    saveFilesFromClipboard() {
        const fileSink = this._("#file-sink-clipboard");
        if ( fileSink ) {
            this._("#file-sink-clipboard").files = Object.create(this.tabulatorTable.getSelectedData().length > 0 ? this.tabulatorTable.getSelectedData() : this.clipboardFiles.files);
            this._("#file-sink-clipboard").openDialog();
        }
    }

    getClipboardFileList() {
        let files = [];
        for (let i = 0; i < this.clipboardFiles.files.length; i ++)
        {
            files[i] =  html`<div class="clipboard-list"><strong>${this.clipboardFiles.files[i].name}</strong> ${humanFileSize(this.clipboardFiles.files[i].size)}</div>`;
        }
        return files;
    }

    /**
     * Open Filesink for multiple files
     */
    async openClipboardFileSink() {
        const fileSink = this._("#file-sink-clipboard");
        if (fileSink) {
            this._("#file-sink-clipboard").files = Object.create(this.clipboardFiles.files);
            this._("#file-sink-clipboard").openDialog();
        }
    }

    clearClipboard() {
       /* this.tabulatorTable.deleteRow(this.tabulatorTable.getSelectedRows());
        let data = [];
        this.tabulatorTable.getRows().forEach(row =>
            console.log("row.file", row.file) &&
            data.push(row.file)
        );
        console.log("data", data);

        //TODO Check if file is set then push data to clipboard and send notification
        //TODO unterscheide zwischen alle files löschen und nur selected files löschen
        //TODO find matomo error !!!!
        //TODO filesink filesink error
*/

        if(this.tabulatorTable && this.tabulatorTable.getSelectedData().length > 0) {
            let data = {"files": this.clipboardFiles.files};
            this.tabulatorTable.getSelectedData().forEach(toRemove =>
                data.files = data.files.filter(file => toRemove.name !== file.name)
            );
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent("dbp-clipboard-file-picker-file-uploaded",
                {  bubbles: true, composed: true });
            this.dispatchEvent(event);
            send({
                "summary": i18n.t('clipboard.clear-count-clipboard-title', {count: this.tabulatorTable.getSelectedData().length}),
                "body": i18n.t('clipboard.clear-count-clipboard-body', {count: this.tabulatorTable.getSelectedData().length}),
                "type": "success",
                "timeout": 5,
            });
            this.numberOfSelectedFiles = 0;

        } else {
            let data = {"files": []};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent("dbp-clipboard-file-picker-file-uploaded",
                {  bubbles: true, composed: true });
            this.dispatchEvent(event);
            send({
                "summary": i18n.t('clipboard.clear-clipboard-title'),
                "body": i18n.t('clipboard.clear-clipboard-body'),
                "type": "success",
                "timeout": 5,
            });
        }
    }

    openFilesink() {
        const fileSink = this._("#file-source");
        if (fileSink) {
            this._("#file-source").setAttribute("dialog-open", "");
        }
    }

    getAdditionalButtons() {

        return html`
            <div class="flex-container">
                       
                        <div class="btn-flex-container-mobile">
                            <button @click="${() => { this.openFilesink(); }}"
                                    class="button" title="${i18n.t('clipboard.add-files')}">
                                <dbp-icon class="nav-icon" name="clipboard"></dbp-icon> ${i18n.t('clipboard.add-files-btn')}
                            </button>
                            <button @click="${() => { this.clearClipboard(); }}"
                                    class="button" title="${(this.numberOfSelectedFiles > 0) ? i18n.t('clipboard.remove-count', {count: this.numberOfSelectedFiles}) : i18n.t('clipboard.remove-all')}"
                                    ?disabled="${this.clipboardFiles.files.length === 0}">
                                ${(this.numberOfSelectedFiles > 0) ? i18n.t('clipboard.remove-count-btn', {count: this.numberOfSelectedFiles}) : i18n.t('clipboard.remove-all-btn')}
                            </button>
                        </div>
                        <div class="btn-flex-container-mobile">
                            <button @click="${() => { this.saveFilesFromClipboard(); }}"
                                    ?disabled="${this.clipboardFiles.files.length === 0}"
                                    class="button" title="${(this.numberOfSelectedFiles > 0) ? i18n.t('clipboard.save-count', {count: this.numberOfSelectedFiles}) : i18n.t('clipboard.save-all')}">
                                ${(this.numberOfSelectedFiles > 0) ? i18n.t('clipboard.save-count-btn', {count: this.numberOfSelectedFiles}) : i18n.t('clipboard.save-all-btn')}
                            </button>
                        </div>
                        
                    </div>
                    <dbp-file-source
                                id="file-source"
                                context="${i18n.t('clipboard.add-files')}"
                                allowed-mime-types="${this.allowedMimeTypes}"
                                nextcloud-auth-url="${this.nextcloudWebAppPasswordURL}"
                                nextcloud-web-dav-url="${this.nextcloudWebDavURL}"
                                nextcloud-name="${this.nextcloudName}"
                                nextcloud-file-url="${this.nextcloudFileURL}"
                                enabled-targets="${this.enabledTargets}"
                                decompress-zip
                                lang="${this.lang}"
                                text="${i18n.t('clipboard.upload-area-text')}"
                                button-label="${i18n.t('clipboard.upload-button-label')}"
                                show-clipboard
                                @dbp-file-source-file-selected="${this.saveFilesToClipboardEvent}"
                                @dbp-nextcloud-file-picker-number-files="${this.finishedSaveFilesToClipboard}"
                                @dbp-file-source-file-upload-finished="${this.finishedSaveFilesToClipboard}"
                        ></dbp-file-source>
                    <dbp-file-sink id="file-sink-clipboard"
                                   context="${(this.numberOfSelectedFiles > 0) ? i18n.t('clipboard.save-count', {count: this.numberOfSelectedFiles}) : i18n.t('clipboard.save-all')}"
                                   filename="clipboard-documents.zip"
                                   allowed-mime-types="${this.allowedMimeTypes}"
                                   enabled-targets="${this.enabledTargets}"
                                   show-clipboard
                                   nextcloud-auth-url="${this.nextcloudWebAppPasswordURL}"
                                   nextcloud-web-dav-url="${this.nextcloudWebDavURL}"
                                   nextcloud-name="${this.nextcloudName}"
                                   nextcloud-file-url="${this.nextcloudFileURL}"
                                   lang="${this.lang}"
                                   subscribe="nextcloud-file-url:nextcloud-file-url"
                    ></dbp-file-sink>
        `;
    }

    getClipboardSink() {
        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');

        let additionalButtons = this.showAdditionalButtons ? this.getAdditionalButtons() : "";
        return html`
            <div class="wrapper">
                <div class="content">
                    <h3>${i18n.t('clipboard.sink-title')}</h3>
                    <p>${i18n.t('clipboard.sink-body')}<br><br></p>
                    <div class="warning-container">
                        <dbp-icon name="warning" class="warning-icon"></dbp-icon>
                        <p>${i18n.t('clipboard.warning')}</p>
                    </div>
                    <div class="container">
                        ${additionalButtons}
                        <link rel="stylesheet" href="${tabulatorCss}">
                        <div class="table-wrapper">
                            <label class="button-container select-all-icon">
                                <input type="checkbox" id="select_all" name="select_all" value="select_all" @click="${() => {this.selectAllFiles();}}">
                                <span class="checkmark"></span>
                            </label>
                            <table id="clipboard-content-table" class="force-no-select"></table>
                        </div>
                    </div>
                </div>
                <div class="clipboard-footer">
                    <button class="button select-button is-primary" title="${i18n.t('clipboard.sink-btn', {count: this.filesToSave.length})}"
                        @click="${() => {this.saveFilesToClipboard();}}"> <dbp-icon class="nav-icon" name="clipboard"></dbp-icon> ${i18n.t('clipboard.sink-btn', {count: this.filesToSave.length})}
                    </button>
                </div>
            </div>
        `;

    }


    getClipboardSource() {
        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');

        let additionalButtons = this.showAdditionalButtons ? this.getAdditionalButtons() : "";
        return html`
            <div class="wrapper">
                <div class="content">
                    <h3>${i18n.t('clipboard.source-title')}</h3>
                    <p>${i18n.t('clipboard.source-body')}</p>
                    <div class="warning-container">
                        <dbp-icon name="warning" class="warning-icon"></dbp-icon>
                        <p>${i18n.t('clipboard.warning')}</p>
                    </div>
                    <div class="container">
                        ${additionalButtons}
                        <link rel="stylesheet" href="${tabulatorCss}">
                        <div class="table-wrapper">
                            <label class="button-container select-all-icon">
                                <input type="checkbox" id="select_all" name="select_all" value="select_all" @click="${() => {this.selectAllFiles();}}">
                                <span class="checkmark"></span>
                            </label>
                            <table id="clipboard-content-table" class="force-no-select"></table>
                        </div>
                    </div>
                </div>
                <div class="clipboard-footer">
                    <button class="button select-button is-primary" ?disabled="${this.clipboardSelectBtnDisabled}"
                            @click="${() => {this.sendClipboardFiles(this.tabulatorTable.getSelectedData());}}"> ${i18n.t('clipboard.source-btn')}
                    </button>
                </div>
            </div>
        `;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS(false)}
            ${commonStyles.getButtonCSS()}
            ${commonStyles.getTextUtilities()}
            ${commonStyles.getModalDialogCSS()}
            ${commonStyles.getRadioAndCheckboxCss()}
            ${fileHandlingStyles.getFileHandlingCss()}

            a {
                border-bottom: 1px solid rgba(0,0,0,0.3);
                padding: 0;
            }

            a:hover {
                color: #fff;
                background-color: #000;
            }

            h2:first-child {
                margin-top: 0;
                margin-bottom: 0px;
            }

            .subheadline{
                font-style: italic;
                padding-left: 2em;
                margin-top: -1px;
                /*line-height: 1.8;*/
                margin-bottom: 1.2em;
            }
            
            .warning-container{
                display: flex;
                flex-direction: inherit;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .warning-icon{
                margin-right: 20px;
                font-size: 1.5rem;
            }
            
            .container{
                margin-top: 2rem;
            }
            
            .flex-container{
                margin-bottom: 5px;
            }
            
            .select-btn-wrapper{
                float: right;
            }
            
            .init{
                margin: 0px;
            }
            
            .flex-container{
                display: flex;
                justify-content: space-between;
            }

            .tabulator .tabulator-tableHolder .tabulator-placeholder span{
                margin: initial;
            }
            
            .checkmark{
                height: 20px;
                width:20px;
            }
            
            .button-container .checkmark::after{
                left: 8px;
                top: 3px;
                width: 4px;
                height: 11px;
            }
            
            .table-wrapper{
                position: relative;
            }
            
            .select-all-icon{
                position: absolute;
                top: 17px;
                left: 10px;
                z-index: 100;
                height: 40px;
            }

            .clipboard-footer {
                background-color: white;
                width: 100%;
                padding-top: 10px;
                display: flex;
                align-items: end;
                flex-direction: column;
            }
            
            .wrapper{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
            }
            
            .content{
                width: 100%;
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            @media only screen
            and (orientation: portrait)
            and (max-device-width: 765px) {
                .flex-container{
                    justify-content: space-between;
                    display: flex;
                }
                
                .btn-flex-container-mobile{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                
                .select-btn-wrapper{
                    width: 100%;
                    display: flex;
                    justify-content: end;
                    float: none;
                }
                
                .flex-container{
                    display: block;
                }

                .checkmark{
                    height: 30px;
                    width:30px;
                }

                .button-container .checkmark::after{
                    left: 11px;
                    top: 4px;
                    width: 8px;
                    height: 15px;
                }
                

                .select-all-icon{
                    top: 10px;
                    left: 10px;
                }
                
                .btn-flex-container-mobile{
                    flex-direction: column;
                }
                
                .btn-flex-container-mobile button:nth-child(2){
                    margin-top: 5px;
                }
                
            }

        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');

        let additionalButtons = this.showAdditionalButtons ? this.getAdditionalButtons() : "";

        if (this.isFileSink)
            return this.getClipboardSink();
        if (this.isFileSource)
            return this.getClipboardSource();

        return html`
            <div class="container">
                
                ${additionalButtons}
                
                <link rel="stylesheet" href="${tabulatorCss}">
               
                <div class="table-wrapper">
                    <label class="button-container select-all-icon">
                        <input type="checkbox" id="select_all" name="select_all" value="select_all" @click="${() => {this.selectAllFiles();}}">
                        <span class="checkmark"></span>
                    </label>
                    <table id="clipboard-content-table" class="force-no-select"></table>
                </div>
            </div>
        `;
    }
}