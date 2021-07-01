import {html , LitElement} from 'lit-element';
import {createInstance} from './i18n.js';
import * as commonUtils from '@dbp-toolkit/common/utils';

class ActivityExample extends LitElement {

    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
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
                    this._i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        const i18n = this._i18n;
        return html`
            <h3>${i18n.t('activity-example.hello-world')}</h3>
            <ul>${(Array.from(Array(100).keys())).map(i => html`<li>${i18n.t('activity-example.hello-world') + ' ' + i}</li>`)}</ul>
        `;
    }
}

commonUtils.defineCustomElement('dbp-activity-example', ActivityExample);
