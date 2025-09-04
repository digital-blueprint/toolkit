import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {stringifyForDataValue} from '../utils.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import select2 from 'select2';
import select2LangDe from '../i18n/de/select2';
import select2LangEn from '../i18n/en/select2';

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
        this.$select = null;
        select2(window, $);
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

    $(selector) {
        return $(this.shadowRoot.querySelector(selector));
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

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.$select = this.$('#' + this.formElementId);
            this.initSelect2IfNeeded();
        });
    }

    isDisplayModeTags() {
        return ['tags', 'tag'].includes(this.displayMode);
    }

    initSelect2IfNeeded() {
        if (this.isDisplayModeTags() && !this.select2IsInitialized()) {
            this.initSelect2();
        }
    }

    select2IsInitialized() {
        return this.$select !== null && this.$select.hasClass('select2-hidden-accessible');
    }

    /**
     * Initializes the Select2 selector
     *
     * @param ignorePreset
     */
    initSelect2(ignorePreset = false) {
        if (this.$select === null) {
            return false;
        }

        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this.$select && this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
            this.$select.off('select2:select');
            this.$select.off('select2:closing');
        }

        this.$select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                allowClear: true,
                placeholder: this._i18n.t('render-form.enum.select-placeholder'),
                dropdownParent: this.$('#select-dropdown'),
                data: commonUtils.keyValueObjectToSelect2DataArray(this.items),
            })
            // https://select2.org/programmatic-control/events
            // select2:clear will trigger select2:unselect and change for each selected item
            .on('change', this.handleInputValue.bind(this));

        // Set the value after initialization
        this.$select.val(this.value).trigger('change');

        return true;
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
                              <span class="required-mark">
                                  ${this._i18n.t('render-form.base-object.required-field')}
                              </span>
                          `
                        : html``}
                </label>

                ${this.description
                    ? html`
                          <div class="description">
                              ${this.description}
                              ${this.required
                                  ? html`
                                        ${this._i18n.t('render-form.base-object.required-field')}
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
        const validModes = ['dropdown', 'list', 'tag', 'tags'];
        if (!validModes.includes(this.displayMode)) {
            console.warn(`Invalid display-mode: ${this.displayMode}. Defaulting to 'dropdown'.`);
            this._displayMode = 'dropdown';
        } else {
            this._displayMode = this.displayMode;
        }

        // In case it wasn't handled before
        this.handleEmptyValue();
        const select2CSS = commonUtils.getAbsoluteURL(select2CSSPath);

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
                                              ?checked="${!!this.value?.includes(key)}"
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
                                              ?checked="${!!this.value?.includes(key)}"
                                              @input="${this.handleInputValue}"
                                              ?disabled=${this.disabled}
                                              ?required=${this.required} />
                                      `}
                                ${this.items[key]}
                            </label>
                        `,
                    )}
                `;
            case 'tag':
            case 'tags':
                return html`
                    <link rel="stylesheet" href="${select2CSS}" />
                    <select
                        ${ref(this.selectRef)}
                        id="${this.formElementId}"
                        name="${this.name}"
                        class="select"
                        ?disabled=${this.disabled}
                        ?required=${this.required}
                        ?multiple=${this.multiple}></select>
                    <div id="select-dropdown"></div>
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
            commonStyles.getSelect2CSS(),
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

                .required-mark {
                    color: var(--dbp-danger);
                }

                #select-dropdown {
                    position: relative;
                }

                .select2-control.control {
                    width: 100%;
                }

                .select2-container--default
                    .select2-selection--multiple
                    .select2-selection__choice {
                    border-radius: 0;
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
        if (this.isDisplayModeTags()) {
            this.value = this.$select.val();
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
                // Disabled, because it causes race conditions!
                // case 'items':
                // case 'multiple':
                //     this.adaptValueForMultiple();
                //     break;
                case 'displayMode':
                    this.initSelect2IfNeeded();
                    break;
                case 'items':
                    this.handleEmptyValue();

                    // If the display mode is tags, we need to reinitialize Select2 to get in the new items
                    if (this.isDisplayModeTags()) {
                        this.initSelect2();
                    }
                    break;
                case 'multiple':
                    this.handleEmptyValue();
                    break;
                case 'value': {
                    this.handleEmptyValue();
                    this.generateDataValue();

                    if (this.select2IsInitialized()) {
                        this.$select.val(this.value).trigger('change');
                    }

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
        } else {
            this.dataValue = this.value;
        }
    }
}
