import {createUUID} from '@dbp-toolkit/common/utils';
import {css, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {ScopedElementsMixin, Icon} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';

/**
 * Safely renders text with newlines converted to <br> elements.
 * Text is automatically escaped by lit-html to prevent XSS.
 *
 * @param text - Text containing newline characters (\n)
 * @returns {import('lit').TemplateResult[]} Template array with lines separated by <br> tags
 */
function renderTextWithBreaks(text) {
    const lines = text.split('\n');
    return lines.map(
        (line, index) => html`
            ${line}${index < lines.length - 1
                ? html`
                      <br />
                  `
                : ''}
        `,
    );
}

class NotificationItem extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.type = 'info';
        this.body = '';
        this.summary = '';
        this.timeout = 0;
        this.icon = '';
        this.replaceId = null;

        this.notificationId = null;
        this.targetNotificationId = null;
        this._progressTimeout = null;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            type: {type: String},
            body: {type: String},
            summary: {type: String},
            timeout: {type: Number},
            icon: {type: String},
            replaceId: {type: String},
            notificationId: {type: String, reflect: true},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.timeout > 0) {
            this._progressTimeout = setTimeout(() => {
                this.handleDelete(true);
            }, this.timeout * 1000);
        }
    }

    disconnectedCallback() {
        if (this._progressTimeout) {
            clearTimeout(this._progressTimeout);
        }
        super.disconnectedCallback();
    }

    handleDelete(automatic = false) {
        this.dispatchEvent(
            new CustomEvent('dbp-notification-close', {
                detail: {
                    targetNotificationId: this.targetNotificationId,
                    // Indicates if the close was automatic (timeout) or manual (user click)
                    automatic: automatic,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getNotificationCSS()}

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
        const progressClass = this.timeout > 0 ? 'has-progress-bar' : 'no-progress-bar';
        const progressStyle = this.timeout > 0 ? `--dbp-progress-timeout: ${this.timeout}s;` : '';

        return html`
            <div class="notification is-${this.type} ${progressClass} enter-animation">
                <button
                    class="delete"
                    @click=${this.handleDelete}
                    aria-label="Close notification"></button>
                ${this.summary
                    ? html`
                          <h3>${this.summary}</h3>
                      `
                    : ''}
                <div class="content">
                    ${this.icon
                        ? html`
                              <dbp-icon name="${this.icon}"></dbp-icon>
                          `
                        : ''}
                    <span>${renderTextWithBreaks(this.body)}</span>
                </div>
                ${this.timeout > 0
                    ? html`
                          <div class="progress-container">
                              <div class="progress" style="${progressStyle}"></div>
                          </div>
                      `
                    : ''}
            </div>
        `;
    }
}

/**
 * Notification web component
 */
export class Notification extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.notifications = [];
        this._boundNotificationHandler = this._handleNotificationEvent.bind(this);
    }

    static get scopedElements() {
        return {
            'dbp-notification-item': NotificationItem,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            inline: {type: Boolean, attribute: 'inline'},
            notifications: {type: Array, state: true},
        };
    }

    /**
     * @param {CustomEvent} customEvent
     */
    _handleNotificationEvent(customEvent) {
        let targetNotificationId = customEvent.detail.targetNotificationId ?? null;

        if (targetNotificationId) {
            // If targetNotificationId is set, only process notifications for that component
            if (targetNotificationId !== this.id) {
                return;
            }
        } else {
            // If targetNotificationId is not set, only process notifications for the default notification component in the app-shell
            if (this.id !== 'dbp-notification') {
                return;
            }
        }
        customEvent.preventDefault();

        let replaceId = customEvent.detail.replaceId ?? null;
        let notificationData = {
            id: createUUID(),
            type: customEvent.detail.type ?? 'info',
            body: customEvent.detail.body ?? '',
            summary: customEvent.detail.summary ?? '',
            timeout: customEvent.detail.timeout ?? 0,
            icon: customEvent.detail.icon ?? '',
            replaceId: replaceId,
        };

        if (replaceId) {
            this.notifications = this.notifications.filter((n) => n.replaceId !== replaceId);
        }
        this.notifications.push(notificationData);
        this.requestUpdate('notifications');

        this.updateComplete.then(() => {
            const notificationEvent = new CustomEvent('dbp-notification-added', {
                detail: {targetNotificationId: this.id},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(notificationEvent);
        });
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dbp-notification-send', this._boundNotificationHandler);
    }

    disconnectedCallback() {
        window.removeEventListener('dbp-notification-send', this._boundNotificationHandler);
        super.disconnectedCallback();
        for (const notification of Object.values(this.notifications)) {
            clearTimeout(notification.progressTimeout);
        }
    }

    _removeById(notificationId, noAnimation = false) {
        const item = this.shadowRoot.querySelector(
            `dbp-notification-item[notificationId="${notificationId}"]`,
        );

        if (item) {
            const animationTimeout = noAnimation ? 0 : 500;
            item.classList.add('is-removing');
            setTimeout(() => {
                this.notifications = this.notifications.filter((n) => n.id !== notificationId);
                this.dispatchEvent(
                    new CustomEvent('dbp-notification-removed', {
                        detail: {targetNotificationId: this.id},
                        bubbles: true,
                        composed: true,
                    }),
                );
            }, animationTimeout);
        }
    }

    /**
     * Removes all notifications
     */
    removeAllNotifications() {
        this.notifications = [];
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

            .notification h3 {
                font: inherit;
                font-weight: bold;
                margin-bottom: 3px;
            }
        `;
    }

    render() {
        return html`
            <div class="notification-container" id="notification-container">
                ${repeat(
                    this.notifications,
                    (notification) => notification.id,
                    (notification) => html`
                        <dbp-notification-item
                            .type=${notification.type}
                            .body=${notification.body}
                            .summary=${notification.summary}
                            .timeout=${notification.timeout}
                            .icon=${notification.icon}
                            .replaceId=${notification.replaceId}
                            .notificationId=${notification.id}
                            @dbp-notification-close=${(e) => {
                                this._removeById(notification.id, e.detail.automatic);
                            }}></dbp-notification-item>
                    `,
                )}
            </div>
        `;
    }
}
