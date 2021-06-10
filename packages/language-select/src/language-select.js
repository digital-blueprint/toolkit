import {html, css} from 'lit-element';
import {createInstance} from './i18n.js';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";


/**
 * Emits a dbp-language-changed event where event.detail.lang is the new selected language
 */
export class LanguageSelect extends AdapterLitElement {

    constructor() {
        super();
        this._lang = 'de';
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
        return [commonStyles.getThemeCSS(),
            css`
            :host {
                display: inline-block;
            }

            a:hover {
                background-color: var(--dbp-dark);
                color: var(--dbp-light);
                transition: none;
            }

            a {
                padding: 0.3em;
                display: inline-block;
                text-decoration: none;
                transition: background-color 0.15s, color 0.15s;
                color: var(--dbp-dark);
                border-radius: var(--dbp-border-radius);
            }
            `
        ];
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