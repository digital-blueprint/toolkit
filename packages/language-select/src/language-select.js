import {html, css} from 'lit';
import {createInstance, setOverridesByGlobalCache} from './i18n.js';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {AdapterLitElement} from '@dbp-toolkit/common';


/**
 * Emits a dbp-language-changed event where event.detail.lang is the new selected language
 */
export class LanguageSelect extends AdapterLitElement {

    constructor() {
        super();
        this._lang = 'de';
        this.langDir = '';
        this.languages = ['de', 'en'];

        this._i18n = createInstance();
        // for the i18next scanner
        this._i18n.t('de');
        this._i18n.t('de-action');
        this._i18n.t('en');
        this._i18n.t('en-action');
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
            langDir: {type: String, attribute: 'lang-dir'},
            next: {type: String},
            languages: {type: Array},
        };
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.langDir != '') {
        setOverridesByGlobalCache(this._i18n, this);
      }
    }

    set lang(value) {
        const oldValue = this.lang;
        const oldNext = this.next;
        this._lang = value;
        this.requestUpdate('lang', oldValue);
        this.requestUpdate('next', oldNext);

        if (oldValue !== value) {
            // tell a dbp-provider to update the "lang" property
            this.sendSetPropertyEvent('lang', value);

            // Unlike other cases we use the next language for the translations so that
            // users not knowing the current language can understand it.
            // In case of more than two this doesn't make that much sense, but for now..
            this._i18n.changeLanguage(this.next);
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
        // language=css
        return css`
                ${commonStyles.getThemeCSS()}
            :host {
                display: inline-block;
            }

            a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
                transition: none;
            }

            a {
                padding: 0.3em;
                display: inline-block;
                text-decoration: none;
                transition: background-color 0.15s, color 0.15s;
                color: var(--dbp-content);
            }

            input::-moz-focus-inner { border: 0; }

            :focus-visible{
                outline:none !important;
                outline-width: 0 !important;
                box-shadow: none;
                -moz-box-shadow: none;
                -webkit-box-shadow: none;
                box-shadow: 0px 0px 4px 2px var(--dbp-primary);
            }

            `
        ;
    }

    onClick(e) {
        e.preventDefault();
        this.lang = this.next;
    }

    render() {
        var linkTitle = this._i18n.t(this.next + '-action');
        return html`
            <a href="#" title="${linkTitle}" @click=${this.onClick}>${this.next.toUpperCase()}</a>
        `;
    }
}
