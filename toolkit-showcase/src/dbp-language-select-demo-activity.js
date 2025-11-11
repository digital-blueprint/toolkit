import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {LanguageSelectDemo} from '@dbp-toolkit/language-select/src/dbp-language-select-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/language-select/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpLanguageSelectDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-language-select-demo': LanguageSelectDemo,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {});
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
            ${demoStyles.renderMarkdown(readme)}
            <dbp-language-select-demo
                id="demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"></dbp-language-select-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-language-select-demo-activity', DbpLanguageSelectDemoActivity);
