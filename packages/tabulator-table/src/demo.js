import {createInstance, setOverridesByGlobalCache} from './i18n';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {TabulatorTable} from './tabulator-table';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {IconButton} from '@dbp-toolkit/common';
import {Modal} from '@dbp-toolkit/common/src/modal.js';

export class TabulatorTableDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
        this.langDir = '';
        this.boundPressEnterAndSubmitSearchHandler = this.pressEnterAndSubmitSearch.bind(this);
        this.selectAllTable2 = true;
        this.selectAllTable7 = true;
        this.expandedTabulator = true;
        this.selectedRow = this.rowClick.bind(this);
        this.selected = false;
    }

    static get scopedElements() {
        return {
            'dbp-tabulator-table': TabulatorTable,
            'dbp-icon-button': IconButton,
            'dbp-modal': Modal,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            langDir: {type: String, attribute: 'lang-dir'},
            selectAllTable2: {type: Boolean},
            selectAllTable7: {type: Boolean},
            expandedTabulator: {type: Boolean},
            selected: {type: Boolean},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.langDir) {
            setOverridesByGlobalCache(this._i18n, this);
        }

        this.updateComplete.then(() => {
            this._a('.tabulator-table-demo').forEach((table) => {
                table.buildTable();
                document.addEventListener('keyup', this.boundPressEnterAndSubmitSearchHandler);
                if (table.id == 'tabulator-table-demo-7')
                    table.addEventListener('click', this.selectedRow);
            });
        });
    }

    pressEnterAndSubmitSearch(event) {
        if (event.keyCode === 13) {
            const activeElement = this.shadowRoot.activeElement;
            if (activeElement && activeElement.id === 'searchbar') {
                event.preventDefault();
                this.filterTable();
            }
        }
    }

    download() {
        let table = this._('#tabulator-table-demo-7');
        let fileFormat = this._('#file-format-select');
        fileFormat = fileFormat.value;
        let dataName = 'data';
        table.download(fileFormat, dataName);
    }

    rowClick(event) {
        this.selected = true;
        let deleteButton = this._('#delete-button');
        let table = this._('#tabulator-table-demo-7');
        if (table.checkNoneSelected()) {
            deleteButton.disabled = false;
            this.selectAllTable7 = false;
        } else {
            deleteButton.disabled = true;
            this.selectAllTable7 = true;
        }
    }

    setTableData(data) {
        let table = this._('#tabulator-table-demo-6');
        table.setData(data);
    }

    setTableDataForEdit(data) {
        let table = this._('#tabulator-table-demo-7');
        table.setData(data);
    }

    deleteRow(e, row) {
        let table = this._('#tabulator-table-demo-7');
        e.stopPropagation();
        table.deleteRow(row);
    }

    updateRows() {
        let table = this._('#tabulator-table-demo-9');
        let newData = this._('#age-input');
        newData = {age: newData.value};
        let rows = table.getRows();
        for (let row of rows) table.updateRow(row, newData);
    }

    filterTable() {
        let filter = this._('#searchbar');
        let operator = this._('#operator-select');
        let column = this._('#column-select');

        filter = filter.value;
        operator = operator.value;
        column = column.value;

        let table = this._('#tabulator-table-demo-7');
        if (column !== 'all') {
            let filter_object = {field: column, type: operator, value: filter};
            table.setFilter([filter_object]);
        } else {
            const columns = table.getColumnsFields();
            let listOfFilters = [];

            for (let col of columns) {
                let filter_object = {field: col, type: operator, value: filter};
                listOfFilters.push(filter_object);
            }
            table.setFilter([listOfFilters]);
        }
    }

    removeFilter() {
        let table = this._('#tabulator-table-demo-7');
        table.clearFilter();
    }

    deleteSelectedRows() {
        let table = this._('#tabulator-table-demo-7');
        table.deleteSelectedRows();
    }

    expandAll() {
        this.expandedTabulator = false;
        let table = this._('#tabulator-table-demo-8');
        table.expandAll();
    }

    collapseAll() {
        this.expandedTabulator = true;
        let table = this._('#tabulator-table-demo-8');
        table.collapseAll();
    }

    openModal() {
        let modal = this._('#my-modal-123');
        if (modal) {
            modal.open();
        }
    }

    changeVisibility(counter) {
        let id = '#eye-button-' + counter;
        let visibility = this._(id);
        if (visibility.iconName === 'source_icons_eye-empty') {
            visibility.iconName = 'source_icons_eye-off';
        } else {
            visibility.iconName = 'source_icons_eye-empty';
        }
    }

    moveHeaderUp(index) {
        if (index === 1) return;
        let list = this._('.headers');
        for (let li of list.children) {
            if (li.id === index.toString()) {
                let element = li;
                let swapElem = list.children[index - 2];
                this.swapHeader(element, swapElem);
                return;
            }
        }
    }

    moveHeaderDown(index) {
        let table = this._('#tabulator-table-demo-11');
        let columns = table.getColumns();
        if (index === columns.length - 1) return;
        let list = this._('.headers');
        for (let li of list.children) {
            if (li.id === index.toString()) {
                let element = li;
                let swapElem = list.children[index];
                this.swapHeader(element, swapElem);
                return;
            }
        }
    }

    swapHeader(elem, swapElem) {
        let div_1 = elem.children[0];
        let span_1 = div_1.children[0];
        let aux = span_1.innerHTML;

        let div_2 = swapElem.children[0];
        let span_2 = div_2.children[0];

        span_1.innerHTML = span_2.innerHTML;
        span_2.innerHTML = aux;
    }

    resetSettings() {
        let list = this._('.headers');
        let counter = 1;
        let table = this._('#tabulator-table-demo-11');
        let columns = table.getColumns();

        for (let li of list.children) {
            let initial_column = columns[counter].getDefinition();
            let div = li.children[0];
            let span = div.children[0];
            if (span.innerText !== initial_column.title) {
                span.innerText = initial_column.title;
            }
            let visibility = columns[counter].isVisible();
            let visibility_icon = div.children[1];
            if (visibility && visibility_icon.iconName === 'source_icons_eye-off') {
                visibility_icon.iconName = 'source_icons_eye-empty';
            } else if (!visibility && visibility_icon.iconName === 'source_icons_eye-empty') {
                visibility_icon.iconName = 'source_icons_eye-off';
            }
            counter++;
        }
    }

    saveSettings() {
        let table = this._('#tabulator-table-demo-11');
        let list = this._('.headers');
        let newColumns = [];

        for (let li of list.children) {
            let div = li.children[0];
            let span = div.children[0];

            let visibility_icon = div.children[1];
            let visibility;
            if (visibility_icon.iconName === 'source_icons_eye-off') {
                visibility = false;
            } else {
                visibility = true;
            }
            let entry = {title: span.innerText, field: span.innerText, visible: visibility};
            newColumns.push(entry);
        }
        table.setColumns(newColumns);
    }

    selectAllRowsTable2() {
        this.selectAllTable2 = false;
        let table = this._('#tabulator-table-demo-2');

        table.selectAllRows();
    }

    deselectAllRowsTable2() {
        this.selectAllTable2 = true;
        let table = this._('#tabulator-table-demo-2');
        table.deselectAllRows();
    }

    selectAllRowsTable7() {
        this.selectAllTable7 = false;
        let table = this._('#tabulator-table-demo-7');
        table.selectAllRows();
        let deleteButton = this._('#delete-button');
        deleteButton.disabled = false;
    }

    deselectAllRowsTable7() {
        this.selectAllTable7 = true;
        let table = this._('#tabulator-table-demo-7');
        table.deselectAllRows();
        let deleteButton = this._('#delete-button');
        deleteButton.disabled = true;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS(false)}
            ${commonStyles.getButtonCSS()}

            .demo-sub-title {
                margin: 60px 0px 20px;
                font-size: 24px;
            }

            #searchbar {
                box-sizing: border-box;
                border: var(--dbp-border);
                padding: calc(0.375em - 1px) 10px;
                border-radius: var(--dbp-border-radius);
                min-height: 33px;
                background-color: var(--dbp-background);
                color: var(--dbp-content);
            }

            .select-container {
                margin-top: 15px;
            }

            .headers {
                display: initial;
                width: 100%;
                list-style-type: none;
            }

            .header-field {
                align-items: center;
                height: 50px;
                border: 1px solid var(--dbp-muted);
                display: flex;
                margin-bottom: 5px;
            }

            .header-title {
                flex-grow: 2;
                text-overflow: ellipsis;
                overflow: hidden;
                padding-left: 5px;
                text-align: left;
            }
        `;
    }

    /**
     *
     * @param {string} dateString dd/mm/yyyy format
     * @returns {number} unix timestamp
     */
    parseCustomDate(dateString) {
        if (!dateString) {
            return -Infinity;
        }
        // Split the date string and rearrange to match ISO format (YYYY-MM-DD)
        const [day, month, year] = dateString.split('/');
        const isoDateString = `${year}-${month}-${day}`;

        return Date.parse(isoDateString);
    }

    render() {
        const i18n = this._i18n;
        let data = [
            {id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
            {id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
            {id: 3, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
            {id: 4, name: 'Brendon Philips', age: '95', col: 'orange', dob: '01/08/1980'},
            {id: 5, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
        ];

        let dataLong = [
            {id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
            {id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
            {id: 3, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
            {id: 4, name: 'Brendon Philips', age: '95', col: 'orange', dob: '01/08/1980'},
            {id: 5, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
            {id: 6, name: 'Emil Barron', age: '24', col: 'red', dob: ''},
            {id: 7, name: 'Jewell Price', age: '47', col: 'blue', dob: '14/05/1971'},
            {id: 8, name: 'Josiah Haley', age: '52', col: 'green', dob: '22/05/1982'},
            {id: 9, name: 'Minerva Combs', age: '103', col: 'orange', dob: '01/08/1920'},
            {id: 10, name: 'Eileen Burnett', age: '14', col: 'yellow', dob: '31/03/1999'},
            {id: 11, name: 'Alvin Guerrero', age: '32', col: 'red', dob: '12/12/1945'},
            {id: 12, name: 'Del Gentry', age: '41', col: 'blue', dob: '14/05/1967'},
            {id: 13, name: 'Christine Lobowski', age: '72', col: 'red', dob: '22/05/1982'},
            {id: 14, name: 'Sheldon Hopkins', age: '9', col: 'gold', dob: '01/08/1980'},
            {id: 15, name: 'Mason Peters', age: '18', col: 'yellow', dob: '28/07/1989'},
            {id: 16, name: 'Rigoberto Fuller', age: '57', col: 'black', dob: '17/01/1999'},
        ];

        let data_edit = [];

        let data_collapse = [
            {id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: '', license: 'B'},
            {id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982', license: 'B'},
            {
                id: 3,
                name: 'Christine Lobowski',
                age: '42',
                col: 'green',
                dob: '22/05/1982',
                license: 'C1',
            },
            {
                id: 4,
                name: 'Brendon Philips',
                age: '95',
                col: 'orange',
                dob: '01/08/1980',
                license: 'B',
            },
            {
                id: 5,
                name: 'Margret Marmajuke',
                age: '16',
                col: 'yellow',
                dob: '31/01/1999',
                license: 'A',
            },
        ];

        let updatable_table_data = [
            {id: 1, name: 'Oli Bob', age: '12'},
            {id: 2, name: 'Mary May', age: '1'},
            {id: 3, name: 'Christine Lobowski', age: '42'},
            {id: 4, name: 'Brendon Philips', age: '95'},
            {id: 5, name: 'Margret Marmajuke', age: '16'},
            {id: 6, name: 'Emil Barron', age: '24'},
            {id: 7, name: 'Jewell Price', age: '47'},
            {id: 8, name: 'Josiah Haley', age: '52'},
            {id: 9, name: 'Minerva Combs', age: '103'},
            {id: 10, name: 'Eileen Burnett', age: '14'},
            {id: 11, name: 'Alvin Guerrero', age: '32'},
            {id: 12, name: 'Del Gentry', age: '41'},
            {id: 13, name: 'Christine Lobowski', age: '72'},
            {id: 14, name: 'Sheldon Hopkins', age: ''},
            {id: 15, name: 'Mason Peters', age: '18'},
            {id: 16, name: 'Rigoberto Fuller', age: '57'},
        ];

        const names = [
            'Oli Bob',
            'Mary May',
            'Christine Lobowski',
            'Brendon Philips',
            'Margret Marmajuke',
        ];
        const ages = ['12', '1', '42', '95', '16'];
        const colors = ['red', 'blue', 'green', 'orange', 'yellow'];
        const dobs = ['', '14/05/1982', '22/05/1982', '01/08/1980', '31/01/1999'];

        for (let row = 1; row < 6; row++) {
            //let btn_delete = this.createScopedElement('button');
            let btn_delete = this.createScopedElement('dbp-icon-button');
            btn_delete.iconName = 'trash';
            btn_delete.addEventListener('click', (e) => {
                this.deleteRow(e, row);
            });
            btn_delete.setAttribute('id', row.toString());

            let element = {
                id: row,
                name: names[row - 1],
                age: ages[row - 1],
                col: colors[row - 1],
                dob: dobs[row - 1],
                delete: btn_delete,
            };
            data_edit.push(element);
        }

        // https://tabulator.info/docs/6.0/localize#define
        let langs = {
            en: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'en'}),
                    age: i18n.t('columns.age', {lng: 'en'}),
                    col: i18n.t('columns.col', {lng: 'en'}),
                    dob: i18n.t('columns.dob', {lng: 'en'}),
                },
            },
            de: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'de'}),
                    age: i18n.t('columns.age', {lng: 'de'}),
                    col: i18n.t('columns.col', {lng: 'de'}),
                    dob: i18n.t('columns.dob', {lng: 'de'}),
                },
            },
        };

        let langs_edit = {
            en: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'en'}),
                    age: i18n.t('columns.age', {lng: 'en'}),
                    col: i18n.t('columns.col', {lng: 'en'}),
                    dob: i18n.t('columns.dob', {lng: 'en'}),
                    delete: i18n.t('columns.delete', {lng: 'en'}),
                },
            },
            de: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'de'}),
                    age: i18n.t('columns.age', {lng: 'de'}),
                    col: i18n.t('columns.col', {lng: 'de'}),
                    dob: i18n.t('columns.dob', {lng: 'de'}),
                    delete: i18n.t('columns.delete', {lng: 'de'}),
                },
            },
        };

        let langs_update = {
            en: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'en'}),
                    age: i18n.t('columns.age', {lng: 'en'}),
                },
            },
            de: {
                columns: {
                    name: i18n.t('columns.name', {lng: 'de'}),
                    age: i18n.t('columns.age', {lng: 'de'}),
                },
            },
        };

        let langs_collapse = {
            en: {
                columns: {
                    details: i18n.t('columns.details', {lng: 'en'}),
                    name: i18n.t('columns.name', {lng: 'en'}),
                    age: i18n.t('columns.age', {lng: 'en'}),
                    col: i18n.t('columns.col', {lng: 'en'}),
                    dob: i18n.t('columns.dob', {lng: 'en'}),
                    delete: i18n.t('columns.delete', {lng: 'en'}),
                    license: i18n.t('columns.license', {lng: 'en'}),
                },
            },
            de: {
                columns: {
                    details: i18n.t('columns.details', {lng: 'de'}),
                    name: i18n.t('columns.name', {lng: 'de'}),
                    age: i18n.t('columns.age', {lng: 'de'}),
                    col: i18n.t('columns.col', {lng: 'de'}),
                    dob: i18n.t('columns.dob', {lng: 'de'}),
                    delete: i18n.t('columns.delete', {lng: 'de'}),
                    license: i18n.t('columns.license', {lng: 'de'}),
                },
            },
        };

        let options = {
            langs: langs,
            layout: 'fitColumns',
            responsiveLayout: 'collapse',
            responsiveLayoutCollapseStartOpen: false,
            rowHeader: {
                formatter: 'responsiveCollapse',
                width: 30,
                minWidth: 30,
                hozAlign: 'center',
                resizable: false,
            },
            columns: [
                {title: 'name', field: 'name', width: 150},
                {title: 'age', field: 'age', hozAlign: 'left', formatter: 'progress'},
                {title: 'col', field: 'col'},
                {
                    title: 'dob',
                    field: 'dob',
                    hozAlign: 'center',
                    sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                        // a, b - the two values being compared
                        // aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
                        // column - the column component for the column being sorted
                        // dir - the direction of the sort ("asc" or "desc")
                        // sorterParams - sorterParams object from column definition array
                        const aTimestamp = this.parseCustomDate(a);
                        const bTimestamp = this.parseCustomDate(b);

                        return aTimestamp - bTimestamp;
                    },
                },
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        let options_basic = {
            langs: langs,
            layout: 'fitColumns',
            responsiveLayout: 'collapse',
            responsiveLayoutCollapseStartOpen: false,
            rowHeader: {
                formatter: 'responsiveCollapse',
                width: 30,
                minWidth: 30,
                hozAlign: 'center',
                resizable: false,
            },
            columns: [
                {title: 'name', field: 'name', width: 150},
                {title: 'age', field: 'age', hozAlign: 'left'},
                {title: 'col', field: 'col'},
                {
                    title: 'dob',
                    field: 'dob',
                    hozAlign: 'center',
                    sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                        //a, b - the two values being compared
                        //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
                        //column - the column component for the column being sorted
                        //dir - the direction of the sort ("asc" or "desc")
                        //sorterParams - sorterParams object from column definition array
                        const aTimestamp = this.parseCustomDate(a);
                        const bTimestamp = this.parseCustomDate(b);

                        return aTimestamp - bTimestamp;
                    },
                },
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        let options_edit = {
            langs: langs_edit,
            layout: 'fitColumns',
            columns: [
                {title: 'name', field: 'name', width: 150},
                {title: 'age', field: 'age', hozAlign: 'left', formatter: 'progress'},
                {title: 'col', field: 'col', responsive: 0},
                {
                    title: 'dob',
                    field: 'dob',
                    hozAlign: 'center',
                    sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                        //a, b - the two values being compared
                        //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
                        //column - the column component for the column being sorted
                        //dir - the direction of the sort ("asc" or "desc")
                        //sorterParams - sorterParams object from column definition array
                        const aTimestamp = this.parseCustomDate(a);
                        const bTimestamp = this.parseCustomDate(b);

                        return aTimestamp - bTimestamp;
                    },
                },
                {title: 'delete', field: 'delete', formatter: 'html', download: false},
            ],
        };

        let options_collapse = {
            langs: langs_collapse,
            layout: 'fitDataFill',
            responsiveLayout: 'collapse',
            responsiveLayoutCollapseStartOpen: false,
            columns: [
                {
                    title: 'details',
                    field: 'details',
                    width: 100,
                    hozAlign: 'center',
                    formatter: 'responsiveCollapse',
                    headerHozAlign: 'center',
                },
                {title: 'name', field: 'name', width: 150},
                {title: 'age', field: 'age', width: 250, hozAlign: 'left', formatter: 'progress'},
                {title: 'col', field: 'col', width: 250},
                {
                    title: 'dob',
                    field: 'dob',
                    width: 250,
                    hozAlign: 'center',
                    sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                        //a, b - the two values being compared
                        //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
                        //column - the column component for the column being sorted
                        //dir - the direction of the sort ("asc" or "desc")
                        //sorterParams - sorterParams object from column definition array
                        const aTimestamp = this.parseCustomDate(a);
                        const bTimestamp = this.parseCustomDate(b);

                        return aTimestamp - bTimestamp;
                    },
                },
                {title: 'license', field: 'license', width: 250, responsive: 3},
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        let updatable_table_columns = {
            langs: langs_update,
            layout: 'fitColumns',
            columns: [
                {title: 'name', field: 'name', width: 150},
                {title: 'age', field: 'age', hozAlign: 'left', formatter: 'progress'},
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        let auto_columns = {
            langs: langs,
            autoColumns: true,
            layout: 'fitColumns',
            autoColumnsDefinitions: [{field: 'id', visible: false}],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        return html`
            <script
                type="text/javascript"
                src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
            <section class="section">
                <div class="container">
                    <h2 class="title">${i18n.t('demo-title')}</h2>
                    <p>Basic tabulator table with example data.</p>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - basic</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-1"
                        data=${JSON.stringify(data)}
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - select-all-enabled</h3>
                    <div
                        class="edit-selection-buttons ${classMap({hidden: !this.selectAllTable2})}">
                        <button
                            id="select-all-button"
                            class="button is-primary"
                            @click="${() => {
                                this.selectAllRowsTable2();
                            }}">
                            ${i18n.t('select-all')}
                        </button>
                    </div>
                    <div class="edit-selection-buttons ${classMap({hidden: this.selectAllTable2})}">
                        <button
                            id="deselect-all-button"
                            class="button is-primary"
                            @click="${() => {
                                this.deselectAllRowsTable2();
                            }}">
                            ${i18n.t('deselect-all')}
                        </button>
                    </div>

                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-2"
                        data=${JSON.stringify(data)}
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - select-rows-enabled</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-3"
                        select-rows-enabled
                        data=${JSON.stringify(data)}
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - pagination-enabled</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-4"
                        pagination-enabled="true"
                        pagination-size="5"
                        data=${JSON.stringify(dataLong)}
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - pagination-size:10</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-5"
                        pagination-size="10"
                        pagination-enabled="true"
                        data=${JSON.stringify(dataLong)}
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - setData()</h3>
                    <button
                        class="button is-primary"
                        @click="${(e) => {
                            e.target.disabled = true;
                            this.setTableData(dataLong);
                        }}">
                        ${i18n.t('add-data')}
                    </button>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-6"
                        pagination-size="10"
                        pagination-enabled="true"
                        .options=${options}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - Edit</h3>
                    <button
                        class="button is-primary"
                        @click="${() => {
                            this.setTableDataForEdit(data_edit);
                        }}">
                        ${i18n.t('add-data')}
                    </button>
                    <div class="select-container" id="extendable-searchbar">
                        <input type="text" id="searchbar" placeholder="${i18n.t('search-bar')}" />
                        <button
                            class="button is-secondary"
                            id="search-button"
                            @click="${() => {
                                this.filterTable();
                            }}">
                            ${i18n.t('filter')}
                        </button>
                        <button
                            class="button is-secondary"
                            id="remove-filters-button"
                            @click="${() => {
                                this.removeFilter();
                            }}">
                            ${i18n.t('remove-filters')}
                        </button>

                        <button
                            class="button is-secondary ${classMap({hidden: !this.selectAllTable7})}"
                            @click="${() => {
                                this.selectAllRowsTable7();
                            }}">
                            ${i18n.t('select-all')}
                        </button>
                        <button
                            class="button is-secondary ${classMap({hidden: this.selectAllTable7})}"
                            @click="${() => {
                                this.deselectAllRowsTable7();
                            }}">
                            ${i18n.t('deselect-all')}
                        </button>

                        <button
                            class="button is-primary"
                            id="delete-button"
                            disabled
                            @click="${() => {
                                this.deleteSelectedRows();
                            }}">
                            ${i18n.t('delete-rows')}
                        </button>
                        <div class="select-container">
                            <label for="column">${i18n.t('select-column')}</label>

                            <select name="column" class="select" id="column-select">
                                <option value="all">${i18n.t('columns.all')}</option>
                                <option value="name">${i18n.t('columns.name')}</option>
                                <option value="age">${i18n.t('columns.age')}</option>
                                <option value="col">${i18n.t('columns.col')}</option>
                                <option value="dob">${i18n.t('columns.dob')}</option>
                            </select>
                        </div>
                        <div class="select-container">
                            <label for="operator">${i18n.t('select-operator')}</label>
                            <select name="operator" class="select" id="operator-select">
                                <option value="=">=</option>
                                <option value="!=">!=</option>
                                <option value="<"><</option>
                                <option value="<="><=</option>
                                <option value=">">></option>
                                <option value=">=">>=</option>
                                <option value="like">${i18n.t('columns.contains')}</option>
                                <option value="keywords">${i18n.t('columns.keywords')}</option>
                                <option value="starts">${i18n.t('columns.starts')}</option>
                                <option value="ends">${i18n.t('columns.ends')}</option>
                            </select>
                        </div>
                    </div>

                    <div class="select-container">
                        <label for="file-format">${i18n.t('file-format')}</label>
                        <select name="file-format" class="select" id="file-format-select">
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                            <option value="xlsx">XLSX</option>
                            <option value="pdf">PDF</option>
                            <option value="html">HTML</option>
                        </select>
                        <button
                            class="button is-primary"
                            id="dowload-file-button"
                            @click="${() => {
                                this.download();
                            }}">
                            ${i18n.t('download')}
                        </button>
                    </div>

                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-7"
                        select-rows-enabled
                        pagination-size="10"
                        pagination-enabled="true"
                        .options=${options_edit}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - Collapsed Lists</h3>
                    <div
                        class="edit-selection-buttons ${classMap({
                            hidden: !this.expandedTabulator,
                        })}">
                        <button
                            class="button is-primary"
                            @click="${() => {
                                this.expandAll();
                            }}">
                            ${i18n.t('expand-all')}
                        </button>
                    </div>

                    <div
                        class="edit-selection-buttons ${classMap({
                            hidden: this.expandedTabulator,
                        })}">
                        <button
                            class="button is-primary"
                            @click="${() => {
                                this.collapseAll();
                            }}">
                            ${i18n.t('collapse-all')}
                        </button>
                    </div>

                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-8"
                        collapse-enabled
                        data=${JSON.stringify(data_collapse)}
                        .options=${options_collapse}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - Update rows</h3>
                    <input type="text" id="age-input" placeholder=${i18n.t('new-age')} />
                    <button
                        class="button is-primary"
                        id="update-button"
                        @click="${() => {
                            this.updateRows();
                        }}">
                        ${i18n.t('update-rows')}
                    </button>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-9"
                        data=${JSON.stringify(updatable_table_data)}
                        .options=${updatable_table_columns}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - Automatic Column Generation</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-10"
                        data=${JSON.stringify(dataLong)}
                        .options=${auto_columns}
                        pagination-enabled></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - edit columns</h3>
                    <button
                        class="button is-primary"
                        id="open-modal-button"
                        @click="${() => {
                            this.openModal();
                        }}">
                        ${i18n.t('column-settings')}
                    </button>

                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-11"
                        data=${JSON.stringify(data)}
                        .options=${options_basic}></dbp-tabulator-table>
                    <div class="control" id="dbp-translated-demo">
                        <dbp-modal
                            id="my-modal-123"
                            modal-id="my-modal-123"
                            title=${i18n.t('column-settings')}
                            subscribe="lang">
                            <div slot="content" class="modal-content">
                                <ul class="headers">
                                    ${options.columns.map((column, counter) => {
                                        return html`
                                            <li id=${(counter + 1).toString()}>
                                                <div class="header-field">
                                                    <span class="header-title">
                                                        ${column.title}
                                                    </span>
                                                    <dbp-icon-button
                                                        class="header-button header-visibility-icon"
                                                        id=${'eye-button-' + counter}
                                                        @click="${() => {
                                                            this.changeVisibility(counter);
                                                        }}"
                                                        icon-name="source_icons_eye-empty"
                                                        title="}"
                                                        aria-label=""></dbp-icon-button>
                                                    <dbp-icon-button
                                                        class="header-button"
                                                        @click="${() => {
                                                            this.moveHeaderUp(counter + 1);
                                                        }}"
                                                        icon-name="arrow-up"
                                                        title=""
                                                        aria-label=""></dbp-icon-button>
                                                    <dbp-icon-button
                                                        class="header-button"
                                                        @click="${() => {
                                                            this.moveHeaderDown(counter + 1);
                                                        }}"
                                                        icon-name="arrow-down"
                                                        title=""
                                                        aria-label=""></dbp-icon-button>
                                                </div>
                                            </li>
                                        `;
                                    })}
                                </ul>
                            </div>
                            <div slot="footer" class="modal-footer">
                                <button
                                    class="button is-secondary"
                                    @click="${() => {
                                        this.resetSettings();
                                    }}">
                                    ${i18n.t('reset-settings')}
                                </button>
                                <button
                                    class="button is-primary"
                                    @click="${() => {
                                        this.saveSettings();
                                    }}">
                                    ${i18n.t('save-settings')}
                                </button>
                            </div>
                        </dbp-modal>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tabulator-table-demo', TabulatorTableDemo);
