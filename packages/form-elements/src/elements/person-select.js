import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ref, createRef} from 'lit/directives/ref.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpPersonSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.value = '';
        this.multiple = false;
        this.selectedPeople = [];
        this.personSelectRef = createRef();
        this._loadGeneration = 0;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            value: {attribute: 'value'},
            multiple: {type: Boolean},
            selectedPeople: {state: true},
        };
    }

    static get scopedElements() {
        return {
            'dbp-resource-select': ResourceSelect,
        };
    }

    static get styles() {
        return [
            ...super.styles,
            css`
                .selected-people {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin: 0 0 0.5rem;
                    padding: 0;
                    list-style: none;
                }

                .selected-person {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.25rem 0.5rem;
                    border: 1px solid var(--dbp-border);
                    border-radius: 0.25rem;
                    background: var(--dbp-background);
                    color: var(--dbp-content);
                }

                .remove-person {
                    padding: 0;
                    border: 0;
                    background: transparent;
                    color: inherit;
                    font: inherit;
                    line-height: 1;
                    cursor: pointer;
                }

                .remove-person:disabled {
                    cursor: default;
                    opacity: 0.5;
                }
            `,
        ];
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (
            this.multiple &&
            (changedProperties.has('value') ||
                changedProperties.has('auth') ||
                changedProperties.has('entryPointUrl') ||
                changedProperties.has('multiple'))
        ) {
            this.loadSelectedPeople();
        }
    }

    normalizePersonId(value) {
        if (typeof value !== 'string') {
            return '';
        }

        return value.startsWith('/base/people/') ? value.replace('/base/people/', '') : value;
    }

    normalizeMultipleValue(value = this.value) {
        const values = Array.isArray(value) ? value : value ? [value] : [];

        return [
            ...new Set(values.map((personId) => this.normalizePersonId(personId)).filter(Boolean)),
        ];
    }

    getPersonSelectValue() {
        if (this.multiple || !this.value) {
            return '';
        }

        return this.value.startsWith('/base/people/') ? this.value : `/base/people/${this.value}`;
    }

    getPersonSearchQueryParameters(select, searchTerm) {
        return {
            search: searchTerm.trim(),
            sort: 'familyName',
        };
    }

    formatPerson(select, person) {
        let text = person.givenName ?? '';

        if (person.familyName) {
            text += ` ${person.familyName}`;
        }

        return text;
    }

    getPersonName(person, fallback) {
        const name = [person?.givenName, person?.familyName].filter(Boolean).join(' ').trim();
        return name || fallback;
    }

    getPersonUrl(personId) {
        return new URL(`/base/people/${personId}`, this.entryPointUrl).href;
    }

    async fetchPerson(personId) {
        if (!this.entryPointUrl || !this.auth?.token) {
            return null;
        }

        const response = await fetch(this.getPersonUrl(personId), {
            headers: {
                Accept: 'application/ld+json',
                Authorization: `Bearer ${this.auth.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json();
    }

    async loadSelectedPeople() {
        const personIds = this.normalizeMultipleValue();
        const generation = ++this._loadGeneration;

        if (personIds.length === 0) {
            this.selectedPeople = [];
            return;
        }

        if (!this.entryPointUrl || !this.auth?.token) {
            this.selectedPeople = personIds.map((personId) => ({
                id: personId,
                name: personId,
            }));
            return;
        }

        const selectedPeople = await Promise.all(
            personIds.map(async (personId) => {
                try {
                    const person = await this.fetchPerson(personId);
                    return {
                        id: personId,
                        name: this.getPersonName(person, personId),
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        id: personId,
                        name: personId,
                    };
                }
            }),
        );

        if (generation === this._loadGeneration) {
            this.selectedPeople = selectedPeople;
        }
    }

    dispatchValueChange() {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    fieldName: this.name,
                    name: this.name,
                    value: this.value,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    async handlePersonChange(event) {
        if (!this.multiple) {
            let value = event.detail?.value ?? '';

            if (typeof value !== 'string') {
                return;
            }

            this.value = this.normalizePersonId(value);
            return;
        }

        event.stopPropagation();

        const resourceValue = event.detail?.value;
        if (typeof resourceValue !== 'string' || resourceValue === '') {
            return;
        }

        const personId = this.normalizePersonId(resourceValue);
        const personIds = this.normalizeMultipleValue();

        if (!personIds.includes(personId)) {
            this.value = [...personIds, personId];

            const person = event.detail?.object;
            this.selectedPeople = [
                ...this.selectedPeople,
                {
                    id: personId,
                    name: this.getPersonName(person, personId),
                },
            ];

            this.dispatchValueChange();
        }

        await this.personSelectRef.value?.reset();
    }

    removePerson(personId) {
        this.value = this.normalizeMultipleValue().filter((value) => value !== personId);
        this.selectedPeople = this.selectedPeople.filter((person) => person.id !== personId);
        this.dispatchValueChange();
    }

    isValueEmpty() {
        if (this.multiple) {
            return this.normalizeMultipleValue().length === 0;
        }

        return !this.value;
    }

    renderSelectedPeople() {
        if (this.selectedPeople.length === 0) {
            return html``;
        }

        return html`
            <ul class="selected-people">
                ${this.selectedPeople.map(
                    (person) => html`
                        <li class="selected-person">
                            <span>${person.name}</span>
                            <button
                                class="remove-person"
                                type="button"
                                title="Remove ${person.name}"
                                aria-label="Remove ${person.name}"
                                ?disabled=${this.disabled}
                                @click=${() => this.removePerson(person.id)}>
                                ×
                            </button>
                        </li>
                    `,
                )}
            </ul>
        `;
    }

    renderInput() {
        return html`
            ${this.multiple ? this.renderSelectedPeople() : ''}
            <dbp-resource-select
                ${ref(this.personSelectRef)}
                .auth=${this.auth ?? {}}
                .value=${this.getPersonSelectValue()}
                ?disabled=${this.disabled}
                lang="${this.lang}"
                resource-path="/base/people"
                fetch-mode="search"
                .getSearchQueryParameters=${this.getPersonSearchQueryParameters}
                .formatResource=${this.formatPerson}
                @change=${this.handlePersonChange}
                entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
        `;
    }
}
