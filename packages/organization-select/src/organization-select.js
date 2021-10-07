import $ from 'jquery';
import select2 from 'select2';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {createInstance} from './i18n.js';
import {css, html} from 'lit-element';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2LangDe from "@dbp-toolkit/organization-select/src/i18n/de/select2";
import select2LangEn from "@dbp-toolkit/organization-select/src/i18n/en/select2";
import JSONLD from "@dbp-toolkit/common/jsonld";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

select2(window, $);

export class OrganizationSelect extends AdapterLitElement {
    constructor() {
        super();
        this.auth = {};
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.entryPointUrl = '';
        this.jsonld = null;
        this.organizations = [];
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this.selectId = 'select-organization-' + commonUtils.makeId(24);
        this.cache = {};
        this.value = '';
        this.context = '';

        this._onDocumentClicked = this._onDocumentClicked.bind(this);
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            value: {type: String, reflect: true},
            context: {type: String},
            auth: { type: Object },
        };
    }

    $(selector) {
        return $(this.shadowRoot.querySelector(selector));
    }

    select2IsInitialized(elm) {
        return elm !== null && elm.hasClass("select2-hidden-accessible");
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClicked);
        this.updateSelect2();
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }

    async load_organizations() {
        if (this.cache[this.lang] === undefined) {
            this.cache[this.lang] = this.getAssociatedOrganizations();
        }
        this.organizations = await this.cache[this.lang];
    }

    _needsLoading() {
        return this.cache[this.lang] === undefined;
    }

    _onDocumentClicked(ev) {
        // Close the popup when clicking outside of select2
        if (!ev.composedPath().includes(this)) {
            const $select = this.$('#' + this.selectId);
            if ($select.length && this.select2IsInitialized($select)) {
                $select.select2('close');
            }
        }
    }

    _clearSelect2() {
        const $select = this.$('#' + this.selectId);
        console.assert($select.length, "select2 missing");

        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this.select2IsInitialized($select)) {
            $select.off('select2:select');
            $select.empty().trigger('change');
            $select.select2('destroy');
        }
    }

    async updateSelect2() {
        const i18n = this._i18n;
        await this.updateComplete;

        const $select = this.$('#' + this.selectId);
        console.assert($select.length, "select2 missing");

        // Show an empty select until we load the organizations
        if (this._needsLoading()) {
            this._clearSelect2();

            $select.select2({
                width: '100%',
                language: this.lang === "de" ? select2LangDe() : select2LangEn(),
                placeholder: i18n.t('select-organization.loading'),
                data: [],
                disabled: true
            });
        }

        this.removeAttribute("data-organizations-loaded");
        await this.load_organizations();
        this.setAttribute("data-organizations-loaded", "");

        this._clearSelect2();

        const data = this.organizations.map((item) => {
            return {'id': item.object["@id"], 'text': item.code + ' ' + item.name};
        });

        data.sort((a, b) => {
            return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
        });

        $select.select2({
            width: '100%',
            language: this.lang === "de" ? select2LangDe() : select2LangEn(),
            placeholder: i18n.t('select-organization.placeholder'),
            dropdownParent: this.$('#select-organization-dropdown'),
            data: data,
            disabled: false
        }).on("select2:select", () => {
            this.value = $select.select2('data')[0].id;
        });

        // If none is selected, default to the first one
        if (!this.value.length && data.length) {
            this.value = data[0].id;
        }

        // Apply the selection
        $select.val(this.value).trigger('change');
    }

    fireEvent() {
        const organization = this.organizations.find((item) => {
            return item.object["@id"] === this.value;
        });

        const $this = $(this);

        if (organization === undefined) {
            $this.attr("data-object", null);
            $this.data("object", null);
            return;
        }

        this.setDataObject(organization);

        const event = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                'value': organization.value,
                'object': organization.object,
            }
        });
        this.dispatchEvent(event);
    }

    setDataObject(organization) {
        const $this = $(this);
        $this.attr("data-object", JSON.stringify(organization.object));
        $this.data("object", organization.object);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    this._i18n.changeLanguage(this.lang);
                    this.updateSelect2();
                    break;
                case "value": {
                    this.updateSelect2();
                    this.fireEvent();
                    break;
                }
                case "context": {
                    delete this.cache[this.lang];
                    this.updateSelect2();
                    break;
                }
                case "entryPointUrl":
                    JSONLD.getInstance(this.entryPointUrl).then((jsonld) => {
                        this.jsonld = jsonld;
                    }, {}, this.lang);
                    break;
                case "auth":
                    this.initAuthPersonOnce().then();
                    break;
                default:
            }
        });

        super.update(changedProperties);
    }

    async initAuthPersonOnce() {
        if (!this.auth.person || this.hasAttribute("data-auth-person-init-finished")) {
            return;
        }

        this.cache = {};
        await this.updateSelect2();

        // this attribute is used in end2end tests
        this.setAttribute("data-auth-person-init-finished", "");
    }

    /**
     * Returns the list of assigned libraries of the current user
     *
     * @returns {Array} list of organization objects
     */
    async getAssociatedOrganizations() {
        if (!this.auth.person) {
            return [];
        }

        let orgUrl = this.entryPointUrl + '/people/' +
            encodeURIComponent(this.auth['person-id']) +
            '/organizations' +
            '?context=' + encodeURIComponent(this.context) +
            '&lang=' + encodeURIComponent(this.lang);

        let response = await fetch(orgUrl, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Authorization': 'Bearer ' + this.auth.token,
            },
        });

        if (!response.ok)
            throw new Error(response.statusText);

        let data = await response.json();

        let results = [];
        for (let org of data['hydra:member']) {
            let organization = {
                id: org.identifier,
                code: org.alternateName,
                name: org.name,
                url: org.url,
                value: org['@id'],
                object: org,
            };
            results.push(organization);
            if (organization.value === this.value) {
                this.setDataObject(organization);
            }
        }

        return results;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getNotificationCSS()}
            ${commonStyles.getSelect2CSS()}
        `;
    }

    render() {
        const select2CSS = commonUtils.getAssetURL(select2CSSPath);
        return html`
            <link rel="stylesheet" href="${select2CSS}">

        <div class="select">
            <div class="select2-control control">
                <!-- https://select2.org-->
                <select id="${this.selectId}" name="select-organization" class="select" style="visibility: hidden;"></select>
            </div>
            <div id="select-organization-dropdown"></div>
        </div>

        `;
    }
}