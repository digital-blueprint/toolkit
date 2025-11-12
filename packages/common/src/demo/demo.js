import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonUtils from '../common-utils.js';
import * as commonStyles from '../styles.js';
import {DbpModalDemo} from './modal-demo.js';
import {DbpButtonDemo} from './button-demo.js';
import {DbpIconDemo} from './icon-demo.js';
import {DbpMiscDemo} from './misc-demo.js';
import {DbpSelectDemo} from './dbp-select-demo.js';
import {ProviderDemo} from './provider-demo.js';
import {LangMixin} from '../index.js';

export class DbpCommonDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.noAuth = false;
    }

    static get scopedElements() {
        let elements = {
            'dbp-modal-demo': DbpModalDemo,
            'dbp-button-demo': DbpButtonDemo,
            'dbp-icon-demo': DbpIconDemo,
            'dbp-misc-demo': DbpMiscDemo,
            'dbp-select-demo': DbpSelectDemo,
            'dbp-provider-demo': ProviderDemo,
        };

        if (customElements.get('dbp-auth')) {
            elements['dbp-auth'] = customElements.get('dbp-auth');
        }

        return elements;
    }

    static get properties() {
        return {
            ...super.properties,
            noAuth: {type: Boolean, attribute: 'no-auth'},
        };
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}

            div.container {
                margin-bottom: 1.5em;
            }

            .section {
                padding: 3rem 1.5rem;
            }

            .content h1 {
                font-size: 2em;
                margin-bottom: 0.5em;
                color: var(--dbp-content);
                font-weight: 600;
                line-height: 1.125;
            }
        `;
    }

    getAuthComponentHtml() {
        return this.noAuth
            ? html``
            : html`
                  <div class="container">
                      <dbp-auth lang="${this.lang}"></dbp-auth>
                  </div>
              `;
    }

    render() {
        return html`
            <section class="section">
                <div class="content">
                    <h1>Common-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}

                <dbp-misc-demo></dbp-misc-demo>
                <dbp-button-demo></dbp-button-demo>
                <dbp-select-demo></dbp-select-demo>
                <dbp-modal-demo entry-point-url="${this.entryPointUrl}"></dbp-modal-demo>
                <dbp-provider-demo></dbp-provider-demo>
                <dbp-icon-demo></dbp-icon-demo>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-demo', DbpCommonDemo);
