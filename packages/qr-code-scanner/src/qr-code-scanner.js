import {i18n} from './i18n';
import {css, html} from 'lit-element';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import * as commonStyles from 'dbp-common/styles';
import {Icon, MiniSpinner} from 'dbp-common';
import {classMap} from 'lit-html/directives/class-map.js';
import QrScanner from 'qr-scanner';
import * as commonUtils from "dbp-common/utils";

/**
 * Notification web component
 */
export class QrCodeScanner extends DBPLitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            QrScanner.WORKER_PATH = commonUtils.getAssetURL('dbp-qr-scanner', 'qr-scanner-worker.min.js');
            const qrScanner = new QrScanner(this._('#reader'), result => console.log('decoded qr code:', result), undefined, undefined, 'user');
            qrScanner.start();
        });
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
        `;
    }

    //todo check for cam: QrScanner.hasCamera();
    //start stop button
    //doku
    //demo
    //quadrat

    render() {
        return html`
            <div class="columns">
                <div class="column" id="qr">
                    <button class="start">start scanning</button>
                    <video id="reader"></video>
                </div>
            </div>
        `;
    }
}