import $ from 'jquery';
import dt from 'datatables.net';
import resp from 'datatables.net-responsive';
import resp2 from 'datatables.net-responsive-dt';
import jszip from 'jszip/dist/jszip.js';
import bttn from 'datatables.net-buttons-dt';
import bttn2 from 'datatables.net-buttons';
import bttnHtml5 from 'datatables.net-buttons/js/buttons.html5.js';
import bttnPrint from 'datatables.net-buttons/js/buttons.print.js';
import {i18n} from './i18n';
import {css, html, LitElement} from 'lit-element';
import de from '../assets/datatables/i18n/German';
import en from '../assets/datatables/i18n/English';

import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';

dt(window, $);
resp(window, $);
resp2(window, $);
bttn(window, $);
bttn2(window, $);
bttnHtml5(window, $, jszip);
bttnPrint(window, $);

class DataTableView extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        // datatable properties
        this.table = null;
        this.responsive = null;
        this.paging = false;
        this.searching = false;
        this.columns = [];
        this.columnDefs = [];
        this.data = [];
        this.cssStyle = '';
        this.exportable = false;
        this.exportName = 'Data Export';
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
            cssStyle: { type: String, attribute: false },
            exportable: { type: Boolean },
            exportName: { type: String, attribute: 'export-name' }
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

        if (!this.columns.length) {
            if (data.length)
                throw new Error('columns not set-up');
            return;
        }

        this.table = $(this.shadowRoot.querySelector('table')).DataTable({
            destroy: true,
            autoWidth: false,
            language: lang_obj,
            paging: this.paging,
            searching: this.searching,
            columns: this.columns,
            columnDefs: this.columnDefs,
            dom: (this.exportable ? '<"export-btn"B>' : '') + 'lfrtip',
            buttons: [
                {
                    extend: 'csvHtml5',
                    text: 'CSV',
                    title: this.exportName,
                    filename: this.exportName,
                },
                {
                    extend: 'excelHtml5',
                    text: 'XSLX',
                    title: this.exportName,
                    filename: this.exportName,
                },
                {
                    extend: 'print',
                    text: 'Drucken',
                    title: this.exportName,
                },
            ]
        });

        try {
            new $.fn.dataTable.Responsive(this.table, {
                details: true
            });
        } catch (e) {
            // XXX: it throws, but it still works
        }

        this.data = data;

        this.table.clear().rows.add(this.data).draw();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang).catch(e => { console.log(e)});
            }
        });

        super.update(changedProperties);

        this.updateComplete.then(this.set_datatable(this.data)).catch(e => { console.log(e)});
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}

            .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
                color: var(--vpu-muted-text);
                border-radius: var(--vpu-border-radius);
                background: transparent;
            }
            .export-btn {
                margin-bottom: .6rem;
            }
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-data-table-view-src');
        let dt_css = commonUtils.getAssetURL('local/vpu-data-table-view/css/jquery.dataTables.min.css');
        let rs_css = commonUtils.getAssetURL('local/vpu-data-table-view/css/responsive.dataTables.min.css');
        let bt_css = commonUtils.getAssetURL('local/vpu-data-table-view/css/buttons.dataTables.min.css');

        return html`
            <link rel="stylesheet" href="${dt_css}">
            <link rel="stylesheet" href="${rs_css}">
            <link rel="stylesheet" href="${bt_css}">
            <style>
                ${this.cssStyle}
            </style>
            <div><table></table></div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
