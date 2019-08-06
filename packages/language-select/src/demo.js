import {html, LitElement} from 'lit-element';
import './language-select.js';
import utils from 'vpu-common/utils';

class LanguageSelectDemo extends LitElement {

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

utils.defineCustomElement('vpu-language-select-demo', LanguageSelectDemo);
