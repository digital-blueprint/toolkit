import {AuthKeycloak, LoginButton} from 'dbp-auth';
import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import {PersonProfile} from './index.js';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';
import $ from 'jquery';
import {PersonSelect} from 'dbp-person-select';

class PersonProfileDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.person = '';
        this.selectedPerson = '';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'dbp-person-profile': PersonProfile,
          'dbp-auth-keycloak': AuthKeycloak,
          'dbp-login-button': LoginButton,
          'dbp-person-select': PersonSelect,
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
            window.addEventListener("dbp-auth-person-init", () => {
                that.person = window.DBPPersonId;
            });

            const personSelect = that._(this.constructor.getScopedTagName('dbp-person-select'));
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
                    <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                    <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
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
                    <dbp-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" value="${this.person}"></dbp-person-profile>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <h1 class="title">Select-Profile-Demo</h1>
                </div>
                <div class="container">
                    <dbp-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></dbp-person-select>
                </div>
                <div class="container">
                    <dbp-person-profile lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" value="${this.selectedPerson}"></dbp-person-profile>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-person-profile-demo', PersonProfileDemo);