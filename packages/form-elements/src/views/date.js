import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpDateView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A date field';
        /** @type {string} */
        this.value = '';
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    margin: 0;
                }
            `,
        ];
    }

    renderValue() {
        const date = this.value ? new Date(String(this.value)) : null;

        const dateString =
            date === null
                ? '-'
                : date.toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                  });

        return html`
            ${dateString}
        `;
    }
}
