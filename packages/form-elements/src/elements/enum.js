import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {stringifyForDataValue} from "../utils.js";

export class DbpEnumElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A enum field';
        this.items = {};
        this.multiple = false;
        this.dataValue = '';
        this.selectRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            multiple: {type: Boolean},
            dataValue: {type: String, attribute: 'data-value', reflect: true},
            items: {type: Object},
        };
    }

    setItems(items) {
        this.items = items;
    }

    renderInput() {
        return html`
            <select
                ${ref(this.selectRef)}
                id="${this.formElementId}"
                name="${this.name}"
                @change="${this.handleInputValue}"
                ?required=${this.required}
                ?multiple=${this.multiple}>
                ${Object.keys(this.items).map(
                    (key) => html`
                        <option value="${key}" ?selected=${this.multiple ? this.value?.includes(key) : key === this.value}>
                            ${this.items[key]}
                        </option>
                    `,
                )}
            </select>
        `;
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
            `,
        ];
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'items':
                    if (!this.value) {
                        this.value = this.multiple ? [] : Object.keys(this.items)[0];
                    } else if (this.multiple && !Array.isArray(this.value)) {
                        // Convert single value to an array if switching to multiple mode
                        this.value = [this.value];
                    } else if (!this.multiple && Array.isArray(this.value)) {
                        // Convert array to a single value if switching to single mode
                        this.value = this.value[0] || '';
                    }
                    break;
                case 'multiple':
                    if (this.multiple && !Array.isArray(this.value)) {
                        this.value = this.value ? [this.value] : [];
                    } else if (!this.multiple && Array.isArray(this.value)) {
                        this.value = this.value[0] || '';
                    }
                    break;
                case 'value':
                    if (this.multiple) {
                        const data = Array.from(this.selectRef.value.selectedOptions).map(option => option.value);
                        this.dataValue = stringifyForDataValue(data);
                    } else {
                        this.dataValue = this.value;
                    }

                    break;
            }
        });

        super.update(changedProperties);
    }
}

commonUtils.defineCustomElement('dbp-form-enum-element', DbpEnumElement);
