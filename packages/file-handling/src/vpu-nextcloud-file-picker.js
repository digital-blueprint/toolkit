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
        this.statusText = "";
        this.lastDirectoryPath = "/";
        this.directoryPath = "/";
        this.webDavClient = null;
        this.tabulatorTable = null;

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
            authUrl: { type: String, attribute: "auth-url" },
            webDavUrl: { type: String, attribute: "web-dav-url" },
            isPickerActive: { type: Boolean, attribute: false },
            statusText: { type: String, attribute: false },
            directoryPath: { type: String, attribute: false },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
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
                selectable: true,
                columns: [
                    {title: "Type", field: "type", align:"center", formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag =  that.constructor.getScopedTagName("vpu-icon");
                            let icon = `<${icon_tag} name="empty-file"></${icon_tag}>`;
                            return (cell.getValue() === "directory") ? `<${icon_tag} name="folder"></${icon_tag}>` : icon;
                        }},
                    {title: "Filename", field: "basename"},
                    {title: "Size", field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());}},
                    {title: "Mime", field: "mime", formatter: (cell, formatterParams, onRendered) => {
                            if(typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [fileMainType, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }},
                    {title: "Last modified", field: "lastmod",sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
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
                rowClick: (e, row) => {
                    const data = row.getData();

                    switch(data.type) {
                        case "directory":
                            this.directoryClicked(e, data);
                            break;
                        case "file":
                            console.log("file selected", data);
                            break;
                    }
                },
            });

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
                    console.log(`mime type ${data.type} of file '${data.filename}' is not compatible with ${filterParams}`);
                    return false;
                }
                return true;
            }
            if(typeof this.allowedMimeTypes !== 'undefined') {
                this.tabulatorTable.setFilter(checkFileType, this.allowedMimeTypes);
            }
        });
    }

    openFilePicker() {
        // TODO: translation
        this.statusText = "Auth in progress";
        const authUrl = this.authUrl + "?target-origin=" + encodeURIComponent(window.location.href);
        this.loginWindow = window.open(authUrl, "Nextcloud Login",
            "width=400,height=400,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
    }

    onReceiveWindowMessage(event) {
        const data = event.data;
        console.log("data", data);

        if (data.type === "webapppassword") {
            this.loginWindow.close();
            // alert("Login name: " + data.loginName + "\nApp password: " + data.token);

            const apiUrl = this.webDavUrl + "/" + data.loginName;

            // https://github.com/perry-mitchell/webdav-client/blob/master/API.md#module_WebDAV.createClient
            this.webDavClient = createClient(
                apiUrl,
                {
                    username: data.loginName,
                    password: data.token
                }
            );

            this.loadDirectory("/");
        }
    }

    /**
     * Loads the directory from WebDAV
     *
     * @param path
     */
    loadDirectory(path) {
        // TODO: translation
        this.statusText = "Loading directory from Nextcloud: " + path;
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
            this.statusText = error.message;
            this.isPickerActive = false;
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

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}

            .block {
                margin-bottom: 10px;
            }
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-tabulator-table');
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
                <h2>${this.directoryPath}</h2>
                <button class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.folder-last')}"
                        @click="${() => { this.loadDirectory(this.lastDirectoryPath); }}">&#8678;</button>
                <button class="button is-small"
                        title="${i18n.t('nextcloud-file-picker.folder-up')}"
                        @click="${() => { this.loadDirectory(this.getParentDirectoryPath()); }}">&#8679;</button>
                <table id="directory-content-table"></table>
                <button class="button"
                        @click="${() => { this.downloadFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
            </div>
        `;
    }
}
