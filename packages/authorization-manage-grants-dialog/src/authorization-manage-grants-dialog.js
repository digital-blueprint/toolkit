import {html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {Button, LangMixin, Modal, ScopedElementsMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {createInstance} from './i18n.js';
import {getAuthorizationManageGrantsDialogCSS} from './styles.js';

export class AuthorizationManageGrantsDialog extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.auth = {};
        this.entryPointUrl = '';
        this.modalTitle = '';
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.modalRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            auth: {type: Object},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            modalTitle: {type: String, attribute: 'modal-title'},
        };
    }

    static get scopedElements() {
        return {
            'dbp-button': Button,
            'dbp-modal': Modal,
        };
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            getAuthorizationManageGrantsDialogCSS(),
        ];
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('lang') && !this.hasAttribute('modal-title')) {
            this.modalTitle = this._i18n.t('authorization-manage-grants-dialog.modal-title');
        }
    }

    open() {
        this.modalRef.value?.open();
    }

    close() {
        this.modalRef.value?.close();
    }

    render() {
        const i18n = this._i18n;
        return html`
            <dbp-modal
                ${ref(this.modalRef)}
                sticky-footer
                class="modal--manage-grants"
                title="${this.modalTitle}">
                <div slot="content">
                    <p class="content-placeholder">
                        ${i18n.t('authorization-manage-grants-dialog.placeholder')}
                    </p>
                </div>
                <div slot="footer" class="footer-menu">
                    <dbp-button
                        type="is-secondary"
                        value="${i18n.t('authorization-manage-grants-dialog.buttons.close')}"
                        no-spinner-on-click
                        @click="${this.close}"></dbp-button>
                </div>
            </dbp-modal>
        `;
    }
}
