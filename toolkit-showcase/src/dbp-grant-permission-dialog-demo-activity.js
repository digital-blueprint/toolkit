import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {GrantPermissionDialogDemo} from '@dbp-toolkit/grant-permission-dialog/src/demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
// import readme from '@dbp-toolkit/tabulator-table/README.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

class DbpGrantPermissionDialogDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-grant-permission-dialog-demo': GrantPermissionDialogDemo,
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
            `,
        ];
    }

    render() {
        // ${unsafeHTML(readme)}
        return html`

            <dbp-grant-permission-dialog-demo
                id="demo"
                lang="${this.lang}"
                subscribe="auth"
                entry-point-url="${this.entryPointUrl}">
            </dbp-grant-permission-dialog-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-grant-permission-dialog-demo-activity', DbpGrantPermissionDialogDemoActivity);
