import {css, html} from 'lit';
import {ScopedElementsMixin, combineURLs} from '@dbp-toolkit/common';
import {DbpBaseView} from '../base-view.js';

export class DbpResourceSelectView extends ScopedElementsMixin(DbpBaseView) {
    constructor() {
        super();
        this.label = 'A resource field';
        this.name = '';
        this.entryPointUrl = '';
        this.resourcePath = '';
        this._abortController = null;
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Re-fetch the display name whenever the value, auth, entry point or
        // language changes, since any of them affects the resolved resource.
        if (
            changedProperties.has('value') ||
            changedProperties.has('auth') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('lang')
        ) {
            void this.fetchResourceName(this.value);
        }
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
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

    async fetchResourceName(value) {
        // Cancel any request that is still in flight so only the latest one
        // can update the displayed name.
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }

        const token = this.auth?.token;
        if (!value || !this.entryPointUrl || !token) {
            return;
        }

        const url = combineURLs(
            combineURLs(this.entryPointUrl, this.resourcePath),
            encodeURIComponent(value),
        );

        this._abortController = new AbortController();
        const signal = this._abortController.signal;

        try {
            const response = await fetch(url, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': this.lang,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            this.name = data.name ? data.name : value;
        } catch (error) {
            // Ignore aborted requests, they were superseded by a newer one.
            if (error.name === 'AbortError') {
                return;
            }
            this.name = value;
        }
    }
}
