import $ from 'jquery';
import utils from './utils.js';
import select2 from 'select2';
import select2LangDe from './i18n/de/select2'
import select2LangEn from './i18n/en/select2'
import JSONLD from 'vpu-common/jsonld';
import {html} from 'lit-element';
import {i18n, dateTimeFormat, numberFormat} from './i18n.js';
import VPULitElement from 'vpu-common/vpu-lit-element';

select2(window, $);

class PersonSelect extends VPULitElement {

    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
            const that = this;
            const $that = $(this);
            let lastResult = {};

            JSONLD.initialize(utils.getAPiUrl(), function (jsonld) {
                // find the correct api url for a person
                const apiUrl = jsonld.getApiUrlForIdentifier("http://schema.org/Person");
                // const apiUrl = jsonld.getApiUrlForEntityName("Event");

                // the mapping we need for Select2
                const localContext = {
                    "id": "@id",
                    "text": "http://schema.org/name"
                };

                const $select = that.$('#person-select');

                $select.select2({
                    width: '100%',
                    language: that.lang === "de" ? select2LangDe() : select2LangEn(),
                    minimumInputLength: 2,
                    placeholder: i18n.t('person-select.placeholder'),
                    dropdownParent: that.$('#person-select-dropdown'),
                    ajax: {
                        delay: 250,
                        url: apiUrl,
                        contentType: "application/ld+json",
                        beforeSend: function( jqXHR ) {
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

                            const results = jsonld.transformMembers(data, localContext);

                            console.log("results");
                            console.log(results);

                            return {
                                results: results
                            };
                        }
                    }
                }).on("select2:select", function(e) {
                    // set value custom element
                    const identifier = e.params.data.id;
                    $that.attr("value", identifier);
                    $that.val(identifier);

                    const object = utils.findObjectInApiResults(identifier, lastResult);
                    $that.attr("data-object", JSON.stringify(object));

                    // fire a change event
                    that.dispatchEvent(new CustomEvent('change', {
                        detail: {
                            value: identifier,
                        },
                        bubbles: true
                    }));
                });

                // close the selector on blur of the web component
                $(that).blur(() => {
                    // the 500ms delay is a workaround to actually get an item selected when clicking on it,
                    // because the blur gets also fired when clicking in the selector
                    setTimeout(() => {$select.select2('close')}, 500);
                });
            });
        })
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
