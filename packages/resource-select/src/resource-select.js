import $ from 'jquery';
import select2 from 'select2';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {createInstance, setOverridesByGlobalCache} from './i18n.js';
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
        this._url = null;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this._selectId = 'select-resource-' + commonUtils.makeId(24);

        this.auth = {};
        this.lang = this._i18n.language;
        this.langDir = '';
        this.entryPointUrl = null;
        this.resourcePath = null;
        this.value = null;
        this.valueObject = null;

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

        // set translation overrides if requested
        if (this.langDir != '') {
          setOverridesByGlobalCache(this._i18n, this);
        }
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
        }
    }

    buildUrl(select, url) {
        return url;
    }

    formatResource(select, resource) {
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
        return this.formatResource(this, resource);
    }

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
        await this._updateResources();
        await this._updateSelect2();
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
            placeholder: i18n.t('select.loading'),
            data: [],
            disabled: true,
        });
    }

    async _updateResources() {
        let url = this._getUrl();
        if (url === null || url === this._url) {
            return;
        }

        this._resources = await hydra.getCollection(url, this.auth.token);
        this._url = url;
        this._setValue(this.value);
    }

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
                placeholder: i18n.t('select.placeholder'),
                dropdownParent: this._$('#select-resource-dropdown'),
                data: data,
                disabled: false,
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

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }

        if (
            changedProperties.has('lang') ||
            changedProperties.has('value') ||
            changedProperties.has('resourcePath') ||
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('auth')
        ) {
            this._updateAll();
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
