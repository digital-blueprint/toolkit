import {i18n} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {PersonSelect} from './person-select.js';
import {AuthKeycloak, LoginButton} from 'dbp-auth';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';

class PersonSelectDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'dbp-auth-keycloak': AuthKeycloak,
          'dbp-login-button': LoginButton,
          'dbp-person-select': PersonSelect,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
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
        return this.noAuth ? html`` : html`
            <div class="container">
                <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
            </div>
        `;
    }

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Person-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person 1</label>
                            <div class="control">
                                <dbp-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></dbp-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 2</label>
                            <div class="control">
                                <dbp-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" show-reload-button reload-button-title="Click me"></dbp-person-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-person-select-demo', PersonSelectDemo);