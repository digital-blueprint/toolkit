import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';

export class DbpTimeElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A time field';
    }

    static get properties() {
        return {
            ...super.properties,
        };
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    align-items: center;
                }

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                }

                :host([layout-type='inline']) input[type='time'] {
                    width: min-content;
                }

                input[disabled] {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `,
        ];
    }

    renderInput() {
        return html`
            <input
                type="time"
                id="${this.formElementId}"
                name="${this.name}"
                .value="${this.value}"
                @input="${this.handleInputValue}"
                ?disabled=${this.disabled}
                ?required=${this.required} />
        `;
    }
}
