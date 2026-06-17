import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ref, createRef} from 'lit/directives/ref.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpPersonSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.value = '';
        this.personSelectRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
    }

    static get scopedElements() {
        return {
            'dbp-resource-select': ResourceSelect,
        };
    }

    firstUpdated() {
        super.firstUpdated();
    }

    static get styles() {
        return [...super.styles];
    }

    getPersonSelectValue() {
        if (!this.value) {
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
        let text = person['givenName'] ?? '';
        if (person['familyName']) {
            text += ` ${person['familyName']}`;
        }

        return text;
    }

    renderInput() {
        return html`
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
                @change="${(event) => {
                    let value = event.detail?.value ?? '';
                    if (!(value instanceof String) && typeof value !== 'string') {
                        return;
                    }
                    if (value.startsWith('/base/people/')) {
                        value = value.replace('/base/people/', '');
                    }
                    this.value = value;
                }}"
                entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
        `;
    }
}
