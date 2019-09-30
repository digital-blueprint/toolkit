import {i18n} from './i18n';
import {send as notify} from 'vpu-common/notification';
import {html, LitElement} from 'lit-element';
import './vpu-notification';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from 'bulma/css/bulma.min.css';

class NotificationDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
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

    render() {
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">

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
                    <vpu-notification lang="${this.lang}"></vpu-notification>
                </div>
            </section>
        `;
    }

    send() {
        const types = ["primary", "link", "info", "success", "danger", "warning"];
        notify({
            "summary": "Item deleted",
            "body": `Item ${Math.random().toString(36).substring(7)} foo was deleted!`,
            "type": types[Math.floor(Math.random() * types.length)],
            "timeout": 5,
        });
    }
}

commonUtils.defineCustomElement('vpu-notification-demo', NotificationDemo);
