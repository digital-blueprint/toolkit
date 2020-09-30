import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as PersonSelectDemo from 'dbp-qr-code-scanner/src/dbp-qr-code-scanner-demo';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from 'dbp-qr-code-scanner/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';

class DbpQrCodeScannerDemoActivity extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
            'dbp-person-select-demo': PersonSelectDemo,
        };
    }

    static get properties() {
        return {
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
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}
            `
        ];
    }

    render() {
        return html`
            xxx
            <dbp-qr-code-scanner-demo lang="en"></dbp-qr-code-scanner-demo>
            ${unsafeHTML(readme)}
        `;
    }
}

commonUtils.defineCustomElement('dbp-qr-code-scanner-demo-activity', DbpQrCodeScannerDemoActivity);
