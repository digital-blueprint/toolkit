import {html , LitElement} from 'lit-element';
import {createI18nInstance} from './i18n.js';
import * as commonUtils from '@dbp-toolkit/common/utils';

const i18n = createI18nInstance();

class ActivityExample extends LitElement {

    constructor() {
        super();
        this.lang = i18n.language;
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        return html`
            <p>${ i18n.t('activity-example.hello-world') }</p>
        `;
    }
}

commonUtils.defineCustomElement('dbp-activity-example', ActivityExample);
