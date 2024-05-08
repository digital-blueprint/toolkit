import {createInstance, setOverridesByGlobalCache} from './i18n';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {TabulatorTable} from './tabulator-table';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class TabulatorTableDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-tabulator-table': TabulatorTable,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
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
            });
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    setTableData(data) {
        let table = this._('#tabulator-table-demo-5');
        table.setData(data);
    }

    setTableData2(data) {
        let table = this._('#tabulator-table-demo-6');
        table.setData(data);
    }

    deleteTableRow(row) {
        let table = this._('#tabulator-table-demo-6');
        table.deleteRow(row);
    }

    filterTable(){
        let filter = this._('#searchbar');
        console.log(filter.value);
        let operator = this._('#operator-select');
        let column = this._('#column-select');

        filter = filter.value;
        operator = operator.value;
        column = column.value;

        let listOfFilters = [];
        let table = this._('#tabulator-table-demo-6');
        if(column !== 'all')
        {
            let filter_object = {field: column, type: operator, value: filter};
            table.filterColumns([filter_object]);
        }

        else
        {
            console.log('all columns');
            const columns = ['name', 'age', 'col', 'dob'];

            for (let col of columns) {
                let filter_object = {field: col, type: operator, value: filter};
                listOfFilters.push(filter_object);
            }
            console.log([listOfFilters]);
            table.filterColumns([listOfFilters]);
        }
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
        `;
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

        for (let row = 1; row < 5; row++)
        {
            let btn_delete = this.createScopedElement('button');
            btn_delete.addEventListener("click", (event) => {
                this.deleteTableRow(row);
            });
            btn_delete.textContent = 'delete';
            let current_name = 'Oli Bob ' + row;
            let element = {id: row, name: current_name, age: '12', col: 'red', dob: '14/05/1982', delete: btn_delete};
            data_edit.push(element);
        }

        // https://tabulator.info/docs/6.0/localize#define
        let langs = {
            'en': {
                columns: {
                    'name': i18n.t('name', {lng: 'en'}),
                    'age': i18n.t('age', {lng: 'en'}),
                    'col': i18n.t('col', {lng: 'en'}),
                    'dob': i18n.t('dob', {lng: 'en'}),
                },
            },
            'de': {
                columns: {
                    'name': i18n.t('name', {lng: 'de'}),
                    'age': i18n.t('age', {lng: 'de'}),
                    'col': i18n.t('col', {lng: 'de'}),
                    'dob': i18n.t('dob', {lng: 'de'}),
                },
            },
        };

        let langs_edit = {
            'en': {
                columns: {
                    'name': i18n.t('name', {lng: 'en'}),
                    'age': i18n.t('age', {lng: 'en'}),
                    'col': i18n.t('col', {lng: 'en'}),
                    'dob': i18n.t('dob', {lng: 'en'}),
                    'delete': i18n.t('delete', {lng: 'en'}),
                },
            },
            'de': {
                columns: {
                    'name': i18n.t('name', {lng: 'de'}),
                    'age': i18n.t('age', {lng: 'de'}),
                    'col': i18n.t('col', {lng: 'de'}),
                    'dob': i18n.t('dob', {lng: 'de'}),
                    'delete': i18n.t('delete', {lng: 'de'}),
                },
            },
        };

        let options = {
            langs: langs,
            layout: 'fitColumns',
            columns: [
                {field: 'name', width: 150},
                {field: 'age', hozAlign: 'left', formatter: 'progress'},
                {field: 'col'},
                {field: 'dob', sorter: 'date', hozAlign: 'center'},
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
                {field: 'name', width: 150},
                {field: 'age', hozAlign: 'left', formatter: 'progress'},
                {field: 'col'},
                {field: 'dob', sorter: 'date', hozAlign: 'center'},
                {field: 'delete', formatter: 'html'},
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        return html`
            <section class="section">
                <div class="container">
                    <h2 class="title">${i18n.t('demo-title')}</h2>
                    <p>Basic tabulartor table with example data.</p>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - basic</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-1"
                        data=${JSON.stringify(data)}
                        options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - select-all-enabled</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-2"
                        select-all-enabled
                        data=${JSON.stringify(data)}
                        options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - pagination-enabled</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-3"
                        select-all-enabled
                        pagination-enabled="true"
                        pagination-size="5"
                        data=${JSON.stringify(dataLong)}
                        options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - pagination-size:10</h3>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-4"
                        pagination-size="10"
                        pagination-enabled="true"
                        data=${JSON.stringify(dataLong)}
                        options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <h3 class="demo-sub-title">Tabulator table - setData()</h3>
                    <button class="button is-primary" @click="${(e) => {
                        e.target.disabled = true;
                        this.setTableData(dataLong);
                    }}">Add data</button>
                    <dbp-tabulator-table
                        lang="${this.lang}"
                        class="tabulator-table-demo"
                        id="tabulator-table-demo-5"
                        pagination-size="10"
                        pagination-enabled="true"
                        options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>

                <div class="container">
                    <div id="extendable-searchbar">
                        <input type="text" id="searchbar" placeholder="Suchen">
                        <button id="search-button"
                                         @click='${() => {
                                             this.filterTable();
                                         }}'>filter table</button>
                        <div class="search filter">
                            <label for="column">Select column</label>

                            <select name="column" id="column-select">
                                <option value="all">all columns</option>
                                <option value="name">name</option>
                                <option value="age">age</option>
                                <option value="col">color</option>
                                <option value="dob">date of birth</option>
                            </select>
                        </div>
                        <div class="search filter">
                            <label for="operator">Select operator</label>
                            <select name="operator" id="operator-select">
                                <option value="=">=</option>
                                <option value="!=">!=</option>
                                <option value="<"><</option>
                                <option value="<="><=</option>
                                <option value=">">></option>
                                <option value=">=">>=</option>
                                <option value="like">contains</option>
                                <option value="keywords">keywords</option>
                                <option value="starts">starts with</option>
                                <option value="ends">ends with</option>
                            </select>
                            
                        </div>
                    </div>
                    <h3 class="demo-sub-title">Tabulator table - Edit</h3>
                    <button class="button is-primary" @click="${(e) => {
                        e.target.disabled = true;
                        this.setTableData2(data_edit);
                    }}">Add data</button>
                    <dbp-tabulator-table
                            lang="${this.lang}"
                            class="tabulator-table-demo"
                            id="tabulator-table-demo-6"
                            pagination-size="10"
                            pagination-enabled="true"
                            options=${JSON.stringify(options_edit)}></dbp-tabulator-table>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tabulator-table-demo', TabulatorTableDemo);
