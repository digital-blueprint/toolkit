import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonUtils from "@dbp-toolkit/common/utils";
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {NextcloudFilePicker} from "./dbp-nextcloud-file-picker";
import {classMap} from 'lit-html/directives/class-map.js';
import FileSaver from 'file-saver';
import MicroModal from "./micromodal.es";
import * as fileHandlingStyles from './styles';
import { send } from '@dbp-toolkit/common/notification';
import {humanFileSize} from '@dbp-toolkit/common/i18next';
import * as utils from "../../../../../src/utils";


/**
 * FileSink web component
 */
export class FileSink extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.context = '';
        this.lang = 'de';
        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';
        this.nextcloudName ='Nextcloud';
        this.nextcloudPath = '';
        this.nextcloudFileURL = '';
        this.text = '';
        this.buttonLabel = '';
        this.filename = "files.zip";
        this.files = [];
        this.activeTarget = 'local';
        this.isDialogOpen = false;
        this.enabledTargets = 'local';
        this.firstOpen = true;
        this.showClipboard = false;

        this.initialFileHandlingState = {target: '', path: ''};
        this.clipBoardFiles = {files: ''};
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
            context: {type: String, attribute: 'context'},
            lang: {type: String},
            filename: {type: String},
            files: {type: Array, attribute: false},
            enabledTargets: {type: String, attribute: 'enabled-targets'},
            nextcloudAuthUrl: {type: String, attribute: 'nextcloud-auth-url'},
            nextcloudWebDavUrl: {type: String, attribute: 'nextcloud-web-dav-url'},
            nextcloudName: {type: String, attribute: 'nextcloud-name'},
            nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
            text: {type: String},
            buttonLabel: {type: String, attribute: 'button-label'},
            isDialogOpen: {type: Boolean, attribute: false},
            activeTarget: {type: String, attribute: 'active-target'},
            firstOpen: {type: Boolean, attribute: false},
            nextcloudPath: {type: String, attribute: false},
            showClipboard: { type: Boolean, attribute: 'show-clipboard' },

            initialFileHandlingState: {type: Object, attribute: 'initial-file-handling-state'},
            clipBoardFiles: {type: Object, attribute: 'clipboard-files'},

        };
    }


    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {

            console.log("initialFileHandlingState", this.initialFileHandlingState);
        });
    }

    async downloadCompressedFiles() {
        // see: https://stuk.github.io/jszip/
        let JSZip = (await import('jszip/dist/jszip.js')).default;
        let zip = new JSZip();
        let fileNames = [];

        // download one file not compressed!
        if (this.files.length === 1) {
            FileSaver.saveAs(this.files[0], this.files[0].filename);
            this.closeDialog();
            return;
        }

        // download all files compressed
        this.files.forEach((file) => {
            let fileName = file.name;

            // add pseudo-random string on duplicate file name
            if (fileNames.indexOf(fileName) !== -1) {
                fileName = commonUtils.getBaseName(fileName) + "-" + Math.random().toString(36).substring(7) + "." +
                    commonUtils.getFileExtension(fileName);
            }

            fileNames.push(fileName);
            zip.file(fileName, file);
        });

        let content = await zip.generateAsync({type:"blob"});

        // see: https://github.com/eligrey/FileSaver.js#readme
        FileSaver.saveAs(content, this.filename || "files.zip");

        this.closeDialog();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "enabledTargets":
                    if (!this.hasEnabledDestination(this.activeTargets)) {
                        this.activeTargets = this.enabledTargets.split(",")[0];
                    }
                    break;
                case "files":
                    if (this.files.length !== 0 && !this.isDialogOpen) {
                        this.openDialog();
                    }
                    break;
                case "initialFileHandlingState":
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
        await element.uploadFiles(that.files, directory);
    }

    finishedFileUpload(event) {
        this.sendDestination();
        MicroModal.close(this._('#modal-picker'));
        if (event.detail > 0) {
            send({
                "summary": i18n.t('file-sink.upload-success-title'),
                "body": i18n.t('file-sink.upload-success-body', {name: this.nextcloudName, count: event.detail}),
                "type": "success",
                "timeout": 5,
            });
        }
    }

    sendDestination() {
        let data = {};
        if (this.activeTarget === 'nextcloud') {
            data = {"target": this.activeTarget, "path": this._("#nextcloud-file-picker").directoryPath};

        } else {
            data = {"target": this.activeTarget};
        }
        this.sendSetPropertyEvent('initial-file-handling-state', data);
    }


    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    loadWebdavDirectory() {

        if (this._('#nextcloud-file-picker').webDavClient !== null) {
            this._('#nextcloud-file-picker').loadDirectory(this._('#nextcloud-file-picker').directoryPath);
        }
    }

    openDialog() {
        this.loadWebdavDirectory();
        MicroModal.show(this._('#modal-picker'), {
            disableScroll: true,
            onClose: modal => { this.isDialogOpen = false; },
        });

        console.log("initialFileHandlingState", this.initialFileHandlingState);

        //check if default destination is set
        if (this.initialFileHandlingState.target !== '' && typeof this.initialFileHandlingState.target !== 'undefined'  && this.firstOpen) {
            this.activeTarget = this.initialFileHandlingState.target;
            this.nextcloudPath = this.initialFileHandlingState.path;
            if (this._('#nextcloud-file-picker').webDavClient !== null) {
                this._('#nextcloud-file-picker').loadDirectory(this.initialFileHandlingState.path);
                console.log("load default nextcloud sink", this.initialFileHandlingState.path);
            }
            this.firstOpen = false;
        }
    }

    saveFilesToClipboard()
    {
        //save it
        let data = {};
        if (this.files.length !== 0) {
            data = {"files": this.files};
            this.sendSetPropertyEvent('clipboard-files', data);
            this.closeDialog();
            send({
                "summary": i18n.t('file-sink.save-to-clipboard-title'),
                "body": i18n.t('file-sink.save-to-clipboard-body', {count: this.files.length}),
                "type": "success",
                "timeout": 5,
            });
            console.log("--------------", this.clipBoardFiles);
        }

    }

    getClipboardFiles() {
        let files = [];
        for(let i = 0; i < this.clipBoardFiles.files.length; i ++)
        {
            files[i] =  html`<div class="clipboard-list"><strong>${this.clipBoardFiles.files[i].name}</strong> ${humanFileSize(this.clipBoardFiles.files[i].size)}</div>`;
        }
        return files;
    }

    closeDialog(e) {
        this.sendDestination();
        MicroModal.close(this._('#modal-picker'));
    }

    /**
     * Open Filesink for multiple files
     */
    async openClipboardFileSink() {
        this._("#file-sink-clipboard").files = this.clipBoardFiles.files;
        this._("#file-sink-clipboard").setAttribute("dialog-open", "");
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            ${commonStyles.getModalDialogCSS()}
            ${fileHandlingStyles.getFileHandlingCss()}

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
        const isClipboardHidden = !this.showClipboard;


        return html`
            <vpu-notification lang="de" client-id="my-client-id"></vpu-notification>
            <div class="modal micromodal-slide" id="modal-picker" aria-hidden="true">
                <div class="modal-overlay" tabindex="-1">
                    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-picker-title">
                        <nav class="modal-nav">
                            <div title="${i18n.t('file-sink.nav-local')}"
                                 @click="${() => { this.activeTarget = "local"; }}"
                                 class="${classMap({"active": this.activeTarget === "local", hidden: !this.hasEnabledDestination("local")})}">
                                <dbp-icon class="nav-icon" name="laptop"></dbp-icon>
                                 <p>${i18n.t('file-source.nav-local')}</p>
                            </div>
                            <div title="${this.nextcloudName}"
                                 @click="${() => { this.activeTarget = "nextcloud"; this.loadWebdavDirectory();}}"
                                 class="${classMap({"active": this.activeTarget === "nextcloud", hidden: !this.hasEnabledDestination("nextcloud") || this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}">
                                <dbp-icon class="nav-icon" name="cloud"></dbp-icon>
                                <p> ${this.nextcloudName} </p>
                            </div>
                            <div title="Clipboard"
                                 @click="${() => { this.activeTarget = "clipboard"; }}"
                                 class="${classMap({"active": this.activeTarget === "clipboard", hidden: (!this.hasEnabledDestination("clipboard") || isClipboardHidden) })}">
                                <dbp-icon class="nav-icon" name="clipboard"></dbp-icon>
                                <p>Clipboard</p>
                            </div>
                        </nav>
                            <div class="modal-header">
                                <button title="${i18n.t('file-sink.modal-close')}" class="modal-close"  aria-label="Close modal" @click="${() => { this.closeDialog();}}">
                                        <dbp-icon title="${i18n.t('file-sink.modal-close')}" name="close" class="close-icon"></dbp-icon>
                                </button> 
                                <p class="modal-context"> ${this.context}</p>
                        </div>
                            
                        
                        <main class="modal-content" id="modal-picker-content">
                            <div class="source-main ${classMap({"hidden": this.activeTarget !== "local"})}">
                                <div id="zip-download-block">
                                    <div class="block">
                                        ${this.text || i18n.t('file-sink.local-intro', {'count': this.files.length})}
                                    </div>
                                    <button class="button is-primary"
                                            ?disabled="${this.disabled}"
                                            @click="${() => { this.downloadCompressedFiles(); }}">
                                        ${this.buttonLabel || i18n.t('file-sink.local-button', {'count': this.files.length})}
                                    </button>
                                </div>
                            </div>
                            <div class="source-main ${classMap({"hidden": this.activeTarget !== "nextcloud" || this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}">
                                <dbp-nextcloud-file-picker id="nextcloud-file-picker"
                                                           class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                                           directories-only
                                                           max-selected-items="1"
                                                           select-button-text="${i18n.t('file-sink.select-directory')}"
                                                           ?disabled="${this.disabled}"
                                                           lang="${this.lang}"
                                                           auth-url="${this.nextcloudAuthUrl}"
                                                           web-dav-url="${this.nextcloudWebDavUrl}"
                                                           nextcloud-name="${this.nextcloudName}"
                                                           directory-path="${this.nextcloudPath}"
                                                           nextcloud-file-url="${this.nextcloudFileURL}"
                                                           @dbp-nextcloud-file-picker-file-uploaded="${(event) => {
                                                               this.uploadToNextcloud(event.detail);
                                                           }}"
                                                           @dbp-nextcloud-file-picker-file-uploaded-finished="${(event) => {
                                                                this.finishedFileUpload(event);
                                                            }}"></dbp-nextcloud-file-picker>
                            </div>
                            <div class="source-main ${classMap({"hidden": this.activeTarget !== "clipboard" || isClipboardHidden})}">
                                <div class="block clipboard-container ${classMap({"table": this.clipBoardFiles && this.clipBoardFiles.files.length !== 0})}">
                                    <div class="inner">
                                        <h3>${i18n.t('file-sink.save-to-clipboard-title')}</h3>
                                        <p>${i18n.t('file-sink.save-to-clipboard-text')}</p>
                                        <button class="button is-primary clipboard-btn"
                                                ?disabled="${this.disabled}"
                                                @click="${() => { this.saveFilesToClipboard(); }}">
                                            ${this.buttonLabel || i18n.t('file-sink.save-to-clipboard-btn', {count:this.files.length})}
                                        </button>
                                        <div class="warning-container">
                                            <dbp-icon name="warning" class="warning-icon"></dbp-icon>
                                            <p>${i18n.t('file-sink.save-to-clipboard-warning')}</p>
                                        </div>
                                        
                                        <!-- filesink for clipboard TODO übersetzen-->

                                        <div clHALLLOOOOass="${classMap({"hidden": this.clipBoardFiles.files.length === 0})}">
                                        <button id="clipboard-download-button"
                                                    class="button is-right clipboard-btn"
                                                    @click="${this.openClipboardFileSink}"
                                                    >Aktuellen Zwischenablageninhalt speichern</button>
                                        </div>
                                        
                                        <dbp-file-sink id="file-sink-clipboard"
                                        context="${i18n.t('qualified-pdf-upload.save-field-label', {count: this.clipBoardFiles ? this.clipBoardFiles.files.length : 0})}"
                                        filename="signed-documents.zip"
                                        subscribe="initial-file-handling-state:initial-file-handling-state"
                                        enabled-targets="local${this.showNextcloudFilePicker ? ",nextcloud" : ""}"
                                        nextcloud-auth-url="${this.nextcloudWebAppPasswordURL}"
                                        nextcloud-web-dav-url="${this.nextcloudWebDavURL}"
                                        nextcloud-name="${this.nextcloudName}"
                                        nextcloud-file-url="${this.nextcloudFileURL}"
                                        lang="${this.lang}"
                                        ></dbp-file-sink>
                                        
                                        
                                        <div class="clipboard-data ${classMap({"hidden": this.clipBoardFiles.files.length === 0})}">
                                            <h4>${i18n.t('file-sink.clipboard-files')}</h4>
                                            <p>${i18n.t('file-sink.clipboard-files-overwrite')}</p>
                                            ${this.getClipboardFiles()}
                                        </div>
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