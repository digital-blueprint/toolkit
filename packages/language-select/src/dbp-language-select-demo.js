import {html, LitElement} from 'lit-element';
import {LanguageSelect} from './language-select.js';
import * as commonUtils from 'dbp-common/utils';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';


class LanguageSelectDisplay extends LitElement {

    constructor() {
        super();
        this.lang = 'de';
        this.handleChange =  this.handleChange.bind(this);
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    handleChange(e) {
        this.lang = e.detail.lang;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dbp-language-changed', this.handleChange);
    }

    disconnectedCallback() {
        window.removeEventListener('dbp-language-changed', this.handleChange);
        super.disconnectedCallback();
    }

    render() {
        return html`${this.lang}`;
    }
}

class LanguageSelectDemo extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
    }

    static get scopedElements() {
        return {
          'dbp-language-select': LanguageSelect,
          'dbp-language-select-display': LanguageSelectDisplay,
        };
      }

    render() {
        return html`
            Select 1: <dbp-language-select></dbp-language-select>
            <br>
            <br>
            Select 2: <dbp-language-select></dbp-language-select>
            <br>
            <br>
            Current language 1: <dbp-language-select-display></dbp-language-select-display>
            <br>
            <br>
            Current language 2: <dbp-language-select-display></dbp-language-select-display>
        `;
    }
}

commonUtils.defineCustomElement('dbp-language-select-demo', LanguageSelectDemo);
