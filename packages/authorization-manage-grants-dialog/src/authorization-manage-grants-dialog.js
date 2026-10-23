import {html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {ScopedElementsMixin, LangMixin, Modal, Button, Icon} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {createInstance} from './i18n.js';
import {getAuthorizationManageGrantsDialogCSS} from './styles.js';
import {Notification} from '@dbp-toolkit/notification';
import {AuthorizationSubjectSelect} from './authorization-subject-select.js';

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
            'dbp-icon': Icon,
            'dbp-authorization-subject-select': AuthorizationSubjectSelect,
            'dbp-notification': Notification,
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
            this.modalTitle = this._i18n.t('auth-manage-dialog.modal-title');
        }
    }

    /**
     * Opens the grant management dialog.
     *
     * @returns {void}
     */
    open() {
        this.modalRef.value?.open();
    }

    /**
     * Closes the grant management dialog.
     *
     * @returns {void}
     */
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
                    <div class="add-resource-container">
                        <dbp-authorization-subject-select
                            id="resource-select"
                            class="resource-select-component"
                            lang="${this.lang}"
                            subscribe="auth"
                            placeholder="${i18n.t('auth-manage-dialog.subject-select-placeholder')}"
                            entry-point-url="${this.entryPointUrl}"
                            @change="${(event) => {
                                console.log('Resource select changed', event.detail);
                            }}"></dbp-authorization-subject-select>
                        <div class="add-person-button-container">
                            <dbp-button
                                type="is-secondary"
                                id="add-person-button"
                                no-spinner-on-click
                                @click="${() => {
                                    console.log('Add person button clicked');
                                }}">
                                <dbp-icon name="plus"></dbp-icon>
                                ${i18n.t('auth-manage-dialog.buttons.add-subject-button-label')}
                            </dbp-button>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="footer-menu">
                    <dbp-button type="is-secondary" no-spinner-on-click @click="${this.close}">
                        ${i18n.t('auth-manage-dialog.buttons.close-button-label')}
                    </dbp-button>
                </div>
            </dbp-modal>
        `;
    }
}
