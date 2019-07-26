import {i18n} from './i18n';
import {html} from 'lit-element';
import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'
import utils from "./utils";

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUKnowledgeBaseWebPageElementView extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.value = '';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        JSONLD.initialize(utils.getAPiUrl(), function (jsonld) {
            // TODO: there is no entity url without "collectionOperations"
            const apiUrl = jsonld.getApiUrlForEntityName("KnowledgeBaseWebPageElement") + '/' + that.value;
            console.log(apiUrl);

            fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': 'Bearer ' + that.token,
                },
            })
                .then(response => response.json())
                .then((person) => {
                    console.log(person);
                });
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
        `;
    }
}

customElements.define('vpu-knowledge-base-web-page-element-view', VPUKnowledgeBaseWebPageElementView);
