import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {CheckInPlaceSelectDemo} from '@dbp-toolkit/check-in-place-select/src/dbp-check-in-place-select-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from '@dbp-toolkit/check-in-place-select/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';
import * as demoStyles from "./styles";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

class DbpActivityNameDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    static get scopedElements() {
        return {
            'dbp-check-in-place-select-demo': CheckInPlaceSelectDemo,
        };
    }

    static get properties() {
        return this.getProperties({
        });
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
                <dbp-check-in-place-select-demo id="demo" lang="en" no-auth></dbp-check-in-place-select-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-check-in-place-select-demo-activity', DbpActivityNameDemoActivity);
