import {css, html} from 'lit';
import {createInstance} from './i18n';
import {getFieldsetCSS} from './utils.js';
import {AuthMixin, LangMixin, ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class DbpBaseElement extends LangMixin(
    AuthMixin(ScopedElementsMixin(DBPLitElement)),
    createInstance,
) {
    constructor() {
        super();
        this.formElementId = 'form-element';
        this.name = '';
        this.description = '';
        this.label = '';
        /** @type {string | string[]} */
        this.value = '';
        this.required = false;
        this.disabled = false;
        this.errorMessages = [];
        this.evaluationData = {};
        this.customValidator = null;
        this.hidden = false;
    }

    /** @returns {typeof DBPLitElement.properties & import('@lit/reactive-element').PropertyDeclarations} */
    static get properties() {
        return {
            ...super.properties,
            name: {type: String},
            description: {type: String},
            label: {type: String},
            value: {type: String, reflect: true},
            required: {type: Boolean},
            disabled: {type: Boolean},
            errorMessages: {type: Array, attribute: false},
            customValidator: {type: Function},
            hidden: {type: Boolean},
        };
    }

    // This is supposed to be overwritten by subclasses if empty values need to be handled differently
    isValueEmpty() {
        return !this.value;
    }

    handleErrors() {
        let errorMessages = [];

        if (this.required && this.isValueEmpty()) {
            errorMessages.push(
                this._i18n.t('render-form.base-object.required-field-validation-error'),
            );
        } else if (this.customValidator) {
            // To avoid confusion we skip custom validators if the required field is empty.
            // Evaluate the output of customValidator() and add any error messages to the array
            const customValidationErrors = this.customValidator(this.value, this.evaluationData);
            if (customValidationErrors) {
                errorMessages = errorMessages.concat(customValidationErrors);
            }
        }

        this.errorMessages = errorMessages;
        return errorMessages.length === 0;
    }

    handleErrorsIfAny() {
        if (this.errorMessages.length > 0) {
            this.handleErrors();
        }
    }

    evaluateCallback(data, silent = false) {
        this.evaluationData = data;

        if (silent) {
            // Silent mode: check errors without updating UI
            let errorMessages = [];

            if (this.required && this.isValueEmpty()) {
                errorMessages.push(
                    this._i18n.t('render-form.base-object.required-field-validation-error'),
                );
            } else if (this.customValidator) {
                const customValidationErrors = this.customValidator(
                    this.value,
                    this.evaluationData,
                );
                if (customValidationErrors) {
                    errorMessages = errorMessages.concat(customValidationErrors);
                }
            }

            return errorMessages.length === 0;
        } else {
            // Normal mode: check errors and update UI
            return this.handleErrors();
        }
    }

    renderErrorMessages() {
        if (!this.errorMessages.length) {
            return html``;
        }

        // Loop through each error message
        return html`
            <ul class="validation-errors" id="${this.formElementId}-errors">
                ${this.errorMessages.map(
                    (error) => html`
                        <li>${error}</li>
                    `,
                )}
            </ul>
        `;
    }

    /**
     * Returns true if the element currently renders a description, either via the
     * "description" attribute or via the "description" slot.
     * @returns {boolean}
     */
    hasDescription() {
        return this.querySelector('[slot="description"]') !== null || !!this.description;
    }

    /**
     * Collects the ids of the elements that describe the input, in the order they should be
     * announced by a screen reader. Validation errors come first, because they are the more
     * urgent information, followed by the static description.
     * @returns {string[]}
     */
    getDescribedByIds() {
        const ids = [];

        if (this.errorMessages.length) {
            ids.push(`${this.formElementId}-errors`);
        }

        if (this.hasDescription()) {
            ids.push(`${this.formElementId}-description`);
        }

        return ids;
    }

    /**
     * The description and the validation errors are rendered as plain elements next to the input,
     * so a screen reader would skip them while the user tabs through the form. Pointing the input
     * at them via aria-describedby makes them part of the announcement of the field.
     * This is done after rendering instead of inside renderInput(), so that every subclass gets
     * the behaviour without having to implement it.
     */
    updateAriaDescribedBy() {
        const describedBy = this.getDescribedByIds().join(' ');

        // Select2 hides the native select and builds its own markup, so the elements the user
        // actually focuses need the attribute as well
        const targets = this.renderRoot.querySelectorAll(
            'input, textarea, select, .select2-search__field, .select2-selection',
        );

        for (const target of targets) {
            if (describedBy) {
                target.setAttribute('aria-describedby', describedBy);
            } else {
                target.removeAttribute('aria-describedby');
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('evaluate', (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const silent = detail.silent || false;
            const result = this.evaluateCallback(detail.data, silent); // Perform your evaluation
            detail.respond(result); // Send the result back to the caller
        });
    }

    static get styles() {
        return [
            commonStyles.getGeneralCSS(false),
            getFieldsetCSS(),
            // language=css
            css`
                .validation-errors {
                    color: var(--dbp-danger);
                    list-style: none;
                    padding-left: 0;
                    margin-block: 0.25em;
                }

                .description {
                    color: var(--dbp-muted);
                    font-size: 0.875rem;
                    line-height: 1.4;
                    margin-bottom: 0.25em;
                }
                .required-mark {
                    color: var(--dbp-danger);
                }

                .slotted-label {
                    display: flex;
                    align-items: baseline;
                }

                .slotted-label .required-mark {
                    flex-shrink: 0;
                }
            `,
        ];
    }

    update(changedProperties) {
        super.update(changedProperties);

        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this.handleErrorsIfAny();
                    break;
            }
        });
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        this.updateAriaDescribedBy();
    }

    handleInputValue(e) {
        this.value = e.target.value;

        // Dispatch a custom event for the parent form to listen to
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    name: this.name,
                    value: this.value,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        if (this.hidden) {
            return html``;
        }

        // Regenerate error messages in case the language has changed
        this.handleErrorsIfAny();

        // Check if the label slot has any assigned content
        const hasLabelSlot = this.querySelector('[slot="label"]') !== null;

        return html`
            <fieldset>
                <label
                    id="${this.formElementId}-label"
                    for="${this.formElementId}"
                    class="${hasLabelSlot ? 'slotted-label' : ''}">
                    <slot name="label">${this.label}</slot>
                    ${
                        this.required && (hasLabelSlot || this.label)
                            ? html`
                                  <span class="required-mark">
                                      ${this._i18n.t('render-form.base-object.required-field')}
                                  </span>
                              `
                            : html``
                    }
                </label>
                ${
                    this.hasDescription()
                        ? html`
                              <div class="description" id="${this.formElementId}-description">
                                  <slot name="description">${this.description}</slot>
                              </div>
                          `
                        : ''
                }
                ${this.renderErrorMessages()} ${this.renderInput()}
            </fieldset>
        `;
    }

    renderInput() {
        return html`
            Please implement renderInput() in your subclass!
        `;
    }
}
