import {css, html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from '../dbp-lit-element';
import {createInstanceGivenResources, setOverridesByFile} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.interpolation = '';
        this.langDir = '';
    }

    static get properties() {
        return {
            ...super.properties,
            key: {type: String},
            lang: {type: String},
            interpolation: {type: Object, attribute: 'var'},
            unsafe: {type: Boolean, attribute: 'unsafe'},
            langDir: {type: String, attribute: 'lang-dir'},
        };
    }

    static get styles() {
        // language=css
        return css`
            .hidden {
                display: none;
            }
        `;
    }

    connectedCallback() {
      super.connectedCallback();

      // init objects with empty string as value for key
      const de = {};
      const en = {};
      de[this.key] = "";
      en[this.key] = "";

      // create i18n instance with given translations
      this._i18n = createInstanceGivenResources(en, de);

      // after init of overrides rerender page
      let local = this;
      if (this.langDir) {
        setOverridesByFile(this._i18n, this, this.langDir).then(function(response) {
            local.requestUpdate();
        });
      }
    }

    update(changedProperties) {
        let lang = this.lang;
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        // request to i18n translation
        const translation = (() => {
          if (this.interpolation && this.unsafe)
            return unsafeHTML(this._i18n.t(this.key, this.interpolation));
          else if (this.interpolation)
            return this._i18n.t(this.key, this.interpolation);
          else
            return this._i18n.t(this.key);
        })();

        // load translation text
        return html`
            ${translation}
        `;
    }
}
