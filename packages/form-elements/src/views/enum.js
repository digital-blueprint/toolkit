import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpEnumView extends ScopedElementsMixin(DbpBaseView) {
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

    renderValue() {
        const value = this.value;
        const items = this.items;

        return html`
            ${Array.isArray(value)
                ? html`
                      <ul>
                          ${value.map(
                              (v) => html`
                                  <li>${items[v] || v}</li>
                              `,
                          )}
                      </ul>
                  `
                : items[value] || value}
        `;
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                /* Do we need ul styling? */
            `,
        ];
    }
}

commonUtils.defineCustomElement('dbp-form-enum-view', DbpEnumView);
