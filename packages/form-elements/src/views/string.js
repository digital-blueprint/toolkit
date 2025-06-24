import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpStringView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A string field';
    }

    renderValue() {
        return html`
            <div style="white-space: pre-line">${this.value}</div>
        `;
    }
}
