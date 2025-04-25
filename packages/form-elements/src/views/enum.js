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

    render() {
        if (this.hidden) {
            return html``;
        }

        // Check if the label slot has any assigned content
        const hasLabelSlot = this.querySelector('[slot="label"]') !== null;

        return html`
            <fieldset>
                ${hasLabelSlot
                    ? html`
                          <slot name="label"></slot>
                      `
                    : html`
                          <label>${this.label}</label>
                      `}
                ${this.renderValue()}
            </fieldset>
        `;
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
