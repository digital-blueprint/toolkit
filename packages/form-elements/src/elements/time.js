import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpTimeElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A time field';
    }

    static get properties() {
        return {
            ...super.properties,
        };
    }

    renderInput() {
        return html`
            <input
                type="time"
                id="${this.formElementId}"
                name="${this.name}"
                .value="${this.value}"
                @input="${this.handleInputValue}"
                ?disabled=${this.disabled}
                ?required=${this.required} />
        `;
    }
}
