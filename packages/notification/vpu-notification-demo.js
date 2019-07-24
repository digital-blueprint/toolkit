import {i18n} from './i18n';
import notification from './notification';
import {html, LitElement} from 'lit-element';

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
        return html`
            <style>
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">

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
        notification.send({
            "summary": "Item deleted",
            "body": "Item foo was deleted!",
            "type": "info",
            "timeout": 5,
        });
    }
}

customElements.define('vpu-notification-demo', NotificationDemo);
