import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import VPULitElement from 'vpu-common/vpu-lit-element';
import {Icon, MiniSpinner} from 'vpu-common';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import {createClient} from 'webdav/web';
import {classMap} from 'lit-html/directives/class-map.js';
import {humanFileSize} from 'vpu-common/i18next';
import Tabulator from 'tabulator-tables';
//import nextcloudFileURL from 'consts:nextcloudFileURL'; TODO
import nextcloudBaseURL from 'consts:nextcloudBaseURL';

/**
 * NextcloudFilePicker web component
 */
export class NextcloudFilePicker extends ScopedElementsMixin(VPULitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.authUrl = '';
        this.webDavUrl = '';
        this.loginWindow = null;
        this.isPickerActive = false;
        this.statusText = '';
        this.lastDirectoryPath = '/';
        this.directoryPath = '/';
        this.webDavClient = null;
        this.tabulatorTable = null;
        this.allowedMimeTypes = '*/*';
        this.directoriesOnly = null;
        this.maxSelectedItems = true;

        this._onReceiveWindowMessage = this.onReceiveWindowMessage.bind(this);
    }

    static get scopedElements() {
        return {
            'vpu-icon': Icon,
            'vpu-mini-spinner': MiniSpinner,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            authUrl: { type: String, attribute: 'auth-url' },
            webDavUrl: { type: String, attribute: 'web-dav-url' },
            isPickerActive: { type: Boolean, attribute: false },
            statusText: { type: String, attribute: false },
            directoryPath: { type: String, attribute: false },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            directoriesOnly: { type: Boolean, attribute: 'directories-only' },
            maxSelectedItems: { type: Number, attribute: 'max-selected-items' },
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

    disconnectedCallback() {
        window.removeEventListener('message', this._onReceiveWindowMessage);
        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
        this.updateComplete.then(() => {
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.addEventListener('message', this._onReceiveWindowMessage);

            // http://tabulator.info/docs/4.7
            // TODO: translation of column headers
            this.tabulatorTable = new Tabulator(this._("#directory-content-table"), {
                layout: "fitDataStretch",
                selectable: this.maxSelectedItems,
                selectableRangeMode: "drag",
                columns: [
                    {title: "", field: "type", align:"center", formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag =  that.constructor.getScopedTagName("vpu-icon");
                            let icon = `<${icon_tag} name="empty-file"></${icon_tag}>`;
                            return (cell.getValue() === "directory") ? `<${icon_tag} name="folder"></${icon_tag}>` : icon;
                        }},
                    {title: i18n.t('nextcloud-file-picker.filename'), field: "basename"},
                    {title: i18n.t('nextcloud-file-picker.size'), field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());}},
                    {title: i18n.t('nextcloud-file-picker.mime-type'), field: "mime", formatter: (cell, formatterParams, onRendered) => {
                            if(typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [fileMainType, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }},
                    {title: i18n.t('nextcloud-file-picker.last-modified'), field: "lastmod",sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp; //you must return the difference between the two values
                        }, formatter:function(cell, formatterParams, onRendered) {
                            const d = Date.parse(cell.getValue());
                            const timestamp = new Date(d);
                            const year = timestamp.getFullYear();
                            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ("0" + timestamp.getDate()).slice(-2);
                            const hours = ("0" + timestamp.getHours()).slice(-2);
                            const minutes = ("0" + timestamp.getMinutes()).slice(-2);
                            return date + "." + month + "." + year + " " + hours + ":" + minutes;
                        }},
                ],
                initialSort:[
                    {column:"basename", dir:"asc"},
                    {column:"type", dir:"asc"},
                ],
                rowClick: (e, row) => {
                    const data = row.getData();

                    if(this.directoriesOnly) {
                        console.log("directory selected", data);
                    }
                    else
                    {
                        switch(data.type) {
                            case "directory":
                                this.directoryClicked(e, data);
                                break;
                            case "file":
                                console.log("file selected", data);
                                break;
                        }
                    }
                },
                rowDblClick: (e, row) => {
                    if(this.directoriesOnly) {
                        const data = row.getData();
                        this.directoryClicked(e, data);
                    }
                }
            });

            console.log("table: ", this.tabulatorTable);
            if(this.tabulatorTable.browserMobile === false)
            {
                this.tabulatorTable.options.selectableRangeMode = "click";
            }
            function checkFileType(data, filterParams) {
                // check if file is allowed
                if(typeof data.mime === 'undefined') {
                    return true;
                }
                const [fileMainType, fileSubType] = data.mime.split('/');
                const mimeTypes = filterParams.split(',');
                let deny = true;

                mimeTypes.forEach((str) => {
                    const [mainType, subType] = str.split('/');
                    deny = deny && ((mainType !== '*' && mainType !== fileMainType) || (subType !== '*' && subType !== fileSubType));
                });

                if (deny) {
                    return false;
                }
                return true;
            }
            if(typeof this.allowedMimeTypes !== 'undefined') {
                this.tabulatorTable.setFilter(checkFileType, this.allowedMimeTypes);
            }
            if(typeof this.directoriesOnly !== 'undefined' && this.directoriesOnly)
            {
                console.log("filter " + this.directoriesOnly);
                this.tabulatorTable.setFilter([
                    {field:"type", type:"=", value:"directory"},
                ]);
            }
        });
    }

    openFilePicker() {
        if(this.webDavClient === null)
        {
            this.statusText = i18n.t('nextcloud-file-picker.auth-progress');
            const authUrl = this.authUrl + "?target-origin=" + encodeURIComponent(window.location.href);
            this.loginWindow = window.open(authUrl, "Nextcloud Login",
                "width=400,height=400,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
        }
        else {

            this.loadDirectory(this.directoryPath, this.webDavClient);

        }

    }

    onReceiveWindowMessage(event) {
        const data = event.data;
        console.log("data", data);

        if (data.type === "webapppassword") {
            this.loginWindow.close();
            // alert("Login name: " + data.loginName + "\nApp password: " + data.token);

            const apiUrl = this.webDavUrl + "/" + data.loginName;
            console.log("url: ", this.webDavUrl);
            // https://github.com/perry-mitchell/webdav-client/blob/master/API.md#module_WebDAV.createClient

            this.webDavClient = createClient(
                apiUrl,
                {
                    username: data.loginName,
                    password: data.token
                }
            );

            this.loadDirectory(this.directoryPath);

        }
    }

    /**
     * Loads the directory from WebDAV
     *
     * @param path
     */
    loadDirectory(path) {
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker');//"Loading directory from Nextcloud: " + path;
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = path;

        // https://github.com/perry-mitchell/webdav-client#getdirectorycontents

        this.webDavClient
            .getDirectoryContents(path, {details: true})
            .then(contents => {
                console.log("contents", contents);
                this.statusText = "";
                this.tabulatorTable.setData(contents.data);
                this.isPickerActive = true;
            }).catch(error => {
                console.error(error.message);

                //try to reload with home directory
                if(path != "/"){
                    this.loadDirectory("/");
                }
                else {
                    this.statusText = error.message;
                    this.isPickerActive = false;
                }

                //client is broken reload try to reset & reconnect
                this.webDavClient = null;
                let reloadButton = html`<button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><vpu-icon name="reload"></button>`;
                this.statusText = reloadButton;
        });

    }

    directoryClicked(event, file) {
        this.loadDirectory(file.filename);
        event.preventDefault();
    }

    downloadFiles(files) {
        files.forEach((fileData) => this.downloadFile(fileData));
    }

    downloadFile(fileData) {
        this.statusText = "Loading " + fileData.filename + "...";

        // https://github.com/perry-mitchell/webdav-client#getfilecontents
        this.webDavClient
            .getFileContents(fileData.filename)
            .then(contents => {
                // create file to send via event
                const file = new File([contents], fileData.basename, { type: fileData.mime });
                console.log("binaryFile", file);

                // send event
                const data = {"file": file, "data": fileData};
                const event = new CustomEvent("vpu-nextcloud-file-picker-file-downloaded",
                    { "detail": data, bubbles: true, composed: true });
                this.dispatchEvent(event);

                this.statusText = "";
            }).catch(error => {
                console.error(error.message);
                this.statusText = error.message;
        });
    }

    /**
     * Returns the parent directory path
     *
     * @returns {string} parent directory path
     */
    getParentDirectoryPath() {
        let path = this.directoryPath.replace(/\/$/, "");
        path = path.replace(path.split("/").pop(), "").replace(/\/$/, "");

        return (path === "") ? "/" : path;
    }

    /**
     * Returns the directory path as clickable breadcrumbs
     *
     * @returns {string} clickable breadcrumb path
     */
    getBreadcrumb() {
        let htmlpath = [];
        htmlpath[0] =  html`<a @click="${() => { this.loadDirectory("/"); }}" title="${i18n.t('nextcloud-file-picker.folder-home')}"><vpu-icon name="home"></vpu-icon></a>`;
        const directories = this.directoryPath.split('/');

        for(let i = 1; i < directories.length; i ++)
        {
            let path = "";
            for(let j = 1; j <= i; j++)
            {
                path += "/";
                path += directories[j];
            }

            htmlpath[i] = html` / <a @click="${() => { this.loadDirectory(path); }}" title="${i18n.t('nextcloud-file-picker.load-path-link', {path: directories[i]})}">${directories[i]}</a>`;
        }

        return htmlpath;
    }

    /**
     * Returns the directory path as clickable breadcrumbs
     *
     * @returns {string} clickable breadcrumb path
     */
    getNextCloudLink() {
        //später ersetzen durch:
        //let link = nextcloudFileURL + this.directoryPath;
        let link = nextcloudBaseURL + '/apps/files/?dir=' + this.directoryPath;
        return link;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            .block {
                margin-bottom: 10px;
            }
            
            .force-no-select{
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL('local/vpu-file-source/tabulator-tables/css/tabulator.min.css');
        console.log("tabulatorCss", tabulatorCss);

        return html`
            <link rel="stylesheet" href="${tabulatorCss}">
            <div class="block">
                <button class="button"
                        title="${i18n.t('nextcloud-file-picker.open-nextcloud-file-picker')}"
                        @click="${async () => { this.openFilePicker(); } }">${i18n.t('nextcloud-file-picker.open')}</button>
            </div>
            <div class="block ${classMap({hidden: this.statusText === ""})}">
                <vpu-mini-spinner style="font-size: 0.7em"></vpu-mini-spinner>
                ${this.statusText}
            </div>
            <div class="block ${classMap({hidden: !this.isPickerActive})}">
                <h2>${this.getBreadcrumb()}</h2>
                 <a class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.open-in-nextcloud')}"
                        href="${this.getNextCloudLink()}" target="_blank">open in nc</a>
                <button class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.folder-home')}"
                        @click="${() => { this.loadDirectory("/"); }}"><vpu-icon name="home"></vpu-icon></button>
                <button class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.folder-last')}"
                        @click="${() => { this.loadDirectory(this.lastDirectoryPath); }}">&#8678;</button>
                <button class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.folder-up')}"
                        @click="${() => { this.loadDirectory(this.getParentDirectoryPath()); }}">&#8679;</button>
                <table id="directory-content-table" class="force-no-select"></table>
                <button class="button"
                        @click="${() => { this.downloadFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
            </div>
        `;
    }
}
