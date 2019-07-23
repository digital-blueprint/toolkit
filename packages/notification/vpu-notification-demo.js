import {i18n} from './i18n.js';
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
                    <vpu-notification lang="${this.lang}"></vpu-notification>
                </div>
            </section>
        `;
    }
}

customElements.define('vpu-notification-demo', NotificationDemo);
