import {html, LitElement, css} from 'lit-element';
import * as commonUtils from './utils.js';
import * as commonStyles from './styles.js';

/**
 * vpu-button implements a button with Bulma styles and automatic spinner and
 * disabling if button is clicked
 *
 * Use the attribute "no-spinner-on-click" to disable the spinner, then you can
 * start it with start() and stop it with stop()
 *
 * Type can be is-primary/is-info/is-success/is-warning/is-danger
 */
class Button extends LitElement {
    constructor() {
        super();
        this.value = "";
        this.type = "";
        this.spinner = false;
        this.noSpinnerOnClick = false;
        this.disabled = false;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    static get properties() {
        return {
            value: { type: String },
            type: { type: String },
            spinner: { type: Boolean },
            noSpinnerOnClick: { type: Boolean, attribute: 'no-spinner-on-click' },
            disabled: { type: Boolean, reflect: true },
        };
    }

    clickHandler() {
        if (!this.noSpinnerOnClick) {
            this.start();
        }
    }

    start() {
        this.spinner = true;
        this.disabled = true;
    }

    stop() {
        this.spinner = false;
        this.disabled = false;
    }

    isDisabled() {
        return this.disabled;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getButtonCSS()}

            vpu-mini-spinner { margin-left: 0.5em; }
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
