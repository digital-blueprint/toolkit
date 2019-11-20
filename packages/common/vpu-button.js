import {html, LitElement, css} from 'lit-element';
import * as commonUtils from './utils.js';
import * as commonStyles from './styles.js';
import VPULitElement from './vpu-lit-element.js';

/**
 * vpu-button implements a button with Bulma styles and automatic spinner and
 * disabling if button is clicked
 *
 * Use the attribute "no-spinner-on-click" to disable the spinner, then you can
 * start it with start() and stop it with stop()
 *
 * Type can be is-primary/is-info/is-success/is-warning/is-danger
 */
class Button extends VPULitElement {
    constructor() {
        super();
        this.value = "";
        this.type = "";
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
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        return html`
            <button @click="${this.clickHandler}" class="button ${this.type}" ?disabled="${this.disabled}">
                ${this.value} <vpu-mini-spinner style="display: ${this.spinner ? "inline" : "none"}"></vpu-mini-spinner>
            </button>
        `;
    }
}

commonUtils.defineCustomElement('vpu-button', Button);
