import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpPersonSelectView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A string field';
        this.name = '';
    }

    async connectedCallback() {
        super.connectedCallback();

        if (this.value !== '' && this.auth.token) {
            this.fetchPersonName(this.value);
        }
    }

    updated(changedProperties) {
        if (changedProperties.get('name')) {
            this.name = this.name || '';
        } else if (changedProperties.get('auth') && this.name === '') {
            this.fetchPersonName(this.value);
        }
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            name: {type: String, attribute: 'name'},
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
            <div style="white-space: pre-line">${this.name}</div>
        `;
    }

    fetchPersonName(value) {
        fetch(
            value.startsWith('/base/people/')
                ? this.entryPointUrl + value
                : this.entryPointUrl + '/base/people/' + value,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.auth.token}`,
                },
            },
        )
            .then((response) => response.json())
            .then((data) => {
                this.name = data.givenName + ' ' + data.familyName || '';
            });
    }
}
