import {html, LitElement} from 'lit-element';
import './language-select.js';

class LanguageSelectDemo extends LitElement {

    constructor() {
        super();
        this.lang = 'de';
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
        window.addEventListener('vpu-language-changed', this.handleChange.bind(this));
    }

    disconnectedCallback() {
        windows.removeEventListener('vpu-language-changed', this.handleChange.bind(this));
        super.disconnectedCallback();
    }

    render() {
        return html`${this.lang}`;
    }
}

customElements.define('vpu-language-select-demo', LanguageSelectDemo);
