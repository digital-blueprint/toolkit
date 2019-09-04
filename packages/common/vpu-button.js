import {html, LitElement, css} from 'lit-element';
import * as commonUtils from './utils.js';
import bulmaCSSPath from 'bulma/css/bulma.min.css';


class Button extends LitElement {
    constructor() {
        super();
        this.value = "";
        // see: https://bulma.io/documentation/elements/button/#colors
        this.type = "primary";
        this.spinner = false;
        this.spinnerOnClick = true;
        this.disabled = false;
    }

    static get properties() {
        return {
            value: { type: String },
            type: { type: String },
            spinner: { type: Boolean },
            spinnerOnClick: { type: Boolean, attribute: 'spinner-on-click' },
            disabled: { type: Boolean },
        };
    }

    static get styles() {
        return css`vpu-mini-spinner { margin-left: 0.5em; }`;
    }

    clickHandler() {
        if (this.spinnerOnClick) {
            this.spinner = true;
        }
    }

    stop() {
        this.spinner = false;
    }

    render() {
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);

        return html`
            <link rel="stylesheet" href="${bulmaCSS}">
            <button @click="${this.clickHandler}" class="button ${this.type}" ?disabled="${this.disabled}">
                ${this.value} <vpu-mini-spinner style="display: ${this.spinner ? "inline" : "none"}"></vpu-mini-spinner>
            </button>
        `;
    }
}

commonUtils.defineCustomElement('vpu-button', Button);
