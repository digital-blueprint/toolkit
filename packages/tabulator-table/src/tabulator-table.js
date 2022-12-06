import {createInstance} from './i18n.js';
import {html, css, unsafeCSS} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import * as commonUtils from "@dbp-toolkit/common/utils";
import {name as pkgName} from "@dbp-toolkit/tabulator-table/package.json";
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";

export class TabulatorTable extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;

        this.tabulatorTable = null;
        this.identifier = 'table';
        this.options = {
            layout: "fitColumns",
            autoColumns: true,
        };
        this.data = [];
        this.paginationEnabled = false;
        this.paginationSize = 10;
        this.selectAllEnabled = false;
        this.tableReady = false;
        this.initalization = true;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            identifier: {type: String, attribute: 'identifier'},
            options: {type: Object},
            data: {type: Array, attribute: 'data'},
            paginationEnabled: {type: Boolean, attribute: 'pagination-enabled'},
            paginationSize: {type: Number, attribute: 'pagination-size'},
            selectAllEnabled: {type: Boolean, attribute: 'select-all-enabled'},
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
                if (this.tabulatorTable) {
                    this.tabulatorTable.setLocale(this.lang);
                }
            } else if (propName === 'options' && this.options !== null && !this.tableReady
                && !this.initalization) {
                this.buildTable();
            }
        });
        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.initalization = false;
        });
    }

    disconnectedCallback() {
        if (this.tabulatorTable) {
            this.tabulatorTable.off("tableBuilt");
            this.tabulatorTable.off("rowClick");
        }

        super.disconnectedCallback();
    }

    buildTable() {
        if (this.paginationEnabled) {
            let paginationElement = this._('.tabulator-paginator');
            this.options['pagination'] = 'local';
            this.options['paginationSize'] = this.paginationSize;
            this.options['paginationSizeSelector'] = true;
            this.options['paginationElement'] = paginationElement;
            this.options['langs'] = {
                'en': {
                    'pagination': {
                        'page_size': 'Page size',
                        'page_size_title': 'Page size',
                        'first': '<span class="mobile-hidden">First</span>',
                        'first_title': 'First Page',
                        'last': '<span class="mobile-hidden">Last</span>',
                        'last_title': 'Last Page',
                        'prev': '<span class="mobile-hidden">Prev</span>',
                        'prev_title': 'Prev Page',
                        'next': '<span class="mobile-hidden">Next</span>',
                        'next_title': 'Next Page'
                    }
                },
                'de': {
                    'pagination': {
                        'page_size': 'Einträge pro Seite',
                        'page_size_title': 'Einträge pro Seite',
                        'first': '<span class="mobile-hidden">Erste</span>',
                        'first_title': 'Erste Seite',
                        'last': '<span class="mobile-hidden">Letzte</span>',
                        'last_title': 'Letzte Seite',
                        'prev': '<span class="mobile-hidden">Vorherige</span>',
                        'prev_title': 'Vorherige Seite',
                        'next': '<span class="mobile-hidden">Nächste</span>',
                        'next_title': 'Nächste Seite'
                    }
                }
            };
        }

        this.tabulatorTable = new Tabulator(this._("#" + this.identifier), this.options);
        this.tabulatorTable.on("tableBuilt", this.tableBuildFunctions.bind(this));
        this.tabulatorTable.on("rowClick", this.rowClickFunction.bind(this));
        this.tableReady = true;
    }

    tableBuildFunctions() {
        if (!this.tabulatorTable)
            return;
        this.tabulatorTable.setLocale(this.lang);
        this.tabulatorTable.setData(this.data);

        if (this.selectAllEnabled) {
            console.log("add select all");
            this.tabulatorTable.addColumn({
                title:
                    '<label id="select_all_wrapper" class="button-container select-all-icon">' +
                    '<input type="checkbox" id="select_all" name="select_all" value="select_all">' +
                    '<span class="checkmark" id="select_all_checkmark"></span>' +
                    '</label>',

                field: 'empty',
                hozAlign: 'center',
                width: 40,
                headerSort: false,
                responsive: 0,
                widthGrow: 1,
                headerClick: (e) => {
                    let allSelected = this.checkAllSelected();

                    if (allSelected) {
                        this.tabulatorTable.deselectRow();
                        this._('#select_all').checked = false;
                    } else {
                        this.tabulatorTable.selectRow("visible");
                        this._('#select_all').checked = true;
                    }
                    e.preventDefault();
                },
            }, true);
        }
    }

    rowClickFunction(e, row) {
        if (this.tabulatorTable !== null &&
            this.tabulatorTable.getSelectedRows().length ===
            this.tabulatorTable.getRows("visible").length) {
            this._('#select_all').checked = true;
        } else {
            this._('#select_all').checked = false;
        }
    }

    /**
     * Select or deselect all files from tabulator table
     *
     */
    selectAllFiles() {
        let allSelected = this.checkAllSelected();

        if (allSelected) {
            this.tabulatorTable.getSelectedRows().forEach((row) => row.deselect());
        } else {
            this.tabulatorTable.getRows().forEach((row) => row.select());
        }
    }

    checkAllSelected() {
        if (this.tabulatorTable) {
            let maxSelected = this.tabulatorTable.getRows("visible").length;
            let selected = this.tabulatorTable.getSelectedRows().length;

            if (selected === maxSelected) {
                return true;
            }
        }
        return false;
    }

    setData(data) {
        if (!this.tabulatorTable)
            return;
        this.data = data;
        this.tabulatorTable.setData(this.data);
    }

    static get styles() {
        const iconPath = commonUtils.getAssetURL(
            '@dbp-toolkit/common',
            'icons/'
        );

        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getTabulatorStyles()}
            ${commonStyles.getRadioAndCheckboxCss()}
            
            .select-all-icon {
                height: 40px;
                position: absolute;
                top: -2px;
            }

            .checkmark {
                height: 20px;
                width: 20px;
                left: 10px;
                top: 8px;
            }

            .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: normal;
                font-size: 1rem;
            }

            .tabulator .tabulator-header .tabulator-header-contents .tabulator-headers {
                min-height: 37px;
                display: flex;
                align-items: center;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page[disabled] {
                opacity: 0.4;
            }

            .tabulator .tabulator-footer {
                background-color: var(--dbp-background);
                color: var(--dbp-content);
            }

            .tabulator .tabulator-footer .tabulator-footer-contents {
                flex-direction: column;
            }

            .tabulator .tabulator-footer .tabulator-paginator {
                flex-direction: row;
                display: flex;
                align-items: center;
            }

            .tabulator .tabulator-footer .tabulator-paginator label {
                color: var(--dbp-content);
                font-weight: 400;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page-size {
                box-sizing: border-box;
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
                transition: all 0.15s ease 0s, color 0.15s ease 0s;
                background: var(--dbp-secondary-surface);
                color: var(--dbp-on-secondary-surface);
                border-color: var(--dbp-secondary-surface-border-color);
                box-sizing: border-box;
                min-height: 40px;
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

                #custom-pagination, .tabulator-footer {
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

                .tabulator .tabulator-footer .tabulator-footer-contents .tabulator-paginator .tabulator-pages {
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

                button[data-page="prev"]::after, button[data-page="next"]::after, button[data-page="first"]::after, button[data-page="last"]::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    background-color: var(--dbp-content);
                    mask-repeat: no-repeat;
                    mask-position: center center;
                    padding: 0 0 0.25%;
                    mask-size: 1.4rem !important;
                }

                button[data-page="first"]::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    mask-image: url("${unsafeCSS(iconPath)}angle-double-left.svg");
                }

                button[data-page="prev"]::after {
                    mask-image: url("${unsafeCSS(iconPath)}chevron-left.svg");
                }

                button[data-page="next"]::after {
                    mask-image: url("${unsafeCSS(iconPath)}chevron-right.svg");
                }

                button[data-page="last"]::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    mask-image: url("${unsafeCSS(iconPath)}angle-double-right.svg");
                }
            }
        `;
    }

    render() {
        const tabulatorCss = commonUtils.getAssetURL(
            pkgName,
            'tabulator-tables/css/tabulator.min.css'
        );

        return html`
            <div class="wrapper">
                <link rel="stylesheet" href="${tabulatorCss}"/>
                <div class="table-wrapper">
                    <div id=${this.identifier}></div>
                    <div class='tabulator ${classMap({hidden: !this.paginationEnabled})}' id='custom-pagination'>
                        <div class='tabulator-footer'>
                            <div class='tabulator-footer-contents'>
                                <span class='tabulator-paginator'></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
