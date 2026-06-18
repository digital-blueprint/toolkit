import $ from 'jquery';
import select2 from 'select2';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2LangDe from '@dbp-toolkit/resource-select/src/i18n/de/select2';
import select2LangEn from '@dbp-toolkit/resource-select/src/i18n/en/select2';
import {AdapterLitElement, AuthMixin, combineURLs, LangMixin} from '@dbp-toolkit/common';
import * as hydra from './hydra.js';

const SEARCH_DELAY = 300;
const MINIMUM_INPUT_LENGTH = 2;

export class ResourceSelect extends LangMixin(AuthMixin(AdapterLitElement), createInstance) {
    constructor() {
        super();
        this._resources = [];
        this._url = null;
        this._lang = null;
        this._isSearching = false;
        this._ignoreValueUpdate = false;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this._selectId = 'select-resource-' + commonUtils.makeId(24);

        this.auth = {};
        this.entryPointUrl = null;
        this.resourcePath = null;
        this.value = null;
        this.valueObject = null;
        this.disabled = false;
        this.perPage = 100;
        this.fetchMode = 'prefetch';

        this.noDefault = false;
        this.placeholder = null;

        this._onDocumentClicked = this._onDocumentClicked.bind(this);
        select2(window, $);
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
            noDefault: {type: Boolean, attribute: 'no-default'},
            value: {type: String, reflect: true},
            disabled: {type: Boolean},
            perPage: {type: Number, attribute: 'per-page'},
            fetchMode: {type: String, attribute: 'fetch-mode'},
            placeholder: {type: String},
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
            this._setValue(null, null);
        } else {
            this._ignoreValueUpdate = true;
            this.value = null;
            this.valueObject = null;
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
        for (const [key, parameterValue] of Object.entries(parameters)) {
            if (parameterValue !== undefined && parameterValue !== null) {
                parsedUrl.searchParams.set(key, String(parameterValue));
            }
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
        return this.fetchMode === 'search' || this.noDefault;
    }

    _setValue(value, valueObject) {
        const valueChanged = this.value !== value;
        let changed = valueChanged;
        if (valueChanged) {
            this._ignoreValueUpdate = true;
        }
        this.value = value;

        let found = arguments.length > 1 ? (valueObject ?? null) : null;
        if (arguments.length < 2) {
            for (let res of this._resources) {
                if (res['@id'] === this.value) {
                    found = res;
                    break;
                }
            }
        }
        changed = changed || this.valueObject !== found;
        this.valueObject = found;

        if (!changed) {
            return;
        }

        const event = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.value,
                object: this.valueObject,
            },
        });
        this.dispatchEvent(event);
    }

    async _updateAll() {
        this._setValue(this.value);

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
        this._setValue(this.value);
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
        this._setValue(this.value);
        await this._updateSelect2();
    }

    _getResourceUrl(value) {
        const url = combineURLs(this.entryPointUrl, value);
        const parsedUrl = new URL(url);
        this._setQueryParameters(parsedUrl, this.getItemQueryParameters(this));

        return parsedUrl.href;
    }

    async _updateSearchValue() {
        if (!this._hasValue()) {
            this._setValue(this.value, null);
            return;
        }

        const $select = this._getSelect2();
        const response = await fetch(this._getResourceUrl(this.value), {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept-Language': this.lang,
                Authorization: 'Bearer ' + this.auth.token,
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const resource = await response.json();
        const id = resource['@id'] ?? this.value;
        this._resources = [resource];

        const option = new Option(this._getText(resource), id, true, true);
        $select.append(option).trigger('change');
        this._setValue(id, resource);
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
                allowClear: this._isClearable(),
                placeholder: this._getPlaceholder(),
                dropdownParent: this._$('#select-resource-dropdown'),
                disabled: this.disabled,
                ajax: {
                    delay: SEARCH_DELAY,
                    url: (params) => this._getCollectionUrl(params.term ?? ''),
                    contentType: 'application/ld+json',
                    beforeSend: (jqXHR) => {
                        jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.auth.token);
                        jqXHR.setRequestHeader('Accept-Language', this.lang);
                        this._isSearching = true;
                    },
                    processResults: (data) => {
                        this._$('#select-resource-dropdown').addClass('select2-bug');

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
                this._setValue(null, null);
            })
            .on('select2:select', (event) => {
                this._$('#select-resource-dropdown').removeClass('select2-bug');
                const data = event.params.data;
                this._setValue(data.id, data.resource ?? null);
            })
            .on('select2:closing', (event) => {
                if (this._isSearching) {
                    event.preventDefault();
                }
            });

        if (this._hasValue()) {
            try {
                await this._updateSearchValue();
            } catch (error) {
                console.log(error);
                this._setValue(this.value, null);
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
                allowClear: this._isClearable(),
            })
            .on('select2:clear', () => {
                this._setValue(null, null);
            })
            .on('select2:select', () => {
                let id = $select.select2('data')[0].id;
                this._setValue(id);
            });

        // If none is selected, default to the first one
        if (this.value === null && data.length && !this.noDefault) {
            this._setValue(data[0].id);
        }

        // Apply the selection
        $select.val(this.value).trigger('change');
    }

    update(changedProperties) {
        super.update(changedProperties);
        const valueChangedExternally = changedProperties.has('value') && !this._ignoreValueUpdate;
        const needsUpdate =
            changedProperties.has('lang') ||
            valueChangedExternally ||
            changedProperties.has('resourcePath') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('perPage') ||
            changedProperties.has('disabled') ||
            changedProperties.has('noDefault') ||
            changedProperties.has('fetchMode');

        this._ignoreValueUpdate = false;

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

                /* https://github.com/select2/select2/issues/5457 */
                .select2-bug .loading-results {
                    display: none !important;
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
                        style="visibility: hidden;"></select>
                </div>
                <div id="select-resource-dropdown"></div>
            </div>
        `;
    }
}
