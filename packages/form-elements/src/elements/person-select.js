import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpPersonSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.value = '';
        this.multiple = false;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            multiple: {type: Boolean},
        };
    }

    static get scopedElements() {
        return {
            'dbp-resource-select': ResourceSelect,
        };
    }

    static get styles() {
        return [...super.styles];
    }

    normalizePersonId(value) {
        if (typeof value !== 'string') {
            return '';
        }

        return value.startsWith('/base/people/') ? value.replace('/base/people/', '') : value;
    }

    normalizePersonValues(value = this.value) {
        const values = Array.isArray(value) ? value : value ? [value] : [];

        return [
            ...new Set(values.map((personId) => this.normalizePersonId(personId)).filter(Boolean)),
        ];
    }

    getPersonSelectValues() {
        return this.normalizePersonValues().map((personId) => `/base/people/${personId}`);
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

    dispatchValueChange() {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    fieldName: this.name,
                    name: this.name,
                    value: this.value,
                    values: this.normalizePersonValues(),
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    handlePersonChange(event) {
        event.stopPropagation();

        const resourceValues = Array.isArray(event.detail?.values)
            ? event.detail.values
            : event.detail?.value
              ? [event.detail.value]
              : [];

        const personIds = this.normalizePersonValues(resourceValues);

        this.value = this.multiple ? personIds : (personIds[0] ?? '');
        this.dispatchValueChange();
    }

    isValueEmpty() {
        return this.normalizePersonValues().length === 0;
    }

    renderInput() {
        return html`
            <dbp-resource-select
                .auth=${this.auth ?? {}}
                .values=${this.getPersonSelectValues()}
                ?multiple=${this.multiple}
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
