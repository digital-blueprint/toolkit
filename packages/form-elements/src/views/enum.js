import {css, html} from 'lit';
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
                ul {
                    list-style: none;
                    padding-left: 0;
                    margin: 0;
                }

                :host([display-style='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    margin: 0;
                }

                :host([display-style='tags']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    margin: 0;
                }

                :host([display-style='tags']) fieldset {
                    line-height: var(--dbp-enum-fieldset-line-height, 28px);
                }

                :host([display-style='tags']) ul {
                    display: flex;
                    gap: var(--dbp-enum-tags-gap, 0.5em);
                    flex-wrap: wrap;
                }

                :host([display-style='tags']) li {
                    background-color: var(--dbp-enum-tag-bg-color, #f2f2f2);
                    color: var(--dbp-enum-tag-color, #121212);
                    padding: var(--dbp-enum-tag-padding, 3px 8px);
                    border-radius: var(--dbp-enum-tag-border-radius, 4px);
                    flex-shrink: 0;
                    line-height: var(--dbp-enum-tag-line-height, 22px);
                }
            `,
        ];
    }
}
