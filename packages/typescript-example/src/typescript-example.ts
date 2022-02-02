import {html, LitElement} from 'lit';
import {createInstance} from './i18n';

export class TypeScriptExample extends LitElement {
    private _i18n;

    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
    }

    render() {
        return html`
            <h3>${this._i18n.t('hello-world')}</h3>
        `;
    }
}
