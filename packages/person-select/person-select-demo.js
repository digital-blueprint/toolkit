import utils from './utils.js';
import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';

class PersonSelectDemo extends LitElement {
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
                    <h1 class="title">Person-Select-Demo</h1>
                </div>
                <div class="container">
                    <vpu-auth lang="${this.lang}" client-id="${utils.setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person</label>
                            <div class="control">
                                <vpu-library-person-select lang="${this.lang}"></vpu-library-person-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

customElements.define('vpu-person-select-demo', PersonSelectDemo);
