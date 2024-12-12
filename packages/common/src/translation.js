import {css, html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from './dbp-lit-element.js';
import * as commonStyles from './styles.js';
import {createInstanceGivenResources, setOverridesByGlobalCache} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.interpolation = '';
        this.langDir = '';
        this.unsafe = false;
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
        return [

              commonStyles.getThemeCSS(),
              commonStyles.getGeneralCSS(),
              css`
                .hidden {
                    display: none;
                }
                .links  {
                    border-bottom: var(--dbp-border);
                    border-color: var(--dbp-content);
                    padding: 0;
                    transition: background-color 0.15s ease 0s, color 0.15s ease 0s;
                    color: var(--dbp-content);
                    cursor: pointer;
                    text-decoration: none;
                }
            `,
          ];
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

      if (this.langDir) {
        setOverridesByGlobalCache(this._i18n, this);
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

        // if translation == "" key was not found
        let key = "";
        if (translation != "") {
          key = unsafeHTML("<!-- key: " + this.key + "-->");
        } else {
          key = unsafeHTML("<!-- key \"" + this.key + "\" not found! -->");
        }

        // load translation text
        return html`
            ${key}
            ${translation}
        `;
    }
}
