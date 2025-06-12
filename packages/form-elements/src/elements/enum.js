import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {stringifyForDataValue} from '../utils.js';

export class DbpEnumElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = '';
        this.items = {};
        this.multiple = false;
        // Since this.multiple === false, we set an empty string as this.value
        this.value = '';
        this.dataValue = '';
        this.displayMode = 'dropdown';
        this.selectRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            multiple: {type: Boolean},
            // We will treat this.value as an object and will not reflect it outside
            // Although we might write a string into this.value anyway for this.multiple === false
            value: {type: Object},
            // That's the only thing we will reflect, and which will be used for gathering the data in the form
            dataValue: {type: String, attribute: 'data-value', reflect: true},
            displayMode: {type: String, attribute: 'display-mode'},
            items: {type: Object},
        };
    }

    // Can be used to set items from the outside
    setItems(items) {
        this.items = items;
    }

    isValueEmptyArray() {
        return Array.isArray(this.value) && this.value.length === 0;
    }

    isValueEmpty() {
        return this.value === '' || this.isValueEmptyArray();
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
                <label for="${this.formElementId}">
                    <slot name="label">${this.label}</slot>
                    ${this.required && (hasLabelSlot || this.label)
                        ? html`
                              (${this._i18n.t('render-form.base-object.required-field')})
                          `
                        : html``}
                </label>

                ${this.description
                    ? html`
                          <div class="description">
                              ${this.description}
                              ${this.required
                                  ? html`
                                        (${this._i18n.t('render-form.base-object.required-field')})
                                    `
                                  : html``}
                          </div>
                      `
                    : ''}
                ${this.renderErrorMessages()} ${this.renderInput()}
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

        // In case it wasn't handled before
        this.handleEmptyValue();

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
                                ${this.multiple
                                    ? html`
                                          <input
                                              type="checkbox"
                                              id="${this.formElementId}"
                                              name="${this.name}"
                                              value="${key}"
                                              class="checkbox"
                                              ?checked="${this.value?.includes(key) ? true : false}"
                                              @input="${this.handleInputValue}"
                                              ?disabled=${this.disabled}
                                              ?required=${this.required} />
                                      `
                                    : html`
                                          <input
                                              type="radio"
                                              id="${this.formElementId}"
                                              name="${this.name}"
                                              value="${key}"
                                              class="radio"
                                              ?checked="${this.value?.includes(key) ? true : false}"
                                              @input="${this.handleInputValue}"
                                              ?disabled=${this.disabled}
                                              ?required=${this.required} />
                                      `}
                                ${this.items[key]}
                            </label>
                        `,
                    )}
                `;
            default:
                console.warn(
                    `Unsupported display mode: ${this._displayMode}. Defaulting to 'dropdown'.`,
                );
                break;
        }
    }

    handleEmptyValue() {
        // If the value for a single-select dropdown is empty, then show either the first item
        // or the item for the empty value
        if (this._displayMode === 'dropdown' && !this.multiple && this.value === '') {
            const emptyItem = this.items[''];
            this.value = emptyItem ? emptyItem : Object.keys(this.items)[0];
            this.generateDataValue();
        }

        // For this.multiple === true and empty value, fix the value and dataValue if necessary
        if (this.isValueEmpty() && !!this.multiple && this.dataValue !== '[]') {
            if (!this.isValueEmptyArray()) {
                this.value = [];
            }
            this.generateDataValue();
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

                label a {
                    text-decoration: underline;
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
                      .filter((checkbox) => checkbox.checked)
                      .map((checkbox) => checkbox.value)
                : e.target.value;
        }

        console.log('handleInputValue this.value', this.value);
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
                // Disabled, because it causes race conditions!
                // case 'items':
                // case 'multiple':
                //     this.adaptValueForMultiple();
                //     break;
                case 'items':
                case 'multiple':
                    this.handleEmptyValue();
                    break;
                case 'value': {
                    console.log('update propName', propName);
                    console.log('update this.value', this.value);
                    this.handleEmptyValue();
                    this.generateDataValue();

                    const changeEvent = new CustomEvent('change', {
                        detail: {value: this.value},
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

    generateDataValue() {
        if (this.multiple) {
            this.dataValue = stringifyForDataValue(this.value);
            console.log('generateDataValue this.value', this.value);
            console.log('generateDataValue this.dataValue', this.dataValue);
        } else {
            this.dataValue = this.value;
        }
    }
}

commonUtils.defineCustomElement('dbp-form-enum-element', DbpEnumElement);
