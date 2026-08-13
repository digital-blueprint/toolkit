import {createInstance} from './i18n.js';
import {html, css, unsafeCSS} from 'lit';
import {
    ScopedElementsMixin,
    LangMixin,
    getIconSVGURL,
    MiniSpinner,
    Button,
    Icon,
    IconButton,
} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as tabulatorStyles from '@dbp-toolkit/tabulator-table/src/tabulator-table-styles';
import {name as pkgName} from '@dbp-toolkit/tabulator-table/package.json';
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {downloadExcel, generatePDFDownload} from './utils.js';
import {sendNotification} from '@dbp-toolkit/common';
import {ColumnConfigurationModal} from './column-configuration-modal.js';
import {
    cloneColumnDefinitions,
    createColumnConfiguration,
    reconcileColumnConfiguration,
} from './column-configuration.js';

export class TabulatorTable extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        // Tabulator table id
        this.identifier = 'table';
        // Web Component id
        this.id = '';
        /** @type {import('tabulator-tables').Options} */
        this.options = {
            layout: 'fitColumns',
            autoColumns: true,
            index: 'id',
        };
        this.data = [];
        this.paginationEnabled = false;
        this.paginationSize = 10;
        this.stickyHeaderEnabled = false;
        this.selectRowsEnabled = false;
        this.rowSelected = false;
        this.selectedRows = null;
        this.tableReady = false;
        this.tableBuilding = false;
        this.initialization = true;
        this.collapseEnabled = false;
        this.isCollapsible = false;
        this.overflowYScrollEnabled = false;
        this.selectedRowCount = 0;
        this.columnConfigurationEnabled = false;
        this.columnConfigurationInHeader = false;
        this.columnConfigurationStorageKey = '';
        this.columnConfigurationExcludedFields = [];
        this.defaultColumnDefinitions = [];
        this.defaultColumnConfiguration = [];
        this.currentColumnConfiguration = [];
        this.columnConfigurationApplying = false;
        this.columnConfigurationHeaderButton = null;
        this.columnConfigurationHeaderElement = null;
    }

    static get scopedElements() {
        return {
            ...super.scopedElements,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-button': Button,
            'dbp-icon': Icon,
            'dbp-icon-button': IconButton,
            'dbp-tabulator-column-configuration-modal': ColumnConfigurationModal,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            id: {type: String, reflect: true},
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
            overflowYScrollEnabled: {type: Boolean, attribute: 'overflow-y-scroll-enabled'},
            tableReady: {type: Boolean, attribute: false},
            tableBuilding: {type: Boolean, attribute: false},
            selectedRowCount: {type: Number},
            columnConfigurationEnabled: {
                type: Boolean,
                attribute: 'column-configuration-enabled',
            },
            columnConfigurationInHeader: {
                type: Boolean,
                attribute: 'column-configuration-in-header',
            },
            columnConfigurationStorageKey: {
                type: String,
                attribute: 'column-configuration-storage-key',
            },
            columnConfigurationExcludedFields: {type: Array, attribute: false},
            currentColumnConfiguration: {type: Array, attribute: false},
        };
    }

    update(changedProperties) {
        super.update(changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this.updateColumnConfigurationHeaderButtonLabel();
                if (this.tabulatorTable) {
                    this.setTableLocale();
                    if (this.columnConfigurationEnabled) {
                        const currentConfiguration = this.currentColumnConfiguration;
                        this.defaultColumnConfiguration = createColumnConfiguration(
                            this.defaultColumnDefinitions,
                            this.columnConfigurationExcludedFields,
                            this.getLang()?.columns,
                        );
                        this.currentColumnConfiguration = reconcileColumnConfiguration(
                            this.defaultColumnConfiguration,
                            currentConfiguration,
                        );
                    }
                }
            } else if (
                propName === 'options' &&
                this.options !== null &&
                !this.tableReady &&
                !this.tableBuilding &&
                !this.initialization
            ) {
                this.buildTable();
            } else if (propName === 'columnConfigurationEnabled' && this.tableReady) {
                if (this.columnConfigurationEnabled) {
                    this.initializeColumnConfiguration();
                } else {
                    this.clearColumnConfigurationHeaderButton();
                }
            } else if (propName === 'columnConfigurationInHeader' && this.tableReady) {
                this.updateColumnConfigurationTriggerPlacement();
            } else if (
                propName === 'columnConfigurationExcludedFields' &&
                this.columnConfigurationEnabled &&
                this.tableReady
            ) {
                this.defaultColumnConfiguration = createColumnConfiguration(
                    this.defaultColumnDefinitions,
                    this.columnConfigurationExcludedFields,
                    this.getLang()?.columns,
                );
                this.syncCurrentColumnConfiguration();
            } else if (
                propName === 'columnConfigurationStorageKey' &&
                this.columnConfigurationEnabled &&
                this.tableReady
            ) {
                this.applyColumnConfiguration(
                    reconcileColumnConfiguration(
                        this.defaultColumnConfiguration,
                        this.loadColumnConfiguration(),
                    ),
                    {persist: false, dispatchEvent: false},
                );
            }
        });
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
            this.tabulatorTable.off('columnMoved');
            this.tabulatorTable.off('pageLoaded');
        }

        super.disconnectedCallback();
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('data') && this.tableReady && this.tabulatorTable) {
            this.tabulatorTable.setData(this.data || []);
        }
    }

    setTableLocale() {
        if (!this.tabulatorTable) return;

        if (typeof this.tabulatorTable.setLocale === 'function') {
            this.tabulatorTable.setLocale(this.lang);
            return;
        }

        if (typeof this.tabulatorTable.modules?.localize?.setLocale === 'function') {
            this.tabulatorTable.modules.localize.setLocale(this.lang);
        }
    }

    buildTable() {
        if (this.collapseEnabled) {
            // this.options['layout'] = 'fitDataFill';
            this.options['responsiveLayout'] = 'collapse';
        }
        if (this.paginationNoLangsEnabled) {
            let paginationElement = this._('.tabulator-paginator');
            if (paginationElement) {
                while (paginationElement.firstChild) {
                    paginationElement.removeChild(paginationElement.firstChild);
                }
            }
            //this.options['autoColumns'] = true;
            this.options['pagination'] = true;
            this.options['paginationSize'] = this.paginationSize;
            this.options['paginationSizeSelector'] = [5, 10, 20, 50, 100];
            this.options['footerElement'] = '';
            this.options['paginationElement'] = paginationElement;
        }

        if (this.paginationEnabled) {
            let paginationElement = this._('.tabulator-paginator');
            if (paginationElement) {
                while (paginationElement.firstChild) {
                    paginationElement.removeChild(paginationElement.firstChild);
                }
            }
            this.options['pagination'] = true;
            this.options['paginationSize'] = this.paginationSize;
            this.options['paginationSizeSelector'] = [5, 10, 20, 50, 100];
            this.options['paginationElement'] = paginationElement;
            // Ensure the langs structure exists before injecting pagination
            // translations, in case the caller didn't provide any langs.
            this.options['langs'] ??= {};
            this.options['langs']['en'] ??= {};
            this.options['langs']['de'] ??= {};
            this.options['langs']['en']['pagination'] = {
                page_size: 'Page size',
                page_size_title: 'Page size',
                first: '<span class="mobile-hidden"> << </span>',
                first_title: 'First Page',
                last: '<span class="mobile-hidden"> >> </span>',
                last_title: 'Last Page',
                prev: '<span class="mobile-hidden"> < </span>',
                prev_title: 'Prev Page',
                next: '<span class="mobile-hidden"> > </span>',
                next_title: 'Next Page',
            };
            this.options['langs']['de']['pagination'] = {
                page_size: 'Einträge pro Seite',
                page_size_title: 'Einträge pro Seite',
                first: '<span class="mobile-hidden"> << </span>',
                first_title: 'Erste Seite',
                last: '<span class="mobile-hidden"> >> </span>',
                last_title: 'Letzte Seite',
                prev: '<span class="mobile-hidden"> < </span>',
                prev_title: 'Vorherige Seite',
                next: '<span class="mobile-hidden"> > </span>',
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

        if (!this._(`#${this.identifier}`)) {
            console.warn('buildTable: container element not found for', this.identifier);
            return;
        }

        /** @type {import('tabulator-tables').Tabulator} */
        this.tabulatorTable = new Tabulator(this._('#' + this.identifier), this.options);

        console.log('TABULATOR TABLE INITIALIZED', this.tabulatorTable);
        this.tableBuilding = true;
        this.tabulatorTable.on('tableBuilt', this.tableBuildFunctions.bind(this));
        this.tabulatorTable.on('rowClick', this.rowClickFunction.bind(this));
        this.tabulatorTable.on('rowSelectionChanged', (data, rows, selected, deselected) => {
            const allSelectedRows = this.tabulatorTable.getSelectedRows();
            const selectedCount = allSelectedRows.length;

            this.selectedRows = allSelectedRows;
            this.selectedCount = selectedCount;
            this.rowSelected = this.selectedRowCount > 0;

            const selectionCountChangedEvent = new CustomEvent(
                'dbp-tabulator-table-selection-count-changed',
                {
                    detail: {
                        count: selectedCount,
                        rows: allSelectedRows,
                    },
                    bubbles: true,
                    composed: true,
                },
            );
            this.dispatchEvent(selectionCountChangedEvent);
            const rowSelectionChangedEvent = new CustomEvent(
                'dbp-tabulator-table-row-selection-changed-event',
                {
                    detail: {
                        selected: selected,
                        deselected: deselected,
                        allselected: allSelectedRows,
                        selectedCount: this.selectedCount,
                        rows: rows,
                        data: data,
                    },
                    bubbles: true,
                    composed: true,
                },
            );
            this.dispatchEvent(rowSelectionChangedEvent);
        });
        this.tabulatorTable.on('columnVisibilityChanged', (column) => {
            const columnDefinition = column.getDefinition();
            const columnVisibility = column.isVisible();
            if (columnDefinition.formatter === 'responsiveCollapse') {
                if (columnVisibility === true) {
                    this.isCollapsible = true;
                } else {
                    this.isCollapsible = false;
                }

                const collapseEvent = new CustomEvent('dbp-tabulator-table-collapsible-event', {
                    detail: {
                        tableId: this.identifier,
                        isCollapsible: this.isCollapsible,
                    },
                    bubbles: true,
                    composed: true,
                });
                this.dispatchEvent(collapseEvent);
                this.updateSelectionState();
            }

            if (this.columnConfigurationEnabled && !this.columnConfigurationApplying) {
                this.syncCurrentColumnConfiguration();
            }
            this.placeColumnConfigurationButtonInHeader();
        });
        this.tabulatorTable.on('columnMoved', () => {
            if (this.columnConfigurationEnabled && !this.columnConfigurationApplying) {
                this.syncCurrentColumnConfiguration();
            }
            this.placeColumnConfigurationButtonInHeader();
        });

        /**
         * Pagination event pageLoaded
         * Whenever a page has been loaded, the pageLoaded event is called, passing the current page number as an argument.
         */
        this.tabulatorTable.on('pageLoaded', (pageno) => {
            const pageLoadedEvent = new CustomEvent('dbp-tabulator-table-page-loaded-event', {
                detail: {
                    tableId: this.identifier,
                    pageSize: pageno,
                },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(pageLoadedEvent);
        });

        this.tabulatorTable.on('renderComplete', () => {
            this.placeColumnConfigurationButtonInHeader();
            const renderCompleteEvent = new CustomEvent(
                'dbp-tabulator-table-render-complete-event',
                {
                    detail: {
                        tableId: this.identifier,
                    },
                    bubbles: true,
                    composed: true,
                },
            );
            this.dispatchEvent(renderCompleteEvent);
        });
    }

    async tableBuildFunctions() {
        if (!this.tabulatorTable) return;
        this.setTableLocale();
        if (Array.isArray(this.data) && this.data.length > 0) {
            await this.tabulatorTable.setData(this.data);
        }
        /**
         * Change cursor to pointer on hover if rows are selectable
         */
        if (this.selectRowsEnabled) {
            this.tabulatorTable.on('rowMouseOver', function (e, row) {
                this.rowManager.element.classList.add('pointer-mouse');
            });
        }
        // Handle pagination size changes
        if (this.paginationEnabled) {
            const paginationSizeDropdown = this._('#custom-pagination .tabulator-page-size');

            const paginationSize = parseInt(
                localStorage.getItem(`tabulator-${this.identifier}-pagination-size`),
            );
            if (paginationSize) {
                this.paginationSize = paginationSize;
                this.tabulatorTable.setPageSize(this.paginationSize);
            }

            paginationSizeDropdown.addEventListener('change', (event) => {
                if (event.target.value) {
                    localStorage.setItem(
                        `tabulator-${this.identifier}-pagination-size`,
                        event.target.value,
                    );
                }
            });

            if (
                paginationSizeDropdown &&
                !paginationSizeDropdown.parentElement.classList.contains('page-size-wrapper')
            ) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('page-size-wrapper');

                paginationSizeDropdown.parentNode.insertBefore(wrapper, paginationSizeDropdown);
                wrapper.appendChild(paginationSizeDropdown);
            }
        }

        if (this.columnConfigurationEnabled) {
            this.initializeColumnConfiguration();
        }

        const tableBuiltEvent = new CustomEvent('dbp-tabulator-table-built', {
            detail: {
                id: this.identifier,
                tabulator: this.tabulatorTable,
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(tableBuiltEvent);

        this.tableReady = true;
        this.tableBuilding = false;
    }

    rowClickFunction(e, row) {
        if (!this._('#select_all') || !this.tabulatorTable) return;

        const check =
            this.tabulatorTable.getSelectedRows().length ===
            this.tabulatorTable.getRows('visible').length;
        /** @type {HTMLInputElement} */ (this._('#select_all')).checked = check;

        if (this.tabulatorTable.getSelectedRows().length === 0) this.rowSelected = false;
        else this.rowSelected = true;
    }

    deleteRow(rowID) {
        if (!this.tabulatorTable) return;

        let row = this.tabulatorTable.getRow(rowID);
        if (!row) {
            console.warn('Row not found for identifier:', rowID);
            return;
        }

        let rowData = row.getData();

        row.delete();

        if (Array.isArray(this.data)) {
            if (rowData && rowData.id !== undefined) {
                // Remove by unique primary key
                this.data = this.data.filter((item) => item.id !== rowData.id);
            } else {
                // Remove by value match using JSON stringification in case references broke
                const targetJson = JSON.stringify(rowData);
                this.data = this.data.filter((item) => JSON.stringify(item) !== targetJson);
            }
        }
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
     * Select all visible rows from tabulator table
     *
     */
    selectAllVisibleRows() {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.getRows('visible').forEach((row) => row.select());
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

    updateSelectionState(data = null, rows = null, selected = [], deselected = []) {
        if (!this.tabulatorTable) return;

        const allSelectedRows = rows ?? this.tabulatorTable.getSelectedRows();
        const allSelectedData = data ?? this.tabulatorTable.getSelectedData();

        this.selectedRows = allSelectedRows;
        this.selectedRowCount = allSelectedRows.length;
        this.rowSelected = this.selectedRowCount > 0;

        const selectionCountEvent = new CustomEvent('dbp-tabulator-table-selection-count-changed', {
            detail: {
                tableId: this.identifier,
                count: this.selectedRowCount,
                selected: selected,
                deselected: deselected,
                rows: allSelectedRows,
                data: allSelectedData,
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(selectionCountEvent);
    }

    checkAllSelected() {
        if (this.tabulatorTable) {
            let maxSelected = this.tabulatorTable.getRows('visible').length;
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
        const setDataResult = this.tabulatorTable.setData(this.data);
        if (
            this.columnConfigurationEnabled &&
            this.options.autoColumns &&
            (!Array.isArray(data) || data.length > 0)
        ) {
            Promise.resolve(setDataResult).then(() => this.refreshAutoColumnConfiguration());
        }
        return setDataResult;
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
        if (listOfFilters.length === 0) this.tabulatorTable.clearFilter(false);
        else this.tabulatorTable.setFilter(listOfFilters);
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
    }

    getColumns() {
        if (!this.tabulatorTable) return;
        return this.tabulatorTable.getColumns();
    }

    setColumns(newColumns) {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.setColumns(newColumns);
        if (this.columnConfigurationEnabled) {
            this.initializeColumnConfiguration();
        }
    }

    getColumnDefinitions() {
        if (!this.tabulatorTable) return;
        return this.tabulatorTable.getColumnDefinitions();
    }

    initializeColumnConfiguration() {
        if (!this.tabulatorTable) return;

        const definitions = this.getColumnDefinitions();
        if (!Array.isArray(definitions)) return;

        this.defaultColumnDefinitions = cloneColumnDefinitions(definitions);
        this.defaultColumnConfiguration = createColumnConfiguration(
            this.defaultColumnDefinitions,
            this.columnConfigurationExcludedFields,
            this.getLang()?.columns,
        );

        const storedConfiguration = this.loadColumnConfiguration();
        this.currentColumnConfiguration = reconcileColumnConfiguration(
            this.defaultColumnConfiguration,
            storedConfiguration,
        );

        if (storedConfiguration) {
            this.applyColumnConfigurationToTable(this.currentColumnConfiguration);
        } else {
            this.syncCurrentColumnConfiguration();
        }
        this.updateColumnConfigurationTriggerPlacement();
    }

    updateColumnConfigurationTriggerPlacement() {
        if (this.columnConfigurationEnabled && this.columnConfigurationInHeader) {
            this.placeColumnConfigurationButtonInHeader();
        } else {
            this.clearColumnConfigurationHeaderButton();
        }
    }

    placeColumnConfigurationButtonInHeader() {
        if (
            !this.tabulatorTable ||
            !this.columnConfigurationEnabled ||
            !this.columnConfigurationInHeader
        ) {
            return;
        }

        const column = this.getRightmostVisibleLeafColumn(this.tabulatorTable.getColumns(true));
        const headerElement = column?.getElement?.();
        const contentElement = headerElement?.querySelector('.tabulator-col-content');
        if (!contentElement) {
            this.clearColumnConfigurationHeaderButton();
            return;
        }

        if (!this.columnConfigurationHeaderButton) {
            const button = this.createScopedElement('dbp-icon-button');
            button.setAttribute('icon-name', 'cog');
            button.setAttribute('no-spinner-on-click', '');
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                this.openColumnConfiguration();
            });
            this.columnConfigurationHeaderButton = button;
        }

        if (
            this.columnConfigurationHeaderElement !== headerElement ||
            this.columnConfigurationHeaderButton.parentElement !== contentElement
        ) {
            this.columnConfigurationHeaderElement?.classList.remove('column-configuration-header');
            headerElement.classList.add('column-configuration-header');
            contentElement.append(this.columnConfigurationHeaderButton);
            this.columnConfigurationHeaderElement = headerElement;
        }

        this.updateColumnConfigurationHeaderButtonLabel();
    }

    getRightmostVisibleLeafColumn(columns) {
        for (let index = columns.length - 1; index >= 0; index--) {
            const column = columns[index];
            const subColumns = column.getSubColumns?.() || [];
            const leafColumn = this.getRightmostVisibleLeafColumn(subColumns);
            if (leafColumn) return leafColumn;
            if (subColumns.length === 0 && column.isVisible()) return column;
        }

        return null;
    }

    clearColumnConfigurationHeaderButton() {
        this.columnConfigurationHeaderButton?.remove();
        this.columnConfigurationHeaderElement?.classList.remove('column-configuration-header');
        this.columnConfigurationHeaderElement = null;
    }

    updateColumnConfigurationHeaderButtonLabel() {
        if (!this.columnConfigurationHeaderButton) return;

        const label = this._i18n.t('tabulator-table.column-configuration.open-description');
        const title = this._i18n.t('tabulator-table.column-configuration.open');
        this.columnConfigurationHeaderButton.setAttribute('aria-label', label);
        this.columnConfigurationHeaderButton.setAttribute('title', title);
    }

    refreshAutoColumnConfiguration() {
        const currentConfiguration = this.currentColumnConfiguration;
        this.defaultColumnDefinitions = cloneColumnDefinitions(this.getColumnDefinitions());
        this.defaultColumnConfiguration = createColumnConfiguration(
            this.defaultColumnDefinitions,
            this.columnConfigurationExcludedFields,
            this.getLang()?.columns,
        );
        this.currentColumnConfiguration = reconcileColumnConfiguration(
            this.defaultColumnConfiguration,
            currentConfiguration,
        );
        this.applyColumnConfigurationToTable(this.currentColumnConfiguration);
    }

    async openColumnConfiguration() {
        if (!this.columnConfigurationEnabled || !this.tabulatorTable) return;

        const modal = this.renderRoot.querySelector('dbp-tabulator-column-configuration-modal');
        if (!modal) return;

        modal.columns = this.currentColumnConfiguration;
        modal.defaultColumns = this.defaultColumnConfiguration;
        await modal.open();
    }

    getColumnConfiguration() {
        return this.currentColumnConfiguration.map(({field, visible}) => ({field, visible}));
    }

    applyColumnConfiguration(configuration, options = {}) {
        if (!this.tabulatorTable || !Array.isArray(configuration)) return;

        const reconciledConfiguration = reconcileColumnConfiguration(
            this.defaultColumnConfiguration,
            configuration,
        );
        this.currentColumnConfiguration = reconciledConfiguration;
        this.applyColumnConfigurationToTable(reconciledConfiguration);

        if (options.persist !== false) {
            this.storeColumnConfiguration();
        }

        if (options.dispatchEvent !== false) {
            this.dispatchEvent(
                new CustomEvent('dbp-tabulator-table-column-configuration-changed', {
                    detail: {
                        tableId: this.identifier,
                        columns: this.getColumnConfiguration(),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    resetColumnConfiguration() {
        this.removeStoredColumnConfiguration();
        this.applyColumnConfiguration(this.defaultColumnConfiguration, {persist: false});
    }

    handleColumnConfigurationSave(event) {
        this.applyColumnConfiguration(event.detail.columns);
    }

    applyColumnConfigurationToTable(configuration) {
        const configurationByField = new Map(
            configuration.map((column, index) => [column.field, {...column, index}]),
        );
        const columns = this.tabulatorTable.getColumns(true);

        this.columnConfigurationApplying = true;
        try {
            this.updateColumnVisibility(columns, configurationByField);
            const responsiveLayout = this.tabulatorTable.modules?.responsiveLayout;
            responsiveLayout?.initializeResponsivity?.();
            responsiveLayout?.update?.();
            this.reorderColumnComponents(columns, configurationByField);
        } finally {
            this.columnConfigurationApplying = false;
            this.syncCurrentColumnConfiguration();
            this.placeColumnConfigurationButtonInHeader();
        }
    }

    updateColumnVisibility(columns, configurationByField) {
        for (const column of columns) {
            const subColumns = column.getSubColumns?.() || [];
            if (subColumns.length > 0) {
                this.updateColumnVisibility(subColumns, configurationByField);
                continue;
            }

            const configured = configurationByField.get(column.getField?.());
            if (!configured) continue;

            const responsiveState = column._column?.modules?.responsive;
            const wasConfiguredVisible = responsiveState?.visible;
            if (responsiveState && typeof responsiveState.visible === 'boolean') {
                responsiveState.visible = configured.visible;
            }

            if (
                configured.visible &&
                !column.isVisible() &&
                (!responsiveState || wasConfiguredVisible === false)
            ) {
                column.show();
            } else if (!configured.visible && column.isVisible()) {
                column.hide();
            }
        }
    }

    reorderColumnComponents(columns, configurationByField) {
        for (const column of columns) {
            const subColumns = column.getSubColumns?.() || [];
            if (subColumns.length > 0) {
                this.reorderColumnComponents(subColumns, configurationByField);
            }
        }

        const currentColumns = [...columns];
        const configurableIndexes = [];
        const configuredColumns = [];
        currentColumns.forEach((column, index) => {
            const field = column.getField?.();
            if ((column.getSubColumns?.() || []).length === 0 && configurationByField.has(field)) {
                configurableIndexes.push(index);
                configuredColumns.push(column);
            }
        });
        configuredColumns.sort(
            (first, second) =>
                configurationByField.get(first.getField()).index -
                configurationByField.get(second.getField()).index,
        );

        configurableIndexes.forEach((targetIndex, configuredIndex) => {
            const sourceColumn = configuredColumns[configuredIndex];
            const sourceIndex = currentColumns.indexOf(sourceColumn);
            if (sourceIndex === targetIndex) return;

            const targetColumn = currentColumns[targetIndex];
            const moveAfterTarget = sourceIndex < targetIndex;
            this.tabulatorTable.moveColumn(sourceColumn, targetColumn, moveAfterTarget);
            currentColumns.splice(sourceIndex, 1);
            const updatedTargetIndex = currentColumns.indexOf(targetColumn);
            currentColumns.splice(updatedTargetIndex + (moveAfterTarget ? 1 : 0), 0, sourceColumn);
        });
    }

    syncCurrentColumnConfiguration() {
        const liveConfiguration = createColumnConfiguration(
            this.getColumnDefinitions(),
            this.columnConfigurationExcludedFields,
            this.getLang()?.columns,
        );
        const columnsByField = new Map();
        this.collectLeafColumnComponents(this.tabulatorTable.getColumns(true), columnsByField);
        this.currentColumnConfiguration = liveConfiguration.map((column) => ({
            ...column,
            visible: this.getConfiguredColumnVisibility(columnsByField.get(column.field), column),
        }));
    }

    getConfiguredColumnVisibility(column, fallbackConfiguration) {
        const responsiveVisibility = column?._column?.modules?.responsive?.visible;
        if (typeof responsiveVisibility === 'boolean') return responsiveVisibility;
        return column?.isVisible() ?? fallbackConfiguration.visible;
    }

    collectLeafColumnComponents(columns, columnsByField) {
        for (const column of columns) {
            const subColumns = column.getSubColumns?.() || [];
            if (subColumns.length > 0) {
                this.collectLeafColumnComponents(subColumns, columnsByField);
            } else if (column.getField?.()) {
                columnsByField.set(column.getField(), column);
            }
        }
    }

    getColumnConfigurationStorageKey() {
        if (!this.columnConfigurationStorageKey) return null;
        return `dbp-tabulator-table-column-configuration-${this.columnConfigurationStorageKey}`;
    }

    loadColumnConfiguration() {
        const storageKey = this.getColumnConfigurationStorageKey();
        if (!storageKey) return null;

        try {
            const value = localStorage.getItem(storageKey);
            if (!value) return null;

            const stored = JSON.parse(value);
            return stored?.version === 1 && Array.isArray(stored.columns) ? stored.columns : null;
        } catch (error) {
            console.warn('Unable to restore the Tabulator column configuration.', error);
            return null;
        }
    }

    storeColumnConfiguration() {
        const storageKey = this.getColumnConfigurationStorageKey();
        if (!storageKey) return;

        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify({version: 1, columns: this.getColumnConfiguration()}),
            );
        } catch (error) {
            console.warn('Unable to store the Tabulator column configuration.', error);
        }
    }

    removeStoredColumnConfiguration() {
        const storageKey = this.getColumnConfigurationStorageKey();
        if (!storageKey) return;

        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.warn('Unable to remove the Tabulator column configuration.', error);
        }
    }

    getColumnsFields() {
        if (!this.tabulatorTable) return;
        let columns = this.tabulatorTable.getColumns();
        let columns_titles = [];
        for (let col of columns) {
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
        let currentLang = this.tabulatorTable.getLang
            ? this.tabulatorTable.getLang()
            : this.tabulatorTable.modules?.localize?.getLang();
        return currentLang ?? this.options.langs?.[this.lang];
    }

    setPage(currentPage) {
        if (!this.tabulatorTable) return;
        this.tabulatorTable.setPage(currentPage);
    }

    expandAll() {
        if (!this.tabulatorTable) return;

        this.tabulatorTable.getRows('visible').forEach((row) => {
            let config = row._row.modules.responsiveLayout;
            config.open = true;
            const item = /** @type {HTMLElement} */ (row.getElement().lastChild);

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
    }

    collapseAll() {
        this.tabulatorTable.getRows('visible').forEach((row) => {
            let config = row._row.modules.responsiveLayout;
            config.open = false;
            const item = /** @type {HTMLElement} */ (row.getElement().lastChild);

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
    }

    async download(type, dataName) {
        if (!this.tabulatorTable) {
            return;
        }

        const active_rows = this.tabulatorTable.getRows('active');
        if (active_rows.length === 0) return;

        const selected_rows = this.tabulatorTable.getSelectedRows();
        const hasSelection = selected_rows.length > 0;

        const rows = hasSelection ? selected_rows : active_rows;
        const data = hasSelection
            ? selected_rows.map((row) => ({...row.getData(), rowIndex: row.getPosition(true)}))
            : this.tabulatorTable.getData().map((row, index) => ({...row, rowIndex: index}));
        const downloadMode = hasSelection ? 'selected' : 'all';

        let hasError = false;

        try {
            switch (type) {
                case 'csv':
                case 'json':
                case 'html':
                    this.tabulatorTable.download(type, dataName + '.' + type, {}, downloadMode);
                    break;
                case 'xlsx':
                    await downloadExcel(rows, dataName);
                    break;
                case 'pdf':
                    await generatePDFDownload(this.tabulatorTable, data, dataName);
                    break;
                default:
                    console.error('Unsupported export type:', type);
                    sendNotification({
                        summary: this._i18n.t('tabulator-table.error-title'),
                        body: this._i18n.t('tabulator-table.unsupported-type-error-message'),
                        type: 'danger',
                        timeout: 0,
                    });
                    hasError = true;
                    break;
            }
        } catch (error) {
            hasError = true;
            console.error('Download failed:', error);
            sendNotification({
                summary: this._i18n.t('tabulator-table.error-title'),
                body: this._i18n.t('tabulator-table.download-error-message'),
                type: 'danger',
                timeout: 0,
            });
        }

        if (!hasError) {
            sendNotification({
                summary: this._i18n.t('tabulator-table.success-title'),
                body: this._i18n.t('tabulator-table.download-success-message'),
                type: 'success',
                timeout: 5,
            });
        }
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getRadioAndCheckboxCss()}
            ${commonStyles.getButtonCSS()}
            ${tabulatorStyles.getTabulatorStyles()}

            .column-configuration-toolbar {
                display: flex;
                justify-content: flex-end;
                min-height: 2.5rem;
            }

            .column-configuration-toolbar dbp-button {
                --dbp-button-icon-margin-right: 0.5rem;
            }

            .tabulator .tabulator-header .column-configuration-header .tabulator-arrow {
                display: none;
            }

            .tabulator .tabulator-header .column-configuration-header .tabulator-col-content {
                padding-right: 2.75rem;
                position: relative;
            }

            .column-configuration-header dbp-icon-button {
                position: absolute;
                top: 50%;
                right: 0.25rem;
                z-index: 1;
                transform: translateY(-50%);
            }

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
            }

            /* Allow scrolling of rows inside "content" area of table */
            :host([overflow-y-scroll-enabled]) .tabulator .tabulator-tableholder {
                overflow-y: scroll;
            }

            .tabulator .tabulator-tableholder :hover {
                cursor: default;
            }

            .tabulator .tabulator-tableholder.pointer-mouse :hover {
                cursor: pointer;
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page[disabled] {
                opacity: var(--dbp-hover-background-color);
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
                min-height: 40px;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background: none;
            }

            .tabulator-page-size option {
                color: var(--dbp-content);
                background-color: var(--dbp-background);
            }

            .page-size-wrapper {
                position: relative;
                display: inline-flex;
                align-items: center;
            }

            .page-size-wrapper::after {
                content: '';
                position: absolute;
                right: 0.6rem;
                width: 1rem;
                height: 1rem;
                pointer-events: none;
                background-color: var(--dbp-content);
                mask-image: url('${unsafeCSS(getIconSVGURL('chevron-down'))}');
                mask-repeat: no-repeat;
                mask-position: center;
                mask-size: contain;
            }
            .tabulator .tabulator-footer .tabulator-paginator {
                color: var(--dbp-content);
            }

            .tabulator .tabulator-footer .tabulator-paginator .tabulator-page {
                opacity: unset;
                border-radius: var(--dbp-border-radius);
                cursor: pointer;
                padding: calc(0.375em - 1px) 0.75em;
                text-align: center;
                white-space: nowrap;
                font-size: inherit;
                font-weight: 300;
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
                background: var(--dbp-selected);
                color: var(--dbp-on-selected-surface);
                font-weight: bold;
            }

            .tabulator .tabulator-footer .tabulator-page:not(disabled):hover {
                color: var(--dbp-hover-color);
                background: var(--dbp-hover-background-color);
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
                    mask-image: url('${unsafeCSS(getIconSVGURL('angle-double-left'))}');
                }

                button[data-page='prev']::after {
                    mask-image: url('${unsafeCSS(getIconSVGURL('chevron-left'))}');
                }

                button[data-page='next']::after {
                    mask-image: url('${unsafeCSS(getIconSVGURL('chevron-right'))}');
                }

                button[data-page='last']::after {
                    content: '\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
                    mask-image: url('${unsafeCSS(getIconSVGURL('angle-double-right'))}');
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

                ${
                    this.columnConfigurationEnabled
                        ? html`
                              ${
                                  !this.columnConfigurationInHeader
                                      ? html`
                                            <div class="column-configuration-toolbar">
                                                <dbp-button
                                                    no-spinner-on-click
                                                    type="is-secondary"
                                                    ?disabled=${!this.tableReady}
                                                    title=${this._i18n.t(
                                                        'tabulator-table.column-configuration.open',
                                                    )}
                                                    @click=${() => this.openColumnConfiguration()}>
                                                    <dbp-icon
                                                        name="cog"
                                                        aria-hidden="true"></dbp-icon>
                                                    <span>
                                                        ${this._i18n.t(
                                                            'tabulator-table.column-configuration.open',
                                                        )}
                                                    </span>
                                                </dbp-button>
                                            </div>
                                        `
                                      : ''
                              }
                              <dbp-tabulator-column-configuration-modal
                                  .lang=${this.lang}
                                  @column-configuration-save=${(event) =>
                                      this.handleColumnConfigurationSave(
                                          event,
                                      )}></dbp-tabulator-column-configuration-modal>
                          `
                        : ''
                }

                <div class="table-wrapper">
                    <div class="${classMap({hidden: this.tableReady, 'spinner-container': true})}">
                        <dbp-mini-spinner
                            text="${this._i18n.t(
                                'tabulator-table.loading-table-data',
                            )}"></dbp-mini-spinner>
                    </div>
                    <div
                        id=${this.identifier}
                        class="${classMap({'sticky-header': this.stickyHeaderEnabled})}"></div>
                    <div
                        class="tabulator ${classMap({hidden: !this.paginationEnabled})}"
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
