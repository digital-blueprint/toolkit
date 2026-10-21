import {html} from 'lit';
import {Button, LangMixin, ScopedElementsMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {AuthorizationManageGrantsDialog} from './authorization-manage-grants-dialog.js';
import {createInstance} from './i18n.js';

export class AuthorizationManageGrantsDialogDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.entryPointUrl = '';
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
    }

    static get scopedElements() {
        return {
            'dbp-authorization-manage-grants-dialog': AuthorizationManageGrantsDialog,
            'dbp-button': Button,
        };
    }

    render() {
        const i18n = this._i18n;
        return html`
            <h2>${i18n.t('authorization-manage-grants-dialog.demo-title')}</h2>
            <dbp-button
                type="is-primary"
                value="${i18n.t('authorization-manage-grants-dialog.buttons.open')}"
                no-spinner-on-click
                @click="${() => this._('#manage-grants-dialog').open()}"></dbp-button>
            <dbp-authorization-manage-grants-dialog
                id="manage-grants-dialog"
                title="${i18n.t('authorization-manage-grants-dialog.modal-title')}"
                lang="${this.lang}"
                subscribe="auth"
                entry-point-url="${this.entryPointUrl}"></dbp-authorization-manage-grants-dialog>
        `;
    }
}

commonUtils.defineCustomElement(
    'dbp-authorization-manage-grants-dialog-demo',
    AuthorizationManageGrantsDialogDemo,
);
