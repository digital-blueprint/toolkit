import {html} from 'lit';
import {LanguageSelect} from './language-select.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {Provider} from '@dbp-toolkit/provider';
import {createInstance, setOverrides} from './i18n.js';

// This is an example on how to override translations at runtime
let OVERRIDES = {
    de: {
        'dbp-language-select-display': {
            demo: 'Überschrieben',
        },
    },
    en: {
        'dbp-language-select-display': {
            demo: 'Overridden',
        },
    },
};

class LanguageSelectDisplay extends LangMixin(AdapterLitElement, createInstance) {
    constructor() {
        super();
        setOverrides(this._i18n, this, OVERRIDES);
    }

    render() {
        return html`
            <b>${this.lang}: ${this._i18n.t('demo')}</b>
        `;
    }
}

export class LanguageSelectDemo extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
    }

    static get scopedElements() {
        return {
            'dbp-language-select': LanguageSelect,
            'dbp-language-select-display': LanguageSelectDisplay,
            'dbp-provider': Provider,
        };
    }

    render() {
        return html`
            <dbp-provider lang="">
                Select 1:
                <dbp-language-select subscribe="lang"></dbp-language-select>
                <br />
                <br />
                Select 2:
                <dbp-language-select subscribe="lang"></dbp-language-select>
                <br />
                <br />
                Current language 1:
                <dbp-language-select-display subscribe="lang"></dbp-language-select-display>
                <br />
                <br />
                Current language 2:
                <dbp-language-select-display subscribe="lang"></dbp-language-select-display>
            </dbp-provider>
        `;
    }
}

commonUtils.defineCustomElement('dbp-language-select-demo', LanguageSelectDemo);
