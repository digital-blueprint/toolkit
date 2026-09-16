import {css, html, unsafeCSS} from 'lit';
import {ScopedElementsMixin, getIconSVGURL} from '@dbp-toolkit/common';
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
        // Generate a unique id per instance to avoid DOM id collisions across components
        this.formElementId = `form-element-${Math.random().toString(36).slice(2, 10)}`;
        this.label = '';
        this.items = {};
        this.multiple = false;
        // Since this.multiple === false, we set an empty string as this.value
        /** @type {string | string[]} */
        this.value = '';
        this.dataValue = '';
        this.displayMode = 'dropdown';
        this.selectRef = createRef();
        this.$select = null;
        select2(window, $);
        this.tagPlaceholder = null;
        this.disabledItems = [];
        // Index of the tag that was removed last, used to restore the focus afterwards
        /** @type {number|null} */
        this._focusIndexAfterRemove = null;
    }

    static get properties() {
        return {
            ...super.properties,
            multiple: {type: Boolean},
            // We will treat this.value as an object and will not reflect it outside
            // Although we might write a string into this.value anyway for this.multiple === false
            value: {type: Object, reflect: false},
            // That's the only thing we will reflect, and which will be used for gathering the data in the form
            dataValue: {type: String, attribute: 'data-value', reflect: true},
            displayMode: {type: String, attribute: 'display-mode'},
            items: {type: Object},
            tagPlaceholder: {type: Object},
            disabledItems: {type: Array},
        };
    }

    $(selector) {
        return $(this.renderRoot.querySelector(selector));
    }

    closeSelect2() {
        if (this.select2IsInitialized()) {
            this.$select.select2('close');
        }
    }

    // Can be used to set items from the outside
    setItems(items) {
        this.items = {...items};
    }

    isValueEmptyArray() {
        return Array.isArray(this.value) && this.value.length === 0;
    }

    isValueEmpty() {
        return this.value === '' || this.isValueEmptyArray();
    }

    /**
     * Determines whether the empty value should be omitted from the form submission.
     * This is the case when the display mode is 'list', the field is *not* required, and the value is empty.
     * @returns {boolean}
     */
    shouldOmitEmptyValue() {
        return (
            !this.required && !this.multiple && this.displayMode === 'list' && this.isValueEmpty()
        );
    }

    connectedCallback() {
        super.connectedCallback();

        void this.updateComplete.then(() => {
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

        this.$select.off('change.dbp-enum');

        this.$select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                allowClear: true,
                placeholder:
                    this.tagPlaceholder?.[this.lang] ||
                    this._i18n.t('render-form.enum.select-placeholder'),
                dropdownParent: this.$('#select-dropdown'),
                data: commonUtils.keyValueObjectToSelect2DataArray(this.items),
            })
            // https://select2.org/programmatic-control/events
            // select2:clear will trigger select2:unselect and change for each selected item
            .on('change.dbp-enum', (event) => {
                this.handleInputValue(event);
                this.updateSelect2Buttons();
            });

        // Set the value after initialization
        this.$select.val(this.value).trigger('change');

        return true;
    }

    updateSelect2Buttons() {
        this._a('.select2-selection__choice').forEach((choice, index) => {
            const removeButton = choice.querySelector('.select2-selection__choice__remove');
            const display = choice.querySelector('.select2-selection__choice__display');
            if (!removeButton || !display) return;

            const label = this._i18n.t('render-form.enum.remove-item', {
                item: display.textContent.trim(),
                lng: this.lang,
            });
            removeButton.setAttribute('aria-label', label);
            removeButton.setAttribute('title', label);
            removeButton.setAttribute('tabindex', '0');
            // Remember which tag was removed, so we can restore the focus afterwards
            removeButton.onclick = () => {
                this._focusIndexAfterRemove = index;
            };
        });

        this.restoreFocusAfterRemove();

        const clearButton = /** @type {HTMLButtonElement|null} */ (
            this.renderRoot.querySelector('.select2-selection__clear')
        );
        if (!clearButton) return;

        const label = this._i18n.t('render-form.enum.remove-all-items', {lng: this.lang});
        clearButton.setAttribute('aria-label', label);
        clearButton.setAttribute('title', label);
        clearButton.setAttribute('tabindex', '0');
        clearButton.onkeydown = (event) => {
            if (!['Enter', ' '].includes(event.key)) return;

            event.preventDefault();
            event.stopPropagation();
            clearButton.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        };
        // After clearing all tags there is no tag left, so the focus goes to the search field
        clearButton.onmousedown = () => {
            this._focusIndexAfterRemove = 0;
        };

        this.moveClearButtonToEnd(clearButton);
    }

    /**
     * Select2 prepends the "remove all items" button to the selection, which would make it the
     * first tab stop. We move it to the end of the selection, so the focus order follows the
     * logical order: remove first tag, remove second tag, ..., search field, remove all items.
     * The button is positioned absolutely, so moving it doesn't change its appearance.
     *
     * @param {HTMLButtonElement} clearButton
     */
    moveClearButtonToEnd(clearButton) {
        const selection = this.renderRoot.querySelector('.select2-selection--multiple');
        if (!selection || selection.lastElementChild === clearButton) return;

        selection.appendChild(clearButton);
    }

    /**
     * Restores the focus after a tag was removed: it moves to the tag that took the place of the
     * removed one (or to the last tag), and if no tag is left, to the select2 search field itself.
     */
    restoreFocusAfterRemove() {
        const index = this._focusIndexAfterRemove;
        if (index === null) return;

        this._focusIndexAfterRemove = null;
        const removeButtons = this._a('.select2-selection__choice__remove');
        const target =
            removeButtons[index] ||
            removeButtons[removeButtons.length - 1] ||
            this.renderRoot.querySelector('.select2-search__field');

        if (target) {
            target.focus();
        }
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
                return html`
                    <div class="select-wrapper">
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
                                        ?selected=${
                                            this.multiple
                                                ? this.value?.includes(key)
                                                : key === this.value
                                        }>
                                        ${this.items[key]}
                                    </option>
                                `,
                            )}
                        </select>
                    </div>
                `;
            case 'list':
                return html`
                    ${Object.keys(this.items).map(
                        (key) => html`
                            <label
                                class="checkboxItem ${
                                    this.disabledItems.includes(key) ? 'disabled' : ''
                                }">
                                ${
                                    this.multiple
                                        ? html`
                                              <input
                                                  type="checkbox"
                                                  id="${this.formElementId}"
                                                  name="${this.name}"
                                                  value="${key}"
                                                  class="checkbox"
                                                  ?checked="${!!this.value?.includes(key)}"
                                                  @input="${this.handleInputValue}"
                                                  ?disabled=${
                                                      this.disabled ||
                                                      this.disabledItems.includes(key)
                                                  }
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
                                                  ?disabled=${
                                                      this.disabled ||
                                                      this.disabledItems.includes(key)
                                                  }
                                                  ?required=${this.required} />
                                          `
                                }
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
                return html``;
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
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    margin: 0;
                    align-items: center;
                    flex-wrap: wrap;
                }

                @media (max-width: 380px) {
                    :host([layout-type='inline']) fieldset {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                }

                :host([layout-type='inline']) label {
                    white-space: nowrap;
                    margin-bottom: 0;
                    flex: 0 0 auto;
                }

                /* allows .select2-container to fully expand */
                :host([layout-type='inline']) #select-dropdown {
                    order: 1;
                    flex: 0 0 auto;
                    min-width: 0;
                    min-height: 0;
                    overflow: visible;
                }

                :host([layout-type='inline']) .select2,
                :host([layout-type='inline']) .select2-container {
                    order: 2;
                    flex: 1 1 200px;
                    min-width: 0;
                    max-width: 100%;
                }

                :host([layout-type='inline']) .checkboxItem:not(:last-of-type) {
                    margin-bottom: 0;
                }

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

                .checkboxItem.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .checkboxItem.disabled input {
                    cursor: not-allowed;
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
                    top: 4px;
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

                .select2-container--default .select2-selection--multiple {
                    border-radius: 0;
                    border-color: var(--dbp-override-content);
                    padding: 0;
                }

                /*  .select2-container--default .select2-search--inline .select2-search__field {
                    !* Needed for the placeholder to be visible. The width of the input is set to 0 by js. *!
                    !*width is the reason for the placeholder to shrink, so I removed it*!
                }*/

                .select-wrapper select {
                    background: none;
                    padding: 2px 5px;
                    font-weight: 300;
                }

                :host(:not([multiple])) .select-wrapper {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                }

                :host(:not([multiple])) .select-wrapper select {
                    appearance: none;
                    padding-right: 1.75em;
                    background-color: var(--dbp-background);
                }

                :host(:not([multiple])) .select-wrapper::after {
                    content: '';
                    position: absolute;
                    right: 0.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1em;
                    height: 1em;
                    pointer-events: none;
                    background-color: currentColor;
                    mask: url('${unsafeCSS(getIconSVGURL('chevron-down'))}') center/contain
                        no-repeat;
                    -webkit-mask: url('${unsafeCSS(getIconSVGURL('chevron-down'))}') center/contain
                        no-repeat;
                }
            `,
        ];
    }

    handleInputValue(e) {
        // Only handle user-triggered events and events from Select2 in tag mode
        if (e.isTrusted !== true && !this.isDisplayModeTags()) return;

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

        this.generateDataValue();

        // Pass the value and field name in the event detail
        const changeEvent = new CustomEvent('change', {
            detail: {value: this.value, fieldName: this.name},
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(changeEvent);
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
                    break;
                }
                case 'lang':
                    this.updateSelect2Buttons();
                    break;
            }
        });

        super.update(changedProperties);
    }

    generateDataValue() {
        if (this.multiple) {
            this.dataValue = stringifyForDataValue(this.value);
        } else {
            this.dataValue = Array.isArray(this.value) ? (this.value[0] ?? '') : this.value;
        }
    }
}
