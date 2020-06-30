import {i18n} from './i18n';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import VPULitElement from 'vpu-common/vpu-lit-element';
import * as commonUtils from "vpu-common/utils";
import {Icon, MiniSpinner} from 'vpu-common';
import * as commonStyles from 'vpu-common/styles';
import {NextcloudFilePicker} from "./vpu-nextcloud-file-picker";
import {classMap} from 'lit-html/directives/class-map.js';
import FileSaver from 'file-saver';


/**
 * FileSink web component
 */
export class FileSink extends ScopedElementsMixin(VPULitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.nextcloudAuthUrl = '';
        this.nextcloudWebDavUrl = '';

        this._onDownloadCompressedFiles = this.onDownloadCompressedFiles.bind(this);
    }

    static get scopedElements() {
        return {
            'vpu-icon': Icon,
            'vpu-mini-spinner': MiniSpinner,
            'vpu-nextcloud-file-picker': NextcloudFilePicker,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            nextcloudAuthUrl: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavUrl: { type: String, attribute: 'nextcloud-web-dav-url' },
        };
    }

    async onDownloadCompressedFiles(event) {
        const detail = event.detail;

        console.log("event", event);
        console.log("detail", detail);

        // see: https://stuk.github.io/jszip/
        let JSZip = (await import('jszip/dist/jszip.js')).default;
        let zip = new JSZip();
        let fileNames = [];

        // add all signed pdf-files
        detail.files.forEach((file) => {
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
        FileSaver.saveAs(content, detail.filename || "files.zip");
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

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.addEventListener('vpu-file-sink-download-compressed-files', this._onDownloadCompressedFiles);
        });
    }

    disconnectedCallback() {
        // remove event listeners
        window.removeEventListener('vpu-file-sink-download-compressed-files', this._onDownloadCompressedFiles);

        super.disconnectedCallback();
    }

    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        return html`
<!--
            <vpu-nextcloud-file-picker id="nextcloud-file-picker"
                                       class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                       ?disabled="${this.disabled}"
                                       lang="${this.lang}"
                                       auth-url="${this.nextcloudAuthUrl}"
                                       web-dav-url="${this.nextcloudWebDavUrl}"
                                       @vpu-nextcloud-file-picker-file-downloaded="${(event) => {
                                           this.sendFileEvent(event.detail.file);
                                       }}"></vpu-nextcloud-file-picker>
-->
        `;
    }
}