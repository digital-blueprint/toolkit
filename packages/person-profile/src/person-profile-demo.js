import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import './person-profile.js';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";
import {getAssetURL} from "./utils";

class PersonProfileDemo extends LitElement {
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
        const bulmaCSS = getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">

            <header>
                <div class="container">
                    <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person remember-login style="float:right"></vpu-auth>
                </div>
            </header>

            <section class="section">
                <div class="container">
                    <h1 class="title">Person-Profile-Demo</h1>
                </div>
                <div class="container">
                    <vpu-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-profile>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-profile-demo', PersonProfileDemo);
