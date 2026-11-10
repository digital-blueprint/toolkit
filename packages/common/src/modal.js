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
        /** @type {boolean} */
        this.printContentOnly = false;
        /** @type {boolean} Whether the page behind the modal is currently hidden for printing */
        this._pageHiddenForPrint = false;
        this._onBeforePrint = this._handleBeforePrint.bind(this);
        this._onAfterPrint = this._handleAfterPrint.bind(this);
    }

    static get properties() {
        return {
            ...super.properties,
            modalId: {type: String, attribute: 'modal-id'},
            title: {type: String},
            stickyFooter: {type: Boolean, attribute: 'sticky-footer'},
            fullHeightLine: {type: Boolean, attribute: 'full-height-line'},
            printContentOnly: {type: Boolean, attribute: 'print-content-only'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('beforeprint', this._onBeforePrint);
        window.addEventListener('afterprint', this._onAfterPrint);
    }

    disconnectedCallback() {
        window.removeEventListener('beforeprint', this._onBeforePrint);
        window.removeEventListener('afterprint', this._onAfterPrint);
        this._handleAfterPrint();
        super.disconnectedCallback();
    }

    /**
     * Hides the page behind the open modal while printing, so that only the modal content
     * ends up on paper. The page is usually outside of the shadow root of the modal and
     * can't be reached with its styles, but the inherited "visibility" crosses shadow
     * boundaries and is switched back on for the dialog in the print styles.
     */
    _handleBeforePrint() {
        if (!this.printContentOnly || !this.isOpen()) {
            return;
        }

        this.ownerDocument.body.style.visibility = 'hidden';
        this._pageHiddenForPrint = true;
    }

    _handleAfterPrint() {
        if (!this._pageHiddenForPrint) {
            return;
        }

        this.ownerDocument.body.style.removeProperty('visibility');
        this._pageHiddenForPrint = false;
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

    /**
     * Moves focus to the modal's close button. Consumers cannot reach the button
     * themselves because it lives inside this component's shadow root, so skip
     * links that want to offer a way out of a long modal form use this method.
     *
     * @returns {boolean} Whether the close button could be focused.
     */
    focusCloseButton() {
        const closeButton = /** @type {HTMLElement|null} */ (
            this.shadowRoot?.querySelector('.modal-close') ?? null
        );
        if (!closeButton) {
            return false;
        }

        closeButton.focus();
        return true;
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
                                <h2 class="modal-title" id="modal-title">${this.title}</h2>
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
