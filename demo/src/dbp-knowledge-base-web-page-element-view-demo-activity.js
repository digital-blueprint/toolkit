import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {KnowledgeBaseWebPageElementViewDemo} from 'dbp-knowledge-base-web-page-element-view/src/dbp-knowledge-base-web-page-element-view-demo';
import * as commonUtils from 'dbp-common/utils';
import * as commonStyles from 'dbp-common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from 'dbp-knowledge-base-web-page-element-view/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';
import * as demoStyles from "./styles";

class KnowledgeBaseWebPageElementViewDemoActivity extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
            'dbp-knowledge-base-web-page-element-view-demo': KnowledgeBaseWebPageElementViewDemo,
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
                <dbp-knowledge-base-web-page-element-view-demo id="demo" lang="en"></dbp-knowledge-base-web-page-element-view-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-knowledge-base-web-page-element-view-demo-activity', KnowledgeBaseWebPageElementViewDemoActivity);