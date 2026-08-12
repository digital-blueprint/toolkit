import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpPersonSelectView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.name = '';
        this.multiple = false;
        this._loadRequestId = 0;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            name: {type: String, attribute: 'name'},
            multiple: {type: Boolean},
        };
    }

    static get styles() {
        return [
            ...super.styles,
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
    updated(changedProperties) {
        super.updated(changedProperties);

        if (
            changedProperties.has('value') ||
            changedProperties.has('auth') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('multiple')
        ) {
            this.loadPersonNames();
        }
    }

    normalizeValues() {
        const values = Array.isArray(this.value) ? this.value : this.value ? [this.value] : [];

        const selectedValues = this.multiple ? values : values.slice(0, 1);

        return selectedValues.filter(Boolean);
    }

    getPersonUrl(personId) {
        return new URL(`/base/people/${personId}`, this.entryPointUrl).href;
    }

    async fetchPersonName(personId) {
        const response = await fetch(this.getPersonUrl(personId), {
            headers: {
                Accept: 'application/ld+json',
                Authorization: `Bearer ${this.auth.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const person = await response.json();
        const name = [person.givenName, person.familyName].filter(Boolean).join(' ').trim();

        return name || personId;
    }

    async loadPersonNames() {
        const personIds = this.normalizeValues();
        const loadRequestId = ++this._loadRequestId;

        if (personIds.length === 0) {
            this.name = '';
            return;
        }

        if (!this.entryPointUrl || !this.auth?.token) {
            this.name = personIds.join('\n');
            return;
        }

        const names = await Promise.all(
            personIds.map(async (personId) => {
                try {
                    return await this.fetchPersonName(personId);
                } catch (error) {
                    console.error(error);
                    return personId;
                }
            }),
        );

        if (loadRequestId === this._loadRequestId) {
            this.name = names.join('\n');
        }
    }

    renderValue() {
        return html`
            <div style="white-space: pre-line">${this.name}</div>
        `;
    }
}
