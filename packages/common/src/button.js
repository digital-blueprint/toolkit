import {html, LitElement, css} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {MiniSpinner} from './mini-spinner.js';
import * as commonStyles from '../styles.js';

/**
 * dbp-button implements a button with Bulma styles and automatic spinner and
 * disabling if button is clicked
 *
 * Use the attribute "no-spinner-on-click" to disable the spinner, then you can
 * start it with start() and stop it with stop()
 *
 * Type can be is-primary/is-info/is-success/is-warning/is-danger
 */
export class Button extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.value = '';
        this.type = '';
        this.spinner = false;
        this.noSpinnerOnClick = false;
        this.disabled = false;
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    static get properties() {
        return {
            value: {type: String},
            type: {type: String},
            spinner: {type: Boolean},
            noSpinnerOnClick: {type: Boolean, attribute: 'no-spinner-on-click'},
            disabled: {type: Boolean, reflect: true},
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

            .spinner {
                margin-left: 0.5em;
            }
        `;
    }

    render() {
        return html`
            <button
                @click="${this.clickHandler}"
                class="button ${this.type}"
                ?disabled="${this.disabled}">
                ${this.value}
                <dbp-mini-spinner
                    class="spinner"
                    style="display: ${this.spinner ? 'inline' : 'none'}"></dbp-mini-spinner>
            </button>
        `;
    }
}

export class LoadingButton extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.value = '';
        this.type = '';
        this.loading = false;
        this.disabled = false;

        // https://bugs.chromium.org/p/chromium/issues/detail?id=1061240#c12
        this.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopImmediatePropagation();
            }
        });
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    static get properties() {
        return {
            // value is deprecated, use the main slot instead
            value: {type: String},
            type: {type: String},
            loading: {type: Boolean},
            disabled: {type: Boolean, reflect: true},
        };
    }

    start() {
        this.loading = true;
        this.disabled = true;
    }

    stop() {
        this.loading = false;
        this.disabled = false;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getButtonCSS()}

            .spinner {
                padding-left: 0.5em;
                min-width: 16px;
            }

            .loading-container {
                display: flex;
                align-items: baseline;
            }

            .label {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            :host {
                display: inline-block;
            }

            .is-not-loading .label {
                padding-left: 12px;
                padding-right: 12px;
            }

            .button {
                width: 100%;
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .button {
                    min-height: 36px;
                }

                .label {
                    margin: auto;
                }
            }
        `;
    }

    render() {
        return html`
            <button
                class="button ${this.type} loading-container ${!this.loading
                    ? 'is-not-loading'
                    : ''}"
                ?disabled="${this.disabled}">
                <div class="label"><slot>${this.value}</slot></div>
                <dbp-mini-spinner
                    class="spinner"
                    style="display: ${this.loading ? 'inline' : 'none'}"></dbp-mini-spinner>
            </button>
        `;
    }
}
