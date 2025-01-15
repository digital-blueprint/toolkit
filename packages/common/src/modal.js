import {
    html, css
} from 'lit';
import { createInstance } from './i18n';
import * as commonStyles from './styles.js';
import { Icon } from './icon';
import {ScopedElementsMixin} from './scoped/ScopedElementsMixin.js';
import dialogPolyfill from 'dialog-polyfill';
import DBPLitElement from './dbp-lit-element';

export class Modal extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        /** @type {HTMLDialogElement} */
        this.modalDialog = null;
        /** @type {string} */
        this.modalId = 'dbp-modal-id';
        /** @type {string} */
        this.title = "";
        /** @type {boolean} */
        this.stickyFooter = false;
        /** @type {number} */
        this.modalPaddingTopDefault;
    }

    static get properties() {
        return {
            modalId: { type: String, attribute: 'modal-id' },
            title: { type: String },
            stickyFooter: { type: Boolean, attribute: 'sticky-footer' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
    }

    firstUpdated() {
        this.modalDialog = /** @type {HTMLDialogElement} */ (this._('#' + this.modalId));
        dialogPolyfill.registerDialog(this.modalDialog);

        // Save default value of padding top changed when adding/removing notifications
        this.modalPaddingTopDefault = parseInt(window.getComputedStyle(this.modalDialog).paddingTop);

        this.modalDialog.addEventListener("close", (event) => {
            // Re allow scrolling the page when dialog is closed
            const htmlElement = this.modalDialog.ownerDocument.documentElement;
            htmlElement.style.removeProperty('overflow');

            const customEvent = new CustomEvent('dbp-modal-closed', {
                detail: { id: this.modalId },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(customEvent);
        });

        window.addEventListener('dbp-notification-send', (e) => {
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            this.updateModalNotificationPadding(notificationId);
        });

        this.addEventListener('dbp-notification-close', (e) => {
            e.stopPropagation();
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            this.updateModalNotificationPadding(notificationId);
        });
    }

    updateModalNotificationPadding(notificationId) {
        const notificationSlot = this.querySelector('[slot="header"]');
        const notificationComponent = notificationSlot.querySelector('#' + notificationId);
        if (!notificationComponent) {
            return;
        }
        /** @type {HTMLElement} */
        const notificationContainer = notificationComponent.shadowRoot.querySelector('#notification-container');
        // Get height of notification and add as padding top to the top of the modal
        if (notificationContainer) {
            const modalPosition = this.modalDialog.getBoundingClientRect();
            const modalPaddingTopCurrent = parseInt(window.getComputedStyle(this.modalDialog).getPropertyValue('padding-top'));
            const modalPaddingTopDefault = this.modalPaddingTopDefault;
            const notificationContainerHeight = notificationContainer.offsetHeight + modalPaddingTopDefault;

            // Until there is more than 1 notification place over the modal add padding top and translate the modal up
            // If the padding top is greater than the notification container height, reduce the padding top and translate the modal up
            if (modalPosition.top > 150 || (modalPaddingTopCurrent > notificationContainerHeight)) {
                this.modalDialog.style.setProperty('--dbp-modal-padding-top', notificationContainerHeight + 'px');
                this.modalDialog.style.setProperty('--dbp-modal-translate-y', (notificationContainerHeight / -2) + 'px');
            }
        }
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon
        };
    }

    isOpen() {
        return this.modalDialog.open;
    }

    open() {
        // Don't open the dialog if it is already open
        if (this.modalDialog.open) {
            return;
        }

        // Prevent scrolling the page when dialog is open
        const htmlElement = this.modalDialog.ownerDocument.documentElement;
        htmlElement.style.overflow = 'hidden';

        this.modalDialog.showModal();
    }

    close() {
        this.modalDialog.close();
        // Remove all notifications if modal is closed
        const notificationSlot = this.querySelector('[slot="header"]');
        if (notificationSlot) {
            const notificationComponent = notificationSlot.querySelector('dbp-notification');
            if (notificationComponent) {
                notificationComponent.removeAllNotifications();
            }
        }
        // Reset modal padding and translation
        this.modalDialog.style.setProperty('--dbp-modal-padding-top', this.modalPaddingTopDefault + 'px');
        this.modalDialog.style.removeProperty('--dbp-modal-translate-y');
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getNativeModalDialogCSS()}
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <dialog class="modal"
                id="${this.modalId}"
                autofocus
                role="alertdialog"
                aria-describedby="modal-content"
                aria-labelledby="modal-title">
                <div class="modal-container">
                    <header class="modal-header">
                        <div class="header-top">
                            <h3 class="modal-title" id="modal-title">
                                ${this.title}
                            </h3>
                            <button
                                    title="${i18n.t('dbp-modal.close')}"
                                    class="modal-close"
                                    aria-label="${i18n.t('dbp-modal.close')}"
                                    @click="${() => {
                                        this.close();
                                    }}">
                                <dbp-icon
                                        title="${i18n.t('dbp-modal.close')}"
                                        name="close"
                                        class="close-icon"></dbp-icon>
                            </button>
                        </div>
                        <div class="header-bottom">
                            <slot name="header"></slot>
                        </div>
                    </header>
                    <main class="modal-content" id="modal-content">
                        <slot name="content"></slot>
                        ${!this.stickyFooter ? html`
                            <footer class="modal-footer modal-footer--sticky">
                                <slot name="footer"></slot>
                            </footer>
                        ` : ''}
                    </main>
                    ${this.stickyFooter ? html`
                        <footer class="modal-footer">
                            <slot name="footer"></slot>
                        </footer>` : ''}
                </div>
            </dialog>
        `;
    }
}
