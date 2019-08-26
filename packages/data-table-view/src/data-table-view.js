import $ from 'jquery';
import dt from 'datatables.net';
import resp from 'datatables.net-responsive';
import resp2 from 'datatables.net-responsive-dt';
//import {getAssetURL,} from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import commonUtils from 'vpu-common/utils';

dt(window, $);
resp(window, $);
resp2(window, $);

class DataTableView extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        // datatable properties
        this.table = null;
        this.responsive = null;
        this.paging = false;
        this.searching = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            table: { type: Object, attribute: false },
            paging: { type: Boolean },
            searching: { type: Boolean },
        };
    }

    set_datatable() {
        const lang_de_url = 'datatables/i18n/German.json';
        const lang_en_url = 'datatables/i18n/English.json';

        if (this.table) {
            this.table.destroy();
        }
        this.table = $(this.querySelector('table')).DataTable({
            autoWidth: false,
            language: {
                url: this.lang === 'de' ? lang_de_url : lang_en_url,
            },
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

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang).catch(e => { console.log(e)});
            }
        });

        super.update(changedProperties);
        this.updateComplete.then(this.set_datatable()).catch(e => { console.log(e)});
    }

    render() {
        return html`
            <style>
            </style>
            <slot name="table"></slot>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
