import {i18n} from './i18n.js';
import {html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak} from './auth-keycloak.js';
import {LoginButton} from './login-button.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {name as pkgName} from './../package.json';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";

class AuthDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
          'dbp-auth-keycloak': AuthKeycloak,
          'dbp-login-button': LoginButton,
        };
    }

    static get properties() {
        return this.getProperties({
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
        });
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
        if (!window.DBPAuthToken) {
            console.error("not logged in");
            return;
        }
        let userInfoURL = 'https://auth-dev.tugraz.at/auth/realms/tugraz/protocol/openid-connect/userinfo';

        // NOTE: the URL and realm need to match the keycloak config above
        const response = await fetch(
            userInfoURL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.DBPAuthToken
                }
            }
        );
        console.log(await response.json());
    }

    async _onShowToken() {
        if (!window.DBPAuthToken) {
            console.error("not logged in");
            return;
        }

        console.log(window.DBPAuthToken);
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
                <div class="container">
                    <dbp-auth-keycloak lang="${this.lang}" entry-point-url="${this.entryPointUrl}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" silent-check-sso-redirect-uri="${silentCheckSsoUri}" scope="optional-test-scope" load-person try-login></dbp-auth-keycloak>

                    <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
                </div>
            </section>

            <input type="button" value="Fetch userinfo (see console)" @click="${this._onUserInfoClick}">
            <input type="button" value="Show token (see console)" @click="${this._onShowToken}">
        `;
    }
}

commonUtils.defineCustomElement('dbp-auth-demo', AuthDemo);
