import {i18n} from './i18n';
import utils from './utils'
import {html} from 'lit-element';
import VPULitElement from 'vpu-common/vpu-lit-element'

/**
 * Notification web component
 */
class VPUNotification extends VPULitElement {
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

        const listener = document.addEventListener("vpu-notification-send", (e) => {
            if (typeof e.detail === 'undefined') {
                return;
            }

            that.notificationBlock = that._("#notification");
            const notificationId = `notification-${utils.createUUID()}`;

            const type = typeof e.detail.type !== 'undefined' ? e.detail.type : "info";
            const body = typeof e.detail.body !== 'undefined' ? e.detail.body : "";
            const summary = typeof e.detail.summary !== 'undefined' ? e.detail.summary : "";
            const timeout = typeof e.detail.timeout !== 'undefined' ? e.detail.timeout : 0;
            const summaryHTML = summary !== "" ? `<h3>${summary}</h3>` : "";

            that.notificationBlock.innerHTML = `
                <div id="${notificationId}" class="notification is-${type}">
                    <button id="${notificationId}-button" onclick="parentNode.parentNode.removeChild(parentNode)" class="delete"></button>
                    ${summaryHTML}
                    ${body}
                </div>
            ` + that.notificationBlock.innerHTML;

            const messageId = `#${notificationId}`;

            if (timeout > 0) {
                setTimeout(() => {
                    that.removeMessageId(messageId);
                }, timeout * 1000);
            }
        });

        this.updateComplete.then(()=>{
        });
    }

    removeMessageId(messageElementId) {
        const element = this._(messageElementId);

        if (element) {
            this.notificationBlock.removeChild(element);
        }
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
                #notification {position: fixed; top: 0; max-width: 500px; margin: 1% auto; left: 0; right: 0;}
                .notification h3 {font-weight: bold; margin-bottom: 3px;}
            </style>

            <div class="columns">
                <div class="column" id="notification">
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-notification', VPUNotification);
