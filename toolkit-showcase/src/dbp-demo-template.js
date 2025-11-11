import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
//import {ClassName} from '@dbp-toolkit/package-name/src/dbp-demo-activity-name'; TODO
import * as commonStyles from '@dbp-toolkit/common/styles';
//import * as commonUtils from "@dbp-toolkit/common/utils";
// import readme from '@dbp-toolkit/class-name/README.md'; TODO
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';

export class DbpActivityNameDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    //TODO
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            // TODO
            //'dbp-class-name-demo': ClassName,
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

                #demo {
                    display: block;
                    padding-top: 50px;
                }
            `,
        ];
    }

    render() {
        /**
            return html`
                ${demoStyles.renderMarkdown(readme)}
                <dbp-class-name-demo id="demo" lang="${this.lang}" entry-point-url="${this
                .entryPointUrl}"></dbp-class-name-demo>
            `;
         */
        return html``;
    }
}

//commonUtils.defineCustomElement('dbp-class-name-demo-activity', DbpClassNameDemoActivity); TODO
