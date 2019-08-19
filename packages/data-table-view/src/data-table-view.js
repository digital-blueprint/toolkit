import $ from 'jquery';
import dt from 'datatables.net';
import resp from 'datatables.net-responsive';
import resp2 from 'datatables.net-responsive-dt';
import {setting, getAPiUrl, getAssetURL, } from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import JSONLD from 'vpu-common/jsonld';
import commonUtils from 'vpu-common/utils';

dt(window, $);
resp(window, $);
resp2(window, $);

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
        this.responsive = null;
        this.paging = false;
        this.searching = false;
        //
        this.is_loading = false;
        this.wait_until_all_loaded = false;
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
            paging: { type: Boolean },
            searching: { type: Boolean },
            is_loading: { type: Boolean, attribute: false },
            wait_until_all_loaded: { type: Boolean, attribute: 'wait-until-all-loaded'}
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        JSONLD.initialize(this.entryPointUrl, function (jsonld) {
            that.jsonld = jsonld;
            try {
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
            } catch (e) {
                that.table_columns = ['message from server'];
                that.setup_columns();
                that.set_datatable([{title: 'message from server', visible: true}]);
                that.table.row.add(['<span style="color:red;background:lightgray;">' + e.toString() + '</span>']);
            }
        });

        // disabled, load first on toggle to visible
        window.addEventListener("vpu-auth-init", () => that.loadWebPageElement());
    }

    setup_columns() {
        if (this.whitelist_cols === '*') {
            const blacklist_cols = this.blacklist_cols.split(' ');
            this.show_columns = this.table_columns.filter(col => blacklist_cols.indexOf(col) === -1);
        } else {
            this.show_columns = this.whitelist_cols.split(' ');
        }
        this.display_columns = this.show_columns.slice();
        for(let i=0; i < this.table_columns.length; ++i) {
            if (this.display_columns.indexOf(this.table_columns[i]) === -1) {
                this.display_columns.push(this.table_columns[i]);
            }
        }
    }

    set_datatable(columns) {
        const lang_de_url = 'datatables/i18n/German.json';
        const lang_en_url = 'datatables/i18n/English.json';

        this.table = $(this.shadowRoot.querySelector('#dt')).DataTable({
            destroy: true,
            autoWidth: false,
            language: {
                url: this.lang === 'de' ? lang_de_url : lang_en_url,
            },
            columns: columns,
            data: [],
            paging: this.paging,
            searching: this.searching,
        });

        try {
            new $.fn.dataTable.Responsive(this.table, {
                details: true
            });
        } catch (e) {
            // XXX: it throws, but it still works
        }
    }

    update_datatable(columns, rows) {
        //console.log('rows = ' + rows);
        const that = this;
        if (this.table) {
            columns.forEach(function (item, index) {
                let i = that.display_columns.indexOf(item.title);
                // console.log('item = {' + item.title + ', ' + item.visible + '} i = ' + i);
                that.table.columns([i]).visible(item.visible == true);
                // TODO that.table.columns([index]).title = item.title;
            });
            rows.forEach(row => this.table.row.add(row));
            // now ready to draw
            this.table.draw();
        }
    }

    async loader(page) {
        const apiUrlWithFilter = this.apiUrl + '?search=' + this.filter + '&page=' + page;
        const that = this;

        return await fetch(apiUrlWithFilter, {
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
                for (let i = 0; i < that.display_columns.length; ++i) {
                    columns[i] = {
                        title: that.display_columns[i],
                        visible: that.show_columns.indexOf(that.display_columns[i]) > -1
                    };
                    if (items) {
                        for (let j = 0; j < items.length; ++j) {
                            if (rows[j] === undefined) {
                                rows[j] = [];
                            }
                            rows[j][i] = items[j][that.display_columns[i]] || '';
                        }
                    }
                }

                that.update_datatable(columns, rows);

                if (!that.wait_until_all_loaded)
                    that.is_loading = false;

                return items.length;
            });
    }
    async call_loader(page) {
        return await this.loader(page);
    }

    async loadWebPageElement() {
        if (window.VPUAuthToken === undefined || window.VPUAuthToken === "") {
            return;
        }
        if (this.apiUrl === null || this.jsonld === null) {
            return;
        }

        this.is_loading = true;
        let page = 1;
        while (await this.call_loader(page++) === 50) {}
        this.is_loading = false;
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            // noinspection FallThroughInSwitchStatementJS
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang).catch(e => { console.log(e)});
                    break;
                case "whitelist_cols":
                case "blacklist_cols":
                    this.setup_columns();
                case "filter":
                case "paging":
                case "searching":
                    if (this.table)
                        this.table.clear();
                    this.loadWebPageElement().catch(e => { console.log(e)});
                    break;
                case "value":
                case "entryPointUrl":
                    const that = this;
                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                        that.apiUrl = that.jsonld.getApiUrlForIdentifier("http://schema.org/" + that.value);
                    });
                    this.loadWebPageElement().catch(e => { console.log(e)});
                    break;
                default:
                    // nothing to do for this properties
            }
        });

        super.update(changedProperties);
    }

    render() {
        let dt_css = getAssetURL('datatables/css/jquery.dataTables.min.css');
        let rs_css = getAssetURL('datatables/css/responsive.dataTables.css');
        return html`
            <link rel="stylesheet" href="${dt_css}">
            <link rel="stylesheet" href="${rs_css}">
            <style>
                #dt-parent {
                    display: block;
                    width: 100%;
                    min-height: 50px;
                    position: relative;
                }
                #cover {
                    display: ${this.is_loading ? 'block' : 'none'};
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    /* margin: 0 auto; */
                    z-index: 999;
                    background: white url("data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==") center center no-repeat;
                    opacity: .9;
                }
                #dt {
                    min-width: 100px;
                    width: 100%;
                }
            </style>
            <div id="dt-parent">
                ${unsafeHTML('<div><table id="dt" class="display"></table></div>')}
                <div id="cover"></div>
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
