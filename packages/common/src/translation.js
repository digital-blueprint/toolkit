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

      // use translation overrides if path is given
      //if(this.langDir != '') {
      //  setOverridesByGlobalCache(this._i18n, this);
      //}

      // supercall after default i18n init to override translations only
      // if a override with this tagname is given
      super.connectedCallback();
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
        // get name of overridenamespace
        let overrideNamespace =
          this._i18n.options.fallbackNS.slice(0,2) == "--" ?
          this._i18n.options.fallbackNS :
          getOverrideNamespace(this._i18n.options.fallbackNS);

        // request to i18n translation
        let translation = (() => {
          if (this.interpolation && this.unsafe)
            return unsafeHTML(this._i18n.t(this.key, this.interpolation));
          else if (this.interpolation)
            return this._i18n.t(this.key, this.interpolation);
          else if (this.unsafe)
            return unsafeHTML(this._i18n.t(this.key));
          else
            return this._i18n.t(this.key);
        })();



        // check if overrides have been loaded with overrideNamespace
        // and then check if given key exists in overrideNS
        let keyComment = "";
        if (this._i18n.exists(overrideNamespace + ":" + this.key) && this._i18n.hasResourceBundle(this.lang, overrideNamespace)) {
          keyComment = unsafeHTML("<!-- key: " + this.key + "-->");
        } else if (this._i18n.hasResourceBundle(this.lang, overrideNamespace)){
          keyComment = unsafeHTML("<!-- key '" + this.key + "' not found! -->");
          translation = "";
          console.error("Key '" + this.key + "' not found!");
        } else {
          keyComment = unsafeHTML("<!-- key '" + this.key + "' and namespace '" + overrideNamespace + "' not found! -->");
          translation = "";
        }

        // load translation text
        return html`
            ${keyComment}
            ${translation}
        `;
    }
}
