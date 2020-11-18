import {i18n} from './i18n';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {InlineNotification} from './inline-notification.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from "@dbp-toolkit/common/styles";

export class InlineNotificationDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.isNotificationVisible = false;
    }

    static get scopedElements() {
        return {
          'dbp-inline-notification': InlineNotification,
        };
      }

    static get properties() {
        return {
            lang: { type: String },
            isNotificationVisible: { type: Boolean, attribute: false }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
    }

    showNotification() {
        this.isNotificationVisible ? this.isNotificationVisible = false : this.isNotificationVisible = true;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        const types = ["primary", "info", "success", "danger", "warning"];

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Inline-Notification-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.showNotification}" class="button">${i18n.t('show')}</button>
                            <br><br>
                            ${this.isNotificationVisible ? html`
                                <dbp-inline-notification summary="Item deleted" body="Item <b>${Math.random().toString(36).substring(7)}</b> foo was deleted!" type="${types[Math.floor(Math.random() * types.length)]}"></dbp-inline-notification>
                            `: ``}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-inline-notification-demo', InlineNotificationDemo);
