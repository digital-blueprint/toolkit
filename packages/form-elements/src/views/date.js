import {html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpDateView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A date field';
    }

    renderValue() {
        let date = this.value;

        // If date is a non-empty string, parse it to a Date object
        if (typeof date === 'string' && date !== '') {
            date = new Date(date);
        }

        const dateString = !date || date === '' ? '-' : date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return html`${dateString}`;
    }
}

commonUtils.defineCustomElement('dbp-form-date-view', DbpDateView);
