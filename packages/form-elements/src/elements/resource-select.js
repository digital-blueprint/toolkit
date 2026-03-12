import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ref, createRef} from 'lit/directives/ref.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpResourceSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.value = '';
        this.resourceSelectRef = createRef();
        this.resourcePath = '';
        this.includeLocal = undefined;
        this.perPage = 30;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
            includeLocal: {type: String, attribute: 'include-local'},
            perPage: {type: Number, attribute: 'per-page'},
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

    renderInput() {
        let buildUrl = (select, url) => {
            url +=
                '?' +
                new URLSearchParams({
                    perPage: this.perPage,
                    ...(this.includeLocal !== undefined && {includeLocal: this.includeLocal}),
                });
            return url;
        };

        return html`
            <dbp-resource-select
                ${ref(this.resourceSelectRef)}
                subscribe="auth"
                lang="${this.lang}"
                resource-path="${this.resourcePath}"
                .buildUrl="${buildUrl}"
                @change="${(event) => {
                    let value = event.target.value;
                    if (!(value instanceof String) && typeof value !== 'string') {
                        return;
                    }
                    if (value.startsWith('/base/organizations/')) {
                        value = value.replace('/base/organizations/', '');
                    }
                    this.value = value;
                }}"
                entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
        `;
    }
}
