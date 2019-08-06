import {html, css, LitElement} from 'lit-element';
import {i18n, dateTimeFormat, numberFormat} from './i18n.js';

/**
 * Emits a vpu-language-changed event where event.detail.lang is the new selected language
 */
class LanguageSelect extends LitElement {

    constructor() {
        super();
        this.lang = 'de';
        this.languages = ['de', 'en'];

        i18n.t('de');
        i18n.t('en');

        this.onExternalChange = this.onExternalChange.bind(this);
    }

    static get properties() {
        return {
            lang: {type: String},
            languages: {type: Array},
        };
    }

    static get styles() {
        return css`
            select {
                background:
                    linear-gradient(45deg, transparent 50%, black 50%),
                    linear-gradient(135deg, black 50%, transparent 50%),
                    linear-gradient(to right, white, white);
                background-position:
                    calc(100% - 21px) calc(1em + 2px),
                    calc(100% - 16px) calc(1em + 2px),
                    100% 0;
                background-size:
                    5px 5px,
                    5px 5px,
                    2.5em 2.5em;
                background-repeat: no-repeat;

                border: 1px solid #000;
                line-height: 1.5em;
                padding: 0.5em 3.5em 0.5em 0.5em;

                border-radius: 0;
                margin: 0;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                -webkit-appearance:none;
                -moz-appearance:none;
            }
        `;
    } 

    onExternalChange(e) {
        this.lang = e.detail.lang
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('vpu-language-changed', this.onExternalChange);
    }

    disconnectedCallback() {
        document.removeEventListener('vpu-language-changed', this.onExternalChange);
        super.disconnectedCallback();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                const event = new CustomEvent("vpu-language-changed", {
                    bubbles: true,
                    detail: {'lang': this.lang},
                });
                this.dispatchEvent(event);

                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    onSelectChange(e) {
        this.lang = e.target.value;
    }

    render() {
        return html`
            <select @change=${this.onSelectChange}>
                ${this.languages.map(i => html`<option value="${i}" ?selected=${this.lang === i}>${i18n.t(i)}</option>`)}
            </select> 
        `;
    }
}

customElements.define('vpu-language-select', LanguageSelect);
