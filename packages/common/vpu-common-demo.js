import {i18n} from './i18n.js';
import {css, html, unsafeCSS} from 'lit-element';
import * as commonUtils from './utils.js';
import * as commonStyles from './styles.js';
import './vpu-mini-spinner.js';
import './vpu-spinner.js';
import {getIconCSS} from './vpu-icon.js';
import './vpu-button.js';
import VPULitElement from './vpu-lit-element.js';

class VpuCommonDemo extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            noAuth: { type: Boolean, attribute: 'no-auth' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
    }

    static get styles() {
        // language=css
        return css`
            ${ commonStyles.getThemeCSS() }

            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em;}

            a:hover {
                color: #ffbb00 !important;
                background-color: blue;
            }

            .demoblock {
                position: relative;
                width: 1.1em;
                height: 1.1em;
                display: inline-block;
                padding: 0px 0px 0px 3px;
            }

           /* from BULMA.CSS */
            .section {
               padding: 3rem 1.5rem;
            }
            .content h1 {
                font-size: 2em;
                margin-bottom: .5em;
            }
            .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
                color: #363636;
                font-weight: 600;
                line-height: 1.125;
            }
            .control:not(:last-child) {
                margin-bottom: 0.5rem;
            }
        `;
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="container">
                <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person></vpu-auth>
            </div>
        `;
    }

    buttonClickHandler() {
        setTimeout(() => {
            this._("vpu-button").stop();
        }, 1000);
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-common-demo-src');
        return html`
            <style>
                a:after {
                    ${ getIconCSS('envelope') };
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
                        <vpu-mini-spinner></vpu-mini-spinner>
                        <vpu-mini-spinner style="font-size: 2em"></vpu-mini-spinner>
                        <vpu-mini-spinner style="font-size: 3em"></vpu-mini-spinner>
                    </div>
                </div>
                <div class="content">
                    <h2>Spinner</h2>
                    <div class="control">
                        <vpu-spinner></vpu-spinner>
                    </div>
                </div>
                <div class="content">
                    <h2>Icons</h2>
                    <div class="control">
                        <p style="text-decoration: underline">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <p style="font-size: 2em;">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <p style="font-size: 2em; color: orange">Foo <vpu-icon name="cloudnetwork"></vpu-icon> bar</p>
                        <span style="background-color: #000"><a href="#" style=" color: #fff">foobar</a></span>
                        <br>

                        ${(new Array(100).fill(0)).map(i => html`<vpu-icon style="color: green; width: 50px; height: 50px; border: #000 solid 1px"name="happy"></vpu-icon>`)}
                    </div>
                </div>
                <div class="content">
                    <h2>Button</h2>
                    <div class="control">
                        <vpu-button value="Load" @click="${this.buttonClickHandler}" type="is-primary"></vpu-button>
                    </div>
                </div>
                <div class="content">
                    <h2>Theming CSS API</h2>
                    <div class="control">
                        <ul>
                            <li><code>--vpu-primary-bg-color</code>: Primary background color <div class="demoblock" style="background-color: var(--vpu-primary-bg-color)"></div></li>
                            <li><code>--vpu-primary-text-color</code>: Primary text color <div class="demoblock" style="background-color: var(--vpu-primary-bg-color); color: var(--vpu-primary-text-color)">X</div></li>
                            <li><code>--vpu-secondary-bg-color</code>: Secondary background color <div class="demoblock" style="background-color: var(--vpu-secondary-bg-color)"></div></li>
                            <li><code>--vpu-secondary-text-color</code>: Secondary text color <div class="demoblock" style="background-color: var(--vpu-secondary-bg-color); color: var(--vpu-secondary-text-color)">X</div></li>
                            <li><code>--vpu-info-bg-color</code>: Info background color <div class="demoblock" style="background-color: var(--vpu-info-bg-color)"></div></li>
                            <li><code>--vpu-info-text-color</code>: Info text color <div class="demoblock" style="background-color: var(--vpu-info-bg-color); color: var(--vpu-info-text-color)">X</div></li>
                            <li><code>--vpu-success-bg-color</code>: Success background color <div class="demoblock" style="background-color: var(--vpu-success-bg-color)"></div></li>
                            <li><code>--vpu-success-text-color</code>: Success text color <div class="demoblock" style="background-color: var(--vpu-success-bg-color); color: var(--vpu-success-text-color)">X</div></li>
                            <li><code>--vpu-warning-bg-color</code>: Warning background color <div class="demoblock" style="background-color: var(--vpu-warning-bg-color)"></div></li>
                            <li><code>--vpu-warning-text-color</code>: Warning text color <div class="demoblock" style="background-color: var(--vpu-warning-bg-color); color: var(--vpu-warning-text-color)">X</div></li>
                            <li><code>--vpu-danger-bg-color</code>: Danger background color <div class="demoblock" style="background-color: var(--vpu-danger-bg-color)"></div></li>
                            <li><code>--vpu-danger-text-color</code>: Danger text color <div class="demoblock" style="background-color: var(--vpu-danger-bg-color); color: var(--vpu-danger-text-color)">X</div></li>

                            <li><code>--vpu-light</code>: Light color <div class="demoblock" style="background-color: var(--vpu-light)"></div></li>
                            <li><code>--vpu-dark</code>: Dark color <div class="demoblock" style="background-color: var(--vpu-dark)"></div></li>
                            <li><code>--vpu-muted-text</code>: Muted text color <div class="demoblock" style="color: var(--vpu-muted-text)">X</div></li>
                            <li><code>--vpu-border-radius</code>: Border-radius <div class="demoblock" style="background-color: var(--vpu-light); border-color: var(--vpu-dark); border-style: solid; border-width: 1px; border-radius: var(--vpu-border-radius)"></div></li>
                            <li><code>--vpu-border-width</code>: Border-width <div class="demoblock" style="background-color: var(--vpu-light); border-color: var(--vpu-dark); border-style: solid; border-width: var(--vpu-border-width); border-radius: 0px;"></div></li>
                        </ul>
                    </div>
                </div>
                <div class="content">
                    <h2>Theming CSS Override API</h2>
                    <pre>
&lt;style&gt;
html {
    /* This will override --vpu-primary-bg-color */
    --vpu-override-primary-bg-color: green;
    /* Same for all other variables, prefix with "override" */
}
&lt;/style&gt;</pre>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-common-demo', VpuCommonDemo);
