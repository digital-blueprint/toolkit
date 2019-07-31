import utils from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';

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

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
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
                    <vpu-auth lang="de" client-id="${utils.setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="content">
                    <h2 class="subtitle">Deutsch</h2>
                    Ein Buch ausleihen...
                    <vpu-knowledge-base-web-page-element-view entry-point-url="${utils.getAPiUrl()}" lang="de" value="bedienstete/bibliothek/buch-ausleihen"></vpu-knowledge-base-web-page-element-view>
                </div>
                <div class="content">
                    <h2 class="subtitle">Englisch</h2>
                    Borrow a book...
                    <vpu-knowledge-base-web-page-element-view entry-point-url="${utils.getAPiUrl()}" lang="en" value="bedienstete/bibliothek/buch-ausleihen"></vpu-knowledge-base-web-page-element-view>
                </div>
                <hr>
                <div class="content">
                    FAQ...
                    <vpu-knowledge-base-web-page-element-view lang="${this.lang}" value="abc/def/xyz"></vpu-knowledge-base-web-page-element-view>
                    <br>
                    Kontaktieren Sie uns unter...
                    <vpu-knowledge-base-web-page-element-view lang="${this.lang}" value="abc/def/klm"></vpu-knowledge-base-web-page-element-view>
                </div>
            </section>
        `;
    }
}

customElements.define('vpu-knowledge-base-web-page-element-view-demo', KnowledgeBaseWebPageElementViewDemo);
