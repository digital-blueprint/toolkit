import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpStringView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A string field';
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

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                    white-space: nowrap;
                }
            `,
        ];
    }

    renderValue() {
        return html`
            <div style="white-space: pre-line">${this.value}</div>
        `;
    }
}
