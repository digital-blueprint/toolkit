import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ref, createRef} from 'lit/directives/ref.js';
import {PersonSelect} from '@dbp-toolkit/person-select';

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
            'dbp-person-select': PersonSelect,
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

    renderInput() {
        return html`
            <dbp-person-select
                ${ref(this.personSelectRef)}
                .auth=${this.auth ?? {}}
                .value=${this.getPersonSelectValue()}
                ?disabled=${this.disabled}
                lang="${this.lang}"
                @change="${(event) => {
                    let value = event.target.value;
                    if (!(value instanceof String) && typeof value !== 'string') {
                        return;
                    }
                    if (value.startsWith('/base/people/')) {
                        value = value.replace('/base/people/', '');
                    }
                    this.value = value;
                }}"
                entry-point-url="${this.entryPointUrl}"></dbp-person-select>
        `;
    }
}
