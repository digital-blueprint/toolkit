import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpPersonSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        /** @type {string | string[]} */
        this.value = '';
        this.multiple = false;
        this._personSelectValues = [];
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            // With "multiple" the value is an array, which must not be reflected: the attribute
            // would become a comma separated string and the attribute observer of
            // AdapterLitElement would write that string back into the value, turning the whole
            // selection into a single unknown person identifier
            value: {type: String, reflect: false},
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
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);

        if (!changedProperties.has('multiple') && !changedProperties.has('value')) {
            return;
        }

        // The value can be handed in from the outside as a resource path like
        // "/base/people/<id>", as a plain identifier, or as an array of both. We always keep it
        // normalized to plain identifiers, so whoever reads the form data never sees the path.
        const personIds = this.normalizePersonValues(this.value);

        if (!this.multiple) {
            this.value = personIds[0] ?? '';
            return;
        }

        // Only assign if the content really changed, since lit compares arrays by identity and
        // would otherwise schedule an endless stream of updates.
        const currentPersonIds = Array.isArray(this.value) ? this.value : null;
        if (
            currentPersonIds === null ||
            currentPersonIds.length !== personIds.length ||
            currentPersonIds.some((personId, index) => personId !== personIds[index])
        ) {
            this.value = personIds;
        }
    }

    normalizePersonValues(value = this.value) {
        const values = Array.isArray(value) ? value : value ? [value] : [];

        return [
            ...new Set(values.map((personId) => this.normalizePersonId(personId)).filter(Boolean)),
        ];
    }

    getPersonSelectValues() {
        const values = this.normalizePersonValues().map((personId) => `/base/people/${personId}`);

        if (
            values.length !== this._personSelectValues.length ||
            values.some((value, index) => value !== this._personSelectValues[index])
        ) {
            this._personSelectValues = values;
        }

        return this._personSelectValues;
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
        const currentPersonIds = this.normalizePersonValues();

        if (
            personIds.length === currentPersonIds.length &&
            personIds.every((personId, index) => personId === currentPersonIds[index])
        ) {
            return;
        }

        if (Array.isArray(event.detail?.values)) {
            this._personSelectValues = event.detail.values;
        }

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
                .multiple=${this.multiple}
                .values=${this.getPersonSelectValues()}
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
