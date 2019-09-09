import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import './vpu-auth';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";
import * as utils from "./utils";

class AuthDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    render() {
        const bulmaCSS = utils.getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">

            <section class="section">
                <div class="container">
                    <h1 class="title">Auth-Demo</h1>
                </div>
                <div class="container">
                    <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person remember-login></vpu-auth>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-auth-demo', AuthDemo);
