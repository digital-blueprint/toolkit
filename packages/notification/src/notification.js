import {createInstance} from './i18n';
import {createUUID} from './utils';
import {css, html} from 'lit';
import {LangMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';

/**
 * Notification web component
 */
export class Notification extends LangMixin(DBPLitElement, createInstance) {
    constructor() {
        super();
        this.notificationBlock = null;
        this.notifications = {};
        this.targetNotificationId = null;
        // notifications = {
        //     notificationId: {
        //         id: 'notificationId',
        //         messageSelector: '#notificationId',
        //         progressTimeout: 10,
        //     }
        // };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            inline: {type: Boolean, attribute: 'inline'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        // const that = this;

        /**
         * @param {CustomEvent} e
         */
        window.addEventListener('dbp-notification-send', (e) => {
            const customEvent = /** @type {CustomEvent} */ (e);
            if (typeof customEvent.detail === 'undefined') {
                return;
            }

            this.targetNotificationId =
                typeof customEvent.detail.targetNotificationId !== 'undefined'
                    ? customEvent.detail.targetNotificationId
                    : null; // If targetNotificationId is set, only process notifications for that component
            if (this.targetNotificationId && this.targetNotificationId !== this.id) {
                return;
            }
            // If targetNotificationId is not set, only process notifications for the default notification component in the app-shell
            if (!this.targetNotificationId && this.id !== 'dbp-notification') {
                return;
            }

            this.notificationBlock = this._('#notification-container');
            const notificationId = `notification-${createUUID()}`;
            this.notifications[notificationId] = {};
            this.notifications[notificationId].id = notificationId;
            this.notifications[notificationId].messageSelector = `#${notificationId}`;

            const type =
                typeof customEvent.detail.type !== 'undefined' ? customEvent.detail.type : 'info';
            const body =
                typeof customEvent.detail.body !== 'undefined' ? customEvent.detail.body : '';
            const summary =
                typeof customEvent.detail.summary !== 'undefined' ? customEvent.detail.summary : '';
            const timeout =
                typeof customEvent.detail.timeout !== 'undefined' ? customEvent.detail.timeout : 0;
            const icon =
                typeof customEvent.detail.icon !== 'undefined' ? customEvent.detail.icon : '';
            const iconHTML = icon !== '' ? `<dbp-icon name="${icon}"></dbp-icon>` : '';
            const summaryHTML = summary !== '' ? `<h3>${summary}</h3>` : '';
            const replaceId =
                typeof customEvent.detail.replaceId !== 'undefined'
                    ? customEvent.detail.replaceId
                    : null;

            if (replaceId) {
                // Search for notification in this.notifications with the same replaceId and remove it
                for (const notificationId in this.notifications) {
                    if (this.notifications[notificationId].replaceId === replaceId) {
                        this.removeMessageById(this.notifications[notificationId]);
                    }
                }
            }
            this.notifications[notificationId].replaceId = replaceId;

            const progressBarHTML =
                timeout > 0
                    ? `<div class="progress-container"><div class="progress" style="--dbp-progress-timeout: ${timeout}s;"></div></div>`
                    : '';
            const progressClass = timeout > 0 ? 'has-progress-bar' : 'no-progress-bar';

            // Create and append notification element
            const newNotification = document.createElement('div');
            newNotification.id = notificationId;
            newNotification.classList.add(
                'notification',
                'enter-animation',
                `is-${type}`,
                progressClass,
            );
            newNotification.innerHTML = `
                <button id="${notificationId}-button" class="delete"></button>
                ${summaryHTML}
                ${iconHTML} ${body}
                ${progressBarHTML}
            `;
            this.notificationBlock.appendChild(newNotification);

            // Add event listener for the delete button
            const deleteButton = this.notificationBlock.querySelector(`#${notificationId}-button`);
            deleteButton.addEventListener('click', () =>
                this.removeMessageById(this.notifications[notificationId]),
            );

            if (timeout > 0) {
                // Remove notification after timeout
                this.notifications[notificationId]['progressTimeout'] = setTimeout(() => {
                    this.removeMessageById(this.notifications[notificationId]);
                }, timeout * 1000);
            }

            // mark the event as handled
            e.preventDefault();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        for (const notification of Object.values(this.notifications)) {
            clearTimeout(notification.progressTimeout);
        }
    }

    /**
     * Removes the notification element
     * @param {object} notification - object with notification data
     * @param {boolean} noAnimation - if true, the notification will not be animated
     */
    removeMessageById(notification, noAnimation = false) {
        const messageElementId = notification.messageSelector;
        const messageElement = this._(messageElementId);

        if (messageElement) {
            const animationTimeout = noAnimation ? 0 : 500;
            // Add animation class
            messageElement.classList.add('is-removing');
            setTimeout(() => {
                this.notificationBlock.removeChild(messageElement);
                // Send event for modal to recalculate padding top and translate y values
                const customEvent = new CustomEvent('dbp-notification-close', {
                    detail: {targetNotificationId: this.targetNotificationId},
                    bubbles: true,
                    composed: true,
                });
                this.dispatchEvent(customEvent);
            }, animationTimeout);

            clearTimeout(this.notifications[notification.id].progressTimeout);
            delete this.notifications[notification.id];
        }
    }

    /**
     * Removes all notifications
     */
    removeAllNotifications() {
        for (const notification of Object.values(this.notifications)) {
            this.removeMessageById(notification, true);
        }
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getNotificationCSS()}

            .notification-container {
                position: fixed;
                top: 0;
                max-width: 500px;
                margin: 0.75em auto;
                left: 0;
                right: 0;
                z-index: 1000;
                padding: 0;
            }

            :host([inline]) .notification-container {
                top: 0;
                left: 0;
                right: 0;
                max-width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
            }

            :host([inline]) .notification-container--inside {
                margin-top: 60px;
            }

            :host([inline]) .notification:not(:last-child) {
                /* margin-bottom: 1rem; */
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
        `;
    }

    render() {
        return html`
            <div class="columns">
                <div class="column notification-container" id="notification-container"></div>
            </div>
        `;
    }
}
