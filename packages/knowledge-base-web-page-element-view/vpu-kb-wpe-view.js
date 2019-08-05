import {i18n} from './i18n';
import {html} from 'lit-element';
// import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'
import utils from "./utils";
import commonUtils from "vpu-common/utils";
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUKnowledgeBaseWebPageElementView extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.value = '';
        this.html = '';
        this.entryPointUrl = utils.getAPiUrl();
        this.error = '';
        this.eyeClose = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA1ElEQVQ4ja3SMU5CURCF4c+ejpiILe5DZAGyASuJS5CKEoMGKhdAwWKgMkriKjQWFkAkBizgmckNPEgeJ7nVuee/M3eGI2mCehFAHZ/Hgtygizd84wsjPOHsEMgUqx1njvtd4R7uAmSIMipo4SeAHtLwdTCbG8gHLsOdVlJN9LwEY4nSFsh5AhhHwGtinoY/ySDlPEAjMbvByyDDvBbgOZi/eNxUkrUTp9NJw3CCNhbJS0vcBshgWzjqAn28W899Zr1U1dBObR8kT9nGXhWFTIoA/vUHQydS/iUcHx4AAAAASUVORK5CYII=';
        this.eyeOpen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5UlEQVQ4jc3SvS7EURAF8B+JioSsCokHUFgNiWewQqvzICRew2v4WLFUnoNS/msrazUaFOYm12RlVeIkk9ycM2fmztzLf8U02tiPaAc3EbM4Rh8fKfo4wdxP5nXcV4YhLnGO54p/wEY2b6akHhYqfR7dVHyriMt4qsQRWtiNaw+wFwWHaaQlcc161l4UblIyXKTcM7hL5FUk14tsgsvNumIhb2NG6ISxiXMrtJI3wErZwyHeK/E2DAWLuKn0F2xLOEgdRriOeK34sc9YsIpT37dd4hFHvj7bRMxElw52sIap3xj/Hp9rzGFBhiMSxAAAAABJRU5ErkJggg==';
        //this.css = 'kb.css';
        this.text = '';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
            html: { type: String, attribute: false },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            id: { type: String, attribute: false},
            error: { type: String, attribute: false},
            //css: { type: String },
            text: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        // JSONLD.initialize(this.entryPointUrl, function (jsonld) {
        //     const apiUrl = jsonld.getApiUrlForEntityName("KnowledgeBaseWebPageElement") + '/' +
        //         encodeURIComponent(commonUtils.base64EncodeUnicode(encodeURIComponent(that.value)));
        // });

        window.addEventListener("vpu-auth-init", () => that.loadWebPageElement());
    }

    /**
     * Loads the data from the web page element
     */
    loadWebPageElement() {
        if (window.VPUAuthToken === undefined || window.VPUAuthToken === "") {
            return;
        }

        // sadly there there is no entity url without "collectionOperations" in entity KnowledgeBaseWebPageElement!
        const apiUrl = this.entryPointUrl + "/web_page_elements/knowledge_base_web_page_elements/" +
            encodeURIComponent(commonUtils.base64EncodeUnicode(encodeURIComponent(this.value))) +
            "?lang=" + encodeURIComponent(this.lang);

        var that = this;
        fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
        })
        .then(function (res) {
            if (!res.ok) {
                let status_msg;
                switch (res.status) {
                    case 403:
                        status_msg = that.lang === 'de' ? 'ist verboten' : 'is forbidden';
                        break;
                    case 404:
                        status_msg = that.lang === 'de' ? 'wurde nicht gefunden' : 'was not found';
                        break;
                    case 500:
                        status_msg = that.lang === 'de' ? 'macht Probleme am Server' : 'troubled server';
                        break;
                    default:
                        status_msg = that.lang === 'de' ? 'mit unbekanntem Problem' : 'with unknown problems';
                }
                if (that.lang === 'de') {
                    that.error = html`<p>FEHLER: Information "<b>${that.value}</b>" ${status_msg} (${res.status}).</p>`;
                } else {
                    that.error = html`<p>ERROR: information "<b>${that.value}</b>" ${status_msg} (${res.status}).</p>`;
                }
                throw new Error('HTTP error: ' +that.value + ' ' + status_msg + ', status = ' + res.status);
            }
            return res.json();
        })
        .then(webPageElement => {
            if (webPageElement !== undefined && webPageElement.text !== undefined) {
                that.html = webPageElement.text;
            }
        })
        // catch e.g. 404 errors
        .catch();
    }

    updated(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
            switch(propName) {
                case "lang":
                case "value":
                case "entry-point-url":
                    this.loadWebPageElement();
                    break;
            }
        });
    }

    toggle(e) {
        const element = this.shadowRoot.querySelector('#A1');
        const img = e.target;
        const d = element.style.display;
        if(d === '' || d === 'none') {
            element.style.display = 'flex';
            img.src = this.eyeClose;
        } else {
            element.style.display = 'none';
            img.src = this.eyeOpen;
        }
    }

    render() {
        //<link rel="stylesheet" href="${this.css}">
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
                .kb {
                    display: none;
                }
            </style>
            <span>${this.text}<img src='${this.eyeOpen}' @click="${this.toggle}" alt="open/close"></span>
            <div class='kb' id="A1">
                ${unsafeHTML(this.html)}
                ${this.error}
            </div>
        `;
    }
}

customElements.define('vpu-knowledge-base-web-page-element-view', VPUKnowledgeBaseWebPageElementView);
