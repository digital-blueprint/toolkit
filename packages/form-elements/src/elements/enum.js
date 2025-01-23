import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base.js';

export class DbpEnumElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A enum field';
        this.items = {};
    }

    static get properties() {
        return {
            ...super.properties,
            items: {type: Object},
        };
    }

    setItems(items) {
        this.items = items;
    }

    renderInput() {
        return html`
            <select
                id="${this.formElementId}"
                name="${this.name}"
                @change="${this.handleInputValue}"
                ?required=${this.required}>
                ${Object.keys(this.items).map(
                    (key) => html`
                        <option value="${key}" ?selected=${key === this.value}>
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
                        this.value = Object.keys(this.items)[0];
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }
}

commonUtils.defineCustomElement('dbp-form-enum-element', DbpEnumElement);
