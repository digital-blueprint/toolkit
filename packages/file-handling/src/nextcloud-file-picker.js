import {createInstance} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {createClient, parseXML} from 'webdav/web'; //parseStat
import {classMap} from 'lit-html/directives/class-map.js';
import {humanFileSize} from '@dbp-toolkit/common/i18next';
import Tabulator from 'tabulator-tables';
import MicroModal from './micromodal.es';
import {name as pkgName} from './../package.json';
import * as fileHandlingStyles from './styles';
import {encrypt, decrypt, parseJwt} from './crypto.js';


/**
 * NextcloudFilePicker web component
 */
export class NextcloudFilePicker extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;

        this.auth = {};
        this.authUrl = '';
        this.webDavUrl = '';
        this.nextcloudName = 'Nextcloud';
        this.nextcloudFileURL = '';
        this.loginWindow = null;
        this.isPickerActive = false;
        this.statusText = '';
        this.lastDirectoryPath = '/';
        this.directoryPath = '';
        this.webDavClient = null;
        this.tabulatorTable = null;
        this.allowedMimeTypes = '';
        this.directoriesOnly = false;
        this.maxSelectedItems = Number.MAX_VALUE;
        this.loading = false;
        this._onReceiveWindowMessage = this.onReceiveWindowMessage.bind(this);

        this.folderIsSelected = this._i18n.t('nextcloud-file-picker.load-in-folder');
        this.generatedFilename = '';
        this.replaceFilename = '';
        this.customFilename = '';
        this.uploadFileObject = null;
        this.uploadFileDirectory = null;
        this.fileList = [];
        this.fileNameCounter = 1;
        this.activeDirectoryRights = 'RGDNVCK';
        this.activeDirectoryACL = '';
        this.forAll = false;
        this.uploadCount = 0;
        this.abortUploadButton = false;
        this.abortUpload = false;
        this.authInfo = '';
        this.selectBtnDisabled = true;
        this.storeSession = false;
        this.boundCloseAdditionalMenuHandler = this.hideAdditionalMenu.bind(this);
        this.initateOpenAdditionalMenu = false;
        this.isInFavorites = false;
        this.isInFilteredRecent = false;
        this.isInRecent = false;
        this.userName = '';
        this.menuHeightBreadcrumb = -1;
        this.menuHeightAdditional = -1; 

        this.boundCloseBreadcrumbMenuHandler = this.hideBreadcrumbMenu.bind(this);
        this.initateOpenBreadcrumbMenu = false;

        this.disableRowClick = false;
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
            ...super.properties,
            lang: {type: String},
            auth: {type: Object},
            authUrl: {type: String, attribute: 'auth-url'},
            webDavUrl: {type: String, attribute: 'web-dav-url'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            isPickerActive: {type: Boolean, attribute: false},
            statusText: {type: String, attribute: false},
            folderIsSelected: {type: String, attribute: false},
            authInfo: {type: String, attribute: 'auth-info'},
            directoryPath: {type: String, attribute: 'directory-path'},
            allowedMimeTypes: {type: String, attribute: 'allowed-mime-types'},
            directoriesOnly: {type: Boolean, attribute: 'directories-only'},
            maxSelectedItems: {type: Number, attribute: 'max-selected-items'},
            loading: {type: Boolean, attribute: false},
            replaceFilename: {type: String, attribute: false},
            uploadFileObject: {type: Object, attribute: false},
            uploadFileDirectory: {type: String, attribute: false},
            activeDirectoryRights: {type: String, attribute: false},
            activeDirectoryACL: {type: String, attribute: false},
            abortUploadButton: {type: Boolean, attribute: false},
            selectBtnDisabled: {type: Boolean, attribute: true},
            userName: { type: Boolean, attribute: false },
            storeSession: {type: Boolean, attribute: 'store-nextcloud-session'},
            disableRowClick: {type: Boolean, attribute: false },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    this._i18n.changeLanguage(this.lang);
                    break;
                case "auth":
                    this._updateAuth();
                    break;
                case "directoriesOnly":
                    if (this.directoriesOnly && this._("#select_all_wrapper")) {
                        this._("#select_all_wrapper").classList.remove("button-container");
                        this._("#select_all_wrapper").classList.add("hidden");
                    }
                    if (!this.directoriesOnly && this._("#select_all_wrapper")) {
                        this._("#select_all_wrapper").classList.add("button-container");
                        this._("#select_all_wrapper").classList.remove("hidden");
                    }
            }
        });

        super.update(changedProperties);
    }

    disconnectedCallback() {
        window.removeEventListener('message', this._onReceiveWindowMessage);
        super.disconnectedCallback();
    }

    async firstUpdated() {
        // Give the browser a chance to paint
        await new Promise((r) => setTimeout(r, 0));
        if (this._("#select_all")) {
            let boundSelectHandler = this.selectAllFiles.bind(this);
            this._("#select_all").addEventListener('click', boundSelectHandler);
        }
        if (this.directoriesOnly && this._("#select_all_wrapper")) {
            this._("#select_all_wrapper").classList.remove("button-container");
            this._("#select_all_wrapper").classList.add("hidden");
        }

    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
        const i18n = this._i18n;
        this._loginStatus = '';
        this._loginState = [];
        this._loginCalled = false;

        this.updateComplete.then(() => {
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.addEventListener('message', this._onReceiveWindowMessage);
            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new Tabulator(this._("#directory-content-table"), {
                layout: "fitColumns",
                selectable: this.maxSelectedItems,
                selectableRangeMode: "drag",
                placeholder: this.directoriesOnly ? i18n.t('nextcloud-file-picker.no-data') : i18n.t('nextcloud-file-picker.no-data-type'),
                responsiveLayout: "collapse",
                responsiveLayoutCollapseStartOpen: false,
                resizableColumns: false,
                columns: [
                    {
                        width: 32,
                        minWidth: 32,
                        align: "center",
                        resizable: false,
                        headerSort: false,
                        formatter: "responsiveCollapse"
                    },
                    {
                        title: '<label id="select_all_wrapper" class="button-container select-all-icon">' +
                            '<input type="checkbox" id="select_all" name="select_all" value="select_all">' +
                            '<span class="checkmark" id="select_all_checkmark"></span>' +
                            '</label>',
                        field: "type",
                        align: "center",
                        headerSort: false,
                        width: 50,
                        responsive: 1,
                        formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag = that.getScopedTagName("dbp-icon");
                            let disabled = this.directoriesOnly ? "nextcloud-picker-icon-disabled" : "";
                            let icon = `<${icon_tag} name="empty-file" class="nextcloud-picker-icon ` + disabled + `"></${icon_tag}>`;
                            return (cell.getValue() === "directory") ? `<${icon_tag} name="folder" class="nextcloud-picker-icon"></${icon_tag}>` : icon;
                        }
                    },
                    {
                        title: i18n.t('nextcloud-file-picker.filename'),
                        responsive: 0,
                        widthGrow: 5,
                        minWidth: 150,
                        field: "basename",
                        sorter: "alphanum",
                        formatter: (cell) => {
                            var data = cell.getRow().getData();
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
                        minWidth: 84,
                        field: "size",
                        formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());
                        }
                    },
                    {
                        title: i18n.t('nextcloud-file-picker.mime-type'),
                        responsive: 2,
                        widthGrow: 1,
                        minWidth: 58,
                        field: "mime",
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
                        field: "lastmod",
                        sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            const d = Date.parse(cell.getValue());
                            const timestamp = new Date(d);
                            const year = timestamp.getFullYear();
                            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ("0" + timestamp.getDate()).slice(-2);
                            const hours = ("0" + timestamp.getHours()).slice(-2);
                            const minutes = ("0" + timestamp.getMinutes()).slice(-2);
                            return date + "." + month + "." + year + " " + hours + ":" + minutes;
                        }
                    },
                    {title: "rights", field: "props.permissions", visible: false},
                    {title: "acl", field: "props.acl-list.acl.acl-permissions", visible: false}
                ],
                initialSort: [
                    {column: "basename", dir: "asc"},
                    {column: "type", dir: "asc"},

                ],
                rowFormatter: (row) => {
                    let data = row.getData();
                    if (!this.checkFileType(data, this.allowedMimeTypes)) {   
                        row.getElement().classList.add("no-select");
                        row.getElement().classList.remove("tabulator-selectable");
                    }
                    if (this.directoriesOnly && typeof data.mime !== 'undefined') {
                        row.getElement().classList.add("no-select");
                        row.getElement().classList.remove("tabulator-selectable");
                    }
                },
                rowSelectionChanged: (data, rows) => {
                    if (!this.disableRowClick) {
                        if (data.length > 0 && this.directoriesOnly) {
                            this.folderIsSelected = i18n.t('nextcloud-file-picker.load-to-folder');
                        } else {
                            this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
                        }
                        if (!this.directoriesOnly && this.tabulatorTable && this.tabulatorTable.getSelectedRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)).length > 0) {
                            this.selectBtnDisabled = false;
                        } else {
                            this.selectBtnDisabled = true;
                        }
                        if (this._("#select_all_checkmark")) {
                            this._("#select_all_checkmark").title = this.checkAllSelected() ? i18n.t('clipboard.select-nothing') : i18n.t('clipboard.select-all');
                        }
                        this.requestUpdate();
                        console.log('selection changed');
                    }
                },
                rowClick: (e, row) => {
                    if (!this.disableRowClick) {
                        const data = row.getData();
                        if (!row.getElement().classList.contains("no-select")) {
                            if (this.directoriesOnly) {
                                // comment out if you want to navigate through folders with double click
                                const data = row.getData();
                                this.directoryClicked(e, data);
                                this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
                            } else {
                                switch (data.type) {
                                    case "directory":
                                        this.directoryClicked(e, data);
                                        break;
                                    case "file":
                                        if (this.tabulatorTable !== null
                                            && this.tabulatorTable.getSelectedRows().length === this.tabulatorTable.getRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)).length) {
                                            this._("#select_all").checked = true;
                                        } else {
                                            this._("#select_all").checked = false;
                                        }
                                        break;
                                }
                            }
                        } else {
                            row.deselect();
                        }
                    } else {
                        // TODO
                        console.log('reached');
                        if (this._('#tf-new-folder')) {
                            this._('#tf-new-folder').focus();
                        }
                    }
                },
                rowDblClick: (e, row) => {
                    // comment this in for double click directory change
                    /* if (this.directoriesOnly) {
                         const data = row.getData();
                         this.directoryClicked(e, data);
                         this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
                     }*/
                },
                rowAdded: (row) => {
                    if (that._('#new-folder-row')) { //TODO find a better condition
                        row.getElement().classList.toggle("addRowAnimation");
                    }
                },
                dataLoaded: () => {
                    if (this.tabulatorTable !== null) {
                        const that = this;
                        setTimeout(function(){
                            if (that._('.tabulator-responsive-collapse-toggle-open')) {
                                that._a('.tabulator-responsive-collapse-toggle-open').forEach(element => element.addEventListener("click", that.toggleCollapse.bind(that)));
                            }

                            if (that._('.tabulator-responsive-collapse-toggle-close')) {
                                that._a('.tabulator-responsive-collapse-toggle-close').forEach(element => element.addEventListener("click", that.toggleCollapse.bind(that)));
                            }
                        }, 0);
                    }
                }
            });

            // Strg + click select mode on desktop
            /*if (this.tabulatorTable.browserMobile === false) {
                this.tabulatorTable.options.selectableRangeMode = "click";
            }*/

            if (typeof this.allowedMimeTypes !== 'undefined' && this.allowedMimeTypes !== '' && !this.directoriesOnly) {
                this.tabulatorTable.setFilter(this.checkFileType, this.allowedMimeTypes);
            }
            // comment this in to show only directories in filesink
            /*
            if (typeof this.directoriesOnly !== 'undefined' && this.directoriesOnly) {
                this.tabulatorTable.setFilter([
                    {field:"type", type:"=", value:"directory"},
                ]);
            }
            */

            // TODO delete this
            // add folder on enter
            // this._('#new-folder').addEventListener('keydown', function (e) {
            //     if (e.keyCode === 13) {
            //         that.addFolder();
            //     }
            // });

            
        });
    }

    /**
     *  Request a re-render every time isLoggedIn()/isLoading() changes
     */
    _updateAuth() {
        this._loginStatus = this.auth['login-status'];

        let newLoginState = [this.isLoggedIn(), this.isLoading()];

        if (this._loginState.toString() !== newLoginState.toString()) {
            this.requestUpdate();
        }

        this._loginState = newLoginState;

        if (this.isLoggedIn() && !this._loginCalled ) {
            this._loginCalled = true;
            this.loginCallback();
        }
    }

    loginCallback() {
        this.checkLocalStorage();
    }

    /**
     * Returns if a person is set in or not
     *
     * @returns {boolean} true or false
     */
    isLoggedIn() {
        return (this.auth.person !== undefined && this.auth.person !== null);
    }

    /**
     * Returns true if a person has successfully logged in
     *
     * @returns {boolean} true or false
     */
    isLoading() {
        if (this._loginStatus === "logged-out")
            return false;

        return (!this.isLoggedIn() && this.auth.token !== undefined);
    }

    /**
     *
     */
    async checkLocalStorage() {
        if (!this.isLoggedIn() || !this.auth)
            return;
        const publicId = this.auth['person-id'];
        const token = parseJwt(this.auth.token);
        const sessionId = token ? token.sid : "";
        if (this.storeSession && sessionId
            && localStorage.getItem("nextcloud-webdav-username" + publicId)
            && localStorage.getItem("nextcloud-webdav-password" + publicId) ){
                try {
                    const userName = await decrypt(sessionId, localStorage.getItem("nextcloud-webdav-username" + publicId));
                    const password = await decrypt(sessionId, localStorage.getItem("nextcloud-webdav-password" + publicId));
                    this.webDavClient = createClient(
                        this.webDavUrl + "/" + userName,
                        {
                            username: userName,
                            password: password
                        }
                    );

                    this.userName = userName;

                    this.isPickerActive = true;
                    this.loadDirectory(this.directoryPath);
                } catch (e) {
                    localStorage.removeItem('nextcloud-webdav-username' + publicId);
                    localStorage.removeItem('nextcloud-webdav-password' + publicId);
                    return;
                }
        }
    }

    /**
     * check mime type of row
     *
     * @param data
     * @param filterParams
     */
    checkFileType(data, filterParams) {
        if (filterParams === '')
            return true;
        if (typeof data.mime === 'undefined') {
            return true;
        }
        const [fileMainType, fileSubType] = data.mime.split('/');
        const mimeTypes = filterParams.split(',');
        let deny = true;

        mimeTypes.forEach((str) => {
            const [mainType, subType] = str.split('/');
            deny = deny && ((mainType !== '*' && mainType !== fileMainType) || (subType !== '*' && subType !== fileSubType));
        });

        return !deny;
    }

    async openFilePicker() {
        const i18n = this._i18n;
        this.disableRowClick = false;
        if (this.webDavClient === null) {
            this.loading = true;
            this.statusText = i18n.t('nextcloud-file-picker.auth-progress');
            const authUrl = this.authUrl + "?target-origin=" + encodeURIComponent(window.location.href);
            this.loginWindow = window.open(authUrl, "Nextcloud Login",
                "width=400,height=400,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
        } else {
            this.loadDirectory(this.directoryPath, this.webDavClient);
        }
    }

    _a(selector) {
        return this.shadowRoot === null ? this.querySelectorAll(selector) : this.shadowRoot.querySelectorAll(selector);
    }

    async persistStorageMaybe() {
        if (navigator.storage && navigator.storage.persist) {
            if (await navigator.storage.persist())
                console.log("Storage will not be cleared except by explicit user action");
            else
                console.log("Storage may be cleared by the UA under storage pressure.");
        }
    }

    async onReceiveWindowMessage(event) {
        if (this.webDavClient === null) {
            const data = event.data;

            if (data.type === "webapppassword") {
                if (this.loginWindow !== null) {
                    this.loginWindow.close();
                }

                // See https://github.com/perry-mitchell/webdav-client/blob/master/API.md#module_WebDAV.createClient
                this.webDavClient = createClient(
                    data.webdavUrl || this.webDavUrl + "/" + data.loginName,
                    {
                        username: data.loginName,
                        password: data.token
                    }
                );


                if (this.storeSession && this.isLoggedIn() && this._("#remember-checkbox") && this._("#remember-checkbox").checked) {
                    this.persistStorageMaybe();
                    const publicId = this.auth['person-id'];
                    const token = parseJwt(this.auth.token);
                    const sessionId = token ? token.sid : "";
                    if (sessionId) {
                        const encrytedName = await encrypt(sessionId, data.loginName);
                        const encrytedToken = await encrypt(sessionId, data.token);
                        localStorage.setItem('nextcloud-webdav-username' + publicId, encrytedName);
                        localStorage.setItem('nextcloud-webdav-password' + publicId, encrytedToken);

                    }
                }

                this.loadDirectory(this.directoryPath);
                this.userName = data.loginName;
            }
        }
    }

    toggleCollapse(e) {
        const table = this.tabulatorTable;
        setTimeout(function() {
            table.redraw();
        }, 0);
    }

    /**
     * 
     * @param {*} data 
     * @returns reduced list of objects, including users files
     */
    filterUserFilesOnly(data) {
        // R = Share, S = Shared Folder, M = Group folder or external source, G = Read, D = Delete, NV / NVW = Write, CK = Create
        let result = [];

        for (let i = 0; i < data.length; i++) {
            if (data) {
                let file_perm = data[i].props.permissions;
                if (!file_perm.includes('M') && !file_perm.includes('S')) {
                    result.push(data[i]);
                }
            }
        }
        return result;
    }

    /**
     * 
     * @param {*} path 
     * @returns array including file path and base name
     */
    parseFileAndBaseName(path) {
        if (path[0] !== "/") { //TODO verify
            path = "/" + path;
        }
        while (/^.+\/$/.test(path)) {
            path = path.substr(0, path.length - 1);
        }
        path = decodeURIComponent(path);

        let array1 = this.webDavUrl.split('/');
        let array2 = path.split('/');
        for (let i = 0; i < array2.length; i++) {
            let item2 = array2[i];
            array1.forEach(item1 => {
                if (item1 === item2) {
                    array2.shift();
                    i--;
                }
            });
        }
        array2.shift();

        let basename = array2[array2.length - 1];
        let filename = '/' + array2.join('/');
        
        return [ filename, basename ];
    }

    /**
     * 
     * @param {*} response 
     * @returns list of file objects containing corresponding information
     */
    mapResponseToObject(response) {
        let results = [];

        response.forEach(item => {
            const [ filePath, baseName ] = this.parseFileAndBaseName(item.href);

            const prop = item.propstat.prop;
            let etag = typeof prop.getetag === 'string' ? prop.getetag.replace(/"/g, '') : null;
            let sizeVal = prop.getcontentlength ? prop.getcontentlength : '0';
            let fileType = prop.resourcetype && typeof prop.resourcetype === 'object' && typeof prop.resourcetype.collection !== 'undefined' ? 'directory' : 'file';
            
            let mimeType;
            if (fileType === 'file') {
                mimeType = prop.getcontenttype && typeof prop.getcontenttype === 'string' ? prop.getcontenttype.split(';')[0] : '';
            }

            let propsObject =  { getetag: etag, getlastmodified: prop.getlastmodified, getcontentlength: sizeVal, 
                                permissions: prop.permissions, resourcetype: fileType, getcontenttype: prop.getcontenttype };

            let statObject = { basename: baseName, etag: etag, filename: filePath, lastmod: prop.getlastmodified, 
                mime: mimeType, props: propsObject, size: parseInt(sizeVal, 10), type: fileType };

            results.push(statObject);
        });

        return results;
    }
    
    /**
     * Loads the favorites from WebDAV
     *
     */
    loadFavorites() {
        this.hideAdditionalMenu();
        const i18n = this._i18n;

        if (typeof this.directoryPath === 'undefined' || this.directoryPath === undefined) {
            this.directoryPath = '';
        }

        console.log("load nextcloud favorites");
        this.selectAllButton = true;
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker', {name: this.nextcloudName});
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = '';
        this.isInRecent = false;
        this.isInFilteredRecent = false;
        this.isInFavorites = true;
                    
        if (this.webDavClient === null) {
            // client is broken reload try to reset & reconnect
            this.tabulatorTable.clearData();
            this.webDavClient = null;
            let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
            this.loading = false;
            this.statusText = reloadButton;
        }

        //see https://github.com/perry-mitchell/webdav-client#customRequest
        this.webDavClient
            .customRequest('/', {method: 'REPORT', responseType: "text/xml", details: true, data: "<?xml version=\"1.0\"?>" +
                    "   <oc:filter-files  xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">" +
                    "       <oc:filter-rules>" +
                    "           <oc:favorite>1</oc:favorite>" +
                    "       </oc:filter-rules>" +
                    "       <d:prop>" +
                    "           <d:getlastmodified />" +
                    "           <d:resourcetype />" +
                    "           <d:getcontenttype />" +
                    "           <d:getcontentlength />" +
                    "           <d:getetag />" +
                    "           <oc:permissions />" +
                    "        </d:prop>" +
                    "   </oc:filter-files>"
                })
            .then(contents => {
                parseXML(contents.data).then(davResp => {
                    // console.log("-contents.data-----", davResp);
                    let dataObject = this.mapResponseToObject(davResp.multistatus.response);

                    this.loading = false;
                    this.statusText = "";
                    this.tabulatorTable.setData(dataObject);

                    if (this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span")) {
                        this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span").innerText = i18n.t('nextcloud-file-picker.no-favorites', { name: this.nextcloudName });
                    }

                    this.isPickerActive = true;
                    this._(".nextcloud-content").scrollTop = 0;
                    this._("#download-button").setAttribute("disabled", "true");

                });
            }).catch(error => { //TODO verify error catching
                console.error(error.message);

                // on Error: try to reload with home directory
                if (this.webDavClient !== null && error.message.search("401") === -1) {
                    console.log("error in load directory");
                    this.directoryPath = "";
                    this.loadDirectory("");
                }
                else {
                    this.loading = false;
                    this.statusText = html`<span class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                    this.isPickerActive = false;
                    this.tabulatorTable.clearData();
                    this.webDavClient = null;
                    let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                                title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                                @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
                    this.loading = false;
                    this.statusText = reloadButton;
                }
                this.isInFavorites = false;
        });
    }

     /**
     * Loads recent files and folders from WebDAV
     *
     */
    loadAllRecentFiles() {
        this.hideAdditionalMenu();
        const i18n = this._i18n;

        if (typeof this.directoryPath === 'undefined' || this.directoryPath === undefined) {
            this.directoryPath = '';
        }

        console.log("load recent files");
        this.selectAllButton = true;
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker', {name: this.nextcloudName});
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = '';
        this.isInFavorites = false;
        this.isInFilteredRecent = false;
        this.isInRecent = true;

        let date = new Date();
        date.setMonth(date.getMonth() - 3);
        let searchDate = date.toISOString().split('.')[0] + 'Z';

        if (this.webDavClient === null || this.userName === null) {
            // client is broken reload try to reset & reconnect
            this.tabulatorTable.clearData();
            this.webDavClient = null;
            let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
            this.loading = false;
            this.statusText = reloadButton;
        }

        //see https://github.com/perry-mitchell/webdav-client#customRequest
        this.webDavClient
            .customRequest('../..', { method: 'SEARCH', responseType: "text/xml", headers: { 'Content-Type': "text/xml" }, details: true, data: "<?xml version=\"1.0\" encoding='UTF-8'?>" +
                "   <d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">" +
                "       <d:basicsearch>" +
                "           <d:select>" +
                "               <d:prop>" +
                "                   <d:getlastmodified />" +
                "                   <d:resourcetype />" +
                "                   <d:getcontenttype />" +
                "                   <d:getcontentlength />" +
                "                   <d:getetag />" +
                "                   <oc:permissions />" +
                "                   <oc:size/>"+
                "                   <oc:owner-id/>" +
                "                   <oc:owner-display-name/>" +
                "               </d:prop>" +
                "           </d:select>" +
                "           <d:from>" +
                "               <d:scope>" +
                "                   <d:href>/files/" + this.userName + "/</d:href>" +
                "                   <d:depth>infinity</d:depth>" +
                "               </d:scope>" + 
                "           </d:from>" +
                "           <d:where> " +
                "               <d:gte>" +
                "                   <d:prop>" +
                "                      <d:getlastmodified/>" +
                "                   </d:prop>" +
                "                   <d:literal>" + searchDate + "</d:literal>" +
                "               </d:gte>" +
                "           </d:where>" +
                "           <d:orderby>" +
                "               <d:order>" +
                "                   <d:prop>" +
                "                       <d:getlastmodified/>" +
                "                   </d:prop>" +
                "                   <d:descending/>" +
                "               </d:order>" +
                "           </d:orderby>" +
                "           <d:limit>"+
                "               <d:nresults>15</d:nresults>" +
                "           </d:limit>"+
                "       </d:basicsearch>" +
                "   </d:searchrequest>"
            })
            .then(contents => {
                parseXML(contents.data).then(davResp => {
                    console.log('davResp', davResp);

                    let dataObject = this.mapResponseToObject(davResp.multistatus.response);
                    console.log("-contents.data-----", dataObject);

                    this.loading = false;
                    this.statusText = "";
                    this.tabulatorTable.setData(dataObject);
                    this.tabulatorTable.setSort([
                        {column: "lastmod", dir: "desc"}
                    ]);

                    if (this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span")) {
                        this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span").innerText = i18n.t('nextcloud-file-picker.no-recent-files');
                    }

                    this.isPickerActive = true;
                    this._(".nextcloud-content").scrollTop = 0;
                    this._("#download-button").setAttribute("disabled", "true");
                });
            }).catch(error => {
                console.error(error.message);

                // on Error: try to reload with home directory
                if (this.webDavClient !== null && error.message.search("401") === -1) {
                    console.log("error in load directory");
                    this.directoryPath = "";
                    this.loadDirectory("");
                }
                else {
                    this.loading = false;
                    this.statusText = html`<span class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                    this.isPickerActive = false;
                    this.tabulatorTable.clearData();
                    this.webDavClient = null;
                    let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                                title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                                @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
                    this.loading = false;
                    this.statusText = reloadButton;
                }

                this.isInRecent = false;
        });
    }

     /**
     * Loads recent files and folders from WebDAV
     *
     */
    loadMyRecentFiles() {
        this.hideAdditionalMenu();
        const i18n = this._i18n;

        if (typeof this.directoryPath === 'undefined' || this.directoryPath === undefined) {
            this.directoryPath = '';
        }

        console.log("load recent files");
        this.selectAllButton = true;
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker', {name: this.nextcloudName});
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = '';
        this.isInFavorites = false;
        this.isInRecent = false;
        this.isInFilteredRecent = true;

        let date = new Date();
        date.setMonth(date.getMonth() - 3);
        let searchDate = date.toISOString().split('.')[0] + 'Z';

        if (this.webDavClient === null || this.userName === null) {
            // client is broken reload try to reset & reconnect
            this.tabulatorTable.clearData();
            this.webDavClient = null;
            let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
            this.loading = false;
            this.statusText = reloadButton;
        }

        //see https://github.com/perry-mitchell/webdav-client#customRequest
        this.webDavClient
            .customRequest('../..', { method: 'SEARCH', responseType: "text/xml", headers: { 'Content-Type': "text/xml" }, details: true, data: "<?xml version=\"1.0\" encoding='UTF-8'?>" +
                "   <d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">" +
                "       <d:basicsearch>" +
                "           <d:select>" +
                "               <d:prop>" +
                "                   <d:getlastmodified />" +
                "                   <d:resourcetype />" +
                "                   <d:getcontenttype />" +
                "                   <d:getcontentlength />" +
                "                   <d:getetag />" +
                "                   <oc:permissions />" +
                "                   <oc:size/>"+
                "                   <oc:owner-id/>" +
                "                   <oc:owner-display-name/>" +
                "               </d:prop>" +
                "           </d:select>" +
                "           <d:from>" +
                "               <d:scope>" +
                "                   <d:href>/files/" + this.userName + "/</d:href>" +
                "                   <d:depth>infinity</d:depth>" +
                "               </d:scope>" + 
                "           </d:from>" +
                "           <d:where> " +
                "               <d:gte>" +
                "                   <d:prop>" +
                "                      <d:getlastmodified/>" +
                "                   </d:prop>" +
                "                   <d:literal>" + searchDate + "</d:literal>" +
                "               </d:gte>" +
                "           </d:where>" +
                "           <d:orderby>" +
                "               <d:order>" +
                "                   <d:prop>" +
                "                       <d:getlastmodified/>" +
                "                   </d:prop>" +
                "                   <d:descending/>" +
                "               </d:order>" +
                "           </d:orderby>" +
                "           <d:limit>"+
                "               <d:nresults>15</d:nresults>" +
                "           </d:limit>"+
                "       </d:basicsearch>" +
                "   </d:searchrequest>"
            })
            .then(contents => {
                parseXML(contents.data).then(davResp => {
                    console.log('davResp', davResp);

                    let dataObject = this.mapResponseToObject(davResp.multistatus.response);
                    console.log("-contents.data-----", dataObject);

                    // show only current user files
                    dataObject = this.filterUserFilesOnly(dataObject);

                    this.loading = false;
                    this.statusText = "";
                    this.tabulatorTable.setData(dataObject);
                    this.tabulatorTable.setSort([
                        {column: "lastmod", dir: "desc"}
                    ]);

                    if (this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span")) {
                        this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span").innerText = i18n.t('nextcloud-file-picker.no-recent-files');
                    }

                    this.isPickerActive = true;
                    this._(".nextcloud-content").scrollTop = 0;
                    this._("#download-button").setAttribute("disabled", "true");
                });
            }).catch(error => {
                console.error(error.message);

                // on Error: try to reload with home directory
                if (this.webDavClient !== null && error.message.search("401") === -1) {
                    console.log("error in load directory");
                    this.directoryPath = "";
                    this.loadDirectory("");
                }
                else {
                    this.loading = false;
                    this.statusText = html`<span class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                    this.isPickerActive = false;
                    this.tabulatorTable.clearData();
                    this.webDavClient = null;
                    let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')} <button class="button"
                                title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                                @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
                    this.loading = false;
                    this.statusText = reloadButton;
                }

                this.isInFilteredRecent = false;
        });
    }

    /**
     * Loads the directory from WebDAV
     *
     * @param path
     */
    loadDirectory(path) {
        this.hideAdditionalMenu();
        
        const i18n = this._i18n;
        if (typeof this.directoryPath === 'undefined' || this.directoryPath === undefined) {
            this.directoryPath = '';
        }
        if (path === undefined) {
            path = '';
        }

        this.disableRowClick = false;
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker', {name: this.nextcloudName});
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = path;
        if (this._("#select_all"))
            this._("#select_all").checked = false;

        // see https://github.com/perry-mitchell/webdav-client#getdirectorycontents
        if (this.webDavClient === null) {
            // client is broken reload try to reset & reconnect
            this.tabulatorTable.clearData();
            this.webDavClient = null;
            let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')}
            <button class="button"
                    title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                    @click="${async () => {
                        this.openFilePicker();
                    }}">
                <dbp-icon name="reload"></dbp-icon>
            </button>`;
            this.loading = false;
            this.statusText = reloadButton;
        }
        this.webDavClient
            .getDirectoryContents(path, {
                details: true, data: "<?xml version=\"1.0\"?>" +
                    "<d:propfind  xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\"  xmlns:ocs=\"http://open-collaboration-services.org/ns\">" +
                    "  <d:prop>" +
                    "        <d:getlastmodified />" +
                    "        <d:resourcetype />" +
                    "        <d:getcontenttype />" +
                    "        <d:getcontentlength />" +
                    "        <d:getetag />" +
                    "        <oc:permissions />" +
                    "        <nc:acl-list>" +
                    "           <nc:acl>" +
                    "               <nc:acl-permissions />" +
                    "           </nc:acl>" +
                    "        </nc:acl-list>" +
                    "  </d:prop>" +
                    "</d:propfind>"
            })
            .then(contents => {
                this.loading = false;
                this.statusText = "";
                this.tabulatorTable.setData(contents.data);
                this.isPickerActive = true;
                this.isInFavorites = false;
                this.isInRecent = false;
                this._(".nextcloud-content").scrollTop = 0;
                if (!this.activeDirectoryRights.includes("CK") && !this.activeDirectoryRights.includes("NV")) {
                    this._("#download-button").setAttribute("disabled", "true");
                } else {
                    this._("#download-button").removeAttribute("disabled");
                }
                if (this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span")) {
                    this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-placeholder > span").innerText = this.directoriesOnly ? i18n.t('nextcloud-file-picker.no-data') : i18n.t('nextcloud-file-picker.no-data-type');
                }

            }).catch(error => {
            console.error(error.message);

            // on Error: try to reload with home directory
            if ((path !== "/" && path !== "") && this.webDavClient !== null && error.message.search("401") === -1) {
                console.log("error in load directory");
                this.directoryPath = "";
                this.loadDirectory("");

            } else {
                this.loading = false;
                this.statusText = html`<span
                        class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                this.isPickerActive = false;
                this.tabulatorTable.clearData();
                this.webDavClient = null;
                let reloadButton = html`${i18n.t('nextcloud-file-picker.something-went-wrong')}
                <button class="button"
                        title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                        @click="${async () => {
                            this.openFilePicker();
                        }}">
                    <dbp-icon name="reload"></dbp-icon>
                </button>`;
                this.loading = false;
                this.statusText = reloadButton;
            }
        });
    }

    /**
     * Event Triggered when a directory in tabulator table is clicked
     *
     * @param event
     * @param file
     */
    directoryClicked(event, file) {
        // save rights of clicked directory
        if (typeof file.props !== 'undefined') {
            this.activeDirectoryRights = file.props.permissions;
            if (typeof file.props['acl-list'] !== "undefined" &&
                typeof file.props['acl-list']['acl']['acl-permissions'] !== "undefined" && file.props['acl-list']['acl']['acl-permissions']) {
                this.activeDirectoryACL = file.props['acl-list']['acl']['acl-permissions'];
            } else {
                this.activeDirectoryACL = '';
            }
        } else {
            this.activeDirectoryRights = 'SGDNVCK';
        }
        this.loadDirectory(file.filename);
        event.preventDefault();
    }

    /**
     * Download all files
     *
     * @param files
     */
    downloadFiles(files) {
        files.forEach((fileData) => this.downloadFile(fileData, files.length));

        this.tabulatorTable.deselectRow();
        if (this._("#select_all")) {
            this._("#select_all").checked = false;
        }
        const data = {"count": files.length};
        const event = new CustomEvent("dbp-nextcloud-file-picker-number-files",
            {"detail": data, bubbles: true, composed: true});
        this.dispatchEvent(event);

        if (files.length > 0) {
            this.sendSetPropertyEvent(
                'analytics-event',
                {category: 'FileHandlingNextcloud', action: 'DownloadFiles', name: files.length});
        }
    }

    /**
     * Download a single file
     *
     * @param fileData
     * @param maxUpload
     */
    downloadFile(fileData, maxUpload) {

        const i18n = this._i18n;
        this.loading = true;
        this.statusText = "Loading " + fileData.filename + "...";

        // https://github.com/perry-mitchell/webdav-client#getfilecontents
        this.webDavClient
            .getFileContents(fileData.filename)
            .then(contents => {
                // create file to send via event
                const file = new File([contents], fileData.basename, {type: fileData.mime});
                // send event
                const data = {"file": file, "data": fileData, "maxUpload": maxUpload};
                const event = new CustomEvent("dbp-nextcloud-file-picker-file-downloaded",
                    {"detail": data, bubbles: true, composed: true});
                this.dispatchEvent(event);
                this.loading = false;
                this.statusText = "";
            }).catch(error => {
            console.error(error.message);
            this.loading = false;
            this.statusText = html`<span
                    class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
        });
    }

    /**
     * Send the directory to filesink
     *
     * @param directory
     */
    sendDirectory(directory) {
        if (this.isInFavorites) {
            this.statusText = html`<span class="error"> ${ i18n.t('nextcloud-file-picker.error-save-to-favorites') } </span>`;
            return;
        } else if (this.isInRecent) { //TODO verify
            this.statusText = html`<span class="error"> ${ i18n.t('nextcloud-file-picker.error-save-to-recent') } </span>`;
            return;
        }
        
        const i18n = this._i18n;
        this.tabulatorTable.deselectRow();
        let path;

        if (!directory[0]) {
            path = this.directoryPath;
        } else {
            path = directory[0].filename;
        }
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.upload-to', {path: path});

        const event = new CustomEvent("dbp-nextcloud-file-picker-file-uploaded",
            {"detail": path, bubbles: true, composed: true});
        this.dispatchEvent(event);
    }


    /**
     * Upload Files to a directory
     *
     * @param files
     * @param directory
     */
    uploadFiles(files, directory) {
        const i18n = this._i18n;
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.upload-to', {path: directory});
        this.fileList = files;
        this.forAll = false;
        this.setRepeatForAllConflicts();
        this.uploadFile(directory);

        if (files.length > 0) {
            this.sendSetPropertyEvent(
                'analytics-event',
                {category: 'FileHandlingNextcloud', action: 'UploadFiles', name: files.length});
        }
    }

    /**
     * Upload a single file from this.filelist to given directory
     *
     * @param directory
     */
    async uploadFile(directory) {
        const i18n = this._i18n;
        if (this.abortUpload) {
            this.abortUpload = false;
            this.abortUploadButton = false;
            this.forAll = false;
            this.loading = false;
            this.statusText = i18n.t('nextcloud-file-picker.abort-message');
            this._("#replace_mode_all").checked = false;
            return;
        }
        if (this.fileList.length !== 0) {
            let file = this.fileList[0];
            this.replaceFilename = file.name;
            let path = directory + "/" + file.name;
            // https://github.com/perry-mitchell/webdav-client#putfilecontents
            let that = this;
            this.loading = true;
            this.statusText = i18n.t('nextcloud-file-picker.upload-to', {path: path});
            // contentLength: https://github.com/perry-mitchell/webdav-client/issues/266
            await this.webDavClient
                .putFileContents(path, file, {
                    contentLength: file.size,
                    overwrite: false, onUploadProgress: progress => {
                        /* console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);*/
                    }
                }).then(function () {
                    that.uploadCount += 1;
                    that.fileList.shift();
                    that.uploadFile(directory);
                }).catch(error => {
                    if (error.message.search("412") !== -1 || error.message.search("403") !== -1) {
                        this.generatedFilename = this.getNextFilename();
                        this._("#replace-filename").value = this.generatedFilename;
                        if (this.forAll) {
                            this.uploadFileObject = file;
                            this.uploadFileDirectory = directory;
                            this.abortUploadButton = true;
                            this.uploadFileAfterConflict();
                        } else {
                            this.replaceModalDialog(file, directory);
                        }
                    } else {
                        throw error;
                    }
                });
        } else {
            this.loadDirectory(this.directoryPath);
            this.loading = false;
            this.statusText = "";
            this._("#replace_mode_all").checked = false;
            this.forAll = false;
            this.customFilename = '';
            const event = new CustomEvent("dbp-nextcloud-file-picker-file-uploaded-finished",
                {bubbles: true, composed: true, detail: this.uploadCount});
            this.uploadCount = 0;
            this.abortUpload = false;
            this.abortUploadButton = false;
            this.dispatchEvent(event);

        }
    }

    /**
     * Upload a file after a conflict happens on webdav side
     *
     */
    async uploadFileAfterConflict() {
        const i18n = this._i18n;
        if (this.abortUpload) {
            this.abortUpload = false;
            this.abortUploadButton = false;
            this.forAll = false;
            this.loading = false;
            this.statusText = i18n.t('nextcloud-file-picker.abort-message');
            this._("#replace_mode_all").checked = false;
            return;
        }
        let path = "";
        let overwrite = false;
        let file = this.uploadFileObject;
        let directory = this.uploadFileDirectory;

        if (this._("input[name='replacement']:checked").value === "ignore") {
            MicroModal.close(this._("#replace-modal"));
            this.forAll ? this.fileList = [] : this.fileList.shift();
            this.uploadFile(directory);
            return true;
        } else if (this._("input[name='replacement']:checked").value === "new-name") {
            if (this.generatedFilename !== this._("#replace-filename").value) {
                this.customFilename = this._("#replace-filename").value;
            }
            path = directory + "/" + this._("#replace-filename").value;
            MicroModal.close(this._("#replace-modal"));
            this.replaceFilename = this._("#replace-filename").value;
        } else {
            path = directory + "/" + this.uploadFileObject.name;
            overwrite = true;
        }

        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.upload-to', {path: path});

        let that = this;
        // https://github.com/perry-mitchell/webdav-client#putfilecontents
        // contentLength: https://github.com/perry-mitchell/webdav-client/issues/266
        await this.webDavClient
            .putFileContents(path, file, {
                contentLength: file.size,
                overwrite: overwrite, onUploadProgress: progress => {
                    /*console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);*/
                }
            }).then(content => {
                MicroModal.close(this._("#replace-modal"));
                this.uploadCount += 1;
                that.fileList.shift();
                that.uploadFile(directory);
            }).catch(error => {
                if (error.message.search("412") !== -1) {
                    MicroModal.close(that._("#replace-modal"));
                    this.generatedFilename = this.getNextFilename();
                    this._("#replace-filename").value = this.generatedFilename;
                    if (this.forAll) {
                        this.uploadFileObject = file;
                        this.uploadFileDirectory = directory;
                        this.abortUploadButton = true;
                        this.uploadFileAfterConflict();
                    } else {
                        this.replaceModalDialog(file, directory);
                    }
                } else {
                    throw error;
                }
            });

        this.fileNameCounter = 1;
    }

    /**
     * Check permissions of a given file in the active directory
     * no rename: if you dont have create permissions
     * no replace: if you dont have write permissions
     *
     * R = Share, S = Shared Folder, M = Group folder or external source, G = Read, D = Delete, NV / NVW = Write, CK = Create
     *
     * @param file
     * @returns {number}
     */
    checkRights(file) {

        // nextcloud permissions
        let file_perm = 0;
        let active_directory_perm = this.activeDirectoryRights;
        let rows = this.tabulatorTable.searchRows("basename", "=", this.replaceFilename);
        if (typeof rows[0] !== 'undefined' && rows[0]) {
            file_perm = rows[0].getData().props.permissions;
        } else {
            file_perm = "";
        }

        /* ACL permissions: If ACL > permssions comment this in
        if (this.activeDirectoryACL !== '') {
            console.log("ACL SET");
            active_directory_perm = "MG";
            if (this.activeDirectoryACL & (1 << (3 - 1))) {
                active_directory_perm = "CK";
                console.log("ACL CREATE");
            }
            if (this.activeDirectoryACL & (1 << (2 - 1))) {
                active_directory_perm += "NV";
                console.log("ACL WRITE");
            }
        }

        // if file has acl rights take that
        if (typeof rows[0].getData().props['acl-list'] !== 'undefined' && rows[0].getData().props['acl-list'] &&
            rows[0].getData().props['acl-list']['acl']['acl-permissions'] !== '') {
            console.log("FILE HAS ACL");
            file_perm = "MG";

            if (rows[0].getData().props['acl-list']['acl']['acl-permissions'] & (1 << (3 - 1))) {
                file_perm = "CK";
                console.log("FILE ACL CREATE");
            }
            if (rows[0].getData().props['acl-list']['acl']['acl-permissions'] & (1 << (2 - 1))) {
                file_perm += "NV";
                console.log("FILE ACL WRITE");
            }
        }
        */

        // all allowed
        if (active_directory_perm.includes("CK") && file_perm.includes("NV")) {
            return -1;
        }

        // read only file but you can write to directory = only create and no edit
        if (active_directory_perm.includes("CK") && !file_perm.includes("NV")) {
            return 1;
        }

        // only edit and no create
        if (!active_directory_perm.includes("CK") && file_perm.includes("NV")) {
            return 2;
        }

        // read only directory and read only file
        return 0;

    }

    /**
     * Open the replace Modal Dialog with gui where forbidden actions are disabled
     *
     * @param file
     * @param directory
     */
    replaceModalDialog(file, directory) {
        const i18n = this._i18n;
        this.uploadFileObject = file;
        this.uploadFileDirectory = directory;
        let rights = this.checkRights(file);
        // read only directory or read only file
        if (rights === 0) {
            this.loading = false;
            this.statusText = i18n.t('nextcloud-file-picker.readonly');
            return;
        }
        // read only file but you can write to directory = only create and no edit
        else if (rights === 1) {
            this.loading = false;
            this.statusText = i18n.t('nextcloud-file-picker.onlycreate');
            this._("#replace-replace").setAttribute("disabled", "true");
            this._("#replace-new-name").removeAttribute("disabled");
            this._("#replace-replace").checked = false;
            this._("#replace-new-name").checked = true;
            this.setInputFieldVisibility();
            this._("#replace-new-name").focus();
        }
        // only edit and no create
        else if (rights === 2) {
            this.loading = false;
            this.statusText = i18n.t('nextcloud-file-picker.onlyedit');
            this._("#replace-new-name").setAttribute("disabled", "true");
            this._("#replace-replace").removeAttribute("disabled");
            this._("#replace-new-name").checked = false;
            this._("#replace-replace").checked = true;
            this.setInputFieldVisibility();
            this._("#replace-replace").focus();
        }
        // all allowed
        else {
            this._("#replace-new-name").removeAttribute("disabled");
            this._("#replace-replace").removeAttribute("disabled");
            this._("#replace-replace").checked = false;
            this._("#replace-new-name").checked = true;
            this.setInputFieldVisibility();
            this._("#replace-new-name").focus();
        }
        MicroModal.show(this._('#replace-modal'), {
            disableScroll: true,
            onClose: modal => {
                this.statusText = "";
                this.loading = false;
            },
        });
    }

    closeDialog(e) {
        if (this.tabulatorTable) {
            this.tabulatorTable.deselectRow();
        }
        if (this._("#select_all")) {
            this._("#select_all").checked = false;
        }
        MicroModal.close(this._('#modal-picker'));
    }

    /**
     * Returns a filename with the next counter number.
     *
     * @returns {string} The next filename
     */
    getNextFilename() {
        let nextFilename = "";
        let splitFilename;
        if (this.forAll && this.customFilename !== '') {
            splitFilename = this.customFilename.split(".");
        } else {
            splitFilename = this.replaceFilename.split(".");
        }

        let splitBracket = splitFilename[0].split('(');
        if (splitBracket.length > 1) {
            let numberString = splitBracket[1].split(')');
            if (numberString.length > 1 && !isNaN(parseInt(numberString[0]))) {
                let number = parseInt(numberString[0]);
                this.fileNameCounter = number + 1;
                nextFilename = splitBracket[0] + "(" + this.fileNameCounter + ")";
            } else {
                nextFilename = splitFilename[0] + "(" + this.fileNameCounter + ")";
            }
        } else {
            nextFilename = splitFilename[0] + "(" + this.fileNameCounter + ")";
        }
        if (splitFilename.length > 1) {
            for (let i = 1; i < splitFilename.length; i++) {
                nextFilename = nextFilename + "." + splitFilename[i];
            }
        }
        this.fileNameCounter++;
        return nextFilename;
    }

    /**
     * Disables or enables the input field for the new file name
     */
    setInputFieldVisibility() {
        this._("#replace-filename").disabled = !this._("#replace-new-name").checked;
    }

    /**
     * Returns text for the cancel button depending on number of files
     *
     * @returns {string} correct cancel text
     */
    getCancelText() {
        const i18n = this._i18n;
        if (this.fileList.length > 1) {
            return i18n.t('nextcloud-file-picker.replace-cancel-all');
        }
        return i18n.t('nextcloud-file-picker.replace-cancel');
    }

    /**
     *
     */
    cancelOverwrite() {
        this.statusText = "";
        this.loading = false;
        this.fileList = [];
    }

    /**
     *
     */
    setRepeatForAllConflicts() {
        this.forAll = this._("#replace_mode_all").checked;
    }

    /**
     * Add new folder with webdav
     *
     */
    openAddFolderDialogue() {
        const i18n = this._i18n;
        if (this._('.addRowAnimation')) {
            this._('.addRowAnimation').classList.remove('addRowAnimation');
        }
        this._('#new-folder-wrapper').classList.toggle('hidden');
        if (this._('#new-folder-wrapper').classList.contains('hidden')) {
            this._('#add-folder-button').setAttribute("name", "plus");
            this._('#add-folder-button').setAttribute("title", i18n.t('nextcloud-file-picker.add-folder-open'));
        } else {
            this._('#add-folder-button').setAttribute("name", "close");
            this._('#add-folder-button').setAttribute("title", i18n.t('nextcloud-file-picker.add-folder-close'));
            this._('#new-folder').focus();
        }
    }

    addOpenFolderTableEntry() {
        const i18n = this._i18n;
        if (this._('.addRowAnimation')) {
            this._('.addRowAnimation').classList.remove('addRowAnimation');
        }

        let props = {permissions: 'RGDNVCK'};
        var row = {
            type: "directory",
            filename: "",
            basename: "",
            props: props
        };
        this.tabulatorTable.addRow(row, 1, 1);

        // row id
        this._('#directory-content-table').querySelector("div.tabulator-tableHolder > div.tabulator-table > div.tabulator-row:nth-child(1)").setAttribute('id', 'new-folder-row');

        this._('#new-folder-row').setAttribute('style', 'background: #259207; color: white');
        this._('#new-folder-row').querySelector("div.tabulator-cell:nth-child(1) > div > span.tabulator-responsive-collapse-toggle-open").classList.add('new-folder-selected');
        this._('#new-folder-row').querySelector("div.tabulator-cell:nth-child(1) > div > span.tabulator-responsive-collapse-toggle-close").classList.add('new-folder-selected');

        this._('#new-folder-row').querySelector("div.tabulator-cell:nth-child(6)").innerText = '';
        this._('#new-folder-row').querySelector("div.tabulator-cell:nth-child(3)").setAttribute('id', 'new-folder-cell');

        // add text input field
        this._('#new-folder-cell').innerHTML = '<input type="text" class="input" name="tf-new-folder" id ="tf-new-folder" value="" placeholder="'+ i18n.t('nextcloud-file-picker.new-folder-placeholder') + '" />';

        // add event listener for pressing enter to save new folder with given name
        this._('#tf-new-folder').addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                console.log('enter pressed');
                this.addNewFolder();
            }
        })

        this._('#tf-new-folder').addEventListener("keyup", ({key}) => {
            if (key === "Escape") {
                console.log('ESC pressed');
                // TODO abbrechen
            }
        })

        this._('#tf-new-folder').addEventListener("click", ({key}) => {
            //TODO add click rules
        })


        // during folder creation it should not be possible to click something
        this.disableRowClick = true;

        // disable selection of rows during folder creation
        this.tabulatorTable.getRows().forEach((row) => {
            row.getElement().classList.add("no-select");
            row.getElement().classList.remove("tabulator-selectable");
        })

        // set focus to text field
        // this._('#tf-new-folder').focus();
    }

    addNewFolder() {
        const i18n = this._i18n;
        if (this._('#tf-new-folder').value !== "") {
            let folderName = this._('#tf-new-folder').value;
            if (typeof this.directoryPath === 'undefined') {
                this.directoryPath = '';
            }
            let folderPath = this.directoryPath + "/" + folderName;
            this.webDavClient.createDirectory(folderPath).then(contents => {
                const d = new Date();
                let props = {permissions: 'RGDNVCK'};
                this.tabulatorTable.addRow({
                    type: "directory",
                    filename: folderPath,
                    basename: folderName,
                    lastmod: d,
                    props: props
                }, true);
                this.statusText = i18n.t('nextcloud-file-picker.add-folder-success', {folder: folderName});
                this.loading = false;


            }).catch(error => {
                this.loading = false;
                if (error.message.search("405") !== -1) {
                    this.statusText = html`<span
                            class="error"> ${i18n.t('nextcloud-file-picker.add-folder-error', {folder: folderName})} </span>`;
                } else {
                    this.statusText = html`<span
                            class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                }  
            })
            .finally(() => { // folder should be created now - delete default entry
                // this.tabulatorTable.deleteRow(row);
                var row = this.tabulatorTable.getRowFromPosition(1);
                row.delete();
                // console.log(this.tabulatorTable.getData());
                this.disableRowClick = false;

          
                this.tabulatorTable.getRows().forEach((row) => {
                    let data = row.getData();
                    if (!this.checkFileType(data, this.allowedMimeTypes)) {   
                        row.getElement().classList.remove("no-select");
                        row.getElement().classList.add("tabulator-selectable");
                    }
                    if (!(this.directoriesOnly && typeof data.mime !== 'undefined')) {
                        row.getElement().classList.remove("no-select");
                        row.getElement().classList.add("tabulator-selectable");
                    }
                })
            });
        }
    }

    /**
     * Add new folder with webdav
     *
     */
    addFolder() {
        const i18n = this._i18n;
        if (this._('#new-folder').value !== "") {
            let folderName = this._('#new-folder').value;
            if (typeof this.directoryPath === 'undefined') {
                this.directoryPath = '';
            }
            let folderPath = this.directoryPath + "/" + folderName;
            this.webDavClient.createDirectory(folderPath).then(contents => {
                // this.loadDirectory(this.directoryPath);
                const d = new Date();
                let props = {permissions: 'RGDNVCK'};
                this.tabulatorTable.addRow({
                    type: "directory",
                    filename: folderPath,
                    basename: folderName,
                    lastmod: d,
                    props: props
                }, true);
                this.statusText = i18n.t('nextcloud-file-picker.add-folder-success', {folder: folderName});
                this.loading = false;
            }).catch(error => {
                this.loading = false;
                if (error.message.search("405") !== -1) {
                    this.statusText = html`<span
                            class="error"> ${i18n.t('nextcloud-file-picker.add-folder-error', {folder: folderName})} </span>`;
                } else {
                    this.statusText = html`<span
                            class="error"> ${i18n.t('nextcloud-file-picker.webdav-error', {error: error.message})} </span>`;
                }
            });

            this._('#new-folder').value = '';
            this.openAddFolderDialogue();
        }
    }

    /**
     * Select or deselect all files from tabulator table
     *
     */
    selectAllFiles() {
        let allSelected = this.checkAllSelected();
        if (allSelected) {
            this.tabulatorTable.getSelectedRows().forEach(row => row.deselect());
        } else {
            this.tabulatorTable.selectRow(this.tabulatorTable.getRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)));
        }
    }

    checkAllSelected() {
        if (this.tabulatorTable) {
            let maxSelected = this.tabulatorTable.getRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)).length;
            let selected = this.tabulatorTable.getSelectedRows().length;
            if (selected === maxSelected) {
                return true;
            }
        }
        return false;
    }

    logOut() {
        this.webDavClient = null;
        this.isPickerActive = false;
        if (this.auth) {
            const publicId = this.auth['person-id'];
            localStorage.removeItem('nextcloud-webdav-username' + publicId);
            localStorage.removeItem('nextcloud-webdav-password' + publicId);
        }
    }

    /**
     * Returns the parent directory path
     *
     * @returns {string} parent directory path
     */
    getParentDirectoryPath() {
        if (typeof this.directoryPath === 'undefined') {
            this.directoryPath = '';
        }
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
        const i18n = this._i18n;
        if (typeof this.directoryPath === 'undefined') {
            this.directoryPath = '';
        }
        let htmlpath = [];
        htmlpath[0] = html`<span class="breadcrumb"><a class="home-link" @click="${() => {
            this.loadDirectory("");
        }}" title="${i18n.t('nextcloud-file-picker.folder-home')}"><dbp-icon name="home"></dbp-icon> </a></span>`;
        
        if (this.isInFavorites) {
            htmlpath[1] = html`<span> › </span><span class="breadcrumb"><a @click="${() => {
                this.loadDirectory(path);
            }}" title="${i18n.t('nextcloud-file-picker.favorites-title')}">${i18n.t('nextcloud-file-picker.favorites-title')}</a></span>`;

        } else if (this.isInRecent) {
            htmlpath[1] = html`<span> › </span><span class="breadcrumb"><a @click="${() => {
                this.loadDirectory(path);
            }}" title="${i18n.t('nextcloud-file-picker.recent-files-title')}">${i18n.t('nextcloud-file-picker.recent-files-title')}</a></span>`;

        } else if (this.isInFilteredRecent) { 
            htmlpath[1] = html`<span> › </span><span class="breadcrumb"><a @click="${() => {
                this.loadDirectory(path);
            }}" title="${i18n.t('nextcloud-file-picker.my-recent-files-title')}">${i18n.t('nextcloud-file-picker.my-recent-files-title')}</a></span>`;
        
        } else { // case normal folders
            const directories = this.directoryPath.split('/');
            if (directories[1] === "") {
                return htmlpath;
            }
            for (let i = 1; i < directories.length; i++) {
                let path = "";
                for (let j = 1; j <= i; j++) {
                    path += "/";
                    path += directories[j];
                }

                htmlpath[i] = html`<span> › </span><span class="breadcrumb"><a @click="${() => {
                    this.loadDirectory(path);
                }}" title="${i18n.t('nextcloud-file-picker.load-path-link', {path: directories[i]})}">${directories[i]}</a></span>`;
            }
            
            let length = htmlpath.length;
            let width = window.innerWidth;

            if (length > 3 && width <= 768) { //breadcrumb longer than 3 && only for mobile view

                let path_temp = [];

                // for (let i = 2; i < htmlpath.length - 1; i++) {
                //     path_temp[i] = html`<li class="breadcrumb-${i}" id="breadcrumb-${i}">${htmlpath[i]}</li>`;
                // }

                for (let i = 2; i < directories.length - 1; i++) {
                    let path = "";
                    for (let j = 1; j <= i; j++) {
                        path += "/";
                        path += directories[j];
                    }
    
                    path_temp[i] = html`<li class="breadcrumb-${i}" id="breadcrumb-${i}"><a @click="${() => {
                        this.loadDirectory(path);
                    }}" title="${i18n.t('nextcloud-file-picker.load-path-link', {path: directories[i]})}">${directories[i]}</a></li>`;
                }

                let shortcrumb = [];

                shortcrumb[0] = htmlpath[0];
                shortcrumb[1] = html`<span> › </span>
                    <span class="breadcrumb"><a class="extended-breadcrumb-link" @click="${() => { this.toggleBreadcrumbMenu(); }}" title="TODO">. . .</a><div class="breadcrumb-menu"><ul class='extended-breadcrumb-menu hidden'>${path_temp}</ul></div></span>`;
                    
                shortcrumb[2] = htmlpath[length - 1];
                
                return shortcrumb;
            }
        }

        return htmlpath;
    }

    toggleBreadcrumbMenu() {
        const menu = this.shadowRoot.querySelector("ul.extended-breadcrumb-menu");
        const menuStart = this.shadowRoot.querySelector("a.extended-breadcrumb-link");

        if (menu === null || menuStart === null) {
            return;
        }

        menu.classList.toggle('hidden'); //sets hidden or removes it

        // computations for overflow - begin
        //if (this.menuHeightBreadcrumb === -1) {
            this.menuHeightBreadcrumb = menu.clientHeight;
            console.log("menuheight: ", this.menuHeightBreadcrumb);
        //}

        let topValue = menuStart.getBoundingClientRect().bottom;
        console.log("topValue", topValue);
        let isMenuOverflow = this.menuHeightBreadcrumb + topValue >= this._('.wrapper').offsetHeight ? true : false;
        
        console.log("modal.offsetHeight: ", this._('.wrapper').offsetHeight);
        console.log("ismenuoverflow: ", isMenuOverflow);
        console.log("navigation height: ", this._('.nextcloud-nav').offsetHeight);

        //set max-width to window with 
        let maxWidth = this._('.wrapper').offsetWidth;
        console.log ("offsetWidth", maxWidth);
        
        if (isMenuOverflow && !menu.classList.contains('hidden')) {
            let actualHeight = this._('.wrapper').offsetHeight - this._('.nextcloud-nav').offsetHeight;
            console.log("actual height: ", actualHeight);

            menu.setAttribute('style', 'position: fixed;top: ' + topValue + 'px;height: ' + actualHeight + 'px;max-width: ' + maxWidth + 'px;overflow-y: auto;');
            menu.scrollTop = 0;

            document.body.setAttribute('style', 'overflow:hidden;'); //TODO delete?

        } else if (isMenuOverflow && menu.classList.contains('hidden')) {

            console.log("isMenuOverflow AND hidden - remove attributes");

            document.body.removeAttribute('style', 'overflow:hidden;'); //TODO delete?

            menu.removeAttribute('style');

        }
        // computations for overflow - end

        if (!menu.classList.contains('hidden')) { // add event listener for clicking outside of menu
            document.addEventListener('click', this.boundCloseBreadcrumbMenuHandler);
            console.log('add event listener');
            this.initateOpenBreadcrumbMenu = true;
        }
        else {
            document.removeEventListener('click', this.boundCloseBreadcrumbMenuHandler);
            console.log('delete event listener');

            menu.removeAttribute('style');
        }
    }

    hideBreadcrumbMenu() {
        if (this.initateOpenBreadcrumbMenu) {
            this.initateOpenBreadcrumbMenu = false;
            return;
        }
        const menu = this.shadowRoot.querySelector("ul.extended-breadcrumb-menu");
        if (menu && !menu.classList.contains('hidden'))
            this.toggleBreadcrumbMenu();
    }

    /**
     * Returns Link to Nextcloud with actual directory
     *
     * @returns {string} actual directory Nextcloud link
     */
    getNextCloudLink() {
        return this.nextcloudFileURL + this.directoryPath;
    }

    toggleMoreMenu() {
        const menu = this.shadowRoot.querySelector("ul.extended-menu");
        const menuStart = this.shadowRoot.querySelector("a.extended-menu-link");

        if (menu === null || menuStart === null) {
            return;
        }

        menu.classList.toggle('hidden'); //sets hidden or removes it

        // TODO: fix or delete
        // computations for overflow - begin
        // if (this.menuHeightAdditional === -1) {
        //     this.menuHeightAdditional = menu.clientHeight;
        // }

        // let topValue = menuStart.getBoundingClientRect().bottom;
        // let isMenuOverflow = this.menuHeightAdditional + topValue >= window.innerHeight ? true : false;
        
        // if (isMenuOverflow && !menu.classList.contains('hidden')) {
        //     menu.setAttribute('style', 'position: fixed;top: ' + topValue + 'px;bottom: 0;border-bottom: 0;overflow-y: auto;');
        //     menu.scrollTop = 0;
        //     document.body.setAttribute('style', 'overflow:hidden;');
        // } else if (isMenuOverflow && menu.classList.contains('hidden')) {
        //     document.body.removeAttribute('style', 'overflow:hidden;');
        //     menu.removeAttribute('style');
        // }
        // computations for overflow - end

        if (!menu.classList.contains('hidden')) { // add event listener for clicking outside of menu
            document.addEventListener('click', this.boundCloseAdditionalMenuHandler);
            console.log('add event listener');
            this.initateOpenAdditionalMenu = true;
        }
        else {
            document.removeEventListener('click', this.boundCloseAdditionalMenuHandler);
            console.log('delete event listener');
        }
    }

    hideAdditionalMenu() {
        if (this.initateOpenAdditionalMenu) {
            this.initateOpenAdditionalMenu = false;
            return;
        }
        const menu = this.shadowRoot.querySelector("ul.extended-menu");
        if (menu && !menu.classList.contains('hidden'))
            this.toggleMoreMenu();
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

            .extended-breadcrumb-menu li a {
                max-width: none;
                display: inline;
            }
            
            .nextcloud-nav { /** sticky header - TODO nur mobil! **/
                /** position: absolute;  relative **/
                position: relative;
                width: 100%;
            }

            .nextcloud-header.hidden {
                display: none!important;
            }

            .nextcloud-header {
                /** padding-bottom: 40px; 10px**/
                /** height: 33px; TODO nur mobil! **/
            }

            .breadcrumb-menu {
                display: inline;
            }

            .extended-breadcrumb-menu li {
                padding: 7px;
                padding-right: 46px;
                overflow: hidden;
            }

            .extended-breadcrumb-menu li.active {
                background-color: var(--dbp-dark);
                color: var(--dbp-light);
            }

            .extended-breadcrumb-menu li.active a:hover {
                color: var(--dbp-light);
            }

            .extended-breadcrumb-menu a.inactive {
                color: var(--dbp-muted-text);
                pointer-events: none;
                cursor: default;
            }

            .extended-breadcrumb-menu {
                list-style: none;
                border: black 1px solid;
                position: absolute;
                background-color: white;
                z-index: 1000;
                /** display: grid; **/
            }
        
            .extended-breadcrumb-menu a:hover {
                color: #E4154B;
            }

            .button-container.filter-user {
                line-height: 28px;
                padding-left: 40px;
            }

            .tabulator-row.no-select.tabulator-selected {
                background-color: white;
                color: #333;
            }

            input[type=text]#tf-new-folder:focus {
                border: none;
                background: transparent;
                width: 100%;
                height: 100%;
            }

            input[type=text]#tf-new-folder:focus-visible {
                outline: none;
            }

            input[type=text]#tf-new-folder::placeholder {
                color: #333;
                font-weight: 300;
            }

            #tf-new-folder::-webkit-input-placeholder {
                color: #333;
                font-weight: 300;
            }

            #tf-new-folder:-moz-placeholder {
                color: #333;
                font-weight: 300;
            }

            #tf-new-folder::-moz-placeholder {
                color: #333;
                font-weight: 300;
            }

            #tf-new-folder::-ms-input-placeholder {
                color: #333;
                font-weight: 300;
            }

            input[type=text]#tf-new-folder {
                border: 0px;
                background: transparent;
                width: 100%;
                height: 100%;
                margin-left: -8px;
            }

            .new-folder-selected::after {
                filter: invert(100%);
            }

            .visible {
                display: unset;
            }

            .block {
                margin-bottom: 10px;
            }

            .error {
                color: var(--dbp-danger-bg-color);
            }

            .filter-options-wrapper {
                padding-right: 0px;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 4px; /** align with */
            }

            .extended-menu li {
                padding: 7px;
                padding-right: 46px;
            }

            .extended-menu li.active {
                background-color: var(--dbp-dark);
                color: var(--dbp-light);
            }
            .extended-menu li.active a:hover {
                color: var(--dbp-light);
            }

            .extended-menu a.inactive {
                color: var(--dbp-muted-text);
                pointer-events: none;
                cursor: default;
            }

            .extended-menu a {
                padding: 8px;
            }

            .extended-menu {
                list-style: none;
                border: black 1px solid;
                position: absolute;
                background-color: white;
                z-index: 1000;
                right: 0px;
            }

            .extended-menu a:hover {
                color: #E4154B;
            }

            .nextcloud-header {
                /**margin-bottom: 2rem;**/
                /**display: inline-grid; TODO**/
                width: 100%;
                /**grid-template-columns: auto auto;**/
            }

            .nextcloud-header div button {
                justify-self: start;
            }

            .nextcloud-intro {
                text-align: center;
            }

            .nextcloud-logo {
                width: 80px;
                height: 95px;
                justify-self: end;
                transition: all 0.5s ease;
                margin: auto;
            }

            .nextcloud-logo-image {
                height: 100%;
                width: 100%;
                background-image: var(--dbp-override-image-nextcloud, url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M69.3 86.1l-46.1 0C11 85.9 1.1 75.9 1.1 63.7c0-11.8 9.1-21.4 20.6-22.4 0.5-15.2 13-27.4 28.3-27.4 3.4 0 6.6 0.5 9.2 1.6 6.2 2.1 11.4 6.4 14.8 12 6.5 1 12.7 4.3 16.9 9.1 5 5.5 7.8 12.6 7.8 19.9C98.8 72.8 85.6 86.1 69.3 86.1zM23.6 80.6h45.7c13.3 0 24-10.8 24-24 0-6-2.3-11.8-6.4-16.2 -3.7-4.2-9.1-6.9-14.9-7.5l-1.4-0.2L70 31.4c-2.8-5.1-7.2-8.9-12.6-10.7l-0.1 0c-2-0.8-4.5-1.2-7.2-1.2 -12.6 0-22.9 10.3-22.9 22.9v4.5h-3.6c-9.3 0-17 7.6-17 17C6.6 73 14.3 80.6 23.6 80.6z'/%3E%3C/svg%3E"));
                background-repeat: no-repeat;
                background-position: center;
            }

            .nextcloud-logo-sm {
                width: 40px;
                justify-self: inherit;
                margin-right: 70px;
                display: none;
            }

            .m-inherit {
                margin: inherit;
            }

            .wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
            }

            .wrapper-select {
                justify-content: inherit;
            }

            .select-button {
                justify-self: end;
            }

            .nextcloud-content {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }


            .nextcloud-nav {
                display: flex;
                justify-content: space-between;
            }


            .nextcloud-footer {
                background-color: white;
                width: 100%;
                padding-top: 10px;
            }

            .nextcloud-footer-grid {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: row-reverse;
                justify-content: space-between;
            }


            .additional-menu {
                white-space: nowrap;
                height: 33px;
                margin-right: -8px
            }

            .nextcloud-nav p {
                align-self: center;
            }

            #replace-modal-box {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 30px;
                max-height: 450px;
                min-height: 450px;
                min-width: 380px;
                max-width: 190px;
            }

            #replace-modal-box .modal-header {
                display: flex;
                justify-content: space-evenly;
                align-items: baseline;
            }

            #replace-modal-box .modal-header h2 {
                font-size: 1.2rem;
                padding-right: 5px;
            }

            #replace-modal-box .modal-content {
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: space-evenly;
            }

            #replace-modal-box .radio-btn {
                margin-right: 5px;
            }

            #replace-modal-box .modal-content label {
                display: block;
                width: 100%;
                text-align: left;
            }

            #replace-modal-box #replace-filename {
                display: block;
                width: 100%;
                margin-top: 8px;
            }

            #replace-modal-box input[type="text"]:disabled {
                color: #aaa;
            }

            #replace-modal-box .modal-content div {
                display: flex;
            }

            #replace-modal-box .modal-footer {
                padding-top: 15px;
            }

            #replace-modal-box .modal-footer .modal-footer-btn {
                display: flex;
                justify-content: space-between;
                padding-bottom: 15px;
            }

            .breadcrumb {
                border-bottom: 1px solid black;
            }

            .breadcrumb:last-child, .breadcrumb:first-child {
                border-bottom: none;
            }

            .breadcrumb a {
                display: inline-block;
                height: 33px;
                vertical-align: middle;
                line-height: 33px;

            }

            input:disabled + label {
                color: #aaa;
            }

            .inline-block {
                display: inline-block;
            }

            .nextcloud-nav h2 {
                padding-top: 10px;
            }

            .no-select, .tabulator-row.tabulator-selected.no-select:hover, .tabulator-row.no-select:hover, .tabulator-row.tabulator-selectable.no-select:hover {
                cursor: unset;
                color: #333;
                background-color: white;
            }

            .inline-block {
                position: absolute;
                right: 0px;
                z-index: 1;
                background-color: white;
                bottom: -45px;
            }

            .addRowAnimation {
                animation: added 0.4s ease;
            }

            #abortButton {
                color: var(--dbp-danger-bg-color);
            }

            #abortButton:hover {
                color: white;
            }
            
            .menu-buttons {
                display: flex;
                gap: 1em;
            }

            @keyframes added {
                0% {
                    background-color: white;
                }
                50% {
                    background-color: var(--dbp-success-bg-color);
                }
                100% {
                    background-color: white;
                }
            }

            .spinner {
                font-size: 0.7em;
            }

            .nextcloud-picker-icon-disabled {
                opacity: 0.4;
            }

            .button.button, .button, button.dt-button {
                background-color: white;
            }

            #new-folder {
                padding-right: 50px;
            }

            .nextcloud-nav a {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 130px;
            }

            #replace-modal-box .modal-header {
                padding: 0px;
            }

            #replace-modal-content {
                padding: 0px;
                align-items: baseline;
            }

            #replace-modal-box .modal-header h2 {
                text-align: left;
            }

            .table-wrapper {
                position: relative;
            }

            .button-container .checkmark::after {
                left: 8px;
                top: 3px;
                width: 4px;
                height: 11px;
            }

            .select-all-icon {
                height: 30px;
            }

            .checkmark {
                height: 20px;
                width: 20px;
                left: 11px;
                top: 4px;
            }
            
            #replace-modal .checkmark {
                height: 20px;
                width: 20px;
                left: 1px;
                top: 0px;
            }
            
            .remember-container{
                display: inline-block;
                line-height: 28px;
                padding-left: 34px;
            }

            .remember-container .checkmark{
                left: 0px;
            }

            .more-menu {
                height: 22.4px;
                /*top: 4px;*/
                width: 19px;
            }

            .nextcloud-nav a.home-link {
                font-size: 1.4em;
            }

            @media only screen
            and (orientation: portrait)
            and (max-width: 768px) {

                .breadcrumb .extended-breadcrumb-menu a {
                    /** overflow: visible; **/
                    display: inherit;
                }

                .additional-menu button {
                    float: right;
                }

                .additional-menu {
                    position: absolute;
                    right: 0px;
                    /** margin-right: 10px; **/
                }

                .additional-menu {
                    position: inherit;
                }

                .inline-block {
                    width: inherit;
                    position: absolute;
                    right: 52px;
                    z-index: 1;
                    background-color: white;
                    bottom: 0px;
                }

                .add-folder-button {
                    right: 0px;
                    position: absolute;
                }

                .nextcloud-nav h2 > a {
                    font-size: 1.3rem;
                }

                .nextcloud-nav h2 {
                    padding-top: 8px;
                }

                .nextcloud-nav a {
                    font-size: 1rem;
                    /** max-width: max-content; **/
                }

                .nextcloud-nav .home-link {
                    font-size: 1.2rem;
                }

                .nextcloud-logo-sm {
                    display: none;
                }

                .nextcloud-logo {
                    margin: 0 auto;
                }


                .button-wrapper {
                    justify-self: start;
                }

                .wrapper {
                    display: flex;
                    justify-content: space-between;
                }

                .nextcloud-header {
                    grid-area: header-l;
                    margin-bottom: 0px;
                }

                .nextcloud-content, .nextcloud-intro {
                    grid-area: content;
                    height: 100%;
                    justify-content: center;
                }

                .nextcloud-intro {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                }

                .nextcloud-footer {
                    bottom: 0px;
                    width: 100%;
                    left: 0px;
                }

                .mobile-hidden {
                    display: none;
                }

                .info-box {
                    position: relative;
                }

                .nextcloud-footer-grid {
                    display: flex;
                    justify-content: center;
                    flex-direction: column-reverse;
                }

                .select-button {
                    margin: 0px;
                }

                #new-folder {
                    width: 100%;
                }

                #replace-modal-box {
                    min-width: 100%;
                    max-width: 100%;
                }

                .hidden {
                    display: none;
                }

                .button-container .checkmark::after {
                    left: 8px;
                    top: 2px;
                    width: 8px;
                    height: 15px;
                }

                .select-all-icon {
                    height: 32px;
                }

                .checkmark {
                    height: 25px;
                    width: 25px;
                    left: 9px;
                    top: 2px;
                }

            }
        `;
    }

    render() {
        const i18n = this._i18n;
        const tabulatorCss = commonUtils.getAssetURL(pkgName, 'tabulator-tables/css/tabulator.min.css');
        return html`
            <div class="wrapper">
                <link rel="stylesheet" href="${tabulatorCss}">
                <div class="nextcloud-intro ${classMap({hidden: this.isPickerActive})}">
                    <div class="nextcloud-logo ${classMap({"nextcloud-logo-sm": this.isPickerActive})}">
                        <div class="nextcloud-logo-image"></div>
                    </div>
                    <div class="block text-center ${classMap({hidden: this.isPickerActive})}">
                        <h2 class="m-inherit">
                            ${this.nextcloudName}
                        </h2>
                        <p class="m-inherit">
                            ${i18n.t('nextcloud-file-picker.init-text-1', {name: this.nextcloudName})} <br>
                            ${i18n.t('nextcloud-file-picker.init-text-2')} <br><br>

                        </p>
                    </div>
                    <div class="block ${classMap({hidden: this.isPickerActive})}">
                        <button class="button  is-primary"
                                title="${i18n.t('nextcloud-file-picker.open-nextcloud-file-picker', {name: this.nextcloudName})}"
                                @click="${async () => {
                                    this.openFilePicker();
                                }}">${i18n.t('nextcloud-file-picker.connect-nextcloud', {name: this.nextcloudName})}
                        </button>
                    </div>
                    <div class="block text-center m-inherit ${classMap({hidden: this.isPickerActive && !this.storeSession || !this.isLoggedIn()})}"> <!-- remove hidden to enable remember me -->
                        <label class="button-container remember-container">
                            ${i18n.t('nextcloud-file-picker.remember-me', {name: this.nextcloudName})}
                            <input type="checkbox" id="remember-checkbox" name="remember">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                    <div class="block text-center m-inherit ${classMap({hidden: this.isPickerActive})}">
                        <p class="m-inherit"><br>
                            ${i18n.t('nextcloud-file-picker.auth-info')}
                            <slot name="auth-info"><br/>${this.authInfo}</slot>
                        </p>
                        
                    </div>
                </div>
                <div class="nextcloud-header ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-nav">
                        <p>${this.getBreadcrumb()}</p>

                        <div class="additional-menu ${classMap({hidden: !this.storeSession})}">

                            <a class="extended-menu-link" @click="${() => { this.toggleMoreMenu(); }}" title="${i18n.t('nextcloud-file-picker.more-menu')}">
                                <dbp-icon name="menu-dots" class="more-menu"></dbp-icon>
                            </a>
                            <ul class='extended-menu hidden'>
                                <li class="${classMap({active: this.isInFavorites})}" id="favorites-item">
                                    <a class="" @click="${this.loadFavorites}">
                                        ${i18n.t('nextcloud-file-picker.favorites-link-text')}
                                    </a>
                                </li>
                                <li class="${classMap({active: this.isInFilteredRecent})}" id="my-recent-item">
                                    <a class="" @click="${this.loadMyRecentFiles}">
                                        ${i18n.t('nextcloud-file-picker.my-recent-files-link-text')}
                                    </a>
                                </li>
                                <li class="${classMap({active: this.isInRecent})}" id="all-recent-item">
                                    <a class="" @click="${this.loadAllRecentFiles}">
                                        ${i18n.t('nextcloud-file-picker.all-recent-files-link-text')}
                                    </a>
                                </li>
                                <li class="${classMap({hidden: !this.directoriesOnly})}">
                                    <a class="${classMap({inactive: this.isInRecent || this.isInFavorites || this.isInFilteredRecent || this.disableRowClick})}" @click="${() => { this.addOpenFolderTableEntry(); }}">
                                        ${i18n.t('nextcloud-file-picker.add-folder')}
                                    </a>
                                </li>

                            <button class="button ${classMap({hidden: this.storeSession})}"
                                    title="${i18n.t('nextcloud-file-picker.add-folder-open')}"
                                    @click="${() => {
                                        this.openAddFolderDialogue();
                                    }}">
                                <dbp-icon name="plus" class="nextcloud-add-folder" id="add-folder-button"></dbp-icon>
                            </button>
                            
                                <li class="${classMap({hidden: !this.storeSession})}" title="${i18n.t('nextcloud-file-picker.log-out')}">
                                    <a class="" @click="${() => { this.logOut(); this.hideAdditionalMenu(); }}">
                                        ${i18n.t('nextcloud-file-picker.log-out')}
                                    </a>
                                </li>
                            
                            </ul>
                        </div>
                    </div> 
                </div>
                <div class="nextcloud-content ${classMap({hidden: !this.isPickerActive})}">
                    
                    <div class="table-wrapper">
                        <table id="directory-content-table" class="force-no-select"></table>
                    </div>
                </div>

                <div class="nextcloud-footer ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-footer-grid">
                        <button id="download-button"
                                class="button select-button is-primary ${classMap({hidden: ((!this.directoriesOnly) || (this.directoriesOnly && this.abortUploadButton && this.forAll))})}"
                                @click="${() => {
                                    this.sendDirectory(this.tabulatorTable.getSelectedData());
                                }}"
                                ?disabled="${this.selectBtnDisabled}">
                            <dbp-icon class="nav-icon" name="cloud-upload"></dbp-icon>
                            ${this.folderIsSelected}
                        </button>
                        <button class="button select-button is-primary ${classMap({hidden: this.directoriesOnly})}"
                                @click="${() => {
                                    this.downloadFiles(this.tabulatorTable.getSelectedData());
                                }}"
                                ?disabled="${this.selectBtnDisabled}">
                            ${(this.tabulatorTable && this.tabulatorTable.getSelectedRows().filter(row => row.getData().type != 'directory' && this.checkFileType(row.getData(), this.allowedMimeTypes)).length === 0) ? i18n.t('nextcloud-file-picker.select-files') : i18n.t('nextcloud-file-picker.select-files-btn', {count: this.tabulatorTable ? this.tabulatorTable.getSelectedRows().length : 0})}
                        </button>
                        <button id="abortButton"
                                class="button select-button hidden ${classMap({"visible": (this.directoriesOnly && this.forAll && this.abortUploadButton)})}"
                                title="${i18n.t('nextcloud-file-picker.abort')}" @click="${() => {
                            this.abortUpload = true;
                        }}">${i18n.t('nextcloud-file-picker.abort')}
                        </button>

                        <div class="block info-box ${classMap({hidden: this.statusText === ""})}">
                            <dbp-mini-spinner
                                    class="spinner ${classMap({hidden: this.loading === false})}"></dbp-mini-spinner>
                            <span>${this.statusText}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div class="modal micromodal-slide" id="replace-modal" aria-hidden="true">
                <div class="modal-overlay" tabindex="-2" data-micromodal-close>
                    <div class="modal-container" id="replace-modal-box" role="dialog" aria-modal="true"
                         aria-labelledby="replace-modal-title">
                        <header class="modal-header">
                            <button title="${i18n.t('file-sink.modal-close')}" class="modal-close"
                                    aria-label="Close modal" @click="${() => {
                                this.closeDialog();
                            }}">
                                <dbp-icon title="${i18n.t('file-sink.modal-close')}" name="close"
                                          class="close-icon"></dbp-icon>
                            </button>
                            <h2 id="replace-modal-title">
                                ${i18n.t('nextcloud-file-picker.replace-title-1')}
                                <span style="word-break: break-all;">${this.replaceFilename}</span>
                                ${i18n.t('nextcloud-file-picker.replace-title-2')}.
                            </h2>
                        </header>
                        <main class="modal-content" id="replace-modal-content">
                            <h3>
                                ${i18n.t('nextcloud-file-picker.replace-text')}?
                            </h3>
                            <div>
                                <label class="button-container">
                                    <span> 
                                        ${i18n.t('nextcloud-file-picker.replace-new_name')}:

                                    </span>
                                    <input type="radio" id="replace-new-name" class="radio-btn" name="replacement"
                                           value="new-name" checked @click="${() => {
                                        this.setInputFieldVisibility();
                                    }}">
                                    <span class="radiobutton"></span>
                                    <input type="text" id="replace-filename" class="input" name="replace-filename"
                                           value="" onClick="this.select();">
                                </label>

                            </div>


                            <div>
                                <label class="button-container">
                                    <span>${i18n.t('nextcloud-file-picker.replace-replace')}</span>
                                    <input type="radio" id="replace-replace" name="replacement" value="replace"
                                           @click="${() => {
                                               this.setInputFieldVisibility();
                                           }}">
                                    <span class="radiobutton"></span>
                                </label>
                            </div>
                            <div>
                                <label class="button-container">
                                    <span>${i18n.t('nextcloud-file-picker.replace-skip')}</span>
                                    <input type="radio" class="radio-btn" name="replacement" value="ignore"
                                           @click="${() => {
                                               this.setInputFieldVisibility();
                                           }}">
                                    <span class="radiobutton"></span>
                                </label>
                            </div>
                        </main>
                        <footer class="modal-footer">
                            <div class="modal-footer-btn">
                                <button class="button" data-micromodal-close aria-label="Close this dialog window"
                                        @click="${() => {
                                            this.cancelOverwrite();
                                        }}">${this.getCancelText()}
                                </button>
                                <button class="button select-button is-primary" @click="${() => {
                                    this.uploadFileAfterConflict();
                                }}">OK
                                </button>
                            </div>
                            <div>
                                <label class="button-container">
                                    ${i18n.t('nextcloud-file-picker.replace-mode-all')}
                                    <input type="checkbox" id="replace_mode_all" name="replace_mode_all"
                                           value="replace_mode_all" @click="${() => {
                                        this.setRepeatForAllConflicts();
                                    }}">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        `;
    }
}
