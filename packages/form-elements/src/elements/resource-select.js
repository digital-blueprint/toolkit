import {html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {DbpBaseElement} from '../base-element.js';
import {ResourceSelect} from '@dbp-toolkit/resource-select';

export class DbpResourceSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.value = '';
        this.resourcePath = '';
        this.perPage = 100;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
            perPage: {type: Number, attribute: 'per-page'},
        };
    }

    // Override this to add query parameters to the collection request, same as
    // the getCollectionQueryParameters method on dbp-resource-select.
    getCollectionQueryParameters(select) {
        return {};
    }

    static get scopedElements() {
        return {
            'dbp-resource-select': ResourceSelect,
        };
    }

    static get styles() {
        return [...super.styles];
    }

    _getResourceSelectValue() {
        if (!this.value) {
            return null;
        }

        return `${this.resourcePath}/${encodeURIComponent(this.value)}`;
    }

    renderInput() {
        return html`
            <dbp-resource-select
                .auth=${this.auth}
                .value=${this._getResourceSelectValue()}
                .perPage=${this.perPage}
                lang="${this.lang}"
                ?disabled=${this.disabled}
                resource-path="${this.resourcePath}"
                .getCollectionQueryParameters="${this.getCollectionQueryParameters.bind(this)}"
                @change="${(event) => {
                    let value = event.target.value;
                    if (value) {
                        const segments = value.split('/');
                        this.value = decodeURIComponent(segments[segments.length - 1]);
                    } else {
                        this.value = '';
                    }
                }}"
                entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
        `;
    }
}
