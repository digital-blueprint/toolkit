import {AuthKeycloak, LoginButton} from 'vpu-auth';
import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import VPULitElement from 'vpu-common/vpu-lit-element';
import {PersonProfile} from './index.js';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import $ from 'jquery';
import {PersonSelect} from 'vpu-person-select';

class PersonProfileDemo extends ScopedElementsMixin(VPULitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.person = '';
        this.selectedPerson = '';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'vpu-person-profile': PersonProfile,
          'vpu-auth-keycloak': AuthKeycloak,
          'vpu-login-button': LoginButton,
          'vpu-person-select': PersonSelect,
        };
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

            const personSelect = that._(this.constructor.getScopedTagName('vpu-person-select'));
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
                    <vpu-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></vpu-auth-keycloak>
                    <vpu-login-button lang="${this.lang}" show-image></vpu-login-button>
                </div>
            </header>
        `;
    }

    render() {
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
