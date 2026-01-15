import {css, html} from 'lit';
import {Button, Icon, Modal, ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpModalDemo} from '@dbp-toolkit/common/src/demo/modal-demo.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import readme from '@dbp-toolkit/common/README.modal.md';
import * as demoStyles from './styles';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {MarkdownElement} from './markdown-element.js';
import {PersonSelect} from '@dbp-toolkit/person-select';

class DbpCommonModalDemoActivity extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'en';
        this.entryPointUrl = '';
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-modal-demo': DbpModalDemo,
            'dbp-markdown': MarkdownElement,
            'dbp-person-select': PersonSelect,
            'dbp-modal': Modal,
            'dbp-button': Button,
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
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

                .control h3 {
                    color: var(--dbp-content);
                    font-weight: 600;
                    line-height: 1.125;
                    margin-top: 1.5em;
                    font-size: 1.25em;
                    margin-bottom: 0.5em;
                }

                .control {
                    margin-bottom: 1.5rem;
                }

                dbp-modal .footer-menu {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1em;
                    padding-top: 1em;
                }

                .modal--person {
                    --dbp-modal-min-height: 25em;
                    --dbp-modal-animation: mmSlideIn;
                }

                .modal--person .header h3 {
                    margin: 0 1em 0 0;
                }
            `,
        ];
    }

    render() {
        return html`
            <dbp-markdown .markdown=${readme}></dbp-markdown>
            <dbp-modal-demo></dbp-modal-demo>

            <div class="control">
                <h3>Modal with person selector (with slide-in effect)</h3>
                <dbp-button
                    type="is-primary"
                    id="modal-trigger-person"
                    value="open modal"
                    no-spinner-on-click
                    @click="${() =>
                        this.renderRoot.querySelector('#my-modal-person').open()}"></dbp-button>

                <dbp-modal
                    id="my-modal-person"
                    class="modal modal--person"
                    modal-id="modal-person"
                    title="Person selector modal"
                    min-width="500px"
                    min-height="400px"
                    subscribe="lang">
                    <div slot="header" class="header">
                        <h3>Person name</h3>
                        <dbp-icon name="cog"></dbp-icon>
                    </div>
                    <div slot="content">
                        <dbp-person-select
                            subscribe="auth"
                            lang="${this.lang}"
                            entry-point-url="${this.entryPointUrl}"></dbp-person-select>
                    </div>
                    <menu slot="footer" class="footer-menu">
                        <dbp-button
                            @click="${() => {
                                this.renderRoot.querySelector('#my-modal-person').close();
                            }}">
                            Cancel
                        </dbp-button>
                        <dbp-button type="is-primary">Submit</dbp-button>
                    </menu>
                </dbp-modal>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-modal-demo-activity', DbpCommonModalDemoActivity);
