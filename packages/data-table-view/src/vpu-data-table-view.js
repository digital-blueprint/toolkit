import $ from 'jquery';
import dt from 'datatables.net';
import resp from 'datatables.net-responsive';
import resp2 from 'datatables.net-responsive-dt';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import de from '../assets/datatables/i18n/German';
import en from '../assets/datatables/i18n/English';

import * as commonUtils from 'vpu-common/utils';
import * as utils from "./utils";
import bulmaCSSPath from "bulma/css/bulma.min.css";

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
        this.columns = [{title: 'uninitialized'}];
        this.columnDefs = [];
        this.data = [];
        this.cc = 1;
        this.cssStyle = '';
    }

    setCSSStyle(style) {
        this.cssStyle = style;
    }

    static get properties() {
        return {
            lang: { type: String },
            table: { type: Object, attribute: false },
            paging: { type: Boolean },
            searching: { type: Boolean },
            columns: { type: Array, attribute: false },
            columnDefs: { type: Array, attribute: false },
            data: { type: Array, attribute: false },
            cc: {type: Number, attribute: 'columns-count'},
            cssStyle: { type: String, attribute: false },
        };
    }

    set_columns(cols) {
        this.columns = cols;
        return this;
    }
    set_columnDefs(defs) {
        this.columnDefs = defs;
        return this;
    }
    add_row(row) {
        this.data.push(row);
        this.table.row.add(row);
        return this;
    }
    draw() {
        this.table.draw();
        return this;
    }

    set_datatable(data) {
        const lang_obj = this.lang === 'de' ? de : en;

        if (this.cc > this.columns.length) {
            for (let i = this.columns.length; i < this.cc; ++i) {
                this.columns.push({title: ''});
            }
        }

        this.table = $(this.shadowRoot.querySelector('table')).DataTable({
            destroy: true,
            autoWidth: false,
            language: lang_obj,
            paging: this.paging,
            searching: this.searching,
            columns: this.columns,
            columnDefs: this.columnDefs,
        });

        try {
            new $.fn.dataTable.Responsive(this.table, {
                details: true
            });
        } catch (e) {
            // XXX: it throws, but it still works
        }
        if (data) {
            this.data = data;
        }
        this.table.clear().rows.add(this.data).draw();
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
        commonUtils.initAssetBaseURL('vpu-data-table-view-src');
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);
        let dt_css = commonUtils.getAssetURL('local/vpu-data-table-view/css/jquery.dataTables.min.css');
        let rs_css = commonUtils.getAssetURL('local/vpu-data-table-view/css/responsive.dataTables.css');

        return html`
            <link rel="stylesheet" href="${bulmaCSS}">
            <link rel="stylesheet" href="${dt_css}">
            <link rel="stylesheet" href="${rs_css}">
            <style>
                ${this.cssStyle}
            </style>
            <div><table></table></div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
