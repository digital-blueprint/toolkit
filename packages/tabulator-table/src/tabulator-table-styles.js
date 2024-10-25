import {css} from 'lit';

export function getTabulatorStyles() {
    // language=css
    return css`


        .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
            font-weight: normal;
            font-size: 1rem;
        }

        .tabulator .tabulator-header,
        .tabulator .tabulator-header,
        .tabulator .tabulator-header .tabulator-col,
        .tabulator,
        .tabulator-row .tabulator-cell,
        .tabulator-row.tabulator-row-even,
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
            background-color: unset;
            background: unset;
            color: unset;
            border: none;
            font-size: 1rem;
        }

        .tabulator-headers + br {
            display: none;
        }

        .tabulator-row,
        .tabulator-row.tabulator-row-even {
            background-color: var(--dbp-background);
        }

        .tabulator-row.tabulator-selectable.tabulator-selectable:hover {
            background-color: var(--dbp-hover-background-color, var(--dbp-background));
            color: var(--dbp-hover-color, var(--dbp-content));
        }

        .tabulator-row.tabulator-selectable.tabulator-selected:hover,
        .tabulator-row.tabulator-selected {
            background-color: var(--dbp-override-muted, var(--dbp-content-surface));
            color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-selected .tabulator-responsive-collapse-toggle,
        .tabulator-row.tabulator-selected .tabulator-cell .tabulator-responsive-collapse-toggle {
            background-color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-row,
        .tabulator-row.tabulator-row-even {
            border-top: 1px solid var(--dbp-muted);
            color: var(--dbp-content);
        }

        .tabulator-row.tabulator-row-even.tabulator-selected {
            color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-header {
            padding-top: 10px;
            padding-bottom: 10px;
        }

        /* hide first fake column used by select all checkbox in the header */
        .tabulator-cell[tabulator-field="empty"] {
            display: none !important;
        }

        /* Toggle Button Styles */
        .tabulator-row .tabulator-responsive-collapse {
            border: none;
        }

        .tabulator-row .tabulator-cell.tabulator-row-handle {
            padding: 0px;
        }

        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
            height: 99%;
            width: 99%;
        }

        .tabulator-responsive-collapse-toggle svg {
            display: none !important;
        }

        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover {
            opacity: 1;
        }

        .tabulator-responsive-collapse-toggle,
        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
            -webkit-mask-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_2_1_' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 100 100' style='enable-background:new 0 0 100 100;' xml:space='preserve'%3E%3Cpath d='M2.4,29.6l44.4,44.2c0.9,0.9,2.1,1.3,3.3,1.3c1.2,0,2.4-0.5,3.3-1.3l44.2-44.2c1.1-1.1,1.1-2.8,0-3.9 c-0.5-0.5-1.2-0.8-1.9-0.8c-0.7,0-1.4,0.3-1.9,0.8L50.1,69.3L6.3,25.7c-1.1-1.1-2.8-1.1-3.9,0C1.3,26.8,1.3,28.5,2.4,29.6z'/%3E%3C/svg%3E");
            mask-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_2_1_' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 100 100' style='enable-background:new 0 0 100 100;' xml:space='preserve'%3E%3Cpath d='M2.4,29.6l44.4,44.2c0.9,0.9,2.1,1.3,3.3,1.3c1.2,0,2.4-0.5,3.3-1.3l44.2-44.2c1.1-1.1,1.1-2.8,0-3.9 c-0.5-0.5-1.2-0.8-1.9-0.8c-0.7,0-1.4,0.3-1.9,0.8L50.1,69.3L6.3,25.7c-1.1-1.1-2.8-1.1-3.9,0C1.3,26.8,1.3,28.5,2.4,29.6z'/%3E%3C/svg%3E");
            content: '';
            background-color: var(--dbp-content);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            mask-position: center center;
            margin: 0;
            padding: 0;
            -webkit-mask-size: 24px;
            mask-size: 24px;
            transform: rotate(0);
        }

        .tabulator-responsive-collapse-toggle.open,
        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open {
            transform: rotate(-180deg);
        }

        /* Define the style when the column is not sorted */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
            border-top: none;
            border-bottom: 6px solid var(--dbp-muted);
        }

        /* Define the style when the column is sorted in ascending order */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
            border-top: none;
            border-bottom: 6px solid var(--dbp-accent);
        }

        /* Define the style when the column is sorted in descending order */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
            border-bottom: none;
            border-top: 6px solid var(--dbp-accent);
            color: var(--dbp-accent);
        }

        .tabulator-cell.tabulator-row-header.tabulator-row-handle {
            background-color: var(--dbp-background-color);
            border-style: none;
        }

        .tabulator-row, .tabulator-row.tabulator-row-even,
        .tabulator-row.tabulator-row-odd {
            padding-top: 0px;
            padding-bottom: 0px;
        }

        .tabulator-row .tabulator-cell {
            padding-top: 12px;
            padding-bottom: 12px;
            /* padding-top: 20px;
            padding-bottom: 20px; */ /* from the other getTabulatorStyles() */
        }

        .tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents {
            color: var(--dbp-muted);
            font-size: 1rem;
            font-weight: initial;
            text-align: center;
        }

        .tabulator-placeholder {
            border-top: 1px solid var(--dbp-muted);
            padding-top: 10px;
        }

        .tabulator-row.no-select.tabulator-selected {
            background-color: var(--dbp-background);
            color: var(--dbp-muted);
        }

        .no-select,
        .tabulator-row.tabulator-selected.no-select:hover,
        .tabulator-row.no-select:hover,
        .tabulator-row.tabulator-selectable.no-select:hover {
            cursor: unset;
        }

        .no-select-styles,
        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles,
        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles:hover,
        .no-select,
        .tabulator-row.tabulator-selected.no-select:hover,
        .tabulator-row.no-select:hover,
        .tabulator-row.tabulator-selectable.no-select:hover,
        .tabulator-row.tabulator-selected.no-select-styles:hover,
        .tabulator-row.no-select-styles:hover,
        .tabulator-row.tabulator-selectable.no-select-styles:hover {
            color: var(--dbp-content);
            background-color: var(--dbp-background);
        }

        .tabulator .tabulator-tableholder {
            overflow: inherit;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover {
            background-color: unset;
        }



        /*************************************
         * from the other getTabulatorStyles()
         *************************************/
        .tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right,
        .tabulator-row .tabulator-frozen.tabulator-frozen-right {
            background-color:  var(--dbp-background);
            color: var(--dbp-content);
        }

        .tabulator .tabulator-footer .tabulator-paginator {
            text-align: center;
        }

        .tabulator[tabulator-layout=fitDataFill] .tabulator-tableHolder .tabulator-table {
            min-width: calc(100% - 41px);
        }

        @media only screen and (orientation: portrait) and (max-width: 768px) {

        }

    `;
}
