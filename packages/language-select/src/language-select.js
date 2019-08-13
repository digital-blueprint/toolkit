import {html, css, LitElement} from 'lit-element';
import {i18n} from './i18n.js';
import utils from 'vpu-common/utils';

/**
 * Emits a vpu-language-changed event where event.detail.lang is the new selected language
 */
class LanguageSelect extends LitElement {

    constructor() {
        super();
        this._lang = 'de';
        this.languages = ['de', 'en'];

        this.onExternalChange = this.onExternalChange.bind(this);

        // for the i18next scanner
        i18n.t('de');
        i18n.t('de-action');
        i18n.t('en');
        i18n.t('en-action');
    }

    _getNextLanguage(lang) {
        var index = this.languages.indexOf(lang);
        var next = this.languages[index + 1];
        if (typeof next === 'undefined')
            next = this.languages[0];
        return next;
    }

    _getPreviousLanguage(lang) {
        var index = this.languages.indexOf(lang);
        var prev = this.languages[index - 1];
        if (typeof prev === 'undefined')
            prev = this.languages[this.languages.length - 1];
        return prev;
    }

    static get properties() {
        return {
            lang: {type: String},
            next: {type: String},
            languages: {type: Array},
        };
    }

    set lang(value) {
        const oldValue = this.lang;
        const oldNext = this.next;
        this._lang = value;
        this.requestUpdate('lang', oldValue);
        this.requestUpdate('next', oldNext);

        if (oldValue !== value) {
            const event = new CustomEvent("vpu-language-changed", {
                bubbles: true,
                detail: {'lang': value}
            });
            this.dispatchEvent(event);

            // Unlike other cases we use the next language for the translations so that
            // users not knowing the current language can understand it.
            // In case of more than two this doesn't make that much sense, but for now..
            i18n.changeLanguage(this.next);
        }
    }

    get lang() {
        return this._lang;
    }

    set next(value) {
        this.lang = this._getPreviousLanguage(value);
    }

    get next() {
        return this._getNextLanguage(this.lang);
    }

    static get styles() {
        return css`
            a:hover {
                background-color: #000;
                color: #fff;
            }

            a {
                padding: 5px;
                display: inline-block;
                text-decoration: none;
                color: #000;
                transition: background-color 0.15s, color 0.15s;
                font-weight: 300;
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

    onClick(e) {
        e.preventDefault();
        this.lang = this.next;
    }

    render() {
        var linkTitle = i18n.t(this.next + '-action');
        return html`
            <a href="#" title="${linkTitle}" @click=${this.onClick}>${this.next.toUpperCase()}</a>
        `;
    }
}

utils.defineCustomElement('vpu-language-select', LanguageSelect);
