import $ from 'jquery';
import {getAssetURL, findObjectInApiResults} from './utils.js';
import select2 from 'select2';
import select2LangDe from './i18n/de/select2'
import select2LangEn from './i18n/en/select2'
import JSONLD from 'vpu-common/jsonld';
import {html} from 'lit-element';
import {i18n} from './i18n.js';
import VPULitElementJQuery from 'vpu-common/vpu-lit-element-jquery';
import * as commonUtils from 'vpu-common/utils';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import {send as notify} from "vpu-common/notification";


select2(window, $);

class PersonSelect extends VPULitElementJQuery {

    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = commonUtils.getAPiUrl();
        this.jsonld = null;
        this.$select = null;
        this.active = false;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this.selectId = 'person-select-' + commonUtils.makeId(24);
        this.value = '';
    }

    static get properties() {
        return {
            lang: { type: String },
            active: { type: Boolean, attribute: false },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            value: { type: String },
        };
    }

    clear() {
        this.$select.val(null).trigger('change').trigger('select2:unselect');
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        this.updateComplete.then(()=>{
            that.$select = that.$('#' + that.selectId);

            // close the selector on blur of the web component
            $(that).blur(() => {
                // the 500ms delay is a workaround to actually get an item selected when clicking on it,
                // because the blur gets also fired when clicking in the selector
                setTimeout(() => {that.$select.select2('close')}, 500);
            });
        });
    }

    /**
     * Initializes the Select2 selector
     */
    initSelect2() {
        const that = this;
        const $this = $(this);
        let lastResult = {};

        // find the correct api url for a person
        const apiUrl = this.jsonld.getApiUrlForIdentifier("http://schema.org/Person");
        // const apiUrl = this.jsonld.getApiUrlForEntityName("Event");

        // the mapping we need for Select2
        const localContext = {
            "id": "@id",
            "text": "http://schema.org/name"
        };

        if (this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
        }

        this.$select.select2({
            width: '100%',
            language: this.lang === "de" ? select2LangDe() : select2LangEn(),
            minimumInputLength: 2,
            placeholder: i18n.t('person-select.placeholder'),
            dropdownParent: this.$('#person-select-dropdown'),
            ajax: {
                delay: 250,
                url: apiUrl,
                contentType: "application/ld+json",
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', 'Bearer ' + window.VPUAuthToken);
                },
                data: function (params) {
                    return {
                        search: params.term.trim(),
                        'library-only': 1
                    };
                },
                processResults: function (data) {
                    console.log(data);
                    lastResult = data;

                    const results = that.jsonld.transformMembers(data, localContext);

                    console.log("results");
                    console.log(results);

                    return {
                        results: results
                    };
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (textStatus !== "abort") {
                        const body = jqXHR.responseJSON !== undefined && jqXHR.responseJSON["hydra:description"] !== undefined ?
                            jqXHR.responseJSON["hydra:description"] : textStatus;

                        notify({
                            "summary": i18n.t('person-select.error-summary'),
                            "body": body,
                            "type": "danger",
                        });
                    }
                }
            }
        }).on("select2:select", function (e) {
            // set value custom element
            const identifier = e.params.data.id;
            $this.attr("value", identifier);
            $this.val(identifier);

            const object = findObjectInApiResults(identifier, lastResult);
            $this.attr("data-object", JSON.stringify(object));
            $this.data("object", object);

            // fire a change event
            that.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: identifier,
                },
                bubbles: true
            }));
        });

        // preset a person
        if (this.value !== '') {
            const apiUrl = this.entryPointUrl + this.value;

            fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': 'Bearer ' + window.VPUAuthToken,
                },
            })
            .then(result => {
                if (!result.ok) throw result;
                return result.json();
            })
            .then((person) => {
                const identifier = person["@id"];
                const option = new Option(person.name, identifier, true, true);
                $this.attr("data-object", JSON.stringify(person));
                $this.data("object", person);
                that.$select.append(option).trigger('change');

                // fire a change event
                that.dispatchEvent(new CustomEvent('change', {
                    detail: {
                        value: identifier,
                    },
                    bubbles: true
                }));
            }).catch(() => {});
        }

        return this.$select;
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);

                    if (this.$select !== null && this.$select.hasClass("select2-hidden-accessible")) {
                        // no other way to set an other language at runtime did work
                        this.initSelect2();
                    }
                    break;
                case "value":
                    if (this.$select !== null && this.$select.hasClass("select2-hidden-accessible")) {
                        this.initSelect2();
                    }
                    break;
                case "entryPointUrl":
                    const that = this;

                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                        that.active = true;
                        that.$select = that.initSelect2();
                    });
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        const select2CSS = getAssetURL(select2CSSPath);

        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <link rel="stylesheet" href="${select2CSS}">
            <style>
                #${this.selectId} {
                    width: 100%;
                }
            </style>

            <!-- https://select2.org-->
            <select id="${this.selectId}" name="person" class="select" ?disabled=${!this.active}>${!this.active ? html`<option value="" disabled selected>${ i18n.t('person-select.login-required')}</option>` : ''}</select>
            <div id="person-select-dropdown"></div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-select', PersonSelect);
