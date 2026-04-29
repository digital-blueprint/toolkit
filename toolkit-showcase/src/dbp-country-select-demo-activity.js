import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {CountrySelectDemo} from '@dbp-toolkit/country-select/src/dbp-country-select-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/country-select/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpCountrySelectDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
    }

    static get scopedElements() {
        return {
            'dbp-country-select-demo': CountrySelectDemo,
            'dbp-markdown': MarkdownElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
        };
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }

                #demo {
                    display: block;
                    padding-top: 50px;
                }
            `,
        ];
    }

    render() {
        return html`
            <dbp-markdown .markdown=${readme}></dbp-markdown>
            <dbp-country-select-demo id="demo" lang="${this.lang}"></dbp-country-select-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-country-select-demo-activity', DbpCountrySelectDemoActivity);
