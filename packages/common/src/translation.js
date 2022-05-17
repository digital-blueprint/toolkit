import {css, html} from 'lit';
import {until} from 'lit/directives/until.js';
import DBPLitElement from '../dbp-lit-element';
import {createInstanceAsync} from './i18n.js';

export class Translation extends DBPLitElement {
    constructor() {
        super();
        this.key = '';
        this.lang = '';
        this.langFile = '';
        this.interpolation = '';
    }

    static get properties() {
        return {
            ...super.properties,
            key: {type: String},
            lang: {type: String},
            langFile: {type: String, attribute: 'lang-file'},
            interpolation: {type: Object, attribute: 'var'},
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
      this._i18n = createInstanceAsync(this.langFile);
    }

    update(changedProperties) {
        let lang = this.lang;
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.then(function(response) {
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

        // async request to i18n translation
        const translation = this._i18n.then(function(response){
          if (interpolation)
            return response.t(key, interpolation);
          else
            return response.t(key);
        });

        // load translation text when available, otherwise display "Loading.."
        return html`
            ${until(translation, html`<span>Loading..</span>`)}
        `;
    }
}
