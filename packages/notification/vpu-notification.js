import {i18n} from './i18n.js';
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

            const type = typeof e.detail.type !== 'undefined' ? e.detail.type : "info";
            const body = typeof e.detail.body !== 'undefined' ? e.detail.body : "";
            const summary = typeof e.detail.summary !== 'undefined' ? e.detail.summary : "";
            const timeout = typeof e.detail.timeout !== 'undefined' ? e.detail.timeout : 0;

            // TODO: take care about summary and timeout
            that._("#notification").innerHTML += `
                <div id="notification" class="notification is-${type}">
                    <button class="delete"></button>
                    ${body}
                </div>
            `;
        });

        this.updateComplete.then(()=>{
        });
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
            </style>

            <div class="columns">
                <div class="column" id="notification">
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-notification', VPUNotification);
