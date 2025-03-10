import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {stringifyForDataValue} from "../utils.js";

export class DbpEnumElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = '';
        this.items = {};
        this.multiple = false;
        this.dataValue = '';
        this.displayMode = 'dropdown';
        this.selectRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            multiple: {type: Boolean},
            dataValue: {type: String, attribute: 'data-value', reflect: true},
            displayMode: {type: String, attribute: 'display-mode'},
            items: {type: Object},
        };
    }

    setItems(items) {
        this.items = items;
    }

    render() {
        if (this.hidden) {
            return html``;
        }

        // Regenerate error messages in case the language has changed
        this.handleErrorsIfAny();

        return html`
            <fieldset>
                ${this.label ?
                    html`<label for="${this.formElementId}">
                        ${this.label}
                        ${this.required
                            ? html`
                                (${this._i18n.t('render-form.base-object.required-field')})
                            `
                            : html``}
                    </label>`
                    : ''
                }
                ${this.description ?
                    html`<div class="description">
                        ${this.description}
                        ${this.required
                            ? html`
                                (${this._i18n.t('render-form.base-object.required-field')})
                            `
                            : html``}
                        </div>`
                    : ''}
                ${this.renderErrorMessages()}
                ${this.renderInput()}
            </fieldset>
        `;
    }

    renderInput() {

        const validModes = ['dropdown', 'list'];
        if (!validModes.includes(this.displayMode)) {
            console.warn(`Invalid display-mode: ${this.displayMode}. Defaulting to 'dropdown'.`);
            this._displayMode = 'dropdown';
        } else {
            this._displayMode = this.displayMode;
        }

        switch (this._displayMode) {
            case 'dropdown':
                // If multiple is true, this.value is an array of selected values!
                return html`
                    <select
                        ${ref(this.selectRef)}
                        id="${this.formElementId}"
                        name="${this.name}"
                        @change="${this.handleInputValue}"
                        ?disabled=${this.disabled}
                        ?required=${this.required}
                        ?multiple=${this.multiple}>
                        ${Object.keys(this.items).map(
                            (key) => html`
                                <option
                                    value="${key}"
                                    ?selected=${this.multiple
                                        ? this.value?.includes(key)
                                        : key === this.value}>
                                    ${this.items[key]}
                                </option>
                            `,
                        )}
                    </select>
                `;
            case 'list':
                return html`
                    ${Object.keys(this.items).map(
                        (key) => html`
                            <label class="checkboxItem">
                                ${this.multiple ?
                                    html`<input
                                        type="checkbox"
                                        id="${this.formElementId}"
                                        name="${key}"
                                        value="${key}"
                                        class="checkbox"
                                        ?checked="${this.checked}"
                                        @input="${this.handleInputValue}"
                                        ?disabled=${this.disabled}
                                        ?required=${this.required} />`
                                    : html`<input
                                        type="radio"
                                        id="${this.formElementId}"
                                        name="${this.name}"
                                        value="${key}"
                                        class="radio"
                                        ?checked="${this.checked}"
                                        @input="${this.handleInputValue}"
                                        ?disabled=${this.disabled}
                                        ?required=${this.required} />`
                                }
                                ${this.items[key]}
                            </label>
                        `
                    )}
                `;
            default:
                console.warn(`Unsupported display mode: ${this._displayMode}. Defaulting to 'dropdown'.`);
                break;
        }
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                /* For some reasons the selector chevron was very large */
                select:not(.select) {
                    background-size: 1em;
                }

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

    handleInputValue(e) {
        if (this.displayMode === 'dropdown') {
            this.value = this.multiple
                ? Array.from(e.target.selectedOptions).map((option) => option.value)
                : e.target.value;
        }
        if (this.displayMode === 'list') {
            this.value = this.multiple
                ? Array.from(this._a('[type="checkbox"]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value)
                : e.target.value;
        }
    }

    adaptValueForMultiple() {
        // if (!this.value) {
        //     // this.value = this.multiple ? [] : Object.keys(this.items)[0];
        //     this.value = this.multiple ? [] : '';
        // }

        if (this.multiple && !Array.isArray(this.value)) {
            // Convert single value to an array if switching to multiple mode
            this.value = [this.value];
        } else if (!this.multiple && Array.isArray(this.value)) {
            // Convert array to a single value if switching to single mode
            this.value = this.value[0] || '';
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'items':
                case 'multiple':
                    // Disabled, because it causes race conditions!
                    // this.adaptValueForMultiple();
                    break;
                case 'value':
                    this.generateDataValue();
                    break;
            }
        });

        super.update(changedProperties);
    }

    generateDataValue() {
        if (this.multiple) {
            if (this.selectRef.value) {
                const data = Array.from(this.selectRef.value.selectedOptions).map(
                    (option) => option.value,
                );
                this.dataValue = stringifyForDataValue(data);
            }
            if (this._a('[type="checkbox"]').length > 0) {
                const data = Array.from(this._a('[type="checkbox"]'))
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);
                this.dataValue =  stringifyForDataValue(data);
            }
        } else {
            this.dataValue = this.value;
        }
    }
}

commonUtils.defineCustomElement('dbp-form-enum-element', DbpEnumElement);
