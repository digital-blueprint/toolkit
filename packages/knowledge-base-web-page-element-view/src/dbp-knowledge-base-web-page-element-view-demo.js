import {i18n} from './i18n';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from 'dbp-auth';
import {KnowledgeBaseWebPageElementView} from './knowledge-base-web-page-element-view.js';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';

class KnowledgeBaseWebPageElementViewDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
          'dbp-knowledge-base-web-page-element-view' : KnowledgeBaseWebPageElementView,
          'dbp-auth-keycloak': AuthKeycloak,
          'dbp-login-button': LoginButton,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
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

    static get styles() {
        // language=css
        const styles = css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}

            .clean {
                --KBBorder: initial;
                --KBBorderRadius: initial;
                --KBMargin: initial;
                --KBPadding: initial;
            }
            .opt {
                --KBBorder: 2px solid blue;
            }
        `;

        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            styles,
        ];
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="content">
                <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
            </div>
        `;
    }

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">KnowledgeBaseWebPageElementView-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <h2 class="subtitle">Deutsch</h2>
                    <p>Ein erster Schritt</p>
                    <dbp-knowledge-base-web-page-element-view lang="de" entry-point-url="${commonUtils.getAPiUrl()}" value="bedienstete/bibliothek/buch-ausleihen" text="Ein Buch ausleihen"></dbp-knowledge-base-web-page-element-view>
                </div>
                <div class="container">
                    <h2 class="subtitle">Englisch</h2>
                    <p>A first step</p>
                    <dbp-knowledge-base-web-page-element-view lang="en" entry-point-url="${commonUtils.getAPiUrl()}" value="bedienstete/bibliothek/buch-ausleihen" text="Borrow a book"></dbp-knowledge-base-web-page-element-view>
                </div>
                <hr>
                <div class="container">
                    <p>mit Text in der WebComponent:</p>
                    <dbp-knowledge-base-web-page-element-view lang="${this.lang}" value="abc/def/xyz" text="FAQ"></dbp-knowledge-base-web-page-element-view>
                </div>
                <hr>
                <div class="container">
                    <p>ohne Text in der WebComponent:</p>
                    Kontaktieren Sie uns unter...
                    <dbp-knowledge-base-web-page-element-view class="opt" lang="${this.lang}" value="abc/def/klm"></dbp-knowledge-base-web-page-element-view>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-knowledge-base-web-page-element-view-demo', KnowledgeBaseWebPageElementViewDemo);