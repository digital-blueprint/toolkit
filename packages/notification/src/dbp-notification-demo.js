import {i18n} from './i18n';
import {send as notify} from 'dbp-common/notification';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Notification} from './notification.js';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from "dbp-common/styles";

export class NotificationDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get scopedElements() {
        return {
          'dbp-notification': Notification,
        };
      }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
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
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Notification-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.send}" class="button">${i18n.t('send')}</button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <dbp-notification lang="${this.lang}"></dbp-notification>
                </div>
            </section>
        `;
    }

    send() {
        const types = ["primary", "info", "success", "danger", "warning"];
        notify({
            "summary": "Item deleted",
            "body": `Item ${Math.random().toString(36).substring(7)} foo was deleted!`,
            "type": types[Math.floor(Math.random() * types.length)],
            "timeout": 0,
        });
    }
}

commonUtils.defineCustomElement('dbp-notification-demo', NotificationDemo);
