import {i18n} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {PersonSelect} from './person-select.js';
import {AuthKeycloak, LoginButton} from 'vpu-auth';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';

class PersonSelectDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'vpu-auth-keycloak': AuthKeycloak,
          'vpu-login-button': LoginButton,
          'vpu-person-select': PersonSelect,
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
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}

            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}
        `;
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="container">
                <vpu-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></vpu-auth-keycloak>
                <vpu-login-button lang="${this.lang}" show-image></vpu-login-button>
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
                                <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}"></vpu-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 2</label>
                            <div class="control">
                                <vpu-person-select lang="${this.lang}" entry-point-url="${commonUtils.getAPiUrl()}" show-reload-button reload-button-title="Click me"></vpu-person-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-select-demo', PersonSelectDemo);
