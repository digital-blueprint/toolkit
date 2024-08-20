import {createInstance} from './src/i18n.js';
import {css, html} from 'lit';
import DBPLitElement from './dbp-lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Modal} from '@dbp-toolkit/common/src/modal.js';
import {PersonSelect} from '@dbp-toolkit/person-select/src/person-select.js';
// import {ResourceSelect} from '@dbp-toolkit/resource-select/src/resource-select.js';
import * as commonUtils from './utils.js';
import * as commonStyles from './styles.js';
import {
    getIconCSS,
    Icon,
    MiniSpinner,
    Button,
    IconButton,
    LoadingButton,
    Spinner,
    InlineNotification,
    Translated,
    Translation,
} from './index.js';



export class DbpCommonDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.noAuth = false;
        this.entryPointUrl = '';
        this.langDir = '';
    }

    static get scopedElements() {
        let elements = {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-spinner': Spinner,
            'dbp-button': Button,
            'dbp-icon-button': IconButton,
            'dbp-loading-button': LoadingButton,
            'dbp-inline-notification': InlineNotification,
            'dbp-translated': Translated,
            'dbp-translation': Translation,
            'dbp-modal': Modal,
            'dbp-person-select': PersonSelect,
            // 'dbp-resource-select': ResourceSelect,
        };

        if (customElements.get('dbp-auth')) {
            elements['dbp-auth'] = customElements.get('dbp-auth');
        }

        return elements;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            noAuth: {type: Boolean, attribute: 'no-auth'},
            langDir: {type: String, attribute: 'lang-dir'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._i18n.changeLanguage(this.lang);

        this.updateComplete.then(() => {});
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}

            h1.title {
                margin-bottom: 1em;
            }
            div.container {
                margin-bottom: 1.5em;
            }

            a:hover {
                color: #ffbb00 !important;
                background-color: blue;
            }

            .color-demo-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 1rem;
                padding: 0;
                list-style: none;
            }

            .color-demo-list > li {
                border: 1px solid var(--dbp-override-muted);
            }

            .demoblock {
                min-height: 150px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }

            .color-demo-list--examples .demoblock:hover {
                background: var(--dbp-hover-background-color) !important;
                color: var(--dbp-hover-color) !important;
            }

            .demoblock__example {
                flex-grow: 1;
                justify-content: center;
                display: flex;
                align-items: center;
            }

            .demoblock__description {
                padding: 0.5rem 1rem;
                display: flex;
                flex-direction: column;
                background: var(--dbp-override-background);
                color: var(--dbp-override-content);
                border-top: 1px solid var(--dbp-override-muted);
            }

            .demoblock__variable {
                white-space: nowrap;
                overflow: hidden;
            }

            .demoblock__color-role {
                color: var(--dbp-muted);
            }

            /* from BULMA.CSS */
            .section {
                padding: 3rem 1.5rem;
            }
            .content h1 {
                font-size: 2em;
                margin-bottom: 0.5em;
            }
            .content h1,
            .content h2,
            .content h3,
            .content h4,
            .content h5,
            .content h6 {
                color: var(--dbp-content);
                font-weight: 600;
                line-height: 1.125;
                margin-top: 2em;
            }
            .control:not(:last-child) {
                margin-bottom: 0.5rem;
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

    buttonClickHandler(e) {
        // add class to button to end2end test if button was clicked
        e.target.classList.add('button-clicked');

        setTimeout(() => {
            const scopedTagName = this.getScopedTagName('dbp-button');
            this.shadowRoot.querySelectorAll(scopedTagName).forEach(element => {
                element.stop();
            });
        }, 1000);
    }

    loadingButtonClickHandler(e) {
        let button = e.target;
        button.start();
        setTimeout(() => {
            button.stop();
        }, 1000);
    }

    openModal(id) {
        const modal = this._(id);
        if (modal) {
            modal.open();
        }
    }

    render() {
        return html`
            <style>
                a:after {
                    ${getIconCSS('envelope')};
                }
            </style>
            <section class="section">
                <div class="content">
                    <h1>Common-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="content">
                    <h2>Mini Spinner</h2>
                    <div class="control">
                        <dbp-mini-spinner text="Loading..."></dbp-mini-spinner>
                        <dbp-mini-spinner></dbp-mini-spinner>
                        <dbp-mini-spinner style="font-size: 2em"></dbp-mini-spinner>
                        <dbp-mini-spinner style="font-size: 3em"></dbp-mini-spinner>
                    </div>
                </div>
                <div class="content">
                    <h2>Spinner</h2>
                    <div class="control">
                        <dbp-spinner></dbp-spinner>
                    </div>
                </div>
                <div class="content">
                    <h2>Icons</h2>
                    <div class="control">
                        <p style="text-decoration: underline">
                            Foo
                            <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                            bar
                        </p>
                        <p style="font-size: 2em;">
                            Foo
                            <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                            bar
                        </p>
                        <p style="font-size: 2em; color:var(--dbp-warning);">
                            Foo
                            <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                            bar
                        </p>
                        <span style="background-color: #000">
                            <a href="#" style=" color: #fff">foobar</a>
                        </span>
                        <p style="font-size: 2em; color:var(--dbp-warning);">
                            Foo
                            <dbp-icon name="information" aria-label="Information icon"></dbp-icon>
                            bar
                        </p>
                        <br />

                        ${new Array(100).fill(0).map(
                            (i) => html`
                                <dbp-icon
                                    aria-label="A happy face icon"
                                    style="color:var(--dbp-success); width: 50px; height: 50px; border: #000 solid 1px"
                                    name="happy"></dbp-icon>
                            `,
                        )}
                    </div>
                </div>
                <div class="content">
                    <h2>Button</h2>
                    <div class="control">
                        <dbp-button
                            value="Primary"
                            @click="${this.buttonClickHandler}"
                            type="is-primary"></dbp-button>
                        <dbp-button
                            value="No type"
                            @click="${this.buttonClickHandler}"
                            ></dbp-button>
                        <dbp-button
                            value="Secondary"
                            @click="${this.buttonClickHandler}"
                            type="is-secondary"></dbp-button>
                        <dbp-button
                            value="Danger"
                            @click="${this.buttonClickHandler}"
                            type="is-danger"></dbp-button>
                        <dbp-button
                            value="Warning"
                            @click="${this.buttonClickHandler}"
                            type="is-warning"></dbp-button>
                        <dbp-button
                            value="Success"
                            @click="${this.buttonClickHandler}"
                            type="is-success"></dbp-button>
                        <dbp-button
                            value="Info"
                            @click="${this.buttonClickHandler}"
                            type="is-info"></dbp-button>
                        <br><br>
                        <dbp-button
                            value="Small primary"
                            @click="${this.buttonClickHandler}"
                            type="is-small is-primary"></dbp-button>
                        <dbp-button
                            value="Small secondary"
                            @click="${this.buttonClickHandler}"
                            type="is-small is-secondary"></dbp-button>
                        <br><br>
                        <dbp-loading-button
                            @click="${this.loadingButtonClickHandler}"
                            type="is-primary">
                            Loading Button
                        </dbp-loading-button>
                        <dbp-loading-button
                            @click="${this.loadingButtonClickHandler}"
                            type="is-primary"
                            disabled>
                            Loading Button Disabled
                        </dbp-loading-button>
                        <br><br>
                        <dbp-icon-button
                            icon-name="checkmark-circle"
                            aria-label="Click to approve this changes"
                            title="Enter input"></dbp-icon-button>
                        <dbp-icon-button
                            icon-name="chrome"
                            aria-label="Select your browser"
                            title="Enter input"></dbp-icon-button>
                        <dbp-icon-button
                            icon-name="steam"
                            aria-label="Play games by pressing this button"
                            title="Enter input"></dbp-icon-button>
                        <dbp-icon-button
                            icon-name="bug"
                            title="No aria-label defined"></dbp-icon-button>
                    </div>
                </div>
                <div class="content">
                    <h2>Theming CSS API</h2>
                    <div class="control">
                        <ul class="color-demo-list">
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-background);">
                                    <div class="demoblock__example"></div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Background color</span>
                                        <code class="demoblock__variable">--dbp-background</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-content);">
                                <div class="demoblock__example"></div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Content color</span>
                                        <code class="demoblock__variable">--dbp-content</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-primary);">
                                    <div class="demoblock__example"></div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Primary color</span>
                                        <code class="demoblock__variable">--dbp-primary</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-secondary);">
                                    <div class="demoblock__example"></div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Secondary color</span>
                                        <code class="demoblock__variable">--dbp-secondary</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-muted);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Muted</span>
                                        <code class="demoblock__variable">--dbp-muted</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-accent);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Accent</span>
                                        <code class="demoblock__variable">--dbp-accent</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-info);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Info</span>
                                        <code class="demoblock__variable">--dbp-info</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-success);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Success</span>
                                        <code class="demoblock__variable">--dbp-success</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-warning);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Warning</span>
                                        <code class="demoblock__variable">--dbp-warning</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-danger);">
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">Danger</span>
                                        <code class="demoblock__variable">--dbp-danger</code>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <ul class="color-demo-list color-demo-list--examples">
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-primary-surface); color: var(--dbp-on-primary-surface)">
                                    <div class="demoblock__example">
                                        <span>Primary</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On primary surface</span>
                                        <code class="demoblock__variable">--dbp-primary-surface<br/>--dbp-on-primary-surface</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-secondary-surface); color: var(--dbp-on-secondary-surface)">
                                    <div class="demoblock__example">
                                        <span>Secondary</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On secondary surface</span>
                                        <code class="demoblock__variable">--dbp-secondary-surface<br/>--dbp-on-secondary-surface</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-info-surface); color: var(--dbp-on-info-surface)">
                                    <div class="demoblock__example">
                                        <span>Info</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On info surface</span>
                                        <code class="demoblock__variable">--dbp-info-surface<br/>--dbp-on-info-surface</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-success-surface); color: var(--dbp-on-success-surface)">
                                    <div class="demoblock__example">
                                        <span>Success</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On success surface</span>
                                        <code class="demoblock__variable">--dbp-success-surface<br/>--dbp-on-success-surface</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-warning-surface); color: var(--dbp-on-warning-surface)">
                                    <div class="demoblock__example">
                                        <span>Warning</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On warning surface</span>
                                        <code class="demoblock__variable">--dbp-warning-surface<br/>--dbp-on-warning-surface</code>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-danger-surface); color: var(--dbp-on-danger-surface)">
                                    <div class="demoblock__example">
                                        <span>Danger</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On danger surface</span>
                                        <code class="demoblock__variable">--dbp-danger-surface<br/>--dbp-on-danger-surface</code>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="demoblock" style="background-color: var(--dbp-hover-background-color); color: var(--dbp-hover-color)">
                                    <div class="demoblock__example">
                                        <span>Hover</span>
                                    </div>
                                    <div class="demoblock__description">
                                        <span class="demoblock__color-role">On hover</span>
                                        <code class="demoblock__variable">--dbp-hover-background-color<br/>--dbp-hover-color</code>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content">
                    <h2>Theming CSS Override API</h2>
                    <pre><code style="text-wrap: wrap;">
&lt;style&gt;
html {
    /* This will override --dbp-primary-surface */
    --dbp-override-primary-surface: green;
    /* Same for all other variables, prefix with "override" */
}
&lt;/style&gt;</code></pre>
                </div>
                <div class="content">
                    <h2>Inline Notification</h2>
                    <div class="control">
                        <dbp-inline-notification
                            summary="Default - no type"
                            body="Item <b>foo</b> was deleted!"></dbp-inline-notification>
                        <br/>
                        <dbp-inline-notification
                            summary="Primary - Item deleted"
                            body="Item <b>foo</b> was deleted!"
                            type="primary"></dbp-inline-notification>
                        <br />
                        <dbp-inline-notification
                            summary="Info - Item deleted"
                            body="Item <b>foo</b> was deleted!"
                            type="info"></dbp-inline-notification>
                        <br />
                        <dbp-inline-notification
                            summary="Success - Item deleted"
                            body="Item <b>foo</b> was deleted!"
                            type="success"></dbp-inline-notification>
                        <br />
                        <dbp-inline-notification
                            summary="Warning - item deleted"
                            body="Item <b>foo</b> was deleted!"
                            type="warning"></dbp-inline-notification>
                        <br />
                        <dbp-inline-notification
                            summary="Danger - item will be deleted"
                            body="Item <b>foo</b> was deleted!"
                            type="danger"></dbp-inline-notification>
                    </div>
                </div>
                <div class="content">
                    <h2>Translated text</h2>
                    <div class="control" id="dbp-translated-demo">
                        <dbp-translated subscribe="lang">
                            <div slot="de">
                                Dieser Text ist Deutsch und wird Englisch werden wenn man die
                                Sprache auf Englisch stellt.
                            </div>
                            <div slot="en">
                                This text is English and will be German if the language is changed
                                to German.
                            </div>
                        </dbp-translated>
                    </div>
                    <div class="control" id="dbp-translation-demo">
                        <dbp-translation key="toolkit-showcase" subscribe="lang, lang-dir"></dbp-translation>
                        <dbp-translation key="toolkit-showcase-link" var='{"link1": "https://www.i18next.com/translation-function/interpolation"}' subscribe="lang, lang-dir" unsafe></dbp-translation>
                        <dbp-translation key="abc" subscribe="lang, lang-dir"></dbp-translation>
                    </div>
                </div>

                <div class="content">
                    <h2>Modal component</h2>
                    <div class="control" id="dbp-translated-demo">
                        <h3>Basic Modal (with fade-in effect)</h3>
                        <style>
                            dbp-modal .header {
                                display: flex;
                                margin-bottom: 1em;
                            }
                            dbp-modal .footer-menu {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: flex-end;
                                gap: 1em;
                            }
                            .modal--basic {
                                --dbp-modal-content-min-height: 6em;
                            }
                            .modal--basic .header h3 {
                                margin: 0 1em 0 0;
                            }
                        </style>

                        <dbp-button type="is-primary" id="modal-trigger"
                            value="open modal"
                            no-spinner-on-click
                            @click="${() => this._('#my-modal-basic').open() }"></dbp-button>

                        <dbp-modal id="my-modal-basic" class="modal modal--basic" modal-id="my-modal-123" title="The title of the modal" subscribe="lang">
                            <div slot="header" class="header">
                                <h3>Person name</h3><dbp-icon name="cog"></dbp-icon>
                            </div>
                            <div slot="content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                            <menu slot="footer" class="footer-menu">
                                <dbp-button @click="${() => { this._('#my-modal-basic').close(); }}">Cancel</dbp-button>
                                <dbp-button type="is-primary">Submit</dbp-button>
                            </menu>
                        </dbp-modal>
                    </div>

                    <div class="control" id="dbp-translated-demo">
                        <h3>Modal with long content</h3>
                        <style>

                        </style>

                        <dbp-button type="is-primary" id="modal-trigger"
                            value="open modal"
                            no-spinner-on-click
                            @click="${() => this._('#my-modal-long').open() }"></dbp-button>

                        <dbp-modal id="my-modal-long" class="modal modal--long" modal-id="my-modal-123" title="The title of the modal" subscribe="lang">
                            <div slot="header" class="header">
                                <h3>Person name</h3><dbp-icon name="cog"></dbp-icon>
                            </div>
                            <div slot="content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h4>Exercitation</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h4>Consectetur</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h5>Eiusmod</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h4>Incididunt</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h5>Consequat</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            </div>
                            <menu slot="footer" class="footer-menu">
                                <dbp-button @click="${() => { this._('#my-modal-long').close(); }}">Cancel</dbp-button>
                                <dbp-button type="is-primary">Submit</dbp-button>
                            </menu>
                        </dbp-modal>
                    </div>


                    <div class="control" id="dbp-translated-demo">
                        <h3>Modal with person selector (with slide-in effect)</h3>
                        <style>
                            #my-modal-person {
                                --dbp-modal-content-min-height: 15em;
                                --dbp-modal-animation: mmSlideIn;
                            }
                        </style>

                        <dbp-button type="is-primary" id="modal-trigger"
                            value="open modal"
                            no-spinner-on-click
                            @click="${() => this._('#my-modal-person').open() }"></dbp-button>

                        <dbp-modal id="my-modal-person" class="modal modal--person"
                            modal-id="my-modal-123"
                            title="Person selector modal"
                            min-width="500px"
                            min-height="400px"
                            subscribe="lang">
                            <div slot="header" class="header">
                                <h3>Person name</h3><dbp-icon name="cog"></dbp-icon>
                            </div>
                            <div slot="content">
                                <dbp-person-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"></dbp-person-select>
                            </div>
                            <menu slot="footer" class="footer-menu">
                                <dbp-button @click="${() => { this._('#my-modal-person').close(); }}">Cancel</dbp-button>
                                <dbp-button type="is-primary">Submit</dbp-button>
                            </menu>
                        </dbp-modal>
                    </div>
                </div>

            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-common-demo', DbpCommonDemo);
