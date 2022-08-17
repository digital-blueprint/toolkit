import {html, LitElement} from 'lit';
import {createInstance, setOverridesByGlobalCache} from './i18n';

export class TypeScriptExample extends LitElement {
    private _i18n;
    private langDir;

    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';
    }

    static get properties() {
        return {
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
        };
    }

    connectedCallback() {
      super.connectedCallback();

      // set translation overrides if requested
      if (this.langDir != '') {
        setOverridesByGlobalCache(this._i18n, this);
      }
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
