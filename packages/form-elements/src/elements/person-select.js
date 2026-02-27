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

    renderInput() {
        // With the textarea tag, it's advised to use `.value` to set the value!
        // https://lit.dev/docs/templates/expressions/#binding-properties
        return html`
            <dbp-person-select
                ${ref(this.personSelectRef)}
                subscribe="auth"
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
