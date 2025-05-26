import {createInstance} from './i18n';
import {send as notify} from '@dbp-toolkit/common/notification';
import {css, html} from 'lit';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {Notification} from './notification.js';
import {getRandomInt} from './utils.js';
import {Modal} from '@dbp-toolkit/common/src/modal';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class NotificationDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        /** @type {Modal} */
        this.modal = null;
        /** @type {Modal} */
        this.modalLarge = null;
    }

    static get scopedElements() {
        return {
            'dbp-notification': Notification,
            'dbp-modal': Modal,
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.modal = this.shadowRoot.querySelector('#modal-notification-test');
        this.modalLarge = this.shadowRoot.querySelector('#modal-notification-test--large');
    }

    openModal() {
        this.modal.open();
    }

    openModalLarge() {
        this.modalLarge.open();
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            .section {
                margin-bottom: 4em;
            }
            .title {
                margin-bottom: 0.5em;
            }

            #modal-notification-test {
                --dbp-modal-max-width: 640px;
            }

            modal-notification-test--large {
                --dbp-modal-max-width: 50vw;
                --dbp-modal-max-width: 50vw;
                --dbp-modal-min-height: 90vh;
                --dbp-modal-max-height: 90vh;
            }

            .modal-footer {
                display: flex;
                justify-content: flex-end;
            }

            .modal-content {
                padding: 1em 0;
            }

            .modal-content h2,
            .modal-content h3 {
                margin-bottom: 1em;
            }

            .modal-content p {
                margin-bottom: 1em;
            }

            .modal--large .modal-content {
                columns: 2;
                column-gap: 2em;
            }
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Notification-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.send}" class="button">
                                ${i18n.t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <h1 class="title">Notification with Dialog</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.openModal}" class="button">
                                ${i18n.t('open-dialog')}
                            </button>
                        </div>
                    </div>
                    <dbp-modal
                        id="modal-notification-test"
                        modal-id="my-modal-123"
                        title="The title of the modal"
                        subscribe="lang">
                        <div slot="header" class="header">
                            <div class="modal-notification">
                                <dbp-notification
                                    id="dbp-modal-notification-123"
                                    inline
                                    lang="${this.lang}"></dbp-notification>
                            </div>
                        </div>
                        <div slot="content" class="modal-content">
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <div slot="footer" class="modal-footer">
                            <button
                                id="send-button"
                                @click="${() => this.sendModal('dbp-modal-notification-123')}"
                                class="button is-primary">
                                ${i18n.t('add-notification')}
                            </button>
                        </div>
                    </dbp-modal>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <h1 class="title">Notification with Large Dialog</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.openModalLarge}" class="button">
                                ${i18n.t('open-dialog')}
                            </button>
                        </div>
                    </div>
                    <dbp-modal
                        id="modal-notification-test--large"
                        class="modal--large"
                        modal-id="my-modal-124"
                        title="The title of the modal"
                        subscribe="lang">
                        <div slot="header" class="header">
                            <div class="modal-notification">
                                <dbp-notification
                                    id="dbp-modal-notification-124"
                                    inline
                                    lang="${this.lang}"></dbp-notification>
                            </div>
                        </div>
                        <div slot="content" class="modal-content">
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>Important information here</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h3>This is a notification testing dialog</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <div slot="footer" class="modal-footer">
                            <button
                                id="send-button"
                                @click="${() => this.sendModal('dbp-modal-notification-124')}"
                                class="button is-primary">
                                ${i18n.t('add-notification')}
                            </button>
                        </div>
                    </dbp-modal>
                </div>
            </section>
        `;
    }

    send() {
        const types = ['primary', 'info', 'success', 'danger', 'warning'];
        const type = types[Math.floor(Math.random() * types.length)];
        const timeout = getRandomInt(5, 15);
        notify({
            summary: 'Item deleted',
            body: `Item ${Math.random().toString(36).substring(7)} foo was deleted! <br> Even ID: ${type}-event <span>[${timeout}s]</span>`,
            type: type,
            timeout: timeout,
            replaceId: `${type}-event`,
        });
    }

    sendModal(targetNotificationId) {
        const types = ['info', 'success', 'danger', 'warning'];
        // const types = ['success', 'danger'];
        const type = types[Math.floor(Math.random() * types.length)];
        //const timeout = getRandomInt(5, 15);
        const timeout = 0;
        notify({
            summary: 'Modal Notification',
            body: `Something happened! <br> Even ID: ${type}-event <span>[${timeout}s]</span>`,
            type: type,
            timeout: timeout,
            replaceId: `${type}-event`,
            targetNotificationId: targetNotificationId,
        });
    }
}

commonUtils.defineCustomElement('dbp-notification-demo', NotificationDemo);
