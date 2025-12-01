import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {ref, createRef} from 'lit/directives/ref.js';
import {DbpBaseElement} from '../base-element.js';

export class DbpNumberElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A number field';
        this.placeholder = '';
        this.min = null;
        this.max = null;
        this.step = null;
        /** @type {import('lit/directives/ref.js').Ref<HTMLInputElement>} */
        this.inputRef = createRef();
        this._userProvidedValidator = null;
    }

    static get properties() {
        return {
            ...super.properties,
            placeholder: {type: String},
            min: {type: Number},
            max: {type: Number},
            step: {type: Number},
        };
    }

    firstUpdated() {
        super.firstUpdated();

        // Store the user-provided validator if it exists
        if (this.customValidator) {
            this._userProvidedValidator = this.customValidator;
        }

        const formElement = this.inputRef.value;

        if (formElement) {
            formElement.addEventListener('input', (event) => {
                this.customValidator = () => {
                    // First call the user-provided validator if it exists
                    if (this._userProvidedValidator) {
                        const userError = this._userProvidedValidator(this.value);
                        if (userError) {
                            return userError;
                        }
                    }

                    // Then, check min/max constraints
                    const numValue = parseFloat(this.value);
                    if (this.value && !isNaN(numValue)) {
                        if (this.min !== null && numValue < this.min) {
                            return this._i18n.t('render-form.number.min-exceeded', {
                                min: this.min,
                            });
                        }
                        if (this.max !== null && numValue > this.max) {
                            return this._i18n.t('render-form.number.max-exceeded', {
                                max: this.max,
                            });
                        }
                    }
                    return null; // No errors
                };
                this.handleErrors();
            });
        }
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    align-items: center;
                }

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                    white-space: nowrap;
                }
            `,
        ];
    }

    renderInput() {
        return html`
            <input
                type="number"
                id="${this.formElementId}"
                ${ref(this.inputRef)}
                name="${this.name}"
                .value="${this.value}"
                placeholder="${this.placeholder}"
                @input="${this.handleInputValue}"
                min="${this.min !== null ? this.min : ''}"
                max="${this.max !== null ? this.max : ''}"
                step="${this.step !== null ? this.step : ''}"
                ?disabled=${this.disabled}
                ?required=${this.required} />
        `;
    }
}
