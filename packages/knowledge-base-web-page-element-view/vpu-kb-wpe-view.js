import {i18n} from './i18n';
import {html} from 'lit-element';
// import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'
import utils from "./utils";
import commonUtils from "vpu-common/utils";
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUKnowledgeBaseWebPageElementView extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.value = '';
        this.html = '';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
            html: { type: String, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        // JSONLD.initialize(utils.getAPiUrl(), function (jsonld) {
        //     const apiUrl = jsonld.getApiUrlForEntityName("KnowledgeBaseWebPageElement") + '/' + btoa(that.value);
        // });

        // sadly there there is no entity url without "collectionOperations" in entity KnowledgeBaseWebPageElement!
        const apiUrl = utils.getAPiUrl("/web_page_elements/knowledge_base_web_page_elements/") + commonUtils.base64EncodeUnicode(that.value);

        window.addEventListener("vpu-auth-init", function(e)
        {
            fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': 'Bearer ' + window.VPUAuthToken,
                },
            })
                .then(res => res.json())
                .then(webPageElement => {
                    if (webPageElement !== undefined && webPageElement.text !== undefined) {
                        that.html = webPageElement.text;
                    }
                })
                // catch e.g. 404 errors
                .catch(error => console.error(error));
        });

        this.updateComplete.then(()=>{
        });
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
            </style>

            <div class="columns">
                <div class="column">
                    Hier kann man dann etwas aufklappen.
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    ${unsafeHTML(this.html)}
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-knowledge-base-web-page-element-view', VPUKnowledgeBaseWebPageElementView);
