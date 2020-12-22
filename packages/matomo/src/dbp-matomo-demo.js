import {i18n} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {MatomoElement} from './matomo';


export class MatomoDemo extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
        this.lang = 'de';
        this.matomoUrl = '';
        this.matomoSiteId = -1;
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-matomo': MatomoElement,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
            matomoUrl: { type: String, attribute: "matomo-url" },
            matomoSiteId: { type: Number, attribute: "matomo-site-id" },
            noAuth: { type: Boolean, attribute: 'no-auth' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
    }

    track(action, message) {
        const matomo = this.shadowRoot.querySelector(this.constructor.getScopedTagName('dbp-matomo'));
        if (matomo !== null) {
            matomo.track(action, message);
        }
    }

    clickMe() {
        this.track('button clicked', 'alert()');

        alert('button clicked!');
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em; padding-left:20px;}
            `
        ];
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`<dbp-login-button lang="${this.lang}" show-image></dbp-login-button>` : html`
            <div class="container">
                <dbp-auth-keycloak lang="${this.lang}" silent-check-sso-redirect-uri="/dist/silent-check-sso.html"
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
                    <h1 class="title">Matomo-Demo</h1>
                </div>
                <div class="container">
                    ${ this.getAuthComponentHtml() }
                    <dbp-matomo endpoint="${this.matomoUrl}" site-id="${this.matomoSiteId}"></dbp-matomo>
                </div>
                <div class="container">
                    <p>Click this button (and watch the network traffic) ...</p>
                    <p><input type="button" value="click me" @click="${this.clickMe}"></p>
               </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-matomo-demo', MatomoDemo);
