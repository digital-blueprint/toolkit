import {i18n} from './i18n';
import {createUUID} from './utils'
import {css, html} from 'lit-element';
import VPULitElement from 'vpu-common/vpu-lit-element';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import { send } from 'vpu-common/notification';

export { send };

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

        const listener = window.addEventListener("vpu-notification-send", (e) => {
            if (typeof e.detail === 'undefined') {
                return;
            }

            that.notificationBlock = that._("#notification");
            const notificationId = `notification-${createUUID()}`;

            const type = typeof e.detail.type !== 'undefined' ? e.detail.type : "info";
            const body = typeof e.detail.body !== 'undefined' ? e.detail.body : "";
            const summary = typeof e.detail.summary !== 'undefined' ? e.detail.summary : "";
            const timeout = typeof e.detail.timeout !== 'undefined' ? e.detail.timeout : 0;
            const icon = typeof e.detail.icon !== 'undefined' ? e.detail.icon : '';
            const iconHTML = icon !== '' ? `<vpu-icon name="${icon}"></vpu-icon>` : "";
            const summaryHTML = summary !== "" ? `<h3>${summary}</h3>` : "";

            that.notificationBlock.innerHTML = `
                <div id="${notificationId}" class="notification is-${type}">
                    <button id="${notificationId}-button" onclick="parentNode.parentNode.removeChild(parentNode)" class="delete"></button>
                    ${summaryHTML}
                    ${iconHTML} ${body}
                </div>
            ` + that.notificationBlock.innerHTML;

            const messageId = `#${notificationId}`;

            if (timeout > 0) {
                setTimeout(() => {
                    that.removeMessageId(messageId);
                }, timeout * 1000);
            }

            // mark the event as handled
            e.preventDefault();
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

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getNotificationCSS()}

            .notification:not(:last-child) {
                margin-bottom: 1.5rem;
            }

            .notification h3 {
                font-weight: bold;
                margin-bottom: 3px;
            }

            .delete, .modal-close {
                -moz-appearance: none;
                -webkit-appearance: none;
                background-color: rgba(10,10,10,.2);
                border: none;
                border-radius: 290486px;
                cursor: pointer;
                pointer-events: auto;
                display: inline-block;
                flex-grow: 0;
                flex-shrink: 0;
                font-size: 0;
                height: 20px;
                max-height: 20px;
                max-width: 20px;
                min-height: 20px;
                min-width: 20px;
                outline: 0;
                position: relative;
                vertical-align: top;
                width: 20px;
            }

            .delete::before, .modal-close::before, .delete::after, .modal-close::after {
                background-color: white;
                content: "";
                display: block;
                left: 50%;
                position: absolute;
                top: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
                        transform: translateX(-50%) translateY(-50%) rotate(45deg);
                -webkit-transform-origin: center center;
                        transform-origin: center center;
            }

            .delete::before, .modal-close::before {
                height: 2px;
                width: 50%;
            }

            .delete::after, .modal-close::after {
                height: 50%;
                width: 2px;
            }

            .delete:hover, .modal-close:hover, .delete:focus, .modal-close:focus {
                background-color: rgba(10, 10, 10, 0.3);
            }

            .delete:active, .modal-close:active {
                background-color: rgba(10, 10, 10, 0.4);
            }

            #notification {
                position: fixed; top: 0; max-width: 500px; margin: 0.75em auto; left: 0; right: 0; z-index: 1000; padding: 0;
            }

            .notification h3 {
                margin: 0 0 3px 0;
                font: inherit;
                font-weight: bold; 
            }
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-notification-src');

        return html`
            <div class="columns">
                <div class="column" id="notification">
                </div>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-notification', VPUNotification);
