import {createInstance, setOverridesByGlobalCache} from './i18n';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as fileHandlingStyles from '@dbp-toolkit/file-handling/src/styles';
import {Icon} from '@dbp-toolkit/common';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {humanFileSize} from '@dbp-toolkit/common/i18next';
import {name as pkgName} from '@dbp-toolkit/file-handling/package.json';
import {send} from '@dbp-toolkit/common/notification';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {classMap} from 'lit/directives/class-map.js';

const MODE_TABLE_ONLY = 'table-only';
const MODE_FILE_SINK = 'file-sink';
const MODE_FILE_SOURCE = 'file-source';

export class Clipboard extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';

        this.allowedMimeTypes = '';
        this.clipboardFiles = {files: ''};
        this.clipboardSelectBtnDisabled = true;
        this.tabulatorTable = null;
        this._onReceiveBeforeUnload = this.onReceiveBeforeUnload.bind(this);
        this.boundSelectHandler = this.selectAllFiles.bind(this);
        this.filesToSave = [];
        this.numberOfSelectedFiles = 0;
        this.enabledTargets = 'local';
        this.countUploadFiles = 0;
        this.buttonsDisabled = false;

        this.nextcloudWebAppPasswordURL = '';
        this.nextcloudWebDavURL = '';
        this.nextcloudName = '';
        this.nextcloudFileURL = '';
        this.nextcloudAuthInfo = '';
        this.nextcloudStoreSession = false;
        this.authInfo = '';

        this.allowNesting = false;

        // To avoid a cyclic dependency
        import('./file-sink').then(({FileSink}) =>
            this.defineScopedElement('dbp-file-sink', FileSink)
        );
        import('./file-source').then(({FileSource}) =>
            this.defineScopedElement('dbp-file-source', FileSource)
        );

        this.mode = MODE_TABLE_ONLY;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            allowedMimeTypes: {type: String, attribute: 'allowed-mime-types'},
            clipboardSelectBtnDisabled: {type: Boolean},
            clipboardFiles: {type: Object, attribute: 'clipboard-files'},
            filesToSave: {type: Array, attribute: 'files-to-save'},
            numberOfSelectedFiles: {type: Number, attribute: false},
            enabledTargets: {type: String, attribute: 'enabled-targets'},
            buttonsDisabled: {type: Boolean},

            nextcloudWebAppPasswordURL: {type: String, attribute: 'nextcloud-auth-url'},
            nextcloudWebDavURL: {type: String, attribute: 'nextcloud-web-dav-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
            nextcloudAuthInfo: {type: String, attribute: 'nextcloud-auth-info'},
            nextcloudStoreSession: {type: Boolean, attribute: 'nextcloud-store-session'},

            mode: {type: String, attribute: 'mode'},

            allowNesting: {type: Boolean, attribute: 'allow-nesting'},
        };
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }

    _a(selector) {
        return this.shadowRoot === null
            ? this.querySelectorAll(selector)
            : this.shadowRoot.querySelectorAll(selector);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
                case 'clipboardFiles':
                    if (this.tabulatorTable)
                        this.generateClipboardTable();
                    break;
            }
        });

        if(this.langDir != '') {
          setOverridesByGlobalCache(this._i18n, this);
        }

        super.update(changedProperties);
    }

    toggleCollapse(e) {
        const table = this.tabulatorTable;
        // give a chance to draw the table
        // this is for getting more hight in tabulator table, when toggle is called
        setTimeout(function () {
            table.redraw();
        }, 0);
    }

    connectedCallback() {
        const i18n = this._i18n;
        super.connectedCallback();
        const that = this;
        this.updateComplete.then(() => {
            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new Tabulator(this._('#clipboard-content-table'), {
                layout: 'fitColumns',
                selectable: true,
                placeholder: i18n.t('dbp.clipboard.no-data'),
                responsiveLayout: 'collapse',
                responsiveLayoutCollapseStartOpen: false,
                columnHeaderVertAlign: 'middle',
                columnDefaults: {
                    vertAlign: 'middle',
                    hozAlign: 'left',
                    resizable: false,
                },
                columns: [
                    {
                        minWidth: 40,
                        headerSort: false,
                        formatter: 'responsiveCollapse',
                    },
                    {
                        title:
                            '<label class="button-container select-all-icon">' +
                            '<input type="checkbox" id="select_all" name="select_all" value="select_all">' +
                            '<span class="checkmark" id="select_all_checkmark"></span>' +
                            '</label>',
                        field: 'type',
                        hozAlign: 'center',
                        width: 40,
                        headerSort: false,
                        responsive: 1,
                        formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag = that.getScopedTagName('dbp-icon');
                            let icon =
                                `<${icon_tag} name="empty-file" class="nextcloud-picker-icon ` +
                                `"></${icon_tag}>`;
                            let div = this.createScopedElement('div');
                            div.innerHTML = icon;
                            return div;

                        },
                    },
                    {
                        title: i18n.t('dbp.clipboard.file-name'),
                        responsive: 0,
                        widthGrow: 5,
                        minWidth: 150,
                        field: 'name',
                        sorter: 'alphanum',
                        formatter: (cell) => {
                            let div = this.createScopedElement('div');
                            div.classList.add('filename');
                            div.innerHTML = cell.getValue();
                            return div;
                        },
                    },
                    {
                        title: i18n.t('dbp.clipboard.file-size'),
                        responsive: 4,
                        widthGrow: 1,
                        minWidth: 84,
                        field: 'size',
                        formatter: (cell, formatterParams, onRendered) => {
                            return humanFileSize(cell.getValue());
                        },
                    },
                    {
                        title: i18n.t('dbp.clipboard.file-type'),
                        responsive: 2,
                        widthGrow: 1,
                        minWidth: 58,
                        field: 'type',
                        formatter: (cell, formatterParams, onRendered) => {
                            if (typeof cell.getValue() === 'undefined') {
                                return '';
                            }
                            const [, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        },
                    },
                    {
                        title: i18n.t('dbp.clipboard.file-mod'),
                        responsive: 3,
                        widthGrow: 1,
                        minWidth: 150,
                        field: 'lastModified',
                        sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            const timestamp = new Date(cell.getValue());
                            const year = timestamp.getFullYear();
                            const month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ('0' + timestamp.getDate()).slice(-2);
                            const hours = ('0' + timestamp.getHours()).slice(-2);
                            const minutes = ('0' + timestamp.getMinutes()).slice(-2);
                            return date + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
                        },
                    },
                    {title: 'file', field: 'file', visible: false},
                ],
                initialSort: [
                    {column: 'name', dir: 'asc'},
                    {column: 'type', dir: 'asc'},
                ],
            });

            this.tabulatorTable.on("tableBuilt", this.tableBuiltFunction.bind(this));
            this.tabulatorTable.on("rowClick", this.rowClickFunction.bind(this));
            this.tabulatorTable.on("rowSelectionChanged", this.rowSelectionChangedFunction.bind(this));
            this.tabulatorTable.on("dataChanged", this.dataChangedFunction.bind(this));
        });

        //Register only one beforeunload Event for the clipboard warning
        if (!window.clipboardWarning) {
            window.addEventListener('beforeunload', this._onReceiveBeforeUnload, false);
            window.clipboardWarning = true;
        }
    }

    tableBuiltFunction() {
        this.tabulatorTable.addRow([{}]).then(function (row) {
            row.delete();
        });

        this.generateClipboardTable();
        if (this._('#select_all')) {
            this._('#select_all').addEventListener('click', this.boundSelectHandler);
        }
    }

    rowClickFunction(e, row) {
        this.numberOfSelectedFiles =
            this.tabulatorTable !== null
                ? this.tabulatorTable.getSelectedRows().length
                : 0;
        if (
            this.tabulatorTable !== null &&
            this.tabulatorTable.getSelectedRows().length ===
            this.tabulatorTable
                .getRows()
                .filter((row) => this.checkFileType(row.getData())).length
        ) {
            this._('#select_all').checked = true;
        } else {
            this._('#select_all').checked = false;
        }
    }

    rowSelectionChangedFunction(data, rows) {
        const i18n = this._i18n;

        if (this.tabulatorTable && this.tabulatorTable.getSelectedRows().length > 0) {
            this.clipboardSelectBtnDisabled = false;
        } else {
            this.clipboardSelectBtnDisabled = true;
        }

        if (this._('#select_all_checkmark')) {
            this._('#select_all_checkmark').title = this.checkAllSelected()
                ? i18n.t('dbp.clipboard.select-nothing')
                : i18n.t('dbp.clipboard.select-all');
        }
    }

    dataChangedFunction() {
        if (this.tabulatorTable !== null) {

            const that = this;
            setTimeout(function () {
                if (that._('.tabulator-responsive-collapse-toggle-open')) {
                    that._a('.tabulator-responsive-collapse-toggle-open').forEach(
                        (element) =>
                            element.addEventListener(
                                'click',
                                that.toggleCollapse.bind(that)
                            )
                    );
                }

                if (that._('.tabulator-responsive-collapse-toggle-close')) {
                    that._a('.tabulator-responsive-collapse-toggle-close').forEach(
                        (element) =>
                            element.addEventListener(
                                'click',
                                that.toggleCollapse.bind(that)
                            )
                    );
                }
            }, 0);

        }
    }

    disconnectedCallback() {
        //We doesn't want to deregister this event, because we want to use this event over activities
        //window.removeEventListener('beforeunload', this._onReceiveBeforeUnload);
        super.disconnectedCallback();
        this.tabulatorTable.off("tableBuilt");
        this.tabulatorTable.off("rowClick");
        this.tabulatorTable.off("rowSelectionChanged");
        this.tabulatorTable.off("dataChanged");
    }

    /**
     * Select or deselect all files from tabulator table
     *
     */
    selectAllFiles() {
        let allSelected = this.checkAllSelected();
        if (allSelected) {
            this.tabulatorTable.getSelectedRows().forEach((row) => row.deselect());
            this.numberOfSelectedFiles = 0;
        } else {
            this.tabulatorTable.selectRow(
                this.tabulatorTable
                    .getRows()
                    .filter(
                        (row) =>
                            row.getData().type != 'directory' &&
                            this.checkFileType(row.getData(), this.allowedMimeTypes)
                    )
            );
            this.numberOfSelectedFiles = this.tabulatorTable.getSelectedRows().length;
        }
    }

    /**
     * Checks if all files are already selected
     * Returns true if all files are selected
     *
     * @returns {boolean}
     */
    checkAllSelected() {
        if (this.tabulatorTable) {
            let maxSelected = this.tabulatorTable
                .getRows()
                .filter(
                    (row) =>
                        row.getData().type != 'directory' &&
                        this.checkFileType(row.getData(), this.allowedMimeTypes)
                ).length;
            let selected = this.tabulatorTable.getSelectedRows().length;
            if (selected === maxSelected) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check mime type of a file, returns true if this.allowedMimeTypes contains the mime type of the file
     *
     * @param file
     * @returns {boolean}
     */
    checkFileType(file) {
        if (this.allowedMimeTypes === '') return true;
        // check if file is allowed
        const [fileMainType, fileSubType] = file.type.split('/');
        const mimeTypes = this.allowedMimeTypes.split(',');
        let deny = true;

        mimeTypes.forEach((str) => {
            const [mainType, subType] = str.split('/');
            deny =
                deny &&
                ((mainType !== '*' && mainType !== fileMainType) ||
                    (subType !== '*' && subType !== fileSubType));
        });

        if (deny) {
            console.log(
                `mime type ${file.type} of file '${file.name}' is not compatible with ${this.allowedMimeTypes}`
            );
            return false;
        }
        return true;
    }

    /**
     * If clipboard files and the tabulator table exists, then clear the table and sets the new data
     *s
     */
    generateClipboardTable() {
        this.numberOfSelectedFiles = 0;
        if (this.clipboardFiles.files && this.tabulatorTable) {
            let data = [];
            for (let i = 0; i < this.clipboardFiles.files.length; i++) {
                data[i] = {
                    name: this.clipboardFiles.files[i].name,
                    size: this.clipboardFiles.files[i].size,
                    type: this.clipboardFiles.files[i].type,
                    lastModified: this.clipboardFiles.files[i].lastModified,
                    file: this.clipboardFiles.files[i],
                };
            }

            this.tabulatorTable.clearData();
            this.tabulatorTable.setData(data);

            if(this.clipboardFiles.files.length > 0) {
                let placeholders = this._a(".tabulator-placeholder");
                if(placeholders)
                    placeholders.forEach(placeholder => placeholder.style.display = "none");
            } else {
                let placeholders = this._a(".tabulator-placeholder");
                if(placeholders)
                    placeholders.forEach(placeholder => placeholder.style.display = "inherit");
            }
        }
        if (this._('#select_all')) {
            this._('#select_all').checked = false;
        }

    }

    /**
     * Sends the files to a provider and throws a notification
     *
     * @param files
     */
    async sendClipboardFiles(files) {
        const i18n = this._i18n;
        for (let i = 0; i < files.length; i++) {
            await this.sendFileEvent(files[i].file, files.length);
        }
        this.tabulatorTable.deselectRow();
        send({
            summary: i18n.t('dbp.clipboard.saved-files-title', {count: files.length}),
            body: i18n.t('dbp.clipboard.saved-files-body', {count: files.length}),
            type: 'success',
            timeout: 5,
        });
    }

    async sendFileEvent(file, maxFiles) {
        const data = {file: file, data: file, maxUpload: maxFiles};
        const event = new CustomEvent('dbp-clipboard-file-picker-file-downloaded', {
            detail: data,
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    /**
     * Decides if the "beforeunload" event needs to be canceled
     *
     * @param event
     */
    onReceiveBeforeUnload(event) {
        const i18n = this._i18n;

        // we don't need to stop if there are no signed files
        if (this.clipboardFiles.files.length === 0) {
            return;
        }

        // we need to handle custom events ourselves
        if (event.target && event.target.activeElement && event.target.activeElement.nodeName) {
            send({
                summary: i18n.t('dbp.clipboard.file-warning'),
                body: i18n.t('dbp.clipboard.file-warning-body', {
                    count: this.clipboardFiles.files.length,
                }),
                type: 'warning',
                timeout: 5,
            });
            if (!event.isTrusted) {
                // note that this only works with custom event since calls of "confirm" are ignored
                // in the non-custom event, see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
                const result = confirm('##carefulsaveialuge');
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

    /**
     * Saves files from an event to the clipboard
     *
     * @param event
     */
    saveFilesToClipboardEvent(event) {
        //save it
        let data = {};
        let files = [];
        if (this.clipboardFiles && this.clipboardFiles.files.length !== 0) {
            files = files.concat(this.clipboardFiles.files);
            files = files.concat(event.detail.file);
        } else {
            files = files.concat(event.detail.file);
        }

        this.filesToSave = files;
        if (files && files.length !== 0) {
            data = {files: files};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent('dbp-clipboard-file-picker-file-uploaded', {
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
        }

        this.countUploadFiles += 1;
        if (this.countUploadFiles === event.detail.maxUpload) {
            this.buttonsDisabled = false;
            this.countUploadFiles = 0;
        } else {
            this.buttonsDisabled = true;
        }
    }

    /**
     * Saves all files from this.filesToSave in clipboard and throws a notification
     *
     */
    saveFilesToClipboard() {
        const i18n = this._i18n;

        //save it
        let data = {};
        let files = [];
        if (this.clipboardFiles && this.clipboardFiles.files.length !== 0) {
            files = files.concat(this.clipboardFiles.files);
            files = files.concat(this.filesToSave);
        } else {
            files = files.concat(this.filesToSave);
        }
        if (this.filesToSave && this.filesToSave.length !== 0) {
            data = {files: files};
            this.sendSetPropertyEvent('clipboard-files', data);
            const event = new CustomEvent('dbp-clipboard-file-picker-file-uploaded', {
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
            send({
                summary: i18n.t('dbp.clipboard.saved-files-title', {count: this.filesToSave.length}),
                body: i18n.t('dbp.clipboard.saved-files-body', {count: this.filesToSave.length}),
                type: 'success',
                timeout: 5,
            });
        }
    }

    /**
     * Throws a finish notification with the count from the event.detail
     *
     * @param event
     */
    finishedSaveFilesToClipboard(event) {
        const i18n = this._i18n;
        send({
            summary: i18n.t('dbp.clipboard.saved-files-title', {count: event.detail.count}),
            body: i18n.t('dbp.clipboard.saved-files-body', {count: event.detail.count}),
            type: 'success',
            timeout: 5,
        });
    }

    /**
     * Open the file sink with clipboardfiles
     *
     */
    openFileSink() {
        const fileSink = this._('#file-sink-clipboard');
        if (fileSink) {
            let files = Array();
            if (this.tabulatorTable.getSelectedData().length > 0) {
                this.tabulatorTable.getSelectedData().forEach((fileObject) => {
                    files.push(fileObject.file);
                });
            } else {
                files = this.clipboardFiles.files;
            }
            this._('#file-sink-clipboard').files = Object.create(files);
            this._('#file-sink-clipboard').openDialog();
        }
    }

    /**
     * Open the file source with clipboardfiles
     *
     */
    openFileSource() {
        const fileSource = this._('#file-source-clipboard');
        if (fileSource) {
            this._('#file-source-clipboard').openDialog();
        }
    }

    /**
     * Delete all or only selected files from clipboard and throws a notification
     *
     */
    clearClipboard() {
        const i18n = this._i18n;

        if (this.tabulatorTable && this.tabulatorTable.getSelectedData().length > 0) {
            let count = this.tabulatorTable.getSelectedData().length;
            this.tabulatorTable.deleteRow(this.tabulatorTable.getSelectedRows());
            let data = {files: []};
            this.tabulatorTable.getRows().forEach((row) => data.files.push(row.getData().file));
            this.sendSetPropertyEvent('clipboard-files', data);
            send({
                summary: i18n.t('dbp.clipboard.clear-count-clipboard-title', {count: count}),
                body: i18n.t('dbp.clipboard.clear-count-clipboard-body', {count: count}),
                type: 'success',
                timeout: 5,
            });
            this.numberOfSelectedFiles = 0;
        } else {
            let data = {files: []};
            this.sendSetPropertyEvent('clipboard-files', data);
            send({
                summary: i18n.t('dbp.clipboard.clear-clipboard-title'),
                body: i18n.t('dbp.clipboard.clear-clipboard-body'),
                type: 'success',
                timeout: 5,
            });
        }
    }

    /**
     * Get the additional clipboard buttons
     * If this.mode === MODE_FILE_SINK or MODE_FILE_SOURCE then there are only delete and save files buttons available
     * Else there are the add, delete and save files buttons available
     *
     * @returns {html}
     */
    getAdditionalButtons() {
        const i18n = this._i18n;
        let buttonsAreDisabled =
            this.clipboardFiles.files.length === 0 ? true : this.clipboardSelectBtnDisabled;
        buttonsAreDisabled = this.buttonsDisabled ? true : buttonsAreDisabled;
        return html`
            <div class="flex-container additional-button-container">
                <div class="btn-flex-container-mobile">
                    <button
                            id="clipboard-add-files-button"
                            @click="${() => {
                                this.openFileSource();
                            }}"
                            class="button ${classMap({
                                hidden: this.mode === MODE_FILE_SINK || this.mode === MODE_FILE_SOURCE,
                            })}"
                            title="${i18n.t('dbp.clipboard.add-files')}"
                            ?disabled="${this.buttonsDisabled}">
                        <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                        ${i18n.t('dbp.clipboard.add-files-btn')}
                    </button>
                    <button
                            id="clipboard-remove-files-button"
                            @click="${() => {
                                this.clearClipboard();
                            }}"
                            class="button"
                            title="${this.numberOfSelectedFiles > 0
                                    ? i18n.t('dbp.clipboard.remove-count', {count: this.numberOfSelectedFiles})
                                    : i18n.t('dbp.clipboard.remove-all')}"
                            ?disabled="${buttonsAreDisabled}">
                        ${this.numberOfSelectedFiles > 0
                                ? i18n.t('dbp.clipboard.remove-count-btn', {
                                    count: this.numberOfSelectedFiles,
                                })
                                : i18n.t('dbp.clipboard.remove-all-btn')}
                    </button>
                </div>
                <div class="btn-flex-container-mobile">
                    <button
                            id="clipboard-save-files-button"
                            @click="${() => {
                                this.openFileSink();
                            }}"
                            ?disabled="${buttonsAreDisabled}"
                            class="button"
                            title="${this.numberOfSelectedFiles > 0
                                    ? i18n.t('dbp.clipboard.save-count', {count: this.numberOfSelectedFiles})
                                    : i18n.t('dbp.clipboard.save-all')}">
                        ${this.numberOfSelectedFiles > 0
                                ? i18n.t('dbp.clipboard.save-count-btn', {
                                    count: this.numberOfSelectedFiles,
                                })
                                : i18n.t('dbp.clipboard.save-all-btn')}
                    </button>
                </div>
            </div>
            <dbp-file-source
                    id="file-source-clipboard"
                    context="${i18n.t('dbp.clipboard.add-files')}"
                    allowed-mime-types="${this.allowedMimeTypes}"
                    nextcloud-auth-url="${this.nextcloudWebAppPasswordURL}"
                    nextcloud-web-dav-url="${this.nextcloudWebDavURL}"
                    nextcloud-name="${this.nextcloudName}"
                    nextcloud-file-url="${this.nextcloudFileURL}"
                    nexcloud-auth-info="${this.nextcloudAuthInfo}"
                    ?nextcloud-store-session="${this.nextcloudStoreSession}"
                    enabled-targets="${this.allowNesting
                            ? this.enabledTargets
                            : this.enabledTargets.replace('clipboard', '')}"
                    decompress-zip
                    lang="${this.lang}"
                    text="${i18n.t('dbp.clipboard.upload-area-text')}"
                    button-label="${i18n.t('dbp.clipboard.upload-button-label')}"
                    @dbp-file-source-file-selected="${this.saveFilesToClipboardEvent}"
                    @dbp-nextcloud-file-picker-number-files="${this.finishedSaveFilesToClipboard}"
                    @dbp-file-source-file-upload-finished="${this
                            .finishedSaveFilesToClipboard}"></dbp-file-source>
            <dbp-file-sink
                    id="file-sink-clipboard"
                    context="${this.numberOfSelectedFiles > 0
                            ? i18n.t('dbp.clipboard.save-count', {count: this.numberOfSelectedFiles})
                            : i18n.t('dbp.clipboard.save-all')}"
                    filename="clipboard-documents.zip"
                    allowed-mime-types="${this.allowedMimeTypes}"
                    enabled-targets="${this.allowNesting
                            ? this.enabledTargets
                            : this.enabledTargets.replace('clipboard', '')}"
                    nextcloud-auth-url="${this.nextcloudWebAppPasswordURL}"
                    nextcloud-web-dav-url="${this.nextcloudWebDavURL}"
                    nextcloud-name="${this.nextcloudName}"
                    nextcloud-file-url="${this.nextcloudFileURL}"
                    nexcloud-auth-info="${this.nextcloudAuthInfo}"
                    ?nextcloud-store-session="${this.nextcloudStoreSession}"
                    lang="${this.lang}"></dbp-file-sink>
        `;
    }

    /**
     * Get the clipboard sink html
     *
     * @returns {html}
     */
    getClipboardSink() {
        const i18n = this._i18n;
        const tabulatorCss = commonUtils.getAssetURL(
            pkgName,
            'tabulator-tables/css/tabulator.min.css'
        );
        return html`
            <div class="wrapper">
                <div class="content">
                    <h3>${i18n.t('dbp.clipboard.sink-title')}</h3>
                    <div class="warning-container">
                        <dbp-icon name="warning-high" class="warning-icon"></dbp-icon>
                        <p>${i18n.t('dbp.clipboard.warning')}</p>
                    </div>
                    <div>
                        ${this.getAdditionalButtons()}
                        <link rel="stylesheet" href="${tabulatorCss}"/>
                        <div class="table-wrapper">
                            <table id="clipboard-content-table" class="force-no-select"></table>
                        </div>
                    </div>
                </div>
                <div class="clipboard-footer">
                    <button
                            class="button select-button is-primary"
                            title="${i18n.t('dbp.clipboard.sink-btn', {count: this.filesToSave.length})}"
                            @click="${() => {
                                this.saveFilesToClipboard();
                            }}">
                        <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                        ${i18n.t('dbp.clipboard.sink-btn', {count: this.filesToSave.length})}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get the clipboard source html
     *
     * @returns {html}
     */
    getClipboardSource() {
        const tabulatorCss = commonUtils.getAssetURL(
            pkgName,
            'tabulator-tables/css/tabulator.min.css'
        );
        const i18n = this._i18n;
        return html`
            <div class="wrapper">
                <div class="content">
                    <h3>${i18n.t('dbp.clipboard.source-title')}</h3>
                    <div class="warning-container">
                        <dbp-icon name="warning-high" class="warning-icon"></dbp-icon>
                        <p>${i18n.t('dbp.clipboard.warning')}</p>
                    </div>
                    <div>
                        ${this.getAdditionalButtons()}
                        <link rel="stylesheet" href="${tabulatorCss}"/>
                        <div class="table-wrapper">
                            <table id="clipboard-content-table" class="force-no-select"></table>
                        </div>
                    </div>
                </div>
                <div class="clipboard-footer">
                    <button
                            class="button select-button is-primary"
                            ?disabled="${this.clipboardSelectBtnDisabled}"
                            @click="${() => {
                                this.sendClipboardFiles(this.tabulatorTable.getSelectedData());
                            }}">
                        ${this.tabulatorTable && this.tabulatorTable.getSelectedRows().length > 0
                                ? i18n.t('dbp.clipboard.source-btn', {
                                    count: this.tabulatorTable
                                            ? this.tabulatorTable.getSelectedRows().length
                                            : 0,
                                })
                                : i18n.t('dbp.clipboard.source-btn-none')}
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
            ${commonStyles.getTabulatorStyles()}
            ${fileHandlingStyles.getFileHandlingCss()}


            a {
                border-bottom: var(--dbp-border);
                padding: 0;
            }

            a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
            }

            h2:first-child {
                margin-top: 0;
                margin-bottom: 0px;
            }

            .subheadline {
                font-style: italic;
                padding-left: 2em;
                margin-top: -1px;
                margin-bottom: 1.2em;
            }

            .warning-container {
                display: flex;
                flex-direction: inherit;
                align-items: center;
            }

            .warning-icon {
                margin-right: 10px;
                font-size: 1.5rem;
                margin-top: -23px;
            }

            .container {
                margin-top: 2rem;
            }

            .flex-container {
                margin-bottom: 5px;
            }

            .select-btn-wrapper {
                float: right;
            }

            .init {
                margin: 0px;
            }

            .flex-container {
                display: flex;
                justify-content: space-between;
            }

            .table-wrapper {
                position: relative;
            }

            .clipboard-footer {
                background-color: var(--dbp-background);
                width: 100%;
                padding-top: 10px;
                display: flex;
                align-items: end;
                flex-direction: column;
            }

            .wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                /* position: relative; */
            }

            .content {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .additional-button-container {
                margin-top: 0.5rem;
            }

            .warning-container p {
                margin-top: 0px;
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .flex-container {
                    justify-content: space-between;
                    display: flex;
                }

                .btn-flex-container-mobile {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .select-btn-wrapper {
                    width: 100%;
                    display: flex;
                    justify-content: end;
                    float: none;
                }

                .flex-container {
                    display: block;
                }

                .btn-flex-container-mobile {
                    flex-direction: column;
                }

                .btn-flex-container-mobile button:nth-child(2) {
                    margin-top: 5px;
                }

                .warning-icon {
                    margin-right: 10px;
                    font-size: 85px;
                    margin-top: -43px;
                }
            }
        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL(
            pkgName,
            'tabulator-tables/css/tabulator.min.css'
        );

        if (this.mode === MODE_FILE_SINK) {
            return this.getClipboardSink();
        } else if (this.mode === MODE_FILE_SOURCE) {
            return this.getClipboardSource();
        } else {
            return html`
                <div>
                    ${this.getAdditionalButtons()}
                    <link rel="stylesheet" href="${tabulatorCss}"/>
                    <div class="table-wrapper">
                        <table id="clipboard-content-table" class="force-no-select"></table>
                    </div>
                </div>
            `;
        }
    }
}
