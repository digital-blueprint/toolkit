import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import VPULitElement from 'vpu-common/vpu-lit-element';
import {MiniSpinner} from 'vpu-common';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
// `import {createClient} from 'webdav/web';` didn't seem to work if fileupload demo page is built
// `import createClient from 'webdav/web';` didn't seem to work if Signature project is built
import * as webDavWeb from 'webdav/web';
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

        this.updateComplete.then(() => {
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.addEventListener('message', this._onReceiveWindowMessage);

            // http://tabulator.info/docs/4.7
            // TODO: format size and lastmod
            // TODO: translation of column headers
            // TODO: mime type icon
            this.tabulatorTable = new Tabulator(this._("#directory-content-table"), {
                layout: "fitDataStretch",
                selectable: true,
                columns: [
                    {title: "Filename", field: "basename"},
                    {title: "Size", field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());}},
                    {title: "Type", field: "type"},
                    {title: "Mime", field: "mime"},
                    {title: "Last modified", field: "lastmod", sorter: "date"},
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
        });
    }

    openFilePicker() {
        // TODO: translation
        this.statusText = "Auth in progress";
        this.loginWindow = window.open(this.authUrl, "Nextcloud Login",
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
            this.webDavClient = webDavWeb.createClient(
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
        const tabulatorCss = commonUtils.getAssetURL('local/vpu-fileupload/tabulator-tables/css/tabulator.min.css');
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
                        title="${i18n.t('nextcloud-file-picker.folder-up')}"
                        @click="${() => { this.downloadFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
            </div>
        `;
    }
}
