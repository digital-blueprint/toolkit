import {createInstance} from './i18n';
import {createUUID} from './utils';
import {css, html} from 'lit';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';

/**
 * Notification web component
 */
export class Notification extends DBPLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.notificationBlock = null;
        this.notifications = {};
        // notifications = {
        //     notificationId: {
        //         id: 'notificationId',
        //         messageId: '#notificationId',
        //         progressTimeout: 10,
        //         progressInterval: 23
        //     }
        // };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        /**
         * @param {CustomEvent} e
         */
        window.addEventListener('dbp-notification-send', (e) => {
            /** @type {CustomEvent} */
            const customEvent = e;
            if (typeof customEvent.detail === 'undefined') {
                return;
            }

            that.notificationBlock = that._('#notification');
            const notificationId = `notification-${createUUID()}`;
            that.notifications[notificationId] = {};
            that.notifications[notificationId].id = notificationId;
            that.notifications[notificationId].messageId = `#${notificationId}`;

            const type = typeof customEvent.detail.type !== 'undefined' ? customEvent.detail.type : 'info';
            const body = typeof customEvent.detail.body !== 'undefined' ? customEvent.detail.body : '';
            const summary = typeof customEvent.detail.summary !== 'undefined' ? customEvent.detail.summary : '';
            const timeout = typeof customEvent.detail.timeout !== 'undefined' ? customEvent.detail.timeout : 0;
            const icon = typeof customEvent.detail.icon !== 'undefined' ? customEvent.detail.icon : '';
            const iconHTML = icon !== '' ? `<dbp-icon name="${icon}"></dbp-icon>` : '';
            const summaryHTML = summary !== '' ? `<h3>${summary}</h3>` : '';

            const STEP = 10;
            const MAXCOUNT = timeout * 1000 / STEP;

            const progressBarHTML = timeout > 0 ? `<div class="progress-container"><progress class="progress" value="0" max="${MAXCOUNT}"></progress></div>` : '';
            const progressClass = timeout > 0 ? 'has-progress-bar' : 'no-progress-bar';

            // Create and append notification element
            const newNotification = document.createElement('div');
            newNotification.id = notificationId;
            newNotification.classList.add('notification', `is-${type}`, progressClass);
            newNotification.innerHTML = `
                <button id="${notificationId}-button" class="delete"></button>
                ${summaryHTML}
                ${iconHTML} ${body}
                ${progressBarHTML}
            `;
            that.notificationBlock.appendChild(newNotification);

            // Add event listener for the delete button
            const deleteButton = that.notificationBlock.querySelector(`#${notificationId}-button`);
            deleteButton.addEventListener('click', () => that.removeMessageId(that.notifications[notificationId]));

            if (timeout > 0) {
                // Remove notification after timeout
                that.notifications[notificationId]['progressTimeout'] = setTimeout(() => {
                    that.removeMessageId(that.notifications[notificationId]);
                }, timeout * 1000);

                // Update progress bar
                that.notifications[notificationId]['progressInterval'] = setInterval(() => {
                    /** @type {HTMLProgressElement} */
                    const progressElement = this._(`#${notificationId}`).querySelector('.progress');
                    if (progressElement) {
                        progressElement.value += 1;
                        if (progressElement.value >= MAXCOUNT) {
                            clearInterval(that.notifications[notificationId].progressInterval);
                            that.notifications[notificationId].progressInterval = null;
                        }
                    }
                }, STEP);
            }

            // mark the event as handled
            e.preventDefault();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        for (const notification in this.notifications) {
            clearInterval(this.notifications[notification].progressInterval);
            clearTimeout(this.notifications[notification].progressTimeout);
        }
    }

    /**
     * Removes the notification element
     * @param {object} notification - object with notification data
     */
    removeMessageId(notification) {
        const messageElementId = notification.messageId;
        const element = this._(messageElementId);

        if (element) {
            element.classList.add('is-removing');
            setTimeout(() => {
                this.notificationBlock.removeChild(element);
            }, 250);
            clearInterval(this.notifications[notification.id].progressInterval);
            clearTimeout(this.notifications[notification.id].progressTimeout);
            delete this.notifications[notification.id];
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
                font: inherit;
                font-weight: bold;
                margin-bottom: 3px;
            }

            .delete,
            .modal-close {
                -moz-appearance: none;
                -webkit-appearance: none;
                background-color: rgba(10, 10, 10, 0.2);
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

            .delete::before,
            .modal-close::before,
            .delete::after,
            .modal-close::after {
                background-color: var(--dbp-background);
                color: var(--dbp-content);
                content: '';
                display: block;
                left: 50%;
                position: absolute;
                top: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
                transform: translateX(-50%) translateY(-50%) rotate(45deg);
                -webkit-transform-origin: center center;
                transform-origin: center center;
            }

            .delete::before,
            .modal-close::before {
                height: 2px;
                width: 50%;
            }

            .delete::after,
            .modal-close::after {
                height: 50%;
                width: 2px;
            }

            .delete:hover,
            .modal-close:hover,
            .delete:focus,
            .modal-close:focus {
                background-color: rgba(10, 10, 10, 0.3);
            }

            .delete:active,
            .modal-close:active {
                background-color: rgba(10, 10, 10, 0.4);
            }

            #notification {
                position: fixed;
                top: 0;
                max-width: 500px;
                margin: 0.75em auto;
                left: 0;
                right: 0;
                z-index: 1000;
                padding: 0;
            }
        `;
    }

    render() {
        return html`
            <div class="columns">
                <div class="column" id="notification"></div>
            </div>
        `;
    }
}
