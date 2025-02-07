import {createInstance} from './i18n.js';
import {html, css, unsafeCSS} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as tabulatorStyles from '@dbp-toolkit/tabulator-table/src/tabulator-table-styles';
import {name as pkgName} from '@dbp-toolkit/tabulator-table/package.json';
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class TabulatorTable extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;

        this.identifier = 'table';
        /** @type {import('tabulator-tables').Options} */
        this.options = {
            layout: 'fitColumns',
            autoColumns: true,
        };
        this.data = [];
        this.paginationEnabled = false;
        this.paginationSize = 10;
        this.stickyHeaderEnabled = false;
        this.selectRowsEnabled = false;
        this.rowSelected = false;
        this.selectedRows = null;
        this.tableReady = false;
        this.initialization = true;
        this.collapseEnabled = false;
        this.expanded = false;
        this.isCollapsible = false;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            identifier: {type: String, attribute: 'identifier'},
            options: {type: Object, attribute: 'options'},
            data: {type: Array, attribute: 'data'},
            paginationNoLangsEnabled: {type: Boolean, attribute: 'pagination-no-langs-enabled'},
            paginationEnabled: {type: Boolean, attribute: 'pagination-enabled'},
            paginationSize: {type: Number, attribute: 'pagination-size'},
            stickyHeaderEnabled: {type: Boolean, attribute: 'sticky-header'},
            rowSelected: {type: Boolean},
            selectedRows: {type: Array},
            selectRowsEnabled: {type: Boolean, attribute: 'select-rows-enabled'},
            collapseEnabled: {type: Boolean, attribute: 'collapse-enabled'},
            expanded: {type: Boolean},
            isCollapsible: {type: Boolean, attribute: false},
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
                if (this.tabulatorTable) {
                    this.tabulatorTable.setLocale(this.lang);
                }
            } else if (
                propName === 'options' &&
                this.options !== null &&
                !this.tableReady &&
                !this.initialization
            ) {
                this.buildTable();
            }
        });
        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.initialization = false;
        });
    }

    disconnectedCallback() {
        if (this.tabulatorTable) {
            this.tabulatorTable.off('tableBuilt');
            this.tabulatorTable.off('rowClick');
            this.tabulatorTable.off('columnVisibilityChanged');
        }

        super.disconnectedCallback();
    }

    buildTable() {
        if (this.collapseEnabled) {
            // this.options['layout'] = 'fitDataFill';
            this.options['responsiveLayout'] = 'collapse';
        }
        if (this.paginationNoLangsEnabled) {
            let paginationElement = this._('.tabulator-paginator');
            //this.options['autoColumns'] = true;
            this.options['pagination'] = true;
            this.options['paginationSize'] = this.paginationSize;
            this.options['paginationSizeSelector'] = true;
            this.options['footerElement'] = '';
            this.options['paginationElement'] = paginationElement;
        }

        if (this.paginationEnabled) {
            let paginationElement = this._('.tabulator-paginator');
            this.options['pagination'] = true;
            this.options['paginationSize'] = this.paginationSize;
            this.options['paginationSizeSelector'] = true;
            this.options['paginationElement'] = paginationElement;
            this.options['langs']['en']['pagination'] = {
                page_size: 'Page size',
                page_size_title: 'Page size',
                first: '<span class="mobile-hidden">First</span>',
                first_title: 'First Page',
                last: '<span class="mobile-hidden">Last</span>',
                last_title: 'Last Page',
                prev: '<span class="mobile-hidden">Prev</span>',
                prev_title: 'Prev Page',
                next: '<span class="mobile-hidden">Next</span>',
                next_title: 'Next Page',
            };
            this.options['langs']['de']['pagination'] = {
                page_size: 'Einträge pro Seite',
                page_size_title: 'Einträge pro Seite',
                first: '<span class="mobile-hidden">Erste</span>',
                first_title: 'Erste Seite',
                last: '<span class="mobile-hidden">Letzte</span>',
                last_title: 'Letzte Seite',
                prev: '<span class="mobile-hidden">Vorherige</span>',
                prev_title: 'Vorherige Seite',
                next: '<span class="mobile-hidden">Nächste</span>',
                next_title: 'Nächste Seite',
            };
        }

        if (this.selectRowsEnabled) {
            this.options['selectableRows'] = true;
        }

        // Set this.data if data is provided in the options
        if (this.options.data) {
            this.data = this.options.data;
        }

        /** @type {import('tabulator-tables').Tabulator} */
        this.tabulatorTable = new Tabulator(this._('#' + this.identifier), this.options);
        this.tabulatorTable.on('tableBuilt', this.tableBuildFunctions.bind(this));
        this.tabulatorTable.on('rowClick', this.rowClickFunction.bind(this));
        this.tabulatorTable.on('rowSelectionChanged', (data, rows, selected, deselected) => {
            const allSelectedRows = this.tabulatorTable.getSelectedRows();
            const collapseEvent = new CustomEvent('dbp-tabulator-table-row-selection-changed-event', {
                detail: {
                    selected: selected,
                    deselected: deselected,
                    allselected: allSelectedRows,
                    rows: rows,
                    data: data,
                },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(collapseEvent);
        });
        this.tabulatorTable.on("columnVisibilityChanged", (column) => {
            const columnDefinition = column.getDefinition();
            const columnVisibility = column.isVisible();
            if (columnDefinition.formatter === 'responsiveCollapse') {
                if(columnVisibility === true) {
                    this.isCollapsible = true;
                } else {
                    this.isCollapsible = false;
                }

                const collapseEvent = new CustomEvent('dbp-tabulator-table-collapsible-event', {
                    detail: {
                        tableId: this.identifier,
                        isCollapsible: this.isCollapsible
                    },
                    bubbles: true,
                    composed: true,
                });
                this.dispatchEvent(collapseEvent);
            }
        });
        this.tableReady = true;
    }

    tableBuildFunctions() {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.setLocale(this.lang);
        this.tabulatorTable.setData(this.data);
        /**
         * Change cursor to pointer on hover if rows are selectable
         */
        if(this.selectRowsEnabled) {
            this.tabulatorTable.on("rowMouseOver", function(e, row){
                this.rowManager.element.classList.add('pointer-mouse');
            });
        }
        // Handle pagination size changes
        if (this.paginationEnabled) {
            const paginationSizeDropdown = this._('#custom-pagination .tabulator-page-size');

            const paginationSize = parseInt(localStorage.getItem(`tabulator-${this.identifier}-pagination-size`));
            if (paginationSize) {
                this.paginationSize = paginationSize;
                this.tabulatorTable.setPageSize(this.paginationSize);
            }

            paginationSizeDropdown.addEventListener('change', (event) => {
                if (event.target.value) {
                    localStorage.setItem(`tabulator-${this.identifier}-pagination-size`, event.target.value);
                }
            });
        }
    }

    rowClickFunction(e, row) {
        if (!this._('#select_all') || !this.tabulatorTable) return;

        const check =
            this.tabulatorTable.getSelectedRows().length ===
            this.tabulatorTable.getRows('display').length;
        /** @type {HTMLInputElement} */(this._('#select_all')).checked = check;

        if(this.tabulatorTable.getSelectedRows().length === 0)
            this.rowSelected = false;
        else
            this.rowSelected = true;
    }

    deleteRow(row) {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.deleteRow(row);
    }

    /**
     * Select all rows from tabulator table
     *
     */
    selectAllRows() {
        if (!this.tabulatorTable) return;
        let allSelected = this.checkAllSelected();
        if (!allSelected) {
            this.tabulatorTable.getRows().forEach((row) => row.select());
        }
    }

    /**
     * Deselect all rows from tabulator table
     *
     */
    deselectAllRows() {
        if (!this.tabulatorTable) return;
        let noneSelected = this.checkNoneSelected();
        if (!noneSelected) {
            this.tabulatorTable.getSelectedRows().forEach((row) => row.deselect());
        }
    }
    checkAllSelected() {
        if (this.tabulatorTable) {
            let maxSelected = this.tabulatorTable.getRows('display').length;
            let selected = this.tabulatorTable.getSelectedRows().length;

            if (selected === maxSelected) {
                return true;
            }
        }
        return false;
    }

    checkNoneSelected() {
        if (this.tabulatorTable) {
            let selected = this.tabulatorTable.getSelectedRows().length;

            if (selected === 0) {
                return true;
            }
        }
        return false;
    }

    setData(data) {
        if (!this.tabulatorTable) return;
        this.data = data;
        this.tabulatorTable.setData(this.data);
    }

    clearData() {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.clearData();
    }

    addData(data) {
        if (!this.tabulatorTable) return;

        this.tabulatorTable.addData(data, false);
    }

    setFilter(listOfFilters) {
        if (!this.tabulatorTable) return;
        if(listOfFilters.length === 0)
            this.tabulatorTable.clearFilter(false);
        else
            this.tabulatorTable.setFilter(listOfFilters);
    }

    clearFilter() {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.clearFilter(false);
    }

    getSelectedRows() {
        if (!this.tabulatorTable) return;
        this.selectedRows = this.tabulatorTable.getSelectedRows();
        return this.selectedRows;
    }

    deleteSelectedRows() {
        if (!this.tabulatorTable) return;
        this.getSelectedRows();
        this.tabulatorTable.deleteRow(this.selectedRows);
        if (this.selectAllEnabled) {
            this.tabulatorTable.updateColumnDefinition('empty', {title:'<label id="select_all_wrapper" class="button-container select-all-icon">' +
                    '<input type="checkbox" id="select_all" name="select_all" value="select_all">' +
                    '<span class="checkmark" id="select_all_checkmark"></span>' +
                    '</label>',});
        }
    }

    getColumns() {
        if (!this.tabulatorTable) return;
        return this.tabulatorTable.getColumns();
    }

    setColumns(newColumns) {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.setColumns(newColumns);
    }

    getColumnDefinitions() {
        if (!this.tabulatorTable) return;
        return this.tabulatorTable.getColumnDefinitions();
    }

    getColumnsFields() {
        if (!this.tabulatorTable) return;
        let columns = this.tabulatorTable.getColumns();
        let columns_titles = [];
        for(let col of columns) {
            columns_titles.push(col.getField());
        }
        return columns_titles;
    }

    getRows() {
        if (!this.tabulatorTable) return;
        let rows = this.tabulatorTable.getRows();
        return rows;
    }

    getData() {
        if (!this.tabulatorTable) return;
        let data = this.tabulatorTable.getData();
        return data;
    }

    updateRow(row, newData) {
        if (!this.tabulatorTable) return;
        row.update(newData);
    }

    getPage() {
        if (!this.tabulatorTable) return;
        let currentPage = this.tabulatorTable.getPage();
        return currentPage;
    }

    getLang() {
        if (!this.tabulatorTable) return;
        let currentLang = this.tabulatorTable.getLang();
        return currentLang;
    }

    setPage(currentPage) {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.setPage(currentPage);
    }

    expandAll() {
        if (!this.tabulatorTable) return;
        if(this.expanded === false) {

            this.tabulatorTable.getRows('visible').forEach((row) => {
                let config = row._row.modules.responsiveLayout;
                config.open = true;
                const item = /** @type {HTMLElement} */(row.getElement().lastChild);

                if (item.classList.contains('tabulator-responsive-collapse')) {
                    item.style.display = 'block';
                }
                row.getElement()
                    .getElementsByClassName('tabulator-responsive-collapse-toggle')[0]
                    .classList.add('open');
            });

            const that = this;

            setTimeout(function () {
                that.tabulatorTable.redraw();
            }, 0);

            this.expanded = true;
        }


    }

    collapseAll() {
        if(this.expanded === true) {
            this.tabulatorTable.getRows('visible').forEach((row) => {
                let config = row._row.modules.responsiveLayout;
                config.open = false;
                const item = /** @type {HTMLElement} */(row.getElement().lastChild);

                if (item.classList.contains('tabulator-responsive-collapse')) {
                    item.style.display = 'none';
                }
                row.getElement()
                    .getElementsByClassName('tabulator-responsive-collapse-toggle')[0]
                    .classList.remove('open');
            });

            const that = this;

            setTimeout(function () {
                that.tabulatorTable.redraw();
            }, 0);

            this.expanded = false;
        }

    }

    download(type, dataName) {
        dataName = dataName + '.' + type;
        if (!this.tabulatorTable) return;
        let selected_rows = this.tabulatorTable.getSelectedRows();
        const active_rows = this.tabulatorTable.getRows('active');
        if(active_rows.length === 0)
            return;
        if(selected_rows.length === 0) {
            const data = this.tabulatorTable.getData();
            switch(type) {
                case 'csv':
                case 'json':
                case 'html':
                    this.tabulatorTable.download(type, dataName);
                    break;
                case 'xlsx': {
                    let entries = [];
                    for (let row of active_rows) {
                        let cells = row.getCells();
                        let entry = {};
                        for (let cell of cells) {
                            let column = cell.getColumn();
                            let definition = column.getDefinition();
                            if (!column.isVisible()) {
                                continue;
                            }
                            let field = cell.getField();
                            if(field !== 'empty' && field !== 'undefined' && definition.formatter !== 'html') {
                                entry[field] = cell.getValue();
                            }
                        }
                        entries.push(entry);
                    }
                    const worksheet = XLSX.utils.json_to_sheet(entries);
                    const workbook = XLSX.utils.book_new();
                    /* Add the worksheet to the workbook */
                    XLSX.utils.book_append_sheet(workbook, worksheet, dataName);
                    XLSX.writeFile(workbook, dataName, { compression: true });
                    break;
                }
                case 'pdf': {
                    //  Get only displayed columns. [respect Column setting modal state]
                    let columns = this.tabulatorTable.getColumns();
                    let header = [];
                    for(let column of columns) {
                        let definition = column.getDefinition();
                        if (!column.isVisible()) {
                            continue;
                        }
                        let field = column.getField();
                        if(field!== 'empty' && field !== 'undefined' && definition.formatter !== 'html')
                            header.push(column.getField());
                    }
                    let body = [];
                    for (let entry of data) {
                        let entry_array =  [];

                        header.forEach(column => {
                            let cellValue = entry[column] ? entry[column] : '-';
                            if (Array.isArray(cellValue)) {
                                cellValue = cellValue.join(', ');
                            }
                            entry_array.push(cellValue);
                        });
                        body.push(entry_array);
                    }
                    const doc = new jsPDF('l', 'pt');
                    autoTable(doc, {
                        head: [header],
                        body: body,
                        horizontalPageBreak: false,
                        // horizontalPageBreakBehaviour: 'immediately',
                        tableWidth: 'auto',
                        styles: {
                            overflow: 'linebreak',
                            valign: 'middle',
                            cellWidth: 'auto'
                        },
                        headStyles: {
                            // cellWidth: 'auto'
                        },
                        bodyStyles: {
                            // cellWidth: 'auto',
                            overflow: 'linebreak'
                        }
                    });
                    doc.save(dataName);
                    break;
                }

            };
        } else {
            const selected_data = [];
            for (let row of selected_rows) {
                selected_data.push(row.getData());
            }
            switch(type) {
                case 'csv':
                case 'json':
                case 'html':
                    this.tabulatorTable.download(type, dataName, {}, 'selected');
                    break;
                case 'xlsx': {
                    let entries = [];
                    for (let row of selected_rows) {
                        let cells = row.getCells();
                        let entry = {};
                        for (let cell of cells) {
                            let column = cell.getColumn();
                            let definition = column.getDefinition();
                            if (!column.isVisible()) {
                                continue;
                            }
                            let field = cell.getField();
                            if(field !== 'empty' && field !== 'undefined' && definition.formatter !== 'html') {
                                entry[field] = cell.getValue();
                            }
                        }
                        entries.push(entry);
                    }
                    const worksheet = XLSX.utils.json_to_sheet(entries);
                    const workbook = XLSX.utils.book_new();
                    /* Add the worksheet to the workbook */
                    XLSX.utils.book_append_sheet(workbook, worksheet, dataName);
                    XLSX.writeFile(workbook, dataName, { compression: true });
                    break;
                }
                case 'pdf': {
                    let columns = this.tabulatorTable.getColumns();
                    let header = [];

                    for(let column of columns) {
                        let definition = column.getDefinition();
                        if (!column.isVisible()) {
                            continue;
                        }
                        let field = column.getField();
                        if(field !== 'empty' && field !== 'undefined' && definition.formatter !== 'html')
                            header.push(column.getField());
                    }
                    let body = [];
                    for (let entry of selected_data) {
                        let entry_array =  [];

                        header.forEach(column => {
                            let cellValue = entry[column] ? entry[column] : '-';
                            if (Array.isArray(cellValue)) {
                                cellValue = cellValue.join(', ');
                            }
                            entry_array.push(cellValue);
                        });
                        body.push(entry_array);
                    }
                    const doc = new jsPDF('l', 'pt');
                    autoTable(doc, {
                        head: [header],
                        body: body,
                        horizontalPageBreak: false,
                        // horizontalPageBreakBehaviour: 'immediately',
                        tableWidth: 'auto',
                        styles: {
                            overflow: 'linebreak',
                            valign: 'middle',
                            cellWidth: 'auto'
                        },
                        headStyles: {
                            // cellWidth: 'auto'
                        },
                        bodyStyles: {
                            // cellWidth: 'auto',
                            overflow: 'linebreak'
                        }
                    });
                    doc.save(dataName);
                    break;
                }
            };
        };

    }

    static get styles() {
        const iconPath = commonUtils.getAssetURL('@dbp-toolkit/common', 'icons/');

        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getRadioAndCheckboxCss()}
            ${tabulatorStyles.getTabulatorStyles()}

            .tabulator .tabulator-header .tabulator-col .tabulator-col-title {
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: normal;
                font-size: 1rem;
            }

            .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: normal;
                font-size: 1rem;
            }

            .tabulator .tabulator-header .tabulator-header-contents .tabulator-headers {
                min-height: 37px;
                /*display: flex;
                align-items: center;*/
            }

            .tabulator .tabulator-tableholder :hover {
                cursor: default;
            }

            .tabulator .tabulator-tableholder.pointer-mouse :hover {
                cursor: pointer;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page[disabled] {
                opacity: 0.4;
            }

            .tabulator .tabulator-footer {
                background-color: var(--dbp-background);
                color: var(--dbp-content);
                border-top: none;
            }

            .tabulator .tabulator-footer .tabulator-footer-contents {
                flex-direction: column;
            }

            .tabulator .tabulator-footer .tabulator-paginator {
                flex-direction: row;
                display: flex;
                align-items: center;
                margin-top: 10px;
            }

            .tabulator .tabulator-footer .tabulator-paginator > label {
                padding-right: 10px;
            }

            .tabulator .tabulator-footer .tabulator-paginator label {
                color: var(--dbp-content);
                font-weight: 400;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page-size {
                box-sizing: border-box;
                color: var(--dbp-content);
                background-color: var(--dbp-background);
                border: var(--dbp-border);
                border-radius: var(--dbp-border-radius);
                padding: calc(0.5em - 1px) 1.7em calc(0.5em - 1px) 0.75em;
                cursor: pointer;
                background-position-x: calc(100% - 0.4rem);
                background-size: auto 45%;
                min-height: 40px;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page {
                opacity: unset;
                border-radius: var(--dbp-border-radius);
                cursor: pointer;
                padding: calc(0.375em - 1px) 0.75em;
                text-align: center;
                white-space: nowrap;
                font-size: inherit;
                font-weight: bolder;
                font-family: inherit;
                transition:
                    all 0.15s ease 0s,
                    color 0.15s ease 0s;
                background: var(--dbp-secondary-surface);
                color: var(--dbp-on-secondary-surface);
                border-color: var(--dbp-secondary-surface-border-color);
                box-sizing: border-box;
                min-height: 40px;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page.active {
                background: var(--dbp-on-secondary-surface);
                color: var(--dbp-secondary-surface);
            }

            .filename {
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                white-space: nowrap;
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .mobile-hidden {
                    display: none;
                }

                #custom-pagination,
                .tabulator-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                }

                .tabulator {
                    overflow: visible;
                }

                .tabulator .tabulator-footer .tabulator-paginator .tabulator-page {
                    border: none;
                }

                .tabulator
                    .tabulator-footer
                    .tabulator-footer-contents
                    .tabulator-paginator
                    .tabulator-pages {
                    display: none;
                }

                .tabulator .tabulator-footer .tabulator-paginator {
                    text-align: center;
                }

                .tabulator .tabulator-footer .tabulator-paginator label {
                    display: none;
                }

                .tabulator .tabulator-footer .tabulator-paginator .tabulator-page {
                    border: none;
                }

                .tabulator .tabulator-footer .tabulator-paginator .tabulator-page-size {
                    padding-right: 1.5em;
                    background-size: auto 40%;
                }

                button[data-page='prev']::after,
                button[data-page='next']::after,
                button[data-page='first']::after,
                button[data-page='last']::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    background-color: var(--dbp-content);
                    mask-repeat: no-repeat;
                    mask-position: center center;
                    padding: 0 0 0.25%;
                    mask-size: 1.4rem !important;
                }

                button[data-page='first']::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    mask-image: url('${unsafeCSS(iconPath)}angle-double-left.svg');
                }

                button[data-page='prev']::after {
                    mask-image: url('${unsafeCSS(iconPath)}chevron-left.svg');
                }

                button[data-page='next']::after {
                    mask-image: url('${unsafeCSS(iconPath)}chevron-right.svg');
                }

                button[data-page='last']::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    mask-image: url('${unsafeCSS(iconPath)}angle-double-right.svg');
                }
            }
        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL(
            pkgName,
            'tabulator-tables/css/tabulator.min.css',
        );

        return html`
            <div class="wrapper">
                <link rel="stylesheet" href="${tabulatorCss}" />
                <div class="table-wrapper">
                    <div id=${this.identifier} class="${classMap({'sticky-header': this.stickyHeaderEnabled})}"></div>
                    <div class="tabulator ${classMap({hidden: !this.paginationEnabled})}"
                        id="custom-pagination">
                        <div class="tabulator-footer">
                            <div class="tabulator-footer-contents">
                                <span class="tabulator-paginator"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
