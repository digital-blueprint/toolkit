import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import VPULitElement from 'vpu-common/vpu-lit-element';
import './person-profile.js';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";
import {getAssetURL} from "./utils";
import $ from 'jquery';
import 'vpu-person-select';

class PersonProfileDemo extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.person = '';
        this.selectedPerson = '';
    }

    static get properties() {
        return {
            lang: { type: String },
            person: { type: String, attribute: false },
            selectedPerson: { type: String, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            window.addEventListener("vpu-auth-person-init", () => {
                that.person = that._('vpu-auth').person.identifier;
            });

            const personSelect = that._('vpu-person-select');
            personSelect.onchange = function () {
                that.selectedPerson = $(this).data("object").identifier;
            };

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
                    <vpu-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" value="${this.person}"></vpu-person-profile>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <h1 class="title">Select-Profile-Demo</h1>
                </div>
                <div class="container">
                    <div class="control">
                        <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-select>
                    </div>
                    <vpu-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" value="${this.selectedPerson}"></vpu-person-profile>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-profile-demo', PersonProfileDemo);
