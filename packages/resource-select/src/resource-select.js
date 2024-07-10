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
        // this._resources = [];
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
        /** @type {boolean} */
        this.ignoreValueUpdate = false;
        /** @type {boolean} */
        this.isSearching = false;
        /** @type {object} */
        this.lastResult = {};

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
            disabled: {type: Boolean, reflect: true},
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
        return elm && elm.hasClass('select2-hidden-accessible');
    }

    authenticated() {
        return (this.auth.token || '') !== '';
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClicked);

        this.updateComplete.then(() => {
            this.$select = this._getSelect2();
            if (this.$select.length && !this._IsSelect2Initialized(this.$select)) {
                this._initSelect2();
            }
        });
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }

    _onDocumentClicked(ev) {
        // Close the popup when clicking outside of select2
        if (!ev.composedPath().includes(this)) {
            this.$select = this._getSelect2();
            if (this.$select.length && this._IsSelect2Initialized(this.$select)) {
                this.$select.select2('close');
            }
        }
    }

    _clearSelect2() {
        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this._IsSelect2Initialized(this.$select)) {
            this.$select.off('select2:select');
            this.$select.empty().trigger('change');
            this.$select.select2('destroy');
            this.value = null;
            this.valueObject = null;
        }
    }

    /**
     *
     * @param {*} select
     * @param {string} url
     * @returns {string}
     */
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
        if (this.useSearch) {
            return {
                search: params.term.trim(),
            };
        } else {
            return null;
        }
    }

    /**
     *
     * @param {object} resource
     * @returns {string}
     */
    formatResource(resource) {
        return resource.name ?? resource['@id'];
    }

    /**
     *
     * @returns {string}
     */
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

    /**
     *
     * @param {object} resource
     * @returns {string}
     */
    _getText(resource) {
        return this.formatResource(resource);
    }


    async _initSelect2() {
        const i18n = this._i18n;
        const that = this;
        const $this = $(this);

        const $select = this._getSelect2();

        if (!this.authenticated() || this.$select === null || this.entryPointUrl === null) {
            return false;
        }

        console.assert($select.length, 'select2 missing');

        // Show an empty select until we load the resources
        this._clearSelect2();

        $select.select2({
            width: '100%',
            language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
            minimumInputLength: that.useSearch ? 1 : -1,
            minimumResultsForSearch: that.useSearch ? 1 : Infinity,
            disabled: this.disabled,
            placeholder: i18n.t('resource-select.placeholder'),
            dropdownParent: this._$('#select-resource-dropdown'),
            ajax: {
                delay: 500,
                url: this._getUrl(),
                contentType: 'application/ld+json',
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', 'Bearer ' + that.auth.token);
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

    async updateResources() {
        this._initSelect2();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {

            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);

                    if (this._IsSelect2Initialized(this.$select)) {
                        // no other way to set an other language at runtime did work
                        this._initSelect2();
                    }
                    break;
                case 'value':
                    if (!this.ignoreValueUpdate && this._IsSelect2Initialized(this.$select)) {
                        this._initSelect2();
                    }

                    this.ignoreValueUpdate = false;
                    break;
                case 'entryPointUrl':
                case 'resourcePath':
                    // we don't need to preset the selector if the entry point url changes
                    if (this._IsSelect2Initialized(this.$select)) {
                        this._initSelect2();
                    }
                    break;
                case 'auth':
                    if (this.authenticated() && !this._IsSelect2Initialized(this.$select)) {
                        this._initSelect2();
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getNotificationCSS(),
            commonStyles.getSelect2CSS(),
            // language=css
            css`
                .select2-search--dropdown.use-search {
                    /* display: block; */
                }

                .select2-search--dropdown {
                    /* display: none; */
                }
            `,
        ];
    }

    render() {
        const i18n = this._i18n;
        const select2CSS = commonUtils.getAssetURL(select2CSSPath);

        return html`
            <link rel="stylesheet" href="${select2CSS}" />

            <div class="select">
                <div class="select2-control control">
                    <select
                        id="${this._selectId}"
                        name="select-resources"
                        class="select"
                        ?disabled=${this.disabled}>
                        ${!this.authenticated()
                            ? html`
                                    <option value="" disabled selected>
                                        ${i18n.t('resource-select.login-required')}
                                    </option>
                                `
                            : ''}
                    </select>
                </div>
                <div id="select-resource-dropdown"></div>
            </div>
        `;
    }
}
