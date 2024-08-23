import {
    html, css
} from 'lit';
import { createInstance } from './i18n';
import * as commonStyles from '../styles.js';
import { Icon } from './icon';
import { MiniSpinner } from './mini-spinner';
import dialogPolyfill from 'dialog-polyfill';
import DBPLitElement from '../dbp-lit-element';

export class Modal extends DBPLitElement {
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
    }

    static get properties() {
        return {
            modalId: { type: String, attribute: 'modal-id' },
            title: { type: String },
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
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    open() {
        // Prevent scrolling the page when dialog is open
        const htmlElement = this.modalDialog.ownerDocument.documentElement;
        htmlElement.style.overflow = 'hidden';

        this.modalDialog.showModal();
    }

    close() {
        this.modalDialog.close();
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
                role="dialog"
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
                                    @click="${() => { this.close(); }}">
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
                        </main>
                        <footer class="modal-footer">
                            <slot name="footer"></slot>
                        </footer>
                    </div>
            </dialog>
        `;
    }
}
