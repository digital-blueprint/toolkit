import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpStringElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A string field';
        this.rows = 1;
        this.placeholder = '';
        this.maxLength = null;
    }

    static get properties() {
        return {
            ...super.properties,
            rows: {type: Number},
            placeholder: {type: String},
            maxLength: {type: Number, attribute: 'maxlength'},
        };
    }

    renderInput() {
        return html`
            ${this.rows > 1
                ? html`
                      <textarea
                          id="${this.formElementId}"
                          name="${this.name}"
                          rows="${this.rows}"
                          placeholder="${this.placeholder}"
                          @input="${this.handleInputValue}"
                          maxlength="${this.maxLength}"
                          ?disabled=${this.disabled}
                          ?required=${this.required}>${this.value}</textarea
                      >
                  `
                : html`
                      <input
                          type="text"
                          id="${this.formElementId}"
                          name="${this.name}"
                          .value="${this.value}"
                          placeholder="${this.placeholder}"
                          @input="${this.handleInputValue}"
                          ?disabled=${this.disabled}
                          ?required=${this.required} />
                  `}
        `;
    }
}
