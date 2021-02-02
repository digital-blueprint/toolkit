import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {CheckInPlaceSelect} from './check-in-place-select.js';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";

export class CheckInPlaceSelectDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'dbp-login-button': LoginButton,
          'dbp-check-in-place-select': CheckInPlaceSelect,
          'dbp-auth-keycloak': AuthKeycloak,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
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
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}
            `
        ];
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`<dbp-login-button lang="${this.lang}" show-image></dbp-login-button>` : html`
            <div class="container">
                <dbp-auth-keycloak lang="${this.lang}" entry-point-url="${this.entryPointUrl}" silent-check-sso-redirect-uri="/dist/silent-check-sso.html"
                                   url="https://auth-dev.tugraz.at/auth" realm="tugraz"
                                   client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
            </div>
        `;
    }

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Check-In-Place-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Check-In-Place 1</label>
                            <div class="control">
                                <dbp-check-in-place-select lang="${this.lang}" entry-point-url="${this.entryPointUrl}" subscribe="auth:auth"></dbp-check-in-place-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Check-In-Place 2</label>
                            <div class="control">
                                <dbp-check-in-place-select lang="${this.lang}" entry-point-url="${this.entryPointUrl}" subscribe="auth:auth" show-reload-button reload-button-title="Click me"></dbp-check-in-place-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-check-in-place-select-demo', CheckInPlaceSelectDemo);
