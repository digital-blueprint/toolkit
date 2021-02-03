import {i18n} from './i18n.js';
import {html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak} from './auth-keycloak.js';
import {LoginButton} from './login-button.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {name as pkgName} from './../package.json';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";
import {Provider} from '@dbp-toolkit/provider';

export class DbpAuthDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
        this.auth = {};
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
            <slot></slot>
            <section class="section">
                <div class="container">
                    <h1 class="title">Auth-Demo</h1>
                </div>
                <div class="container">
                    <p>In any App/page an <b>Auth component</b> will be used like:</p>
<pre>
&lt;dbp-auth-keycloak lang="${this.lang}" entry-point-url="${this.entryPointUrl}"
    url="https://auth-dev.tugraz.at/auth" 
    realm="tugraz"
    client-id="auth-dev-mw-frontend-local"
    silent-check-sso-redirect-uri="${silentCheckSsoUri}"
    scope="optional-test-scope" 
    load-person 
    try-login&gt;&lt;/dbp-auth-keycloak&gt;
&lt;dbp-login-button lang="${this.lang}" show-image&gt;&lt;/dbp-login-button&gt;
</pre>
                    <p>but in this demo we actually have already such a component at the top of this page.</p>
                    <p>Please use the login button on the top of the page!</p>
                </div>
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

commonUtils.defineCustomElement('dbp-provider', Provider);
commonUtils.defineCustomElement('dbp-auth-demo', DbpAuthDemo);
