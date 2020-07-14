import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import {Icon, MiniSpinner} from 'dbp-common';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';
import {createClient} from 'webdav/web';
import {classMap} from 'lit-html/directives/class-map.js';
import {humanFileSize} from 'dbp-common/i18next';
import Tabulator from 'tabulator-tables';
import nextcloudFileURL from 'consts:nextcloudFileURL';

/**
 * NextcloudFilePicker web component
 */
export class NextcloudFilePicker extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.authUrl = '';
        this.webDavUrl = '';
        this.nextcloudName = 'TU Graz cloud';
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
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
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
            nextcloudName: { type: String, attribute: 'nextcloud-name' },
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

            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new Tabulator(this._("#directory-content-table"), {
                layout: "fitColumns",
                selectable: this.maxSelectedItems,
                selectableRangeMode: "drag",
                columns: [
                    {title: "", field: "type", align:"center", headerSort:false, width:50, formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag =  that.constructor.getScopedTagName("dbp-icon");
                            let icon = `<${icon_tag} name="empty-file"></${icon_tag}>`;
                            return (cell.getValue() === "directory") ? `<${icon_tag} name="folder"></${icon_tag}>` : icon;
                        }},
                    {title: i18n.t('nextcloud-file-picker.filename'), widthGrow:5, field: "basename", sorter: "alphanum"},
                    {title: i18n.t('nextcloud-file-picker.size'), widthGrow:1, field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());}},
                    {title: i18n.t('nextcloud-file-picker.mime-type'), widthGrow:1, field: "mime", formatter: (cell, formatterParams, onRendered) => {
                            if(typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [fileMainType, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }},
                    {title: i18n.t('nextcloud-file-picker.last-modified'), widthGrow:1, field: "lastmod",sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
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

            const apiUrl = this.webDavUrl + "/" + data.loginName;
            console.log("url: ", this.webDavUrl);
            // see https://github.com/perry-mitchell/webdav-client/blob/master/API.md#module_WebDAV.createClient

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
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker');
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = path;

        // see https://github.com/perry-mitchell/webdav-client#getdirectorycontents

        this.webDavClient
            .getDirectoryContents(path, {details: true})
            .then(contents => {
                console.log("contents", contents);
                this.statusText = "";
                this.tabulatorTable.setData(contents.data);
                this.isPickerActive = true;
            }).catch(error => {
                console.error(error.message);

                // on Error: try to reload with home directory
                if(path != "/"){
                    this.loadDirectory("/");
                }
                else {
                    this.statusText = error.message;
                    this.isPickerActive = false;
                }

                // client is broken reload try to reset & reconnect
                this.webDavClient = null;
                let reloadButton = html`<button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
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
                const event = new CustomEvent("dbp-nextcloud-file-picker-file-downloaded",
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
        htmlpath[0] =  html`<a @click="${() => { this.loadDirectory("/"); }}" title="${i18n.t('nextcloud-file-picker.folder-home')}"><dbp-icon name="home"></dbp-icon> ${this.nextcloudName}</a>`;
        const directories = this.directoryPath.split('/');
        if(directories[1] === "")
        {
            return htmlpath;
        }
        for(let i = 1; i < directories.length; i ++)
        {
            let path = "";
            for(let j = 1; j <= i; j++)
            {
                path += "/";
                path += directories[j];
            }

            htmlpath[i] = html` › <a @click="${() => { this.loadDirectory(path); }}" title="${i18n.t('nextcloud-file-picker.load-path-link', {path: directories[i]})}">${directories[i]}</a>`;
        }

        return htmlpath;
    }

    /**
     * Returns Link to Nextcloud with actual directory
     *
     * @returns {string} actual directory Nextcloud link
     */
    getNextCloudLink() {
        let link = nextcloudFileURL + this.directoryPath;
        return link;
    }

    getCloudLogo() {
        let cloudLogo = html`
        <?xml version="1.0" encoding="utf-8"?>
                <!-- Generator: Adobe Illustrator 24.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                \t viewBox="0 0 260.2 216.6" style="enable-background:new 0 0 260.2 216.6;" xml:space="preserve">
                <style type="text/css">
                \t.st0{fill:#FFFFFF;}
                \t.st1{fill:#231F20;}
                \t.st2{fill:#E4154B;}
                </style>
                <g>
                \t<path d="M239,60.7c-11.4-12.6-27.3-21.6-44.4-24.4c-9.8-15.1-23.6-26.1-39.5-31.8C147.4,1.6,139.2,0,129.9,0
                \t\tC89.2,0,55.8,31.8,53.7,72.1C23.6,75.7,0,101.8,0,133.1c0,31.9,24.3,58.3,55.4,61.2v-20.5C35,171.2,20,154.4,20,133.1
                \t\tc0-23.2,17.9-41.5,41.5-41.9h2c5.7,0,10.2-4.5,10.2-10.2v-4.5c0-31.4,25.2-57,56.6-57c6.9,0,13,1.2,18.3,3.3
                \t\tc13,4.5,24,14.3,30.9,26.9c1.6,2.9,4.5,4.9,7.7,5.3c13.8,1.6,27.3,8.6,36.6,18.7c10.2,11.4,15.9,25.7,15.9,40.7
                \t\tc0,24.1-14.4,44.9-35,54.4v21.9c32.2-10.4,55.4-40.4,55.4-75.5C260.2,94.9,252.8,75.7,239,60.7z"/>
                \t<g>
                \t\t<path class="st2" d="M61,194.9h43.2v-43.2l-43.2,0C61,151.7,61,194.9,61,194.9z"/>
                \t\t<path class="st2" d="M108.5,194.9h43.2v-43.2h-43.2C108.5,151.7,108.5,194.9,108.5,194.9z"/>
                \t\t<path class="st2" d="M156,194.9h43.2v-43.2H156C156,151.7,156,194.9,156,194.9z"/>
                \t\t<path class="st2" d="M82.6,216.6h43.2v-43.2H82.6V216.6z"/>
                \t\t<path class="st2" d="M134.4,173.3h43.2v-43.2h-43.2V173.3z"/>
                \t</g>
                </g>
                </svg>
        `;
        return cloudLogo;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            ${commonStyles.getTextUtilities()}
            
            .block {
                margin-bottom: 10px;
            }
            
            .force-no-select{
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            .nextcloud-header{
                margin-bottom: 2rem;  
                display: inline-grid;
                width: 100%;
                grid-template-columns: auto auto;          
            }
            
            .nextcloud-header button{
                justify-self: start;
            }
            
            .nextcloud-logo{
                width: 80px;
                justify-self: end;  
                transition: all 0.5s ease;
            }
            
            .nextcloud-logo-sm{
                width: 40px;
            }
            
            .m-inherit{
                margin: inherit;
            }
            
            .wrapper{
                width: 100%;
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            
            .wrapper-select{
                justify-content: inherit;
            }
            
            .select-button{
                justify-self: end;
            }
            
            .nextcloud-content{
                width: 100%;
                height: 100%;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: normal
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow, 
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                padding-bottom: 6px;
            }
            
            .tabulator .tabulator-header, .tabulator .tabulator-header, .tabulator .tabulator-header .tabulator-col, .tabulator, .tabulator-row .tabulator-cell, .tabulator-row.tabulator-row-even,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover{
                background-color: unset;
                background: unset;
                color: unset;
                border: none;
            }
            
            .tabulator-row.tabulator-selectable:hover{
                background-color: #eee;
            }
            
            .tabulator .tabulator-header .tabulator-col .tabulator-col-content{
                display: inline-flex;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                top: 16px;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow{
                border-top: none;
                border-bottom: 4px solid #666;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow{
                border-top: none;
                border-bottom: 4px solid #bbb;
            }
            
            .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow{
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                border-top: 4px solid #666;
                border-bottom: none;
            }
            
            .tabulator-row, .tabulator-row.tabulator-row-even{
                padding-top: 10px;
                padding-bottom: 10px;
                border-top: 1px solid #eee;
            }
            
            .tabulator-header{
                padding-top: 10px;
                padding-bottom: 10px;
            }
            
            .nextcloud-nav{
                display: flex;
                justify-content: space-between;
            }
            
            .nextcloud-footer{
                background-color: white;
                width: 100%;
            }
            
            .nextcloud-footer-grid{
                width: 100%;
                display: grid;
            }

        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL('local/dbp-file-source/tabulator-tables/css/tabulator.min.css');
        console.log("tabulatorCss", tabulatorCss);

        return html`
            <div class="wrapper">
                <link rel="stylesheet" href="${tabulatorCss}">
                <div class="nextcloud-header">
                    <button class="button is-small ${classMap({hidden: !this.isPickerActive})}"
                        title="${i18n.t('nextcloud-file-picker.folder-up')}"
                        @click="${() => { this.loadDirectory(this.getParentDirectoryPath()); }}"><dbp-icon name="arrow-left"></dbp-icon></button>
                    <div class="nextcloud-logo ${classMap({"nextcloud-logo-sm": this.isPickerActive})}">
                         ${this.getCloudLogo()}
                    </div>
                </div>
                <div class="block text-center ${classMap({hidden: this.isPickerActive})}">
                    <h2 class="m-inherit">
                        ${this.nextcloudName}
                    </h2>
                    <p class="m-inherit">
                        ${i18n.t('nextcloud-file-picker.init-text-1', {name: this.nextcloudName})}   <br>           
                        ${i18n.t('nextcloud-file-picker.init-text-2')}              
                    </p>
                </div>
                <div class="block ${classMap({hidden: this.isPickerActive})}">
                    <button class="button  is-primary"
                            title="${i18n.t('nextcloud-file-picker.open-nextcloud-file-picker', {name: this.nextcloudName})}"
                            @click="${async () => { this.openFilePicker(); } }">${i18n.t('nextcloud-file-picker.connect-nextcloud', {name: this.nextcloudName})}</button>
                </div>
               
                <div class="nextcloud-content ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-nav">
                        <h2>${this.getBreadcrumb()}</h2>
                         <a class="int-link-external"
                                title="${i18n.t('nextcloud-file-picker.open-in-nextcloud', {name: this.nextcloudName})}"
                                href="${this.getNextCloudLink()}" target="_blank">${i18n.t('nextcloud-file-picker.open-in-nextcloud', {name: this.nextcloudName})} <svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="2.6842mm" width="2.6873mm" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 20.151879 20.141083"><g transform="translate(-258.5 -425.15)"><path style="stroke-linejoin:round;stroke:#000;stroke-linecap:round;stroke-width:1.2;fill:none" d="m266.7 429.59h-7.5029v15.002h15.002v-7.4634"/><path style="stroke-linejoin:round;stroke:#000;stroke-linecap:round;stroke-width:1.2;fill:none" d="m262.94 440.86 15.002-15.002"/><path style="stroke-linejoin:round;stroke:#000;stroke-linecap:round;stroke-width:1.2;fill:none" d="m270.44 425.86h7.499v7.499"/></g></svg></a>
                    </div>
                    <table id="directory-content-table" class="force-no-select"></table>
                </div>
                 <div class="block text-center m-inherit ${classMap({hidden: this.isPickerActive})}">
                    <p class="m-inherit">
                         ${i18n.t('nextcloud-file-picker.auth-info')}
                    </p>
                </div>
                <div class="nextcloud-footer ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-footer-grid">
                        <button class="button select-button is-primary"
                                @click="${() => { this.downloadFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
                        <div class="block ${classMap({hidden: this.statusText === ""})}">
                            <dbp-mini-spinner style="font-size: 0.7em"></dbp-mini-spinner>
                            ${this.statusText}
                        </div>
                       
                    </div>
                </div>
            </div>
        `;
    }
}
