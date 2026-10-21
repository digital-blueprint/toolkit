import {css, html} from 'lit';
import {AdapterLitElement, ScopedElementsMixin} from '@dbp-toolkit/common';
import {AuthorizationManageGrantsDialogDemo} from '@dbp-toolkit/authorization-manage-grants-dialog/src/demo.js';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as commonUtils from '@dbp-toolkit/common/utils';
import readme from '@dbp-toolkit/authorization-manage-grants-dialog/README.md';
import {MarkdownElement} from './markdown-element.js';
import * as demoStyles from './styles.js';

class DbpAuthorizationManageGrantsDialogDemoActivity extends ScopedElementsMixin(
    AdapterLitElement,
) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-authorization-manage-grants-dialog-demo': AuthorizationManageGrantsDialogDemo,
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
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
                .demo-container {
                    display: block;
                    margin-top: 2em;
                }
            `,
        ];
    }

    render() {
        return html`
            <dbp-markdown lang="${this.lang}" .markdown=${readme}></dbp-markdown>
            <dbp-authorization-manage-grants-dialog-demo
                id="authorization-manage-grants-dialog-demo"
                class="demo-container"
                lang="${this.lang}"
                subscribe="auth"
                entry-point-url="${this.entryPointUrl}"></dbp-authorization-manage-grants-dialog-demo>
        `;
    }
}

commonUtils.defineCustomElement(
    'dbp-authorization-manage-grants-dialog-demo-activity',
    DbpAuthorizationManageGrantsDialogDemoActivity,
);
