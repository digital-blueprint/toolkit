import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpAuthDemo} from '@dbp-toolkit/auth/src/dbp-auth-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/auth/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpAuthDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-auth-demo': DbpAuthDemo,
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
                    /*margin-bottom: 1em;*/
                    margin-top: 20px;
                    margin-bottom: 20px;
                }

                div.container {
                    margin-bottom: 1.5em;
                }

                #demo {
                    display: block;
                    padding-top: 50px;
                }
                h2 {
                    text-align: center;
                }
            `,
        ];
    }

    render() {
        return html`
            ${demoStyles.renderMarkdown(readme)}
            <dbp-auth-demo
                id="demo"
                lang="${this.lang}"
                entry-point-url="${this.entryPointUrl}"
                subscribe="auth"
                no-auth></dbp-auth-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-auth-demo-activity', DbpAuthDemoActivity);
