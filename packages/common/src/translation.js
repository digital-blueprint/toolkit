import {html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from '../dbp-lit-element';
import * as commonStyles from '../styles.js';
import {getOverrideNamespace} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.interpolation = '';
        this.unsafe = false;
    }

    static get properties() {
        return {
            ...super.properties,
            key: {type: String},
            lang: {type: String},
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
          else
            return this._i18n.t(this.key);
        })();

        // check if overrides have been loaded with overrideNamespace
        // and then check if given key exists
        let key = "";
        if (this._i18n.exists(this.key) && this._i18n.hasResourceBundle(this.lang, overrideNamespace)) {
          key = unsafeHTML("<!-- key: " + this.key + "-->");
        } else if (this._i18n.hasResourceBundle(this.lang, overrideNamespace)){
          key = unsafeHTML("<!-- key '" + this.key + "' not found! -->");
          translation = "";
          console.error("Key '" + this.key + "' not found!");
        } else {
          key = unsafeHTML("<!-- key '" + this.key + "' and namespace '" + overrideNamespace + "' not found! -->");
          translation = "";
        }

        // load translation text
        return html`
            ${key}
            ${translation}
        `;
    }
}
