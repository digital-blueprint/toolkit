import {html, LitElement, css} from 'lit-element';
import * as commonUtils from './utils.js';
import VPULitElement from './vpu-lit-element.js';

/**
 * vpu-button implements a button with Bulma styles and automatic spinner and
 * disabling if button is clicked
 *
 * Use the attribute "no-spinner-on-click" to disable the spinner, then you can
 * start it with start() and stop it with stop()
 *
 * Use the attribute "type" to set Bulma styles like "is-info"
 * See https://bulma.io/documentation/elements/button/#colors for a list of all styles
 */
class Button extends VPULitElement {
    constructor() {
        super();
        this.value = "";
        // see: https://bulma.io/documentation/elements/button/#colors
        this.type = "is-primary";
        this.spinner = false;
        this.noSpinnerOnClick = false;
        this.disabled = false;
        this.button = null;
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        this.updateComplete.then(()=> {
            this.button = this._("button");
        });
    }

    static get properties() {
        return {
            value: { type: String },
            type: { type: String },
            spinner: { type: Boolean },
            noSpinnerOnClick: { type: Boolean, attribute: 'no-spinner-on-click' },
            disabled: { type: Boolean },
        };
    }

    static get styles() {
        return css`vpu-mini-spinner { margin-left: 0.5em; }`;
    }

    clickHandler() {
        if (!this.noSpinnerOnClick) {
            this.start();
        }
    }

    start() {
        this.spinner = true;
        this.disabled = true;
        this.setAttribute("disabled", "disabled");
    }

    stop() {
        this.spinner = false;
        this.disabled = false;
        this.removeAttribute("disabled");
    }

    isDisabled() {
        return this.button.hasAttribute("disabled");
    }

    static get styles() {
        // language=css
        return css`
            ${commonUtils.getThemeCSS()}
            .button {
                cursor: pointer;
                justify-content: center;
                padding-bottom: calc(.375rem - 1px);
                padding-left: .75rem;
                padding-right: .75rem;
                padding-top: calc(.375rem - 1px);
                text-align: center;
                white-space: nowrap;
            }`;
    }

    render() {
        return html`
            <style>
                .primary {
                    background: var(--vpu-primary-bg-color);
                    color: var(--vpu-primary-text-color);
                }
            </style>
            <button @click="${this.clickHandler}" class="button ${this.type}" ?disabled="${this.disabled}">
                ${this.value} <vpu-mini-spinner style="display: ${this.spinner ? "inline" : "none"}"></vpu-mini-spinner>
            </button>
        `;
    }
}

commonUtils.defineCustomElement('vpu-button', Button);
