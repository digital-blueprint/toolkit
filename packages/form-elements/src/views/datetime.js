import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpDateTimeView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A datetime field';
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
        const date = this.value ? new Date(this.value) : null;

        // Format the date using toLocaleString with de-DE locale
        const dateTimeString =
            date === null
                ? '-'
                : date.toLocaleString('de-DE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZoneName: 'short',
                      hour12: false,
                  });

        return html`
            ${dateTimeString}
        `;
    }
}
