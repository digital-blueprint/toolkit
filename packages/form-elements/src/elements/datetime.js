import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

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

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    align-items: center;
                }

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                }

                :host([layout-type='inline']) .description {
                    margin-bottom: 0;
                }

                :host([layout-type='inline']) input[type='datetime-local'] {
                    width: min-content;
                }
            `,
        ];
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
                ?disabled=${this.disabled}
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
