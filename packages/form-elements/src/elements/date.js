import {html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpDateElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A date field';
        this.min = '';
        this.max = '';
    }

    static get properties() {
        return {
            ...super.properties,
            min: {type: String},
            max: {type: String},
        };
    }

    formatDateValue(val) {
        if (!val) return '';

        // Check if the value is a number (timestamp)
        const timestamp = Number(val);
        if (!isNaN(timestamp)) {
            // Convert timestamp to Date object
            const date = new Date(timestamp);

            // Check if it's a valid date
            if (!isNaN(date.getTime())) {
                // Format date as YYYY-MM-DD (required format for input type="date")
                return date.toISOString().split('T')[0];
            }
        }

        // If it's not a timestamp or invalid, return the original value
        return val;
    }

    renderInput() {
        const formattedValue = this.formatDateValue(this.value);
        const minValue = this.formatDateValue(this.min);
        const maxValue = this.formatDateValue(this.max);

        return html`
            <input
                type="date"
                id="${this.formElementId}"
                name="${this.name}"
                min="${minValue}"
                max="${maxValue}"
                .value="${formattedValue}"
                @input="${this.handleInputValue}"
                ?disabled=${this.disabled}
                ?required=${this.required} />
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-date-element', DbpDateElement);
