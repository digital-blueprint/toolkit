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
        this.whitelist_cols = '*';
        this.blacklist_cols = '';
        this.table_columns = []; // all possible columns, defined by API entity
        this.show_columns = []; // all columns visible in table, defined by property whhitelist/blacklist
        this.display_columns = []; // all possible columns, in desired order for the table
        // datatable properties
        this.table = null;
        this.paging = 1;
        this.searching = 1;
        //
        this.is_loading = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            filter: { type: String },
            apiUrl: { type: String, attribute: false },
            whitelist_cols: { type: String, attribute: 'whitelisted-columns' },
            blacklist_cols: { type: String, attribute: 'blacklisted-columns' },
            table_columns: { type: Array, attribute: false },
            show_columns: { type: Array, attribute: false },
            display_columns: { type: Array, attribute: false },
            table: { type: Object, attribute: false },
            paging: { type: String },
            searching: { type: String },
            is_loading: { type: Boolean },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        JSONLD.initialize(this.entryPointUrl, function (jsonld) {
            that.jsonld = jsonld;
            that.apiUrl = that.jsonld.getApiUrlForIdentifier("http://schema.org/" + that.value);
            that.table_columns = that.jsonld.entities[that.value]['hydra:supportedProperty'].map(obj => obj['hydra:title']);

            // display empty table
            that.setup_columns();
            let columns = [];
            for (let i = 0; i < that.display_columns.length; ++i) {
                columns[i] = {
                    title: that.display_columns[i],
                    visible: that.show_columns.indexOf(that.display_columns[i]) > -1
                };
            }
            that.set_datatable(columns);
            if (that.filter) {
                that.loadWebPageElement();
            }
        });

        // disabled, load first on toggle to visible
        window.addEventListener("vpu-auth-init", () => that.loadWebPageElement());
    }

    setup_columns() {
        //let cols = this.table_columns.slice();

        if (this.whitelist_cols === '*') {
            const blacklist_cols = this.blacklist_cols.split(' ');
            this.show_columns = this.table_columns.filter(col => blacklist_cols.indexOf(col) === -1);
        } else {
            this.show_columns = this.whitelist_cols.split(' ');
        }
        this.display_columns = this.show_columns.slice();
        for(let i=0; i < this.table_columns.length; ++i) {
            if (this.display_columns.indexOf(this.table_columns[i]) === -1)
                this.display_columns.push(this.table_columns[i]);
        }

    }

    set_datatable(columns) {
        const lang_de_url = 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/German.json';
        const lang_en_url = 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/English.json';

        this.table = $(this.shadowRoot.querySelector('#dt')).DataTable({
            destroy: true,
            language: {
                url: this.lang === 'de' ? lang_de_url : lang_en_url,
            },
            columns: columns,
            data: [],
            paging: this.paging > 0,
            searching: this.searching > 0,
        });
    }

    update_datatable(columns, rows) {
        //console.log('rows = ' + rows);
        const that = this;
        if (this.table) {
            this.table.clear();
            columns.forEach(function (item, index) { that.table.columns([index]).visible(item.visible === true); });
            rows.forEach(row => this.table.row.add(row));
            this.table.draw();
        }
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

        const that = this;
        this.is_loading = true;

        fetch(apiUrlWithFilter, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
        })
            .then(res => res.json())
            .then(function (data) {
                // TODO
                that.setup_columns();

                const items = data['hydra:member'];
                let rows = [];
                let columns = [];
                for(let i=0; i < that.display_columns.length; ++i) {
                    columns[i] = {
                        title: that.display_columns[i],
                        visible: that.show_columns.indexOf(that.display_columns[i]) > -1
                    };
                    for(let j=0; j < items.length; ++j) {
                        if (rows[j] === undefined) {
                            rows[j] = [];
                        }
                        rows[j][i] = items[j][that.display_columns[i]] || '';
                    }
                }

                that.update_datatable(columns, rows);
                that.is_loading = false;
            })
            .catch();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            // noinspection FallThroughInSwitchStatementJS
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "filter":
                case "whitelist_cols":
                case "blacklist_cols":
                case "paging":
                case "searching":
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
        let dt_css = getAssetURL('datatables/css/jquery.dataTables.min.css');
        return html`
            <link rel="stylesheet" href="${dt_css}">
            <style>
                #cover {
                    min-width: 100px;
                    display: ${this.is_loading ? 'block' : 'none'};
                    position: relative; height: 100%; width: 100%; top: 0; left: 0; background: #fff; z-index:9999;
                }
                #cover img {
                    display: block;
                    margin 0 auto;
                }
            </style>
            <div id="dt-parent">
                <div id="cover">
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==">
                </div>
                <table id="dt" class="display" style="width:100%"></table>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
