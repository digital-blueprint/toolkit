import {i18n} from './i18n.js';
import {css, html, unsafeCSS} from 'lit-element';
import * as commonUtils from './utils.js';
import './vpu-mini-spinner.js';
import './vpu-spinner.js';
import {getIconCSS} from './vpu-icon.js';
import './vpu-button.js';
import VPULitElement from './vpu-lit-element.js';
import bulmaCSSPath from "bulma/css/bulma.min.css";

class VpuCommonDemo extends VPULitElement {
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

    static get styles() {
        // language=css
        return css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}

            a:after {
                ${ unsafeCSS(getIconCSS('bolt')) };
            }
        `;
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="container">
                <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person></vpu-auth>
            </div>
        `;
    }

    buttonClickHandler() {
        setTimeout(() => {
            this._("vpu-button").stop();
        }, 1000);
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-person-select-src');
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">

            <section class="section">
                <div class="container">
                    <h1 class="title">Common-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <label class="label">Mini Spinner</label>
                    <div class="control">
                        <vpu-mini-spinner></vpu-mini-spinner>
                        <vpu-mini-spinner style="font-size: 2em"></vpu-mini-spinner>
                        <vpu-mini-spinner style="font-size: 3em"></vpu-mini-spinner>
                    </div>
                </div>
                <div class="container">
                    <label class="label">Spinner</label>
                    <div class="control">
                        <vpu-spinner></vpu-spinner>
                    </div>
                </div>
                <div class="container">
                    <label class="label">Icons</label>
                    <div class="control">
                        <p style="text-decoration: underline">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <p style="font-size: 2em;">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <p style="font-size: 2em; color: orange">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <span style="background-color: #000"><a href="#" style=" color: #fff">foobar</a></span>
                        <br>
                        <vpu-icon style="color: green; height: 50px; border: #000 solid 1px"></vpu-icon>
                    </div>
                </div>
                <div class="container">
                    <label class="label">Button</label>
                    <div class="control">
                        <vpu-button value="Load" @click="${this.buttonClickHandler}"></vpu-button>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-common-demo', VpuCommonDemo);
