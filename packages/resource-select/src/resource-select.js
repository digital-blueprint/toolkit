import $ from 'jquery';
import select2 from 'select2';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2LangDe from '@dbp-toolkit/resource-select/src/i18n/de/select2';
import select2LangEn from '@dbp-toolkit/resource-select/src/i18n/en/select2';
import {
    AdapterLitElement,
    AuthMixin,
    combineURLs,
    LangMixin,
    MiniSpinner,
    ScopedElementsMixin,
} from '@dbp-toolkit/common';
import * as hydra from './hydra.js';

const SEARCH_DELAY = 300;
const MINIMUM_INPUT_LENGTH = 2;

export class ResourceSelect extends LangMixin(
    AuthMixin(ScopedElementsMixin(AdapterLitElement)),
    createInstance,
) {
    constructor() {
        super();
        this._resources = [];
        this._url = null;
        this._lang = null;
        this._isSearching = false;
        // Remembers the resource objects of the current selection, so they survive a new
        // search overwriting this._resources in search mode.
        this._selectedObjects = new Map();
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this._selectId = 'select-resource-' + commonUtils.makeId(24);

        this.auth = {};
        this.entryPointUrl = null;
        this.resourcePath = null;
        this.multiple = false;
        this.values = [];
        this.valueObjects = [];
        this.value = null;
        this.valueObject = null;
        this.disabled = false;
        this.perPage = 100;
        this.fetchMode = 'prefetch';

        this.noDefault = false;
        this.placeholder = null;

        // The selection we applied ourselves the last time. Comparing against it tells us whether
        // "value"/"values" were changed from the outside, without having to guess from the
        // changed properties (multiple writes can end up in the same update cycle).
        this._appliedValue = this.value;
        this._appliedValues = this.values;

        this._onDocumentClicked = this._onDocumentClicked.bind(this);
        select2(window, $);
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
            noDefault: {type: Boolean, attribute: 'no-default'},
            multiple: {type: Boolean, reflect: true},
            value: {type: String, reflect: true},
            values: {type: Array},
            disabled: {type: Boolean},
            perPage: {type: Number, attribute: 'per-page'},
            fetchMode: {type: String, attribute: 'fetch-mode'},
            placeholder: {type: String},
        };
    }

    static get scopedElements() {
        return {
            ...super.scopedElements,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    _getSelect2() {
        return this._$('#' + this._selectId);
    }

    _$(selector) {
        return $(this.renderRoot.querySelector(selector));
    }

    _IsSelect2Initialized(elm) {
        return elm !== null && elm.hasClass('select2-hidden-accessible');
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClicked);
        this._updateAll();
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }

    _onDocumentClicked(ev) {
        // Close the popup when clicking outside of select2
        if (!ev.composedPath().includes(this)) {
            const $select = this._getSelect2();
            if ($select.length && this._IsSelect2Initialized($select)) {
                $select.select2('close');
            }
        }
    }

    _clearSelect2() {
        const $select = this._getSelect2();
        console.assert($select.length, 'select2 missing');

        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this._IsSelect2Initialized($select)) {
            $select.off('select2:select');
            $select.off('select2:unselect');
            $select.off('select2:clear');
            $select.off('select2:closing');
            $select.empty().trigger('change');
            $select.select2('destroy');
        }
    }

    buildUrl(select, url) {
        return url;
    }

    /**
     * Resets the selection to empty when clearable, otherwise to the first resource.
     */
    async reset() {
        if (this._isClearable()) {
            this._setSelection([], []);
        } else {
            // Clear without emitting a change event, _updateAll() will select the first
            // resource again right after.
            this._selectedObjects.clear();
            this.values = [];
            this.valueObjects = [];
            this.value = null;
            this.valueObject = null;
            this._appliedValues = this.values;
            this._appliedValue = null;
        }

        await this._updateAll();
    }

    formatResource(select, resource) {
        return resource.name ?? resource['@id'];
    }

    loginCallback() {
        this._updateAll();
    }

    logoutCallback() {
        this._updateAll();
    }

    _getPlaceholder() {
        const i18n = this._i18n;

        if (this.disabled) {
            return i18n.t('select.component-disabled');
        }
        if (!this.isLoggedIn()) {
            return i18n.t('select.login-required');
        }

        return this.placeholder ?? i18n.t('select.placeholder');
    }

    getCollectionQueryParameters(select) {
        return {};
    }

    getSearchQueryParameters(select, searchTerm) {
        searchTerm = searchTerm.trim();
        return searchTerm ? {search: searchTerm} : {};
    }

    getItemParameters(select) {
        return {};
    }

    getItemQueryParameters(select) {
        return this.getItemParameters(select);
    }

    _setQueryParameters(parsedUrl, parameters) {
        for (const [key, parameterValue] of new URLSearchParams(parameters)) {
            parsedUrl.searchParams.append(key, parameterValue);
        }
    }

    _getCollectionUrl(searchTerm) {
        if (this.entryPointUrl === null) {
            return null;
        }

        let url = this.entryPointUrl;
        if (this.resourcePath !== null) {
            url = new URL(this.resourcePath, this.entryPointUrl).href;
        }
        url = this.buildUrl(this, url);

        let parsedUrl = new URL(url);

        this._setQueryParameters(parsedUrl, this.getCollectionQueryParameters(this));
        if (searchTerm !== undefined) {
            this._setQueryParameters(parsedUrl, this.getSearchQueryParameters(this, searchTerm));
        }

        // Inject perPage if the consumer hasn't already set it via buildUrl or query hooks.
        if (!parsedUrl.searchParams.has('perPage')) {
            parsedUrl.searchParams.set('perPage', String(this.perPage));
        }

        return parsedUrl.href;
    }

    _getUrl() {
        return this._getCollectionUrl();
    }

    _getText(resource) {
        return this.formatResource(this, resource);
    }

    _hasValue(value = this.value) {
        return value !== null && value !== undefined && value !== '';
    }

    _isClearable() {
        // Allow clearing only when there is a meaningful empty state to return to.
        // With multiple selections the empty state is always meaningful.
        return this.multiple || this.fetchMode === 'search' || this.noDefault;
    }

    /**
     * Looks up the resource object belonging to an ID. Falls back to the object of a previous
     * selection, since in search mode this._resources only contains the last search results.
     *
     * @param {string} value - The resource ID
     * @returns {object|null} The resource object, or null if unknown
     */
    _findResource(value) {
        for (let res of this._resources) {
            if (res['@id'] === value) {
                return res;
            }
        }

        return this._selectedObjects.get(value) ?? null;
    }

    /**
     * The one place where the selection gets changed. Keeps "value"/"valueObject" in sync with
     * "values"/"valueObjects" and emits a "change" event if anything actually changed.
     *
     * @param {string[]} values - The selected resource IDs
     * @param {(object|null)[]|null} [objects] - The matching resource objects, may contain null
     *     for resources we have no object for. If omitted they get looked up.
     */
    _setSelection(values, objects = null) {
        // Keep the selection to what select2 can actually show, so "values" never claims
        // something different than what the user sees
        let newValues = (values ?? []).filter((value, index, all) => {
            return this._hasValue(value) && all.indexOf(value) === index;
        });
        if (!this.multiple) {
            newValues = newValues.slice(0, 1);
        }

        const newObjects = newValues.map((value, index) => {
            return objects === null ? this._findResource(value) : (objects[index] ?? null);
        });

        const valuesChanged =
            this.values.length !== newValues.length ||
            newValues.some((value, index) => this.values[index] !== value);
        const objectsChanged =
            this.valueObjects.length !== newObjects.length ||
            newObjects.some((object, index) => this.valueObjects[index] !== object);

        this._selectedObjects.clear();
        newValues.forEach((value, index) => {
            if (newObjects[index] !== null) {
                this._selectedObjects.set(value, newObjects[index]);
            }
        });

        // Only assign if the content really changed, since lit compares arrays by identity and
        // would otherwise schedule an endless stream of updates.
        if (valuesChanged) {
            this.values = newValues;
        }
        if (objectsChanged) {
            this.valueObjects = newObjects;
        }
        // "value" and "valueObject" always mirror the first selection, like the native
        // HTMLSelectElement.value does for a <select multiple>.
        this.value = newValues[0] ?? null;
        this.valueObject = newObjects[0] ?? null;

        this._appliedValues = this.values;
        this._appliedValue = this.value;

        if (!valuesChanged && !objectsChanged) {
            return;
        }

        const event = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.value,
                object: this.valueObject,
                values: this.values,
                objects: this.valueObjects,
            },
        });
        this.dispatchEvent(event);
    }

    /**
     * The selection to apply, taking external changes to "value" or "values" into account.
     * If both were changed, "values" wins, since it can express more.
     *
     * @returns {string[]} The resource IDs to select
     */
    _getRequestedValues() {
        if (this.values !== this._appliedValues) {
            return this.values;
        }
        if (this.value !== this._appliedValue) {
            return this._hasValue(this.value) ? [/** @type {string} */ (this.value)] : [];
        }

        return this.values;
    }

    async _updateAll() {
        this._setSelection(this._getRequestedValues());

        const $select = this._getSelect2();
        if (!this.isLoggedIn()) {
            await this._setSelect2Placeholder(this._getPlaceholder());
            return;
        }

        // Show a dummy loading variant initially.
        if (!this._IsSelect2Initialized($select)) {
            await this._setSelect2Loading();
        }

        if (this.fetchMode === 'search') {
            await this._updateSelect2Search();
            return;
        }

        await this._updateResources();
        await this._updateSelect2();
    }

    async _setSelect2Placeholder(placeholder) {
        await this.updateComplete;

        const $select = this._getSelect2();
        console.assert($select.length, 'select2 missing');

        // Show an empty select until we load the resources
        this._clearSelect2();

        $select.select2({
            width: '100%',
            language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
            placeholder: placeholder,
            data: [],
            disabled: true,
        });
    }

    async _setSelect2Loading() {
        await this._setSelect2Placeholder(this._i18n.t('select.loading'));
    }

    async _updateResources() {
        let url = this._getUrl();
        if (url === null || (url === this._url && this.lang === this._lang)) {
            return;
        }

        this._resources = await hydra.getCollection(url, this.lang, () => this.auth.token);
        this._url = url;
        this._lang = this.lang;
        this._setSelection(this.values);
    }

    async updateResources() {
        if (!this.isLoggedIn()) {
            await this._setSelect2Placeholder(this._getPlaceholder());
            return;
        }

        if (this.fetchMode === 'search') {
            await this._updateSelect2Search();
            return;
        }

        let url = this._getUrl();
        if (url === null || this.lang === null) {
            return;
        }

        this._resources = await hydra.getCollection(url, this.lang, () => this.auth.token);
        this._url = url;
        this._setSelection(this.values);
        await this._updateSelect2();
    }

    _getResourceUrl(value) {
        const url = combineURLs(this.entryPointUrl, value);
        const parsedUrl = new URL(url);
        this._setQueryParameters(parsedUrl, this.getItemQueryParameters(this));

        return parsedUrl.href;
    }

    async _fetchResource(value) {
        const response = await fetch(this._getResourceUrl(value), {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept-Language': this.lang,
                Authorization: 'Bearer ' + this.auth.token,
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    }

    async _updateSearchValue() {
        if (!this.values.length) {
            this._setSelection([], []);
            return;
        }

        const results = await Promise.allSettled(
            this.values.map((value) => this._fetchResource(value)),
        );

        // Another update may have added the entries already while we were fetching, so we
        // start from scratch instead of showing the same entry multiple times
        const $select = this._getSelect2();
        $select.empty();

        /** @type {string[]} */
        const ids = [];
        /** @type {(object|null)[]} */
        const objects = [];
        this.values.forEach((value, index) => {
            const result = results[index];
            if (result.status !== 'fulfilled') {
                // Keep the selection, but we have no resource object to show for it
                console.log(result.reason);
                ids.push(value);
                objects.push(null);
                return;
            }

            const resource = result.value;
            const id = resource['@id'] ?? value;
            ids.push(id);
            objects.push(resource);

            const option = new Option(this._getText(resource), id, true, true);
            $select.append(option);
        });

        $select.trigger('change');
        this._resources = objects.filter((object) => object !== null);
        this._setSelection(ids, objects);
    }

    /**
     * Renders one entry of the select2 dropdown. While a search request is running select2
     * adds a "Searching…" entry, which we replace with a spinner plus the same text, so the
     * user gets some moving feedback while waiting.
     *
     * @param {object} result - The select2 result object
     * @returns {HTMLElement|string} An element for the loading entry, the plain text otherwise
     */
    _renderResult(result) {
        if (!result.loading) {
            // Returning a string makes select2 escape the markup for us
            return result.text;
        }

        // We don't use the "text" attribute of the spinner here, because it would render
        // the text smaller than the other entries of the dropdown.
        const entry = document.createElement('span');
        entry.classList.add('loading-entry');
        entry.appendChild(this.createScopedElement('dbp-mini-spinner'));
        entry.appendChild(document.createTextNode(result.text));

        return entry;
    }

    async _updateSelect2Search() {
        await this.updateComplete;
        const url = this._getCollectionUrl();

        if (url === null) {
            return;
        }

        const $select = this._getSelect2();
        console.assert($select.length, 'select2 missing');

        this._clearSelect2();

        $select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                minimumInputLength: MINIMUM_INPUT_LENGTH,
                multiple: this.multiple,
                allowClear: this._isClearable(),
                placeholder: this._getPlaceholder(),
                dropdownParent: this._$('#select-resource-dropdown'),
                disabled: this.disabled,
                templateResult: (result) => this._renderResult(result),
                ajax: {
                    delay: SEARCH_DELAY,
                    url: (params) => this._getCollectionUrl(params.term ?? ''),
                    // remove the default query parameters (_type and term) that select2 adds to the request
                    data: (params) => {
                        return {};
                    },
                    contentType: 'application/ld+json',
                    beforeSend: (jqXHR) => {
                        jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.auth.token);
                        jqXHR.setRequestHeader('Accept-Language', this.lang);
                        this._isSearching = true;
                    },
                    processResults: (data) => {
                        const members = data['hydra:member'] ?? [];
                        this._resources = members;

                        return {
                            results: members.map((resource) => {
                                return {
                                    id: resource['@id'],
                                    _resultId: `result-${resource['@id']}`,
                                    text: this._getText(resource),
                                    resource: resource,
                                };
                            }),
                        };
                    },
                    complete: () => {
                        this._isSearching = false;
                    },
                },
            })
            .on('select2:clear', () => {
                this._setSelection([], []);
            })
            .on('select2:select', (event) => {
                const data = event.params.data;
                const object = data.resource ?? null;
                if (this.multiple) {
                    this._setSelection([...this.values, data.id], [...this.valueObjects, object]);
                } else {
                    this._setSelection([data.id], [object]);
                }
            })
            .on('select2:unselect', (event) => {
                const index = this.values.indexOf(event.params.data.id);
                if (index === -1) {
                    return;
                }

                const values = [...this.values];
                const objects = [...this.valueObjects];
                values.splice(index, 1);
                objects.splice(index, 1);
                this._setSelection(values, objects);
            })
            .on('select2:closing', (event) => {
                if (this._isSearching) {
                    event.preventDefault();
                }
            });

        if (this.values.length) {
            try {
                await this._updateSearchValue();
            } catch (error) {
                console.log(error);
                // Keep the selection, but without the resource objects we failed to fetch
                this._setSelection(
                    this.values,
                    this.values.map(() => null),
                );
            }
        } else {
            $select.val(null).trigger('change');
        }
    }

    async _updateSelect2() {
        await this.updateComplete;

        const $select = this._getSelect2();
        console.assert($select.length, 'select2 missing');

        const data = this._resources.map((item) => {
            return {id: item['@id'], text: this._getText(item)};
        });

        data.sort((a, b) => {
            return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
        });

        this._clearSelect2();

        $select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                placeholder: this._getPlaceholder(),
                dropdownParent: this._$('#select-resource-dropdown'),
                data: data,
                disabled: this.disabled,
                multiple: this.multiple,
                allowClear: this._isClearable(),
            })
            .on('select2:clear', () => {
                this._setSelection([], []);
            })
            .on('select2:select select2:unselect', () => {
                this._setSelection($select.select2('data').map((entry) => entry.id));
            });

        // If none is selected, default to the first one. With "multiple" an empty selection
        // is a valid state, so we never preselect anything there.
        if (!this.multiple && !this.values.length && data.length && !this.noDefault) {
            this._setSelection([data[0].id]);
        }

        // Apply the selection
        $select.val(this.multiple ? this.values : this.value).trigger('change');
    }

    update(changedProperties) {
        // select2 has to be destroyed before lit changes the "multiple" attribute of the
        // select element it has wrapped, otherwise it can't clean up after itself anymore.
        if (changedProperties.has('multiple') && changedProperties.get('multiple') !== undefined) {
            this._clearSelect2();
        }

        super.update(changedProperties);

        // We don't look at the changed properties for the selection, because our own writes to
        // "value"/"values" can end up in the same update cycle as one from the outside, which
        // would hide the latter. Comparing against what we applied last can't miss anything.
        const selectionChangedExternally =
            this.values !== this._appliedValues || this.value !== this._appliedValue;

        const needsUpdate =
            changedProperties.has('lang') ||
            selectionChangedExternally ||
            changedProperties.has('resourcePath') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('perPage') ||
            changedProperties.has('disabled') ||
            changedProperties.has('noDefault') ||
            changedProperties.has('multiple') ||
            changedProperties.has('fetchMode');

        if (needsUpdate) {
            this._updateAll();
        }
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getNotificationCSS(),
            commonStyles.getSelect2CSS(),
            // language=css
            css`
                .select {
                    position: relative;
                    overflow: visible;
                }

                .select > .select2-container--open {
                    left: 0 !important;
                    position: absolute !important;
                    top: 100% !important;
                    width: 100% !important;
                    z-index: 1;
                }

                /* The "Searching…" entry of the dropdown, see _renderResult() */
                .loading-entry {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                }
            `,
        ];
    }

    render() {
        const select2CSS = commonUtils.getAbsoluteURL(select2CSSPath);
        return html`
            <link rel="stylesheet" href="${select2CSS}" />

            <div class="select" id="select-resource-dropdown">
                <div class="select2-control control">
                    <select
                        id="${this._selectId}"
                        name="select-resources"
                        class="select"
                        ?multiple="${this.multiple}"
                        style="visibility: hidden;"></select>
                </div>
                <div id="select-resource-dropdown"></div>
            </div>
        `;
    }
}
