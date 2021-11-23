import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {NotificationDemo} from '@dbp-toolkit/notification/src/dbp-notification-demo';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import readme from '@dbp-toolkit/notification/README.md';
import * as demoStyles from "./styles";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

class DbpNotificationDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
    }

    static get scopedElements() {
        return {
            'dbp-notification-demo': NotificationDemo,
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
                <dbp-notification-demo id="demo" lang="${this.lang}" entry-point-url="${this.entryPointUrl}"></dbp-notification-demo>
        `;
    }
}

commonUtils.defineCustomElement('dbp-notification-demo-activity', DbpNotificationDemoActivity);
