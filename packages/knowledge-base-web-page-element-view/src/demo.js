import 'vpu-auth';
import './vpu-kb-wpe-view.js';
import {setting, getAPiUrl} from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import commonUtils from 'vpu-common/utils';

class KnowledgeBaseWebPageElementViewDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
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

    render() {
        return html`
            <style>
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">

            <section class="section">
                <div class="content">
                    <h1 class="title">KnowledgeBaseWebPageElementView-Demo</h1>
                </div>
                <div class="content">
                    <vpu-auth lang="${this.lang}" client-id="${setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="content">
                    <h2 class="subtitle">Deutsch</h2>
                    <p>Ein erster Schritt</p>
                    <vpu-knowledge-base-web-page-element-view lang="de" entry-point-url="${getAPiUrl()}" value="bedienstete/bibliothek/buch-ausleihen" text="Ein Buch ausleihen"></vpu-knowledge-base-web-page-element-view>
                </div>
                <div class="content">
                    <h2 class="subtitle">Englisch</h2>
                    <p>A first step</p>
                    <vpu-knowledge-base-web-page-element-view lang="en" entry-point-url="${getAPiUrl()}" value="bedienstete/bibliothek/buch-ausleihen" text="Borrow a book"></vpu-knowledge-base-web-page-element-view>
                </div>
                <hr>
                <div class="content">
                    <p>mit Text in der WebComponent:</p>
                    <vpu-knowledge-base-web-page-element-view lang="${this.lang}" value="abc/def/xyz" text="FAQ"></vpu-knowledge-base-web-page-element-view>
                </div>
                <hr>
                <div class="content">
                    <p>ohne Text in der WebComponent:</p>
                    Kontaktieren Sie uns unter...
                    <vpu-knowledge-base-web-page-element-view lang="${this.lang}" value="abc/def/klm"></vpu-knowledge-base-web-page-element-view>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-knowledge-base-web-page-element-view-demo', KnowledgeBaseWebPageElementViewDemo);
