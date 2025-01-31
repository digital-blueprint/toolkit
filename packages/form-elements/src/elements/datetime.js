import {html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base.js';

export class DbpDateTimeElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A datetime field';
        this.dataValue = '';
    }

    static get properties() {
        return {
            ...super.properties,
            dataValue: {type: String, attribute: 'data-value', reflect: true},
        };
    }

    isoToDatetimeLocal(isoString) {
        const date = new Date(isoString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return '';
        }

        // Adjust for local timezone
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);

        // Format to YYYY-MM-DDTHH:mm
        return localDate.toISOString().slice(0, 16);
    }

    renderInput() {
        const formattedValue = this.isoToDatetimeLocal(this.value);

        return html`
            <input
                type="datetime-local"
                id="${this.formElementId}"
                name="${this.name}"
                .value="${formattedValue}"
                @input="${this.handleInputValue}"
                ?required=${this.required} />
        `;
    }

    fixDateTimeValue(val) {
        if (!val) return '';

        const date = new Date(val);
        if (isNaN(date.getTime())) return ''; // Invalid date

        // Return ISO 8601 string including a timezone for later use (e.g. in Blob metadata)
        return date.toISOString();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'value':
                    this.dataValue = this.fixDateTimeValue(this.value);
                    break;
            }
        });

        super.update(changedProperties);
    }
}

commonUtils.defineCustomElement('dbp-form-datetime-element', DbpDateTimeElement);
