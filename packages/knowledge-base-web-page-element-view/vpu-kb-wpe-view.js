import {i18n} from './i18n';
import {html} from 'lit-element';
import JSONLD from 'vpu-common/jsonld';
import VPULitElement from 'vpu-common/vpu-lit-element'

/**
 * KnowledgeBaseWebPageElementView web component
 */
class VPUKnowledgeBaseWebPageElementView extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;


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
                    TODO
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-knowledge-base-web-page-element-view', VPUKnowledgeBaseWebPageElementView);
