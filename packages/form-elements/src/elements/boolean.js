import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpBooleanElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = '';
        this.state = false;
        this.dataValue = false;
        // Needs to be empty, because we can ignore that
        this.value = '';
    }

    static get properties() {
        return {
            ...super.properties,
            state: {type: Boolean},
            dataValue: {type: String, attribute: 'data-value', reflect: true},
        };
    }

    static get styles() {
        return [
            ...super.styles,
            css`
                .checkboxItem {
                    display: flex;
                    align-items: center;
                    column-gap: 4px;
                    width: fit-content;
                    line-height: 1;
                    cursor: pointer;
                    font-weight: normal;
                }

                .checkboxItem:not(:last-of-type) {
                    margin-bottom: 16px;
                }

                .checkbox {
                    appearance: none;
                    position: relative;
                    width: 20px;
                    height: 20px;
                    border: 1px solid var(--dbp-info-surface);
                    border-radius: 2px;
                    cursor: pointer;
                    margin-left: 0;
                }

                .checkbox:checked {
                    background-color: var(--dbp-info-surface);
                }

                .checkbox:checked::after {
                    content: '';
                    position: absolute;
                    top: 5px;
                    left: 3px;
                    width: 12px;
                    height: 6px;
                    border-bottom: 2px solid #ffffff;
                    border-left: 2px solid #ffffff;
                    transform: rotate(-45deg);
                }
            `,
        ];
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'value': {
                    if (this.value === '') {
                        return;
                    }

                    this.state = this.value === 'true';
                    this.dataValue = this.state;

                    const changeEvent = new CustomEvent('change', {
                        detail: {value: this.state, state: this.state},
                        bubbles: true,
                        composed: true,
                    });
                    this.dispatchEvent(changeEvent);
                    break;
                }
            }
        });

        super.update(changedProperties);
    }

    handleInputValue(e) {
        this.state = e.target.checked;
        this.dataValue = this.state;
        this.value = this.state ? 'true' : 'false';
    }

    render() {
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
                ${this.renderInput()} ${this.renderErrorMessages()}
            </fieldset>
        `;
    }

    renderInput() {
        return html`
            <label class="checkboxItem">
                <input
                    type="checkbox"
                    id="${this.formElementId}"
                    name="${this.name}"
                    class="checkbox"
                    ?checked=${this.state}
                    @input="${this.handleInputValue}"
                    ?disabled=${this.disabled}
                    ?required=${this.isRequired} />
                ${this.description}
            </label>
        `;
    }
}
