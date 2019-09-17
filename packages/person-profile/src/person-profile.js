import {getAssetURL} from './utils.js';
import JSONLD from 'vpu-common/jsonld';
import {html} from 'lit-element';
import {i18n} from './i18n.js';
import VPULitElement from 'vpu-common/vpu-lit-element';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";


class PersonProfile extends VPULitElement {

    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = commonUtils.getAPiUrl();
        this.jsonld = null;
        this.value = '';
    }

    static get properties() {
        return {
            lang: { type: String },
            active: { type: Boolean, attribute: false },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            value: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(()=>{
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "entryPointUrl":
                    const that = this;

                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                    }, {}, that.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        const bulmaCSS = getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">
            <style>
            </style>

            PROFILE
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-profile', PersonProfile);
