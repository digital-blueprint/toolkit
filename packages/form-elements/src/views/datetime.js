import {html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpDateTimeView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A datetime field';
    }

    renderValue() {
        let date = this.value;

        // If date is a non-empty string, parse it to a Date object
        if (typeof date === 'string' && date !== '') {
            date = new Date(date);
        }

        // Format the date using toLocaleString with de-DE locale
        const dateTimeString = !date || date === '' ? '-' : date.toLocaleString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            hour12: false
        });

        return html`${dateTimeString}`;
    }
}

commonUtils.defineCustomElement('dbp-form-datetime-view', DbpDateTimeView);
