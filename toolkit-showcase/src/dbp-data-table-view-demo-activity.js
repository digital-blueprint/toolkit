import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {DataTableViewDemo} from '@dbp-toolkit/data-table-view/src/dbp-data-table-view-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import readme from '@dbp-toolkit/data-table-view/README.md';
import * as demoStyles from "./styles";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

class DbpActivityNameDemoActivity extends ScopedElementsMixin(AdapterLitElement) { //TODO
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-data-table-view-demo': DataTableViewDemo,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(()=>{
        });
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}

            #demo{
                display: block;
                padding-top: 50px;
            }
            
            `
        ];
    }

    render() {
        return html`

                ${unsafeHTML(readme)}
                <dbp-data-table-view-demo id="demo" lang="${this.lang}" entry-point-url="${this.entryPointUrl}" no-auth></dbp-data-table-view-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-data-table-view-demo-activity', DbpActivityNameDemoActivity);
