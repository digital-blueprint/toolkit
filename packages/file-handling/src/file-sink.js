import {createInstance} from './i18n';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {NextcloudFilePicker} from './nextcloud-file-picker';
import {classMap} from 'lit/directives/class-map.js';
import FileSaver from 'file-saver';
import MicroModal from './micromodal.es';
import * as fileHandlingStyles from './styles';
import {send} from '@dbp-toolkit/common/notification';
import {Clipboard} from '@dbp-toolkit/file-handling/src/clipboard';
import DbpFileHandlingLitElement from './dbp-file-handling-lit-element';

/**
 * FileSink web component
 */
export class FileSink extends LangMixin(
    ScopedElementsMixin(DbpFileHandlingLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.context = '';
        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.nextcloudName = 'Nextcloud';
        this.nextcloudPath = '';
        this.nextcloudFileURL = '';
        this.nextcloudStoreSession = false;
        this.buttonLabel = '';
        this.filename = 'files.zip';
        this.files = [];
        this.activeTarget = 'local';
        this.isDialogOpen = false;
        this.enabledTargets = 'local';
        this.firstOpen = true;
        this.fullsizeModal = false;
        this.nextcloudAuthInfo = '';
        this.streamed = false;
        this.sumContentLengths = -1;

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
            context: {type: String, attribute: 'context'},
            filename: {type: String},
            files: {type: Array, attribute: false},
            enabledTargets: {type: String, attribute: 'enabled-targets'},
            nextcloudAuthUrl: {type: String, attribute: 'nextcloud-auth-url'},
            nextcloudWebDavUrl: {type: String, attribute: 'nextcloud-web-dav-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
            nextcloudAuthInfo: {type: String, attribute: 'nextcloud-auth-info'},
            nextcloudStoreSession: {type: Boolean, attribute: 'nextcloud-store-session'},
            buttonLabel: {type: String, attribute: 'button-label'},
            isDialogOpen: {type: Boolean, attribute: false},
            activeTarget: {type: String, attribute: 'active-target'},
            firstOpen: {type: Boolean, attribute: false},
            nextcloudPath: {type: String, attribute: false},
            fullsizeModal: {type: Boolean, attribute: 'fullsize-modal'},
            initialFileHandlingState: {type: Object, attribute: 'initial-file-handling-state'},
            streamed: {type: Boolean, attribute: 'streamed'},
            sumContentLengths: {type: Number, attribute: 'content-length'},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        // only activate file streaming mode when the file-sink set the streamed property during connection
        if (this.streamed) {
            let baseUrl = new URL('./stream-sw.js', import.meta.url).href;
            // sw should always be run at the topmost level to listen to all fetch events
            // see common-untils.js getAssetURL()
            if (baseUrl.split('/').slice(-2)[0] === 'shared') {
                baseUrl = new URL('../stream-sw.js', baseUrl).href;
            }
            navigator.serviceWorker.register(baseUrl);
            // start keepalive calls only in Firefox
            if (window.navigator.userAgent.includes('Firefox')) {
                // TODO find a way to reliably stop this again
                // clearInterval works, but when should it be called? callback from sw?
                setInterval(function keepAlive() {
                    fetch('downloadZip/keep-alive', {
                        method: 'POST',
                        mode: 'cors',
                    });
                }, 3500);
            }
        }

        this.updateComplete.then(() => {
            this._('nav.modal-nav').addEventListener('scroll', this.handleScroll.bind(this));

            if (this.enabledTargets.split(',') > 1) {
                this._('.right-paddle').addEventListener(
                    'click',
                    this.handleScrollRight.bind(this, this._('nav.modal-nav')),
                );

                this._('.left-paddle').addEventListener(
                    'click',
                    this.handleScrollLeft.bind(this, this._('nav.modal-nav')),
                );
            } else {
                const paddles = this._('.paddles');
                if (paddles) {
                    paddles.classList.add('hidden');
                }
            }
        });
    }

    // starts a streamed download of all files in this.files
    handleStreamedDownload() {
        // create form used to stream-download a zip
        const downloadForm = document.createElement('form');
        downloadForm.style.display = 'none';
        downloadForm.action = 'downloadZip/files.zip';
        downloadForm.method = 'POST';

        // detect errors. "return" in forEach does not stop the method call
        let error = false;

        // if sumContentLengths set, create input with previously determined sum of content-length
        // this prevents the SW from doing the HEAD requests to do content-length prediction itself
        if (this.sumContentLengths >= 0) {
            let contentLength = document.createElement('input');
            contentLength.name = 'sumContentLengths';
            contentLength.value = this.sumContentLengths;
            downloadForm.appendChild(contentLength);
        }

        this.files.forEach((file) => {
            // check if object is in expected format
            if (
                !Object.hasOwn(file, 'name') ||
                !Object.hasOwn(file, 'url') ||
                file instanceof File
            ) {
                console.error('Given object cannot be streamed!');
                error = true;
                return;
            }
            // create URL object to check if its a real and valid url
            let fileUrl = new URL(file.url);

            // create input with file name and url
            let url = document.createElement('input');
            url.type = 'url';
            url.name = file.name;
            url.value = fileUrl.toString();
            downloadForm.appendChild(url);
        });

        // if error was thrown, stop
        if (error) {
            return;
        }

        // start download
        this.appendChild(downloadForm);
        downloadForm.submit();

        // cleanup
        while (downloadForm.hasChildNodes()) {
            downloadForm.removeChild(downloadForm.firstChild);
        }
        this.removeChild(downloadForm);
    }

    async downloadCompressedFiles() {
        // see: https://stuk.github.io/jszip/
        let JSZip = (await import('jszip/dist/jszip.js')).default;
        let zip = new JSZip();
        let fileNames = [];

        // download one file not compressed!
        if (this.files.length === 1) {
            // if it should be streamed and everything
            if (this.streamed) {
                this.handleStreamedDownload();
            } else {
                if (!(this.files[0] instanceof File)) {
                    console.error('Given object cannot be saved!');
                    return;
                }
                FileSaver.saveAs(this.files[0], this.files[0].filename);
            }

            this.closeDialog();
            return;
        }

        if (this.streamed) {
            this.handleStreamedDownload();
        } else {
            // check if an error was thrown in the forEach. "return does not stop the method call
            let error = false;

            // download all files compressed
            this.files.forEach((file) => {
                if (!(file instanceof File)) {
                    console.error('Given object cannot be saved!');
                    error = true;
                    return;
                }
                let fileName = file.name;

                // add pseudo-random string on duplicate file name
                if (fileNames.indexOf(fileName) !== -1) {
                    fileName =
                        commonUtils.getBaseName(fileName) +
                        '-' +
                        Math.random().toString(36).substring(7) +
                        '.' +
                        commonUtils.getFileExtension(fileName);
                }

                fileNames.push(fileName);
                zip.file(fileName, file);
            });
            // if error was thrown, stop
            if (error) {
                return;
            }
            let content = await zip.generateAsync({type: 'blob'});

            // see: https://github.com/eligrey/FileSaver.js#readme
            FileSaver.saveAs(content, this.filename || 'files.zip');
        }

        this.closeDialog();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'enabledTargets':
                    if (!this.hasEnabledDestination(this.activeTargets)) {
                        this.activeTargets = this.enabledTargets.split(',')[0];
                    }
                    break;
                case 'files':
                    if (this.files.length !== 0) {
                        this.openDialog();
                        if (this.enabledTargets.includes('clipboard')) {
                            const clipboardSink = this._('#clipboard-file-picker');
                            if (clipboardSink) {
                                this._('#clipboard-file-picker').filesToSave = [...this.files];
                            }
                        }
                    }
                    break;
                case 'initialFileHandlingState':
                    //check if default destination is set
                    if (this.firstOpen) {
                        this.nextcloudPath = this.initialFileHandlingState.path;
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }

    hasEnabledDestination(source) {
        return this.enabledTargets.split(',').includes(source);
    }

    async uploadToNextcloud(directory) {
        let that = this;
        const element = that._('#nextcloud-file-picker');
        const files = [...this.files];
        await element.uploadFiles(files, directory);
    }

    finishedFileUpload(event) {
        const i18n = this._i18n;
        this.sendDestination();
        MicroModal.close(this._('#modal-picker'));
        if (event.detail > 0) {
            send({
                summary: i18n.t('file-sink.upload-success-title'),
                body: i18n.t('file-sink.upload-success-body', {
                    name: this.nextcloudName,
                    count: event.detail,
                }),
                type: 'success',
                timeout: 5,
            });
        }
    }

    sendDestination() {
        let data = {};
        if (this.activeTarget === 'nextcloud') {
            data = {
                target: this.activeTarget,
                path: this._('#nextcloud-file-picker').directoryPath,
            };
        } else {
            data = {target: this.activeTarget};
        }
        this.sendSetPropertyEvent('initial-file-handling-state', data);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    loadWebdavDirectory() {
        const filePicker = this._('#nextcloud-file-picker');
        if (filePicker) {
            filePicker.checkLocalStorage().then((contents) => {
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
        if (this.enabledTargets.includes('clipboard')) {
            if (this._('#clipboard-file-picker')._('#select_all')) {
                this._('#clipboard-file-picker')._('#select_all').checked = false;
            }
        }
        const filePicker = this._('#modal-picker');
        if (filePicker) {
            MicroModal.show(filePicker, {
                disableScroll: true,
                onClose: (modal) => {
                    this.isDialogOpen = false;

                    // Send event that dialog is closed
                    const event = new CustomEvent('dbp-file-sink-dialog-closed', {
                        detail: {},
                        bubbles: true,
                        composed: true,
                    });
                    this.dispatchEvent(event);
                },
            });
        }

        //check if default destination is set
        if (
            this.initialFileHandlingState.target !== '' &&
            typeof this.initialFileHandlingState.target !== 'undefined' &&
            this.firstOpen
        ) {
            this.activeTarget = this.initialFileHandlingState.target;
            this.nextcloudPath = this.initialFileHandlingState.path;

            const filePicker = this._('#nextcloud-file-picker');

            if (filePicker && filePicker.webDavClient !== null) {
                filePicker.loadDirectory(this.initialFileHandlingState.path);
            }
            this.firstOpen = false;
        }

        this.isDialogOpen = true;
    }

    closeDialog(e) {
        this.sendDestination();
        if (this.enabledTargets.includes('clipboard')) {
            const filePicker = this._('#clipboard-file-picker');
            if (filePicker && filePicker.tabulatorTable) {
                filePicker.tabulatorTable.deselectRow();
                filePicker.numberOfSelectedFiles = 0;
                if (filePicker._('#select_all')) {
                    filePicker._('#select_all').checked = false;
                }
            }
        }
        MicroModal.close(this._('#modal-picker'));
        this.isDialogOpen = false;
    }

    getClipboardHtml() {
        if (this.enabledTargets.includes('clipboard')) {
            return html`
                <dbp-clipboard
                    id="clipboard-file-picker"
                    subscribe="clipboard-files:clipboard-files"
                    show-additional-buttons
                    mode="file-sink"
                    lang="${this.lang}"
                    auth-url="${this.nextcloudAuthUrl}"
                    enabled-targets="${this.enabledTargets}"
                    nextcloud-auth-url="${this.nextcloudAuthUrl}"
                    nextcloud-web-dav-url="${this.nextcloudWebDavUrl}"
                    nextcloud-name="${this.nextcloudName}"
                    nextcloud-file-url="${this.nextcloudFileURL}"
                    @dbp-clipboard-file-picker-file-uploaded="${(event) => {
                        this.closeDialog(event);
                    }}"></dbp-clipboard>
            `;
        }
        return html``;
    }

    getNextcloudHtml() {
        const i18n = this._i18n;
        if (
            this.enabledTargets.includes('nextcloud') &&
            this.nextcloudWebDavUrl !== '' &&
            this.nextcloudAuthUrl !== ''
        ) {
            return html`
                <dbp-nextcloud-file-picker
                    id="nextcloud-file-picker"
                    class="${classMap({
                        hidden: this.nextcloudWebDavUrl === '' || this.nextcloudAuthUrl === '',
                    })}"
                    directories-only
                    max-selected-items="1"
                    select-button-text="${i18n.t('file-sink.select-directory')}"
                    ?disabled="${this.disabled}"
                    lang="${this.lang}"
                    subscribe="html-overrides,auth"
                    auth-url="${this.nextcloudAuthUrl}"
                    web-dav-url="${this.nextcloudWebDavUrl}"
                    nextcloud-name="${this.nextcloudName}"
                    auth-info="${this.nextcloudAuthInfo}"
                    directory-path="${this.nextcloudPath}"
                    nextcloud-file-url="${this.nextcloudFileURL}"
                    ?store-nextcloud-session="${this.nextcloudStoreSession}"
                    @dbp-nextcloud-file-picker-file-uploaded="${(event) => {
                        this.uploadToNextcloud(event.detail);
                    }}"
                    @dbp-nextcloud-file-picker-file-uploaded-finished="${(event) => {
                        this.finishedFileUpload(event);
                    }}"></dbp-nextcloud-file-picker>
            `;
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

            .modal-container-full-size {
                min-width: 100%;
                min-height: 100%;
            }

            #zip-download-block {
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .block {
                margin-bottom: 10px;
            }

            #clipboard-file-sink {
                width: 100%;
                height: 100%;
            }

            .paddle {
                position: absolute;
                top: 0px;
                padding: 0px 5px;
                box-sizing: content-box;
                height: 100%;
            }

            .paddle::before {
                background-color: var(--dbp-background);
                opacity: 0.8;
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
            }

            .right-paddle {
                right: 0px;
            }

            .left-paddle {
                left: 0px;
            }

            .nav-wrapper {
                position: relative;
                display: block;
                overflow-x: auto;
                border: none;
            }

            .paddles {
                display: none;
            }

            .modal-nav {
                height: 100%;
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .paddles {
                    display: inherit;
                }
            }
        `;
    }

    render() {
        const i18n = this._i18n;
        return html`
            <div class="modal micromodal-slide" id="modal-picker" aria-hidden="true">
                <div class="modal-overlay" tabindex="-1">
                    <div
                        class="modal-container ${classMap({
                            'modal-container-full-size': this.fullsizeModal,
                        })}"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-picker-title">
                        <div class="nav-wrapper modal-nav">
                            <nav class="modal-nav">
                                <div
                                    title="${i18n.t('file-sink.nav-local')}"
                                    @click="${() => {
                                        this.activeTarget = 'local';
                                    }}"
                                    class="${classMap({
                                        active: this.activeTarget === 'local',
                                        hidden: !this.hasEnabledDestination('local'),
                                    })}">
                                    <dbp-icon class="nav-icon" name="laptop"></dbp-icon>
                                    <p>${i18n.t('file-source.nav-local')}</p>
                                </div>
                                <div
                                    title="${this.nextcloudName}"
                                    @click="${() => {
                                        this.activeTarget = 'nextcloud';
                                        this.loadWebdavDirectory();
                                    }}"
                                    class="${classMap({
                                        active: this.activeTarget === 'nextcloud',
                                        hidden:
                                            !this.hasEnabledDestination('nextcloud') ||
                                            this.nextcloudWebDavUrl === '' ||
                                            this.nextcloudAuthUrl === '',
                                    })}">
                                    <dbp-icon class="nav-icon" name="cloud"></dbp-icon>
                                    <p>${this.nextcloudName}</p>
                                </div>
                                <div
                                    title="${i18n.t('file-sink.clipboard')}"
                                    @click="${() => {
                                        this.activeTarget = 'clipboard';
                                    }}"
                                    class="${classMap({
                                        active: this.activeTarget === 'clipboard',
                                        hidden: !this.hasEnabledDestination('clipboard'),
                                    })}">
                                    <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                                    <p>${i18n.t('file-sink.clipboard')}</p>
                                </div>
                            </nav>
                            <div class="paddles">
                                <dbp-icon
                                    class="left-paddle paddle hidden"
                                    name="chevron-left"
                                    class="close-icon"></dbp-icon>
                                <dbp-icon
                                    class="right-paddle paddle"
                                    name="chevron-right"
                                    class="close-icon"></dbp-icon>
                            </div>
                        </div>

                        <div class="modal-header">
                            <button
                                title="${i18n.t('file-sink.modal-close')}"
                                class="modal-close"
                                aria-label="Close modal"
                                @click="${() => {
                                    this.closeDialog();
                                }}">
                                <dbp-icon
                                    title="${i18n.t('file-sink.modal-close')}"
                                    name="close"
                                    class="close-icon"></dbp-icon>
                            </button>
                            <p class="modal-context">${this.context}</p>
                        </div>

                        <main class="modal-content" id="modal-picker-content">
                            <div
                                class="source-main ${classMap({
                                    hidden: this.activeTarget !== 'local',
                                })}">
                                <div id="zip-download-block">
                                    <div class="block">
                                        ${i18n.t('file-sink.local-intro', {
                                            count: this.files.length,
                                        })}
                                    </div>
                                    <button
                                        class="button is-primary"
                                        ?disabled="${this.disabled}"
                                        @click="${() => {
                                            this.downloadCompressedFiles();
                                        }}">
                                        ${i18n.t('file-sink.local-button', {
                                            count: this.files.length,
                                        })}
                                    </button>
                                </div>
                            </div>
                            <div
                                class="source-main ${classMap({
                                    hidden:
                                        this.activeTarget !== 'nextcloud' ||
                                        this.nextcloudWebDavUrl === '' ||
                                        this.nextcloudAuthUrl === '',
                                })}">
                                ${this.getNextcloudHtml()}
                            </div>
                            <div
                                class="source-main ${classMap({
                                    hidden: this.activeTarget !== 'clipboard',
                                })}">
                                ${this.getClipboardHtml()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        `;
    }
}
