import $ from 'jquery';
import dt from 'datatables.net';
import resp from 'datatables.net-responsive';
import resp2 from 'datatables.net-responsive-dt';
import jszip from 'jszip/dist/jszip.js';
import bttn from 'datatables.net-buttons-dt';
import bttn2 from 'datatables.net-buttons';
import bttnHtml5 from 'datatables.net-buttons/js/buttons.html5.js';
import bttnPrint from 'datatables.net-buttons/js/buttons.print.js';
import {createInstance} from './i18n';
import {css, html, unsafeCSS} from 'lit-element';
import de from '../assets/datatables/i18n/German';
import en from '../assets/datatables/i18n/English';
import {getIconSVGURL} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {name as pkgName} from './../package.json';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

dt(window, $);
resp(window, $);
resp2(window, $);
bttn(window, $);
bttn2(window, $);
bttnHtml5(window, $, jszip);
bttnPrint(window, $);

export class DataTableView extends AdapterLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
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
        this.columnSearching = false;
        this.defaultOrder = [];
    }

    setCSSStyle(style) {
        this.cssStyle = style;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            table: { type: Object, attribute: false },
            paging: { type: Boolean },
            searching: { type: Boolean },
            columns: { type: Array, attribute: false },
            columnDefs: { type: Array, attribute: false },
            data: { type: Array, attribute: false },
            cssStyle: { type: String, attribute: false },
            exportable: { type: Boolean },
            exportName: { type: String, attribute: 'export-name' },
            columnSearching: { type: Boolean, attribute: 'column-searching'},
            defaultOrder: { type: Array, attribute: 'default-order'}
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
    set_defaultOrder(order) {
        this.defaultOrder = order;
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
    columnSearch(col, str) {
        this.table.column(col).search(str).draw();
    }
    columnReduce(col, func, init=0) {
        return this.table.column(col, { search: 'applied' }).data().reduce( func, init);
    }
    on(eventName, func) {
        this.table.on(eventName, func);
        return this;
    }

    set_datatable(data, languageChange = false) {
        const lang_obj = this.lang === 'de' ? de : en;
        const i18n = this._i18n;

        if (typeof this.columns === 'undefined' || !this.columns.length) {
            if (data.length)
                throw new Error('columns not set-up');
            return this;
        }

        if (this.columnSearching) {
            const existing_tfoot = this.shadowRoot.querySelector('table tfoot');
            if (existing_tfoot === null || !existing_tfoot.hasChildNodes() || languageChange) {
                if (existing_tfoot !== null) {
                    existing_tfoot.remove();
                }

                const fragment = document.createDocumentFragment();
                const tfoot = document.createElement('tfoot');
                const tr = document.createElement('tr');
                this.columns.forEach(function (element, index) {
                    const th = document.createElement('td');
                    if (element !== null
                        && (typeof element.visible === 'undefined' || element.visible !== false)
                        && (typeof element.searchable === 'undefined' || element.searchable !== false)) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'column-search-line';
                        input.id = 'input-col-' + index;
                        input.placeholder = i18n.t('column-search-placeholder', {fieldName: element.title});
                        th.appendChild(input);
                    }
                    tr.appendChild(th);
                });
                tfoot.appendChild(tr);
                fragment.appendChild(tfoot);
                this.shadowRoot.querySelector('table').appendChild(fragment);
            }
        }

        this.table = $(this.shadowRoot.querySelector('table')).DataTable({
            destroy: true,
            autoWidth: true,
            language: lang_obj,
            paging: this.paging,
            searching: this.searching,
            columns: this.columns,
            columnDefs: this.columnDefs,
            dom: (this.exportable ? '<"export-btn"B>' : '') + 'lfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: i18n.t('export-excel'),
                    title: this.exportName,
                    filename: this.exportName,
                    className: 'button is-small',
                },
                {
                    extend: 'csvHtml5',
                    text: i18n.t('export-csv'),
                    title: this.exportName,
                    filename: this.exportName,
                    className: 'button is-small',
                    charset: 'UTF-8',
                    bom: true,
                    fieldSeparator: this.lang === 'en' ? ',' : ';'
                },
                {
                    extend: 'print',
                    text: i18n.t('print'),
                    title: this.exportName,
                    className: 'button is-small',
                },
            ]
        });

        const dataTableLength = sessionStorage.getItem('dbp-data-table-length');

        //Retrieve page length from session storage
        if (dataTableLength !== null) {
            this.table.page.len(dataTableLength);
        }

        //Save page length in session storage
        this.table.on('length.dt', function ( e, settings, len ) {
            sessionStorage.setItem('dbp-data-table-length', len);
        });

        this.data = data;

        this.table.clear();
        if (this.data.length) {
            this.table.rows.add(this.data);
        }

        new $.fn.dataTable.Responsive(this.table, {
            details: true
        });

        if (this.columnSearching) {
                const thisTable = this.table;
                const that = this;
                this.columns.forEach(function (element, index) {
                    if (element !== null
                        && (typeof element.visible === 'undefined' || element.visible !== false)
                        && (typeof element.searchable === 'undefined' || element.searchable !== false)) {
                        const input = that.shadowRoot.querySelector('#input-col-' + index);
                        if (input) {
                            ['keyup', 'change', 'clear'].forEach(function (event) {
                                input.addEventListener(event, function () {
                                    const column = thisTable.column(index);
                                    if (column.search() !== input.value) {
                                        column.search(input.value).draw();
                                    }
                                });
                            });
                        }
                    }
                });
        }

        this.table.order(this.defaultOrder);
        this.table.draw();

        return this;
    }

    update(changedProperties) {
        let languageChange = false;

        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                this._i18n.changeLanguage(this.lang).catch(e => { console.log(e);});
                languageChange = true;
            }
        });

        this.updateComplete.then(this.set_datatable(this.data, languageChange)).catch(e => { console.log(e);});
        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        const orderExpandIconOverrides = css`
            table.dataTable.dtr-inline.collapsed > tbody > tr[role="row"] > td:first-child::before, table.dataTable.dtr-inline.collapsed > tbody > tr[role="row"] > th:first-child::before {
                all: initial;
                top: 0.7em;
                left: 0.4em;
                height: 1em;
                width: 1em;
                display: block;
                cursor: pointer;
                position: absolute;
                box-sizing: content-box;
                text-align: center;
                text-indent: 0 !important;
                line-height: 0.9em;
                color: var(--dbp-primary-text-color);
                background-color: var(--dbp-primary-bg-color);
                content: '+';
            }

            table.dataTable.dtr-inline.collapsed > tbody > tr.parent > td:first-child::before, table.dataTable.dtr-inline.collapsed > tbody > tr.parent > th:first-child::before {
                content: '-';
            }

            table.dataTable thead .sorting {
                background-image: url('${unsafeCSS(getIconSVGURL('chevron-up'))}'), url('${unsafeCSS(getIconSVGURL('chevron-down'))}');
                background-position: 100% 40%, 100% 60%;
                background-size: 0.5em, 0.5em;
            }

            table.dataTable thead .sorting_desc {
                background-image: url('${unsafeCSS(getIconSVGURL('chevron-up'))}');
                background-position: 100% 50%;
                background-size: 0.8em;
            }

            table.dataTable thead .sorting_asc {
                background-image: url('${unsafeCSS(getIconSVGURL('chevron-down'))}');
                background-size: 0.8em;
                background-position: 100% 50%;
            }
        `;

        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
            ${orderExpandIconOverrides}

            .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
                color: var(--dbp-muted-text);
                border-radius: var(--dbp-border-radius);
                background: transparent;
            }

            .export-btn {
                margin-bottom: .6rem;
            }

            select {
                border-radius: calc(var(--dbp-border-radius)/2);
                height: 28px;
                margin-left: 3px;
            }

            :host {
                display: block;
            }

            .dataTables_filter input {
                border-radius: 0;
                border-style: solid;
                border-color: var(--dbp-dark);
                border-width: 1px;
                padding: 0.1em;
            }

            table.dataTable .column-search-line {
                width: 100%;
            }
        `;
    }

    render() {
        let dt_css = commonUtils.getAssetURL(pkgName, 'css/jquery.dataTables.min.css');
        let rs_css = commonUtils.getAssetURL(pkgName, 'css/responsive.dataTables.min.css');
        let bt_css = commonUtils.getAssetURL(pkgName, 'css/buttons.dataTables.min.css');

        return html`
            <link rel="stylesheet" href="${dt_css}">
            <link rel="stylesheet" href="${rs_css}">
            <link rel="stylesheet" href="${bt_css}">
            <style>
                ${this.cssStyle}
            </style>
            <div><table width="100%"></table></div>
        `;
    }
}