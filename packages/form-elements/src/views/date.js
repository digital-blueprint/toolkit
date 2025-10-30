import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpDateView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A date field';
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
        let date = this.value;

        // If date is a non-empty string, parse it to a Date object
        if (typeof date === 'string' && date !== '') {
            date = new Date(date);
        }

        const dateString =
            !date || date === ''
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
