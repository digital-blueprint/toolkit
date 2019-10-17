import 'vpu-auth';
import {i18n} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import VPULitElement from 'vpu-common/vpu-lit-element';
import './vpu-person-profile.js';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import $ from 'jquery';
import 'vpu-person-select';

class PersonProfileDemo extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.person = '';
        this.selectedPerson = '';
        this.noAuth = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            person: { type: String, attribute: false },
            selectedPerson: { type: String, attribute: false },
            noAuth: { type: Boolean, attribute: 'no-auth' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            window.addEventListener("vpu-auth-person-init", () => {
                that.person = window.VPUPersonId;
            });

            const personSelect = that._('vpu-person-select');
            personSelect.onchange = function () {
                that.selectedPerson = $(this).data("object").identifier;
            };

        });
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}

            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}
        `;
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <header>
                <div class="container">
                    <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person remember-login style="float:right"></vpu-auth>
                </div>
            </header>
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-person-profile-src');

        return html`
            ${this.getAuthComponentHtml()}

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
                    <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-select>
                </div>
                <div class="container">
                    <vpu-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" value="${this.selectedPerson}"></vpu-person-profile>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-profile-demo', PersonProfileDemo);
