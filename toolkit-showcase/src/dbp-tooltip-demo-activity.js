import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {TooltipDemo} from '@dbp-toolkit/tooltip/src/dbp-tooltip-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import readme from '@dbp-toolkit/tooltip/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpTooltipDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
    }

    static get scopedElements() {
        return {
            'dbp-tooltip-demo': TooltipDemo,
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
            <dbp-tooltip-demo id="demo" lang="${this.lang}"></dbp-tooltip-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tooltip-demo-activity', DbpTooltipDemoActivity);
