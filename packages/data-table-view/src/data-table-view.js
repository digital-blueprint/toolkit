import $ from 'jquery';
import dt from 'datatables.net';
import {setting, getAPiUrl, getAssetURL, } from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import JSONLD from 'vpu-common/jsonld';
import commonUtils from 'vpu-common/utils';

dt(window, $);

class DataTableView extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = getAPiUrl();
        this.jsonld = null;
        this.value = null;
        this.filter = null;
        this.apiUrl = null;
        this.blacklist_cols = '';
    }

    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            filter: { type: String },
            apiUrl: { type: String, attribute: false },
            blacklist_cols: { type: String, attribute: 'blacklisted-columns' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        JSONLD.initialize(this.entryPointUrl, function (jsonld) {
            that.jsonld = jsonld;
            that.apiUrl = that.jsonld.getApiUrlForIdentifier("http://schema.org/" + that.value);
        });

        // disabled, load first on toggle to visible
        window.addEventListener("vpu-auth-init", () => that.loadWebPageElement());
    }

    loadWebPageElement() {
        if (window.VPUAuthToken === undefined || window.VPUAuthToken === "") {
            return;
        }
        if (this.apiUrl === null || this.jsonld === null) {
            return;
        }

        const apiUrlWithFilter = this.apiUrl + '?search=' + this.filter;
        console.log('apiUrlWithFilter = ' + apiUrlWithFilter);

        var that = this;

        fetch(apiUrlWithFilter, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
        })
            .then(res => res.json())
            .then(function (data) {
                console.log(data);
                // TODO
                console.log(data['hydra:member']);
                const persons = data['hydra:member'];
                const blacklist_cols = that.blacklist_cols.split(' ');
                let cols = [];
                for(let i=0; i < persons.length; ++i) {
                    let new_cols = Object.keys(persons[i]);
                    cols = cols.concat(new_cols.filter(item => (!~cols.indexOf(item) && !~blacklist_cols.indexOf(item))));
                }
                console.log('cols = ' + cols);
                let rows = [];
                let columns = [];
                for(let i=0; i < cols.length; ++i) {
                    columns[i] = { title: cols[i] };
                    for(let j=0; j < persons.length; ++j) {
                        if (rows[j] === undefined) {
                            rows[j] = [];
                        }
                        rows[j][i] = persons[j][cols[i]] || '';
                    }
                }

                const lang_de_url = 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/German.json';
                const lang_en_url = 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/English.json';

                const table = $(that.shadowRoot.querySelector('#dt')).DataTable({
                    destroy: true,
                    language: {
                        url: that.lang === 'de' ? lang_de_url : lang_en_url,
                    },
                    columns: columns,
                    data: rows,
                    }
                );

            })
            .catch();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "filter":
                    this.loadWebPageElement();
                    break;
                case "value":
                case "entryPointUrl":
                    const that = this;
                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                        that.apiUrl = that.jsonld.getApiUrlForIdentifier("http://schema.org/" + that.value);
                    });
                    this.loadWebPageElement();
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
        var dt_css = getAssetURL('datatables/css/jquery.dataTables.min.css')
        return html`
            <link rel="stylesheet" href="${dt_css}">
            <style>
            </style>
            <table id="dt" class="display" style="width:100%">
            </table>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
