import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from 'dbp-file-handling/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';

class DbpFileHandlingDemoActivity extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
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
            yyy
        `;
    }
}

commonUtils.defineCustomElement('dbp-file-handling-demo', DbpFileHandlingDemoActivity);
