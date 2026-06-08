import $ from 'jquery';
import {findObjectInApiResults} from './utils.js';
import select2 from 'select2';
import select2LangDe from './i18n/de/select2';
import select2LangEn from './i18n/en/select2';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {createInstance} from './i18n.js';
import {Icon, combineURLs} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import * as errorUtils from '@dbp-toolkit/common/error';
import {AdapterLitElement} from '@dbp-toolkit/common';

export class PersonSelect extends LangMixin(
    ScopedElementsMixin(AdapterLitElement),
    createInstance,
) {
    constructor() {
        super();
        Object.assign(PersonSelect.prototype, errorUtils.errorMixin);
        this.auth = {};
        this.entryPointUrl = null;
        this.$select = null;
        this.active = false;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this.selectId = 'person-select-' + commonUtils.makeId(24);
        this.value = '';
        this.object = null;
        this.ignoreValueUpdate = false;
        this.isSearching = false;
        this.lastResult = {};
        this.showReloadButton = false;
        this.reloadButtonTitle = '';
        this.disabled = false;
        this.localDataAttributes = [];

        this._onDocumentClicked = this._onDocumentClicked.bind(this);

        select2(window, $);
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    $(selector) {
        return $(this.shadowRoot.querySelector(selector));
    }

    static get properties() {
        return {
            ...super.properties,
            active: {type: Boolean, attribute: false},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            value: {type: String},
            object: {type: Object, attribute: false},
            localDataAttributes: {type: Array},
            showReloadButton: {type: Boolean, attribute: 'show-reload-button'},
            reloadButtonTitle: {type: String, attribute: 'reload-button-title'},
            auth: {type: Object},
            disabled: {type: Boolean, reflect: true},
        };
    }

    clear() {
        this.object = null;
        $(this).attr('data-object', '');
        $(this).data('object', null);
        this.value = '';
        // Reset value attribute to really make sure it is empty and will trigger a change event
        // when it is set again with the previous value
        $(this).attr('value', '');
        this.$select.val(null).trigger('change').trigger('select2:unselect');

        // Fire a change event
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value: '',
                },
                bubbles: true,
            }),
        );
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClicked);

        this.updateComplete.then(() => {
            this.$select = this.$('#' + this.selectId);
            if (!this.select2IsInitialized()) {
                this.initSelect2();
            }
        });

        const localDataAttributes = this.getAttribute('local-data-attributes');
        if (localDataAttributes) {
            try {
                this.localDataAttributes = JSON.parse(localDataAttributes);
            } catch (error) {
                console.error(
                    'local-data-attributes attribute must be a JSON array of strings',
                    error.message,
                );
            }
        }
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }

    _onDocumentClicked(ev) {
        // Close the popup when clicking outside of select2
        if (!ev.composedPath().includes(this)) {
            const $select = this.$('#' + this.selectId);
            if ($select.length && this.select2IsInitialized()) {
                $select.select2('close');
            }
        }
    }

    /**
     * Initializes the Select2 selector
     *
     * @param ignorePreset
     */
    initSelect2(ignorePreset = false) {
        const i18n = this._i18n;
        const that = this;
        const $this = $(this);

        if (this.$select === null || this.entryPointUrl === null) {
            return false;
        }

        const apiUrl = combineURLs(this.entryPointUrl, '/base/people');

        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this.$select && this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
            this.$select.off('select2:select');
            this.$select.off('select2:closing');
        }

        this.$select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                minimumInputLength: 2,
                allowClear: true,
                placeholder: this.disabled
                    ? i18n.t('person-select.component-disabled')
                    : !this.authenticated()
                      ? i18n.t('person-select.login-required')
                      : i18n.t('person-select.placeholder'),
                dropdownParent: this.$('#person-select-dropdown'),
                ajax: {
                    delay: 500,
                    url: apiUrl,
                    contentType: 'application/ld+json',
                    beforeSend: function (jqXHR) {
                        jqXHR.setRequestHeader('Authorization', 'Bearer ' + that.auth.token);
                        that.isSearching = true;
                    },
                    data: (params) => {
                        return this.getCollectionQueryParameters(this, params.term);
                    },
                    processResults: function (data) {
                        that.$('#person-select-dropdown').addClass('select2-bug');

                        that.lastResult = data;
                        let members = data['hydra:member'];
                        const results = [];
                        members.forEach((person) => {
                            results.push({
                                id: person['@id'],
                                text: that.formatPerson(that, person),
                            });
                        });

                        return {
                            results: results,
                        };
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.handleXhrError(jqXHR, textStatus, errorThrown);
                    },
                    complete: (jqXHR, textStatus) => {
                        that.isSearching = false;
                    },
                },
            })
            .on('select2:clear', function (e) {
                that.clear();
            })
            .on('select2:select', function (e) {
                that.$('#person-select-dropdown').removeClass('select2-bug');

                // set custom element attributes
                const identifier = e.params.data.id;
                that.object = findObjectInApiResults(identifier, that.lastResult);

                $this.attr('data-object', JSON.stringify(that.object));
                $this.data('object', that.object);

                if ($this.attr('value') !== identifier) {
                    that.ignoreValueUpdate = true;
                    $this.attr('value', identifier);

                    // fire a change event
                    that.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {
                                value: identifier,
                            },
                            bubbles: true,
                        }),
                    );
                }
            })
            .on('select2:closing', (e) => {
                if (that.isSearching) {
                    e.preventDefault();
                }
            });

        // TODO: doesn't work here
        // this.$('.select2-selection__arrow').click(() => {
        //     console.log("click");
        // });

        // preset a person
        if (!ignorePreset && this.value !== '' && this.authenticated()) {
            let itemUrl = combineURLs(this.entryPointUrl, this.value);
            let params = new URLSearchParams(this.getItemQueryParameters(this)).toString();
            if (params) {
                itemUrl += `?${params}`;
            }

            fetch(itemUrl, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: 'Bearer ' + this.auth.token,
                },
            })
                .then((result) => {
                    if (!result.ok) throw result;
                    return result.json();
                })
                .then((person) => {
                    that.object = person;
                    const identifier = person['@id'];

                    const option = new Option(
                        that.formatPerson(this, person),
                        identifier,
                        true,
                        true,
                    );
                    $this.attr('data-object', JSON.stringify(person));
                    $this.data('object', person);
                    that.$select.append(option).trigger('change');

                    // fire a change event
                    that.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {
                                value: identifier,
                            },
                            bubbles: true,
                        }),
                    );
                })
                .catch((e) => {
                    console.log(e);
                    that.clear();
                });
        }

        return true;
    }

    /**
     * Returns a key-value mapping of query parameters to use for the person get item request.
     * Gets called if a person is pre-set.
     *
     * @param {object} select
     * @returns {object} The query parameters.
     */
    getItemQueryParameters(select) {
        let queryParameters = {};
        this.addIncludeLocalQueryParameter(select, queryParameters);

        return queryParameters;
    }

    /**
     * Gets passed the search term and returns a key-value mapping of query parameters to use for the
     * person get collection request.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    getCollectionQueryParameters(select, searchTerm) {
        let queryParameters = this.getFilterQueryParameters(select, searchTerm);
        this.addIncludeLocalQueryParameter(select, queryParameters);

        return queryParameters;
    }

    /**
     * Gets passed the search term and returns a key-value mapping of filter parameters (e.g., search, filter, sort)
     * to use for the person get collection request. Feel free to override.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    getFilterQueryParameters(select, searchTerm) {
        return PersonSelect.getFilterQueryParametersDefault(select, searchTerm);
    }

    /**
     * Gets passed the search term and returns the default key-value mapping of filter parameters
     * (e.g., search, filter, sort) to use for the person get collection request.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    static getFilterQueryParametersDefault(select, searchTerm) {
        return {
            search: searchTerm.trim(),
            sort: 'familyName',
        };
    }

    addIncludeLocalQueryParameter(select, queryParameters) {
        if (this.localDataAttributes.length > 0) {
            queryParameters['includeLocal'] = this.localDataAttributes.join(',');
        }
    }

    /**
     * Gets passed a person object and should return a string representation that will
     * be shown to the user. Feel free to override.
     *
     * @param {object} select
     * @param {object} person
     * @returns {string}
     */
    formatPerson(select, person) {
        let text = person['givenName'] ?? '';
        if (person['familyName']) {
            text += ` ${person['familyName']}`;
        }
        const localDataText = this.formatLocalData(select, person);
        if (localDataText) {
            text += ` ${localDataText}`;
        }

        return text;
    }

    /**
     * Gets passed a person object and returns the default string representation of the selected person.
     * Feel free to override.
     *
     * @param {object} select
     * @param {object} person
     * @returns {string}
     */
    static formatPersonDefault(select, person) {
        let text = person['givenName'] ?? '';
        if (person['familyName']) {
            text += ` ${person['familyName']}`;
        }
        const localDataText = PersonSelect.formatLocalDataDefault(select, person);
        if (localDataText) {
            text += ` ${localDataText}`;
        }

        return text;
    }

    /**
     * Should return a string representation of the selected person's local data attributes.
     * Feel free to override.
     *
     * @param {object} select
     * @param {object} person
     * @returns {string}
     */
    formatLocalData(select, person) {
        return PersonSelect.formatLocalDataDefault(select, person);
    }

    /**
     * Returns the default string representation of the selected person's local data attributes.
     */
    static formatLocalDataDefault(select, person) {
        const attributes = person.localData ?? {};
        if (Object.values(attributes).length === 0) {
            return '';
        }

        return `(${Object.values(attributes).join(', ')})`;
    }

    update(changedProperties) {
        super.update(changedProperties);

        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    if (this.select2IsInitialized()) {
                        // no other way to set an other language at runtime did work
                        this.initSelect2(true);
                    }
                    break;
                case 'value':
                    if (!this.ignoreValueUpdate && this.select2IsInitialized()) {
                        this.initSelect2();
                    }

                    this.ignoreValueUpdate = false;
                    break;
                case 'entryPointUrl':
                    // we don't need to preset the selector if the entry point url changes
                    this.initSelect2(true);
                    break;
                case 'auth':
                    this.active = this.authenticated();
                    if (this.active && (!oldValue || !oldValue.token)) {
                        this.initSelect2();
                    }
                    break;
            }
        });
    }

    select2IsInitialized() {
        return this.$select !== null && this.$select.hasClass('select2-hidden-accessible');
    }

    reloadClick() {
        if (this.object === null) {
            return;
        }

        // fire a change event
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value: this.value,
                },
                bubbles: true,
            }),
        );
    }

    authenticated() {
        return (this.auth.token || '') !== '';
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            commonStyles.getFormAddonsCSS(),
            commonStyles.getSelect2CSS(),
            css`
                #person-select-dropdown {
                    position: relative;
                }

                .select2-control.control {
                    width: 100%;
                }

                .field .button.control {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: var(--dbp-border);
                    border-color: var(--dbp-muted);
                    -moz-border-radius-topright: var(--dbp-border-radius);
                    -moz-border-radius-bottomright: var(--dbp-border-radius);
                    line-height: 100%;
                }

                .field .button.control dbp-icon {
                    top: 0;
                }

                /* https://github.com/select2/select2/issues/5457 */
                .select2-bug .loading-results {
                    display: none !important;
                }
            `,
        ];
    }

    render() {
        const i18n = this._i18n;
        const select2CSS = commonUtils.getAbsoluteURL(select2CSSPath);
        return html`
            <link rel="stylesheet" href="${select2CSS}" />
            <div class="select">
                <div class="field has-addons">
                    <div class="select2-control control">
                        <!-- https://select2.org-->
                        <select
                            id="${this.selectId}"
                            name="person"
                            class="select"
                            ?disabled=${!this.active || this.disabled}>
                            ${!this.authenticated()
                                ? html`
                                      <option value="" disabled selected>
                                          ${i18n.t('person-select.login-required')}
                                      </option>
                                  `
                                : ''}
                        </select>
                    </div>
                    <a
                        class="control button"
                        id="reload-button"
                        ?disabled=${this.object === null}
                        @click="${this.reloadClick}"
                        style="display: ${this.showReloadButton ? 'flex' : 'none'}"
                        title="${this.reloadButtonTitle}">
                        <dbp-icon name="reload"></dbp-icon>
                    </a>
                </div>
                <div id="person-select-dropdown"></div>
            </div>
        `;
    }
}
