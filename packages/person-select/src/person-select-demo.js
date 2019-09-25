import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import './person-select.js';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";

class PersonSelectDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            noAuth: { type: Boolean, attribute: 'no-auth' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="container">
                <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person></vpu-auth>
            </div>
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-person-select-src');
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">

            <section class="section">
                <div class="container">
                    <h1 class="title">Person-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person 1</label>
                            <div class="control">
                                <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 2</label>
                            <div class="control">
                                <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-select-demo', PersonSelectDemo);
