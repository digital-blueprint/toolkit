import {css, html} from 'lit';
import {createInstance} from './i18n';
import {getFieldsetCSS} from './utils.js';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class DbpBaseElement extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.formElementId = 'form-element';
        this.name = '';
        this.description = '';
        this.label = '';
        this.value = '';
        this.required = false;
        this.disabled = false;
        this.errorMessages = [];
        this.evaluationData = {};
        this.customValidator = null;
        this.hidden = false;
    }

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

    handleErrors() {
        let errorMessages = [];

        if (this.required && !this.value) {
            errorMessages.push(
                this._i18n.t('render-form.base-object.required-field-validation-error'),
            );
        }

        // Evaluate the output of customValidator() and add any error messages to the array
        if (this.customValidator) {
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

    evaluateCallback(data) {
        console.log('evaluateCallback data', data);
        this.evaluationData = data;

        return this.handleErrors();
    }

    renderErrorMessages() {
        if (!this.errorMessages.length) {
            return html``;
        }

        // Loop through each error message
        return html`
            <ul class="validation-errors">
                ${this.errorMessages.map(
                    (error) => html`
                        <li>${error}</li>
                    `,
                )}
            </ul>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('evaluate', (event) => {
            const detail = event.detail;
            const result = this.evaluateCallback(detail.data); // Perform your evaluation
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
                    color: var(--dbp-override-danger);
                    list-style: none;
                    padding-left: 0;
                    margin-block: 0.25em;
                }

                .description {
                    margin-bottom: 0.25em;
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

    handleInputValue(e) {
        this.value = e.target.value;
    }

    render() {
        if (this.hidden) {
            return html``;
        }

        // Regenerate error messages in case the language has changed
        this.handleErrorsIfAny();

        return html`
            <fieldset>
                <label for="${this.formElementId}">
                    ${this.label}
                    ${this.required
                        ? html`
                              (${this._i18n.t('render-form.base-object.required-field')})
                          `
                        : html``}
                </label>
                <div class="description">${this.description}</div>
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
