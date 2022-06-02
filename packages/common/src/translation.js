import {css, html} from 'lit';
import {until} from 'lit/directives/until.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import DBPLitElement from '../dbp-lit-element';
import {createInstanceAsync, setOverridesByFile} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.langFiles = '';
        this.interpolation = '';
        this.namespace = '';
        this.overrideFiles = '';
    }

    static get properties() {
        return {
            ...super.properties,
            key: {type: String},
            lang: {type: String},
            langFiles: {type: String, attribute: 'lang-files'},
            interpolation: {type: Object, attribute: 'var'},
            unsafe: {type: Boolean, attribute: 'unsafe'},
            namespace: {type: String, attribute: 'ns'},
            overrideFiles: {type: String, attribute: 'override-files'},
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
      if (this.namespace == '') {
        this._i18n = createInstanceAsync(this.langFiles);
      }
      else {
        this._i18n = createInstanceAsync(this.langFiles, this.namespace);
      }

      let local = this;
      let overrideFiles = this.overrideFiles;

      if (this.overrideFiles) {
        this._i18n.then(function(response) {
          setOverridesByFile(response, local, overrideFiles).then(function(response) {
              local._i18n = response;
              local.requestUpdate();
          });
        });
      }
    }

    update(changedProperties) {
        let lang = this.lang;
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    Promise.resolve(this._i18n).then(function(response) {
                      response.changeLanguage(lang);
                    });
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        // save global key in local variable for async use
        let key = this.key;
        let interpolation = this.interpolation;
        let unsafe = this.unsafe;

        // async request to i18n translation
        const translation = Promise.resolve(this._i18n).then(function(response){
          if (interpolation && unsafe)
            return unsafeHTML(response.t(key, interpolation));
          else if (interpolation)
            return response.t(key, interpolation);
          else
            return response.t(key);
        });

        // load translation text when available, otherwise display "Loading.."
        return html`
            ${until(translation, html`Loading..`)}
        `;
    }
}
