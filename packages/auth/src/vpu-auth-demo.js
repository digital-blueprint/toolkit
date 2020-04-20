import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Auth} from './auth.js';
import * as commonUtils from 'vpu-common/utils';

class AuthDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get scopedElements() {
        return {
          'vpu-auth': Auth,
        };
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

    async _onUserInfoClick() {
        if (!window.VPUAuthToken) {
            console.error("not logged in");
            return;
        }
        let userInfoURL = commonUtils.setting('keyCloakBaseURL') + '/realms/tugraz/protocol/openid-connect/userinfo';

        // NOTE: the URL and realm need to match the keycloak config above
        const response = await fetch(
            userInfoURL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.VPUAuthToken
                }
            }
        );
        console.log(await response.json());
    }

    async _onShowToken() {
        if (!window.VPUAuthToken) {
            console.error("not logged in");
            return;
        }

        console.log(window.VPUAuthTokenParsed);
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-auth-src');
        const silentCheckSsoUri = commonUtils.getAssetURL('silent-check-sso.html');
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
            </style>
            <section class="section">
                <div class="container">
                    <h1 class="title">Auth-Demo</h1>
                </div>
                <div class="container">
                    <vpu-auth lang="${this.lang}" keycloak-config='{"silentCheckSsoRedirectUri": "${silentCheckSsoUri}", "scope": "optional-test-scope"}' load-person try-login></vpu-auth>
                </div>
            </section>

            <input type="button" value="Fetch userinfo (see console)" @click="${this._onUserInfoClick}">
            <input type="button" value="Show token (see console)" @click="${this._onShowToken}">
        `;
    }
}

commonUtils.defineCustomElement('vpu-auth-demo', AuthDemo);
