import {html,LitElement,property} from 'lit-element';
import {i18n} from './i18n';

export class TypeScriptExample extends LitElement {

    private _i18n;

    constructor() {
        super();

        this._i18n = i18n.cloneInstance();
    }

    @property({type: String})
    lang = '';

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
        return html`
            <h3>${this._i18n.t('hello-world')}</h3>
        `;
    }
}