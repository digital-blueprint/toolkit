import {html} from 'lit-element';
import {LanguageSelect} from './language-select.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";
import {Provider} from "@dbp-toolkit/provider";


class LanguageSelectDisplay extends AdapterLitElement {

    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    render() {
        return html`${this.lang}`;
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
                Select 1: <dbp-language-select subscribe="lang"></dbp-language-select>
                <br>
                <br>
                Select 2: <dbp-language-select subscribe="lang"></dbp-language-select>
                <br>
                <br>
                Current language 1: <dbp-language-select-display subscribe="lang"></dbp-language-select-display>
                <br>
                <br>
                Current language 2: <dbp-language-select-display subscribe="lang"></dbp-language-select-display>
            </dbp-provider>
        `;
    }
}

commonUtils.defineCustomElement('dbp-language-select-demo', LanguageSelectDemo);
