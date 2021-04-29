import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {PersonProfile} from './index.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import $ from 'jquery';
import {PersonSelect} from '@dbp-toolkit/person-select';

export class PersonProfileDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
        this.person = '';
        this.selectedPerson = '';
        this.noAuth = false;
        this.auth = {};
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
            ...super.properties,
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            person: { type: String, attribute: false },
            selectedPerson: { type: String, attribute: false },
            noAuth: { type: Boolean, attribute: 'no-auth' },
            auth: { type: Object },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'auth':
                {
                    const person = this.auth.person;

                    if (person) {
                        this.person = person.identifier;
                    }
                }
                    break;
            }
        });

        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            const personSelect = that._(this.getScopedTagName('dbp-person-select'));
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
        return this.noAuth ? html`<dbp-login-button subscribe="auth" lang="${this.lang}" show-image></dbp-login-button>` : html`
            <div class="container">
                <dbp-auth-keycloak subscribe="requested-login-status" lang="${this.lang}" entry-point-url="${this.entryPointUrl}" silent-check-sso-redirect-uri="/dist/silent-check-sso.html"
                                   url="https://auth-dev.tugraz.at/auth" realm="tugraz"
                                   client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                <dbp-login-button subscribe="auth" lang="${this.lang}" show-image></dbp-login-button>
            </div>
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
                    <dbp-person-profile subscribe="auth" lang="${this.lang}" entry-point-url="${this.entryPointUrl}" value="${this.person}"></dbp-person-profile>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <h1 class="title">Select-Profile-Demo</h1>
                </div>
                <div class="container">
                    <dbp-person-select subscribe="auth" lang="${this.lang}" entry-point-url="${this.entryPointUrl}"></dbp-person-select>
                </div>
                <div class="container">
                    <dbp-person-profile subscribe="auth" lang="${this.lang}" entry-point-url="${this.entryPointUrl}" value="${this.selectedPerson}"></dbp-person-profile>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-person-profile-demo', PersonProfileDemo);
