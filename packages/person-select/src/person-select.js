import $ from 'jquery';
import utils from './utils.js';
import select2 from 'select2';
import select2LangDe from './i18n/de/select2'
import select2LangEn from './i18n/en/select2'
import JSONLD from 'vpu-common/jsonld';
import {html} from 'lit-element';
import {i18n, dateTimeFormat, numberFormat} from './i18n.js';
import VPULitElementJQuery from 'vpu-common/vpu-lit-element-jquery';

select2(window, $);

class PersonSelect extends VPULitElementJQuery {

    constructor() {
        super();
        this.lang = 'de';
        this.jsonld = null;
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            JSONLD.initialize(utils.getAPiUrl(), function (jsonld) {
                that.jsonld = jsonld;
                const $select = that.initSelect2();

                // close the selector on blur of the web component
                $(that).blur(() => {
                    // the 500ms delay is a workaround to actually get an item selected when clicking on it,
                    // because the blur gets also fired when clicking in the selector
                    setTimeout(() => {$select.select2('close')}, 500);
                });
            });
        })
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

        const $select = this.$('#person-select');

        $select.select2({
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
                        search: params.term,
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
                }
            }
        }).on("select2:select", function (e) {
            // set value custom element
            const identifier = e.params.data.id;
            $this.attr("value", identifier);
            $this.val(identifier);

            const object = utils.findObjectInApiResults(identifier, lastResult);
            $this.attr("data-object", JSON.stringify(object));

            // fire a change event
            that.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: identifier,
                },
                bubbles: true
            }));
        });

        return $select;
    }

    updated(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);

                const $select = this.$('#person-select.select2-hidden-accessible');

                if ($select.length > 0) {
                    // no other way to set an other language at runtime did work
                    $select.select2('destroy');
                    this.initSelect2();
                }
            }
        });
    }

    render() {
        const select2CSS = utils.getAssetURL('select2/css/select2.min.css');

        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <link rel="stylesheet" href="${select2CSS}">
            <style>
                #person-select {
                    width: 100%;
                }
            </style>

            <!-- https://select2.org-->
            <select id="person-select" name="person" class="select"></select>
            <div id="person-select-dropdown"></div>
        `;
    }
}

customElements.define('vpu-library-person-select', PersonSelect);
