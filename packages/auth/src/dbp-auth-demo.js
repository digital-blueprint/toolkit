import {i18n} from './i18n.js';
import {html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak} from './auth-keycloak.js';
import {LoginButton} from './login-button.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {name as pkgName} from './../package.json';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";

export class DbpAuthDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
        this.auth = {};
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'dbp-auth-keycloak': AuthKeycloak,
          'dbp-login-button': LoginButton,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            auth: { type: Object },
            noAuth: { type: Boolean, attribute: 'no-auth' },
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

    async _onUserInfoClick() {
        const div = this._('#person-info');
        if (!this.auth.token) {
            console.error("not logged in");
            div.innerHTML = "You are not logged in!";
            return;
        }
        let userInfoURL = 'https://auth-dev.tugraz.at/auth/realms/tugraz/protocol/openid-connect/userinfo';

        // NOTE: the URL and realm need to match the keycloak config above
        const response = await fetch(
            userInfoURL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.token
                }
            }
        );
        const person = await response.json();
        console.log(person);
        div.innerHTML = JSON.stringify(person);
    }

    async _onShowToken() {
        const div = this._('#token-info');
        if (!this.auth.token) {
            console.error("not logged in");
            div.innerHTML = "You are not logged in!";
            return;
        }

        console.log(this.auth.token);
        div.innerHTML = this.auth.token;
    }

    getAuthComponentHtml() {
        //const silentCheckSsoUri = commonUtils.getAssetURL(pkgName, 'silent-check-sso.html');
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
        const silentCheckSsoUri = commonUtils.getAssetURL(pkgName, 'silent-check-sso.html');
        return html`
            <style>
               /* from BULMA.CSS */
                .section {
                   padding: 3rem 1.5rem;
                   font-family: sans-serif;
                }
                .content h1 {
                    font-size: 2em;
                    margin-bottom: .5em;
                }
                .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
                    color: #363636;
                    font-weight: 600;
                    line-height: 1.125;
                }

                .container * {
                    max-width: 100%;
                }
            </style>
            <section class="section">
                <div class="container">
                    <h1 class="title">Auth-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <input type="button" value="Fetch userinfo" @click="${this._onUserInfoClick}">
                    <input type="button" value="Show token" @click="${this._onShowToken}">
                    <h4>Person info:</h4>
                    <div id="person-info"></div>
                    <h4>Token info:</h4>
                    <div id="token-info"></div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-auth-demo', DbpAuthDemo);
