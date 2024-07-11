import $ from 'jquery';
import select2 from 'select2';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2LangDe from '@dbp-toolkit/resource-select/src/i18n/de/select2';
import select2LangEn from '@dbp-toolkit/resource-select/src/i18n/en/select2';
import {AdapterLitElement} from '@dbp-toolkit/common';
import * as hydra from './hydra.js';

export class ResourceSelect extends AdapterLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this._resources = [];
        /** @type {string | null} */
        this._url = null;
        this._lang = null;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        /** @type {string} */
        this._selectId = 'select-resource-' + commonUtils.makeId(24);

        this.auth = {};
        this.lang = this._i18n.language;
        /** @type {string | null} */
        this.entryPointUrl = null;
        /** @type {string | null} */
        this.resourcePath = null;
        /** @type {string | null} */
        this.value = null;
        /** @type {object | null} */
        this.valueObject = null;
        /** @type {boolean} */
        this.disabled = false;
        /** @type {boolean} */
        this.useSearch = false;
        /** @type {object} */
        this.lastResult = {};
        /** @type {boolean} */
        this.ignoreValueUpdate = false;

        this._onDocumentClicked = this._onDocumentClicked.bind(this);
        select2(window, $);
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            auth: {type: Object},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            resourcePath: {type: String, attribute: 'resource-path'},
            value: {type: String, reflect: true},
            disabled: {type: Boolean},
            useSearch: {type: Boolean, attribute: 'use-search'},
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

    isAuthenticated() {
        return (this.auth.token || '') !== '';
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
            $select.empty().trigger('change');
            $select.select2('destroy');
            // this.value = null;
            // this.valueObject = null;
        }
    }

    buildUrl(select, url) {
        return url;
    }

    /**
     * Gets passed the select2 params (https://select2.org/data-sources/ajax#jquery-ajax-options)
     * and should return an object containing the query parameters send to the server.
     *
     * @param {object} select
     * @param {object} params
     * @returns {object}
     */
    buildUrlData(select, params) {
        if (this.useSearch && params.term) {
            return {
                search: params.term.trim(),
            };
        } else {
            return null;
        }
    }

    formatResource(resource) {
        return resource.name ?? resource['@id'];
    }

    _getUrl() {
        if (this.entryPointUrl === null) {
            return null;
        }
        let url = this.entryPointUrl;
        if (this.resourcePath !== null) {
            url = new URL(this.resourcePath, this.entryPointUrl).href;
        }
        url = this.buildUrl(this, url);
        return url;
    }

    _getText(resource) {
        return this.formatResource(resource);
    }

    /**
     * Sets this.value, this.valueObject and dispatch change event with the value and valueObject.
     * @param {string} value
     * @returns {void}
     */
    _setValue(value) {
        let changed = false;
        changed = this.value !== value;
        this.value = value;

        let found = null;
        for (let res of this._resources) {
            if (res['@id'] === this.value) {
                found = res;
                break;
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

        // Show a dummy loading variant initially
        const $select = this._getSelect2();
        if (!this._IsSelect2Initialized($select)) {
            await this._setSelect2Loading();
        }

        if (!this.auth.token) {
            return;
        }
        if (this.useSearch) {
            await this._updateSelect2WithSearch();
        } else {
            await this._updateResources();
            await this._updateSelect2();
        }
    }

    async _setSelect2Loading() {
        await this.updateComplete;
        const i18n = this._i18n;

        const $select = this._getSelect2();
        console.assert($select.length, 'select2 missing');

        // Show an empty select until we load the resources
        this._clearSelect2();

        $select.select2({
            width: '100%',
            language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
            placeholder: i18n.t('resource-select.loading'),
            data: [],
            disabled: true,
        });
    }

    async _updateResources() {
        let url = this._getUrl();
        if (url === null || (url === this._url && this.lang === this._lang)) {
            return;
        }

        this._resources = await hydra.getCollection(url, this.lang, this.auth.token);
        this._url = url;
        this._lang = this.lang;
        this._setValue(this.value);
    }

    // async updateResources() {
    //     let url = this._getUrl();
    //     if (url === null || this.lang === null) {
    //         return;
    //     }

    //     this._resources = await hydra.getCollection(url, this.lang, this.auth.token);
    //     this._url = url;
    //     this._setValue(this.value);
    //     await this._updateSelect2();
    // }

    async _updateSelect2() {
        await this.updateComplete;
        const i18n = this._i18n;

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
                placeholder: i18n.t('resource-select.placeholder'),
                dropdownParent: this._$('#select-resource-dropdown'),
                data: data,
                disabled: this.disabled,
            })
            .on('select2:select', () => {
                let id = $select.select2('data')[0].id;
                this._setValue(id);
            });

        // If none is selected, default to the first one
        if (this.value === null && data.length) {
            this._setValue(data[0].id);
        }

        // Apply the selection
        $select.val(this.value).trigger('change');
    }

    async _updateSelect2WithSearch() {
        const i18n = this._i18n;
        const that = this;
        const $this = $(this);

        const $select = this._getSelect2();

        if (!this.isAuthenticated() || $select === null || this.entryPointUrl === null) {
            return false;
        }

        console.assert($select.length, 'select2 missing');

        // Show an empty select until we load the resources
        this._clearSelect2();

        $select.select2({
            width: '100%',
            language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
            minimumInputLength: 1,
            disabled: this.disabled,
            placeholder: i18n.t('resource-select.placeholder'),
            dropdownParent: this._$('#select-resource-dropdown'),
            closeOnSelect: true,
            ajax: {
                delay: 500,
                url: this._getUrl(),
                contentType: 'application/ld+json',
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', 'Bearer ' + that.auth.token);
                    jqXHR.setRequestHeader('Accept-Language', that.lang);
                    that.isSearching = true;
                },
                data: (params) => {
                    return this.buildUrlData(this, params);
                },
                processResults: function (data) {

                    that._$('#select-resource-dropdown').addClass('select2-bug');

                    that.lastResult = data;
                    /** @type {Array} */
                    let members = data['hydra:member'];

                    /** @type {Array} */
                    const results = [];
                    members.forEach((resource) => {
                        results.push({
                            id: resource['@id'],
                            text: that.formatResource(resource),
                        });
                    });

                    results.sort((a, b) => {
                        return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
                    });

                    return {
                        results: results,
                    };
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                },
                complete: (jqXHR, textStatus) => {
                    this.isSearching = false;
                },
            },
        })
        .on('select2:select', function (e) {
            that._$('#select-resource-dropdown').removeClass('select2-bug');

            // set custom element attributes
            /** @type {string} */
            const identifier = e.params.data.id;
            that.value = identifier;
            that.valueObject = hydra.findObjectInApiResults(identifier, that.lastResult);
            $this.attr('data-object', JSON.stringify(that.valueObject));
            $this.data('object', that.valueObject);

            if ($this.attr('value') !== identifier) {
                that.ignoreValueUpdate = true;
                $this.attr('value', identifier);

                // fire a change event
                that.dispatchEvent(
                    new CustomEvent('change', {
                        detail: {
                            value: identifier,
                            object: that.valueObject,
                        },
                        bubbles: true,
                        composed: true,
                    })
                );
            }
        })
        .on('select2:closing', (e) => {
            if (that.isSearching) {
                e.preventDefault();
            }
        });

        return true;
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }

        if (
            changedProperties.has('lang') ||
            changedProperties.has('resourcePath') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('disabled')
        ) {
            this._updateAll();
        }

        if (changedProperties.has('value')) {

            if (!this.ignoreValueUpdate) {
                this._updateAll();
            }
            this.ignoreValueUpdate = false;
        }

        if (changedProperties.has('auth')) {
            changedProperties.forEach((oldValue, propName) => {
                if (this.isAuthenticated() && (!oldValue || !oldValue.token)) {
                    this._updateAll();
                }
            });
        }

        super.update(changedProperties);
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getNotificationCSS(),
            commonStyles.getSelect2CSS(),
            // language=css
            css``,
        ];
    }

    render() {
        const select2CSS = commonUtils.getAssetURL(select2CSSPath);
        return html`
            <link rel="stylesheet" href="${select2CSS}" />

            <div class="select">
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
