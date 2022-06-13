import {css, html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from '../dbp-lit-element';
import {createInstanceGivenResources, setOverridesByPromise} from './i18n.js';

// global variable as cache for translations
const translationCache = {};

// fetches overrides for given language
async function fetchOverridesByLanguage(overrides, lng) {
  let result = await
      fetch(overrides + lng +'/translation.json', {
          headers: {'Content-Type': 'application/json'},
      });
  let json = await result.json();
  return json;
}

// handles translation cache promises
async function cacheOverrides(overridesFile, lng) {
  // use global var as cache
  if (translationCache[lng] === undefined) {
    // get translation.json for each lang
    let response = fetchOverridesByLanguage(overridesFile, lng);
    translationCache[lng] = response;
    return response;
  } else {
    return translationCache[lng];
  }
}

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

      if (this.langDir) {
        for(let lng of this._i18n.languages) {
          cacheOverrides(this.langDir, lng);
          setOverridesByPromise(this._i18n, this, translationCache);
        }
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
