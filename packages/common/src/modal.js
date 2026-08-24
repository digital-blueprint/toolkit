import {html, css} from 'lit';
import {createInstance} from './i18n';
import * as commonStyles from './styles.js';
import {Icon} from './icon';
import {ScopedElementsMixin} from './scoped/ScopedElementsMixin.js';
import dialogPolyfill from 'dialog-polyfill';
import DBPLitElement from './dbp-lit-element';
import {LangMixin} from './lang-mixin.js';

export class Modal extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        /** @type {HTMLDialogElement | null} */
        this.modalDialog = null;
        /** @type {string} */
        this.modalId = 'dbp-modal-id';
        /** @type {string} */
        this.title = '';
        /** @type {boolean} */
        this.stickyFooter = false;
        /** @type {boolean} */
        this.fullHeightLine = false;
        /** @type {number} */
        this.modalPaddingTopDefault = 0;
    }

    static get properties() {
        return {
            ...super.properties,
            modalId: {type: String, attribute: 'modal-id'},
            title: {type: String},
            stickyFooter: {type: Boolean, attribute: 'sticky-footer'},
            fullHeightLine: {type: Boolean, attribute: 'full-height-line'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
    }

    firstUpdated() {
        const modalElement = this._('#' + this.modalId);
        if (modalElement?.localName !== 'dialog') {
            return;
        }
        const modalDialog = /** @type {HTMLDialogElement} */ (modalElement);
        this.modalDialog = modalDialog;
        dialogPolyfill.registerDialog(modalDialog);

        // Save default value of padding top changed when adding/removing notifications
        this.modalPaddingTopDefault = parseInt(window.getComputedStyle(modalDialog).paddingTop);

        modalDialog.addEventListener('close', () => {
            // Re allow scrolling the page when dialog is closed
            const htmlElement = modalDialog.ownerDocument.documentElement;
            htmlElement.style.removeProperty('overflow');

            const customEvent = new CustomEvent('dbp-modal-closed', {
                detail: {id: this.modalId},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(customEvent);
        });

        this.addEventListener('dbp-notification-added', (e) => {
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            void this.updateModalNotificationPadding(notificationId);
        });

        this.addEventListener('dbp-notification-removed', (e) => {
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            void this.updateModalNotificationPadding(notificationId);
        });
    }

    async updateModalNotificationPadding(notificationId) {
        const modalDialog = this.modalDialog;
        if (!modalDialog) {
            return;
        }

        const notificationSlot = this.querySelector('[slot="header"]');
        if (!notificationSlot) {
            return;
        }

        const notificationComponent = notificationSlot.querySelector('#' + notificationId);
        if (!notificationComponent || !notificationComponent.shadowRoot) {
            return;
        }

        /** @type {HTMLElement | null} */
        const notificationContainer =
            notificationComponent.shadowRoot.querySelector('#notification-container');

        // Get height of notification and add as padding top to the top of the modal
        if (notificationContainer) {
            // Wait until next frame to ensure styles are applied
            await new Promise((resolve) => requestAnimationFrame(resolve));

            const modalPosition = modalDialog.getBoundingClientRect();
            const modalPaddingTopCurrent = parseInt(
                window.getComputedStyle(modalDialog).getPropertyValue('padding-top'),
            );
            const modalPaddingTopDefault = this.modalPaddingTopDefault;
            const notificationContainerHeight =
                notificationContainer.offsetHeight + modalPaddingTopDefault;

            // Until there is more than 1 notification place over the modal add padding top and translate the modal up
            // If the padding top is greater than the notification container height, reduce the padding top and translate the modal up
            if (modalPosition.top > 150 || modalPaddingTopCurrent > notificationContainerHeight) {
                modalDialog.style.setProperty(
                    '--dbp-modal-padding-top',
                    notificationContainerHeight + 'px',
                );
                modalDialog.style.setProperty(
                    '--dbp-modal-translate-y',
                    notificationContainerHeight / -2 + 'px',
                );
            }
        }
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    isOpen() {
        return this.modalDialog?.open ?? false;
    }

    open() {
        const modalDialog = this.modalDialog;
        if (!modalDialog) {
            return;
        }

        // Don't open the dialog if it is already open
        if (modalDialog.open) {
            return;
        }

        // Prevent scrolling the page when dialog is open
        const htmlElement = modalDialog.ownerDocument.documentElement;
        htmlElement.style.overflow = 'hidden';

        modalDialog.showModal();
    }

    close() {
        const modalDialog = this.modalDialog;
        if (!modalDialog) {
            return;
        }

        modalDialog.close();
        // Remove all notifications if modal is closed
        const notificationSlot = this.querySelector('[slot="header"]');
        if (notificationSlot) {
            const notificationComponent = notificationSlot.querySelector('dbp-notification');
            if (notificationComponent && notificationComponent.shadowRoot) {
                /** @type {HTMLElement & {removeAllNotifications: () => void}} */ (
                    notificationComponent
                ).removeAllNotifications();
            }
        }
        // Reset modal padding and translation
        modalDialog.style.setProperty(
            '--dbp-modal-padding-top',
            this.modalPaddingTopDefault + 'px',
        );
        modalDialog.style.removeProperty('--dbp-modal-translate-y');
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getNativeModalDialogCSS()}
            ${commonStyles.getNativeModalDialogPrintCSS()}
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <dialog
                class="modal"
                id="${this.modalId}"
                autofocus
                role="alertdialog"
                aria-describedby="modal-content"
                aria-labelledby="modal-title">
                <div
                    class="modal-container ${
                        this.fullHeightLine ? 'modal-container--full-height-line' : ''
                    }">
                    <header class="modal-header">
                        <div class="header-top">
                            <slot name="title">
                                <h3 class="modal-title" id="modal-title">${this.title}</h3>
                            </slot>
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
                        ${
                            !this.stickyFooter
                                ? html`
                                      <footer class="modal-footer modal-footer--sticky">
                                          <slot name="footer"></slot>
                                      </footer>
                                  `
                                : ''
                        }
                    </main>
                    ${
                        this.stickyFooter
                            ? html`
                                  <footer class="modal-footer">
                                      <slot name="footer"></slot>
                                  </footer>
                              `
                            : ''
                    }
                </div>
            </dialog>
        `;
    }
}
