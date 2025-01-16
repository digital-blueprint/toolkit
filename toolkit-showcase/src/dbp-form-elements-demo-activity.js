import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {FormElementsDemo} from '@dbp-toolkit/form-elements/src/demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import readme from '@dbp-toolkit/form-elements/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpFormElementsDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-form-elements-demo': FormElementsDemo,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
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
            ${unsafeHTML(readme)}
            <dbp-form-elements-demo
                id="demo"
                lang="${this.lang}"></dbp-form-elements-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-elements-demo-activity', DbpFormElementsDemoActivity);
