import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {MatomoDemo} from '@dbp-toolkit/matomo/src/dbp-matomo-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/matomo/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';

class DbpMatomoDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-matomo-demo': MatomoDemo,
            'dbp-markdown': MarkdownElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
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
            <dbp-matomo-demo
                id="demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"
                no-auth></dbp-matomo-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-matomo-demo-activity', DbpMatomoDemoActivity);
