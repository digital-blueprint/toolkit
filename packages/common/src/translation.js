import {html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from '../dbp-lit-element';
import * as commonStyles from '../styles.js';
import {getOverrideNamespace, setOverridesByGlobalCache, createInstance} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.interpolation = '';
        this.unsafe = false;

        // dir and i18next instance of translation overrides
        this._i18n = createInstance();
        this.langDir = '';
        this.innerText = '';

    }

    static get properties() {
        return {
            ...super.properties,
            key: {type: String},
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            interpolation: {type: Object, attribute: 'var'},
            unsafe: {type: Boolean, attribute: 'unsafe'},
        };
    }

    static get styles() {
        // language=css
        return [
              commonStyles.getThemeCSS(),
              commonStyles.getGeneralCSS(),
              commonStyles.getLinkCss(),
          ];
    }

    connectedCallback() {

      // get overrides everytime
      setOverridesByGlobalCache(this._i18n, this);

      // supercall after default i18n init to override translations only
      // if a override with this tagname is given
      super.connectedCallback();
    }

    update(changedProperties) {
        let lang = this.lang;
        let tagName = ((this.dataset && this.dataset.tagName) || this.tagName).toLowerCase();
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(lang);
                    break;
                case 'key':
                    this.key = tagName + "." + this.key;
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        // get name of overridenamespace
        let overrideNamespace =
          this._i18n.options.fallbackNS.slice(0,2) == "--" ?
          this._i18n.options.fallbackNS :
          getOverrideNamespace(this._i18n.options.fallbackNS);

        let translation = "";

        // request to i18n translation
        if (this.interpolation && this.unsafe) {
            this.innerText = this._i18n.t(this.key, this.interpolation);
            translation = unsafeHTML(this._i18n.t(this.key, this.interpolation));
        }
        else if (this.interpolation) {
            this.innerText = this._i18n.t(this.key, this.interpolation);
            translation = this._i18n.t(this.key, this.interpolation);
        }
        else if (this.unsafe) {
            this.innerText = this._i18n.t(this.key);
            translation = unsafeHTML(this._i18n.t(this.key));
        }
        else {
            this.innerText = this._i18n.t(this.key);
            translation = this._i18n.t(this.key);
        }



        // check if overrides have been loaded with overrideNamespace
        // and then check if given key exists in overrideNS
        // if in debug mode, show keys without errors and warning
        let keyComment = "";
        if ((this._i18n.exists(overrideNamespace + ":" + this.key) && this._i18n.hasResourceBundle(this.lang, overrideNamespace))
              || window.location.hash.includes('debug')) {
            keyComment = unsafeHTML("<!-- key: " + this.key + "-->");
        } else if (this._i18n.hasResourceBundle(this.lang, overrideNamespace)){
            this.innerText = "";
            translation = "";
            keyComment = unsafeHTML("<!-- key '" + this.key + "' not found! -->");
            console.error("Key '" + this.key + "' not found!");
        } else {
            this.innerText = "";
            translation = "";
            keyComment = unsafeHTML("<!-- key '" + this.key + "' and namespace '" + overrideNamespace + "' not found! -->");
            console.error("Key '" + this.key + "' and namespace '" + overrideNamespace + "' not found!");
        }
        // load translation text
        return html`
            ${keyComment}
            ${translation}
        `;
    }
}
