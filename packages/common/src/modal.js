import {html, css
} from 'lit';
import {createInstance} from './i18n';
import * as commonStyles from '../styles.js';
import {Icon} from './icon';
import {MiniSpinner} from './mini-spinner';
import MicroModal from './micromodal.es';
import DBPLitElement from '../dbp-lit-element';
import {styleMap} from 'lit/directives/style-map.js';


export class Modal extends DBPLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.modalId = 'dbp-modal-id';
        this.title = "";

        this.width = 'inherit';
        this.height = 'inherit';
        this.minWidth = 'inherit';
        this.minHeight = 'inherit';

        this.size = {
            width: this.width,
            height: this.height,
            minWidth: this.minWidth,
            minHeight: this.minHeight};
    }

    static get properties() {
        return {
            modalId: {type: String, attribute: 'modal-id'},
            title: {type: String},
            width: {type: String},
            height: {type: String},
            minWidth: {type: String, attribute: 'min-width'},
            minHeight: {type: String, attribute: 'min-height'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.size = {
            width: this.width,
            height: this.height,
            minWidth: this.minWidth,
            minHeight: this.minHeight};
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    open() {
        MicroModal.show(this._('#' + this.modalId), {
            disableScroll: true,
            onClose: (modal) => {
                // TODO get from parent maybe notify parent with event
            },
        });
    }

    close() {
        MicroModal.close(this._('#' + this.modalId));
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getModalDialogCSS()}

            .modal-title {
                margin: 0;
                padding: 0.25em 0 0 0;
                font-weight: 300;
            }
            
            .modal-container{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 15px 20px 20px;
            }
            
            .modal-header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 0 20px 0;
            }
            
            .modal-content{
                display: flex;
                padding-left: 0px;
                padding-right: 0px;
                overflow: unset;
                gap: 1em;
                flex-direction: column;
                height: 100%;
            }
            
            footer{
                padding-top: 20px;
            }
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <div class="modal micromodal-slide" id="${this.modalId}" aria-hidden="true">
                <div class="modal-overlay" tabindex="-2" data-micromodal-close>
                    <div class="modal-container"
                         role="dialog"
                         aria-modal="true"
                         aria-labelledby="show-recipient-modal-title"
                         style=${styleMap(this.size)}>
                        <header class="modal-header">
                            <h3 class="modal-title">
                                ${this.title}
                            </h3>
                            <button
                                title="${i18n.t('dbp-modal.close')}"
                                class="modal-close"
                                aria-label="Close modal"
                                @click="${() => {this.close();}}">
                                <dbp-icon
                                    title="${i18n.t('dbp-modal.close')}"
                                    name="close"
                                    class="close-icon"></dbp-icon>
                            </button>
                        </header>
                        <main class="modal-content">
                            <slot name="content"></slot>
                        </main>
                        <footer class="modal-footer">
                            <slot name="footer"></slot>
                        </footer>
                    </div>
                </div>
            </div>
        `;
    }
}
