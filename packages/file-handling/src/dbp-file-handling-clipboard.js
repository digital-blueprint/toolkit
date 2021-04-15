import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as fileHandlingStyles from './styles';
import Tabulator from "tabulator-tables";
import {humanFileSize} from "@dbp-toolkit/common/i18next";
import {classMap} from 'lit-html/directives/class-map.js';
import * as commonUtils from "@dbp-toolkit/common/utils";
import {name as pkgName} from "../package.json";
import {send} from "@dbp-toolkit/common/notification";
import {FileSink} from "./file-sink";


/**
 * Clipboard web component
 */
export class FileHandlingClipboard extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.authUrl = '';
        this.allowedMimeTypes = '*/*';
        this.clipboardSource = false;
        this.clipboardFiles = {files: ''};
        this.clipboardSelectBtnDisabled = true;
        this.clipboardSelectBtnDisabled = true;
        this.showSelectAllButton = true;
        this.tabulatorTable = null;
        this.maxSelectedItems = true;
        this._onReceiveBeforeUnload = this.onReceiveBeforeUnload.bind(this);
        this.filesToSave = null;

        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.nextcloudName ='Nextcloud';
        this.nextcloudPath = '';
        this.nextcloudFileURL = '';

    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-file-sink': FileSink,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            authUrl: { type: String, attribute: 'auth-url' },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            showSelectAllButton: { type: Boolean, attribute: true },
            clipboardSelectBtnDisabled: { type: Boolean, attribute: true },
            clipboardFiles: {type: Object, attribute: 'clipboard-files'},
            clipboardSource: {type: Boolean, attribute: 'clipboard-source'},
            filesToSave: {type: Object, attribute: 'files-to-save'},

            nextcloudAuthUrl: {type: String, attribute: 'nextcloud-auth-url'},
            nextcloudWebDavUrl: {type: String, attribute: 'nextcloud-web-dav-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
        };

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

    disconnectedCallback() {

        //We doesn't want to deregister this event, because we want to use this event over activities
        //window.removeEventListener('beforeunload', this._onReceiveBeforeUnload);

        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
        this.updateComplete.then(() => {
            if (this.clipboardSource) {
                // see: http://tabulator.info/docs/4.7
                this.tabulatorTable = new Tabulator(this._("#clipboard-content-table"), {
                    layout: "fitColumns",
                    selectable: this.maxSelectedItems,
                    selectableRangeMode: "drag",
                    responsiveLayout: true,
                    placeholder: i18n.t('nextcloud-file-picker.no-data-type'),
                    resizableColumns: false,
                    columns: [
                        {
                            title: "",
                            field: "type",
                            align: "center",
                            headerSort: false,
                            width: 50,
                            responsive: 1,
                            formatter: (cell, formatterParams, onRendered) => {
                                const icon_tag = that.constructor.getScopedTagName("dbp-icon");
                                let icon = `<${icon_tag} name="empty-file" class="nextcloud-picker-icon"></${icon_tag}>`;
                                return icon;
                            }
                        },
                        {
                            title: i18n.t('nextcloud-file-picker.filename'),
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
                            title: i18n.t('nextcloud-file-picker.size'),
                            responsive: 4,
                            widthGrow: 1,
                            minWidth: 50,
                            field: "size",
                            formatter: (cell, formatterParams, onRendered) => {
                                return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());
                            }
                        },
                        {
                            title: i18n.t('nextcloud-file-picker.mime-type'),
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
                            title: i18n.t('nextcloud-file-picker.last-modified'),
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
            }
        });
        if (!this.clipboardSource) {
            window.addEventListener('beforeunload', this._onReceiveBeforeUnload);
        }

    }

    /**
     * Select all files from tabulator table
     *
     */
    selectAll() {
        this.tabulatorTable.selectRow(this.tabulatorTable.getRows().filter(row => this.checkFileType(row.getData())));
        if (this.tabulatorTable.getSelectedRows().length > 0) {
            this.showSelectAllButton = false;
        }
    }

    /**
     * Deselect files from tabulator table
     *
     */
    deselectAll() {
        this.tabulatorTable.deselectRow();
        this.showSelectAllButton = true;
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
        //this.closeDialog();

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
                const result = confirm(i18n.t('page-leaving-warn-dialogue'));
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

    saveFilesToClipboard()
    {
        //save it
        let data = {};
        if (this.filesToSave && this.filesToSave.length !== 0) {
            data = {"files": this.filesToSave};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent("dbp-clipboard-file-picker-file-uploaded",
                {  bubbles: true, composed: true });
            this.dispatchEvent(event);
            send({
                "summary": i18n.t('file-sink.save-to-clipboard-title'),
                "body": i18n.t('file-sink.save-to-clipboard-body', {count: this.filesToSave.length}),
                "type": "success",
                "timeout": 5,
            });
        }

    }



    getClipboardFileList() {
        let files = [];
        for(let i = 0; i < this.clipboardFiles.files.length; i ++)
        {
            files[i] =  html`<div class="clipboard-list"><strong>${this.clipboardFiles.files[i].name}</strong> ${humanFileSize(this.clipboardFiles.files[i].size)}</div>`;
        }
        return files;
    }

    /**
     * Open Filesink for multiple files
     */
    async openClipboardFileSink() {
        this._("#file-sink-clipboard").files = Object.create(this.clipboardFiles.files);
        console.log("------ this.clipboardFiles.files;", this.clipboardFiles.files);
        this._("#file-sink-clipboard").openDialog();
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            ${commonStyles.getTextUtilities()}
            ${commonStyles.getModalDialogCSS()}
            ${commonStyles.getRadioAndCheckboxCss()}
            ${fileHandlingStyles.getFileHandlingCss()}

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

            .clipboard-container .wrapper.table{
                justify-content: start;
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

            .clipboard-container{
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: var(--FUPadding, 20px);
            }

            .clipboard-container.table{
                justify-content: start;
            }

            .clipboard-container .inner{
                overflow-y: auto;
                text-align: center;
                width: 100%;
            }

            .warning-icon{
                font-size: 2rem;
                padding: 0 1rem;
            }

            .clipboard-btn{
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .warning-container{
                display: flex;
                max-width: 400px;
                text-align: left;
                margin: auto;
            }

            .clipboard-data h4{
                margin-top: 2rem;
            }

            .clipboard-data p{
                margin-bottom: 1rem;
            }

            .clipboard-list{
                padding: 1rem 0;
                border-top: 1px solid #eee;
            }


            @media only screen
            and (orientation: portrait)
            and (max-device-width: 765px) {
                .clipboard-container p, .clipboard-container h3{
                    text-align: center;
                }
                .warning-container{
                    flex-direction: column;
                    align-items: center;
                }
                .warning-icon{
                    margin-bottom: 1rem;
                }
            }
        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');

        if (this.clipboardSource) {

            return html`
                <link rel="stylesheet" href="${tabulatorCss}">
                <div class="block clipboard-container">
                    <div class="wrapper ${classMap({"table": this.clipboardFiles.files.length !== 0})}">
                        <div class="inner">
                            <h3>${i18n.t('file-source.clipboard-title')}</h3>
                            <p>${i18n.t('file-source.clipboard-body')}<br><br></p>
                            <p class="${classMap({"hidden": this.clipboardFiles.files.length !== 0})}">
                                ${i18n.t('file-source.clipboard-no-files')}</p>
                            <div class="clipboard-table ${classMap({"hidden": this.clipboardFiles.files.length === 0})}">
                                <div id="select-all-wrapper">
                                    <button class="button ${classMap({"hidden": !this.showSelectAllButton})}"
                                            title="${i18n.t('nextcloud-file-picker.select-all-title')}"
                                            @click="${() => {
                                                this.selectAll();
                                            }}">
                                        ${i18n.t('nextcloud-file-picker.select-all')}
                                    </button>
                                    <button class="button ${classMap({"hidden": this.showSelectAllButton})}"
                                            title="${i18n.t('nextcloud-file-picker.select-nothing-title')}"
                                            @click="${() => {
                                                this.deselectAll();
                                            }}">
                                        ${i18n.t('nextcloud-file-picker.select-nothing')}
                                    </button>
                                </div>
                                <table id="clipboard-content-table" class="force-no-select"></table>
                            </div>
                        </div>
                    </div>
                    <div class="clipboard-footer  ${classMap({"hidden": this.clipboardFiles.files.length === 0})}">
                        <button class="button select-button is-primary" ?disabled="${this.clipboardSelectBtnDisabled}"
                                @click="${() => {
                                    this.sendClipboardFiles(this.tabulatorTable.getSelectedData());
                                }}">${i18n.t('nextcloud-file-picker.select-files')}
                        </button>
                    </div>
                </div>
            `;

        } else {
            return html`                
                <div class="block clipboard-container ${classMap({"table": this.clipboardFiles && this.clipboardFiles.files.length !== 0})}">
                    <div class="inner">
                        <h3>${i18n.t('file-sink.save-to-clipboard-title')}</h3>
                        <p>${i18n.t('file-sink.save-to-clipboard-text')}</p>
                        <button class="button is-primary clipboard-btn"
                                ?disabled="${this.disabled}"
                                @click="${() => { this.saveFilesToClipboard(); }}">
                            ${this.buttonLabel || i18n.t('file-sink.save-to-clipboard-btn', {count:this.filesToSave ? this.filesToSave.length : 0})}
                        </button>
                        <div class="warning-container">
                            <dbp-icon name="warning" class="warning-icon"></dbp-icon>
                            <p>${i18n.t('file-sink.save-to-clipboard-warning')}</p>
                        </div>

                        <div class="${classMap({"hidden": this.clipboardFiles.files.length === 0})}">
                        <button id="clipboard-download-button"
                                    class="button is-right clipboard-btn"
                                    @click="${this.openClipboardFileSink}"
                                    >${i18n.t('clipboard.save-from-clipboard-btn')}</button>
                        </div>
                        
                        <dbp-file-sink id="file-sink-clipboard"
                        context="${i18n.t('clipboard.save-files-from-clipboard', {count: this.clipboardFiles ? this.clipboardFiles.files.length : 0})}"
                        filename="clipboard-documents.zip"
                        enabled-targets="local,nextcloud"
                        nextcloud-auth-url="${this.nextcloudAuthUrl}"
                        nextcloud-web-dav-url="${this.nextcloudWebDavUrl}"
                        nextcloud-name="${this.nextcloudName}"
                        nextcloud-file-url="${this.nextcloudFileURL}"
                        fullsize-modal="true"
                        lang="${this.lang}"
                        ></dbp-file-sink>
                        
                        
                        <div class="clipboard-data ${classMap({"hidden": this.clipboardFiles.files.length === 0})}">
                            <h4>${i18n.t('file-sink.clipboard-files')}</h4>
                            <p>${i18n.t('file-sink.clipboard-files-overwrite')}</p>
                            ${this.getClipboardFileList()}
                        </div>
                    </div>
                </div>
            `;
        }
    }
}
