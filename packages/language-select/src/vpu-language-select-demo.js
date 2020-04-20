import {html, LitElement} from 'lit-element';
import {LanguageSelect} from './vpu-language-select.js';
import * as commonUtils from 'vpu-common/utils';
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
        window.addEventListener('vpu-language-changed', this.handleChange);
    }

    disconnectedCallback() {
        window.removeEventListener('vpu-language-changed', this.handleChange);
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
          'vpu-language-select': LanguageSelect,
          'vpu-language-select-display': LanguageSelectDisplay,
        };
      }

    render() {
        return html`
            Select 1: <vpu-language-select></vpu-language-select>
            <br>
            <br>
            Select 2: <vpu-language-select></vpu-language-select>
            <br>
            <br>
            Current language 1: <vpu-language-select-display></vpu-language-select-display>
            <br>
            <br>
            Current language 2: <vpu-language-select-display></vpu-language-select-display>
        `;
    }
}

commonUtils.defineCustomElement('vpu-language-select-demo', LanguageSelectDemo);
