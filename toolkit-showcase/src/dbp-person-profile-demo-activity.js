import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {PersonProfileDemo} from '@dbp-toolkit/person-profile/src/dbp-person-profile-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from '@dbp-toolkit/person-profile/README.md';
import highlightCSSPath from 'highlight.js/styles/default.css';
import * as demoStyles from "./styles";

class DbpPersonProfileDemoActivity extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
            'dbp-person-profile-demo': PersonProfileDemo,
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
                <dbp-person-profile-demo id="demo" lang="en" no-auth></dbp-person-profile-demo>

        `;
    }
}

commonUtils.defineCustomElement('dbp-person-profile-demo-activity', DbpPersonProfileDemoActivity);