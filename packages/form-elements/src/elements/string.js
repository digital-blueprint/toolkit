import {html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpStringElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A string field';
        this.rows = 1;
    }

    static get properties() {
        return {
            ...super.properties,
            rows: {type: Number},
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
                          @input="${this.handleInputValue}"
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
                          @input="${this.handleInputValue}"
                          ?disabled=${this.disabled}
                          ?required=${this.required} />
                  `}
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-string-element', DbpStringElement);
