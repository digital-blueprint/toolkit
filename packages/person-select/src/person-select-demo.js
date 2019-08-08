import {setting, getAPiUrl} from './utils.js';
import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import './person-select.js';
import commonUtils from 'vpu-common/utils';

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
                    <vpu-auth lang="${this.lang}" client-id="${setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person 1</label>
                            <div class="control">
                                <vpu-person-select lang="${this.lang}" entry-point-url="${getAPiUrl()}"></vpu-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 2</label>
                            <div class="control">
                                <vpu-person-select lang="${this.lang}" entry-point-url="${getAPiUrl()}"></vpu-person-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-select-demo', PersonSelectDemo);
