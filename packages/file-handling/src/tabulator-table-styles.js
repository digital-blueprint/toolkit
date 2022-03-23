import {css} from 'lit';

export function getTabulatorStyles() {
    // language=css
    return css`
        /* Define the style when the column is not sorted */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{
            border-top: none;
            border-bottom: 6px solid var(--dbp-muted);
        }

        /* Define the style when the column is sorted in ascending order */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{
            border-top: none;
            border-bottom: 6px solid var(--dbp-accent);
        }

        /* Define the style when the column is sorted in descending order */
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{
            border-bottom: none;
            border-top: 6px solid var(--dbp-accent);
            color: var(--dbp-accent);
        }        
        
        .tabulator-row, .tabulator-row.tabulator-row-even, .tabulator-row.tabulator-row-odd{
            padding-top: 0px;
            padding-bottom: 0px;
        }

        .tabulator-row .tabulator-cell{
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents {
            color: var(--dbp-muted);
            font-size: 1rem;
            font-weight: initial;
        }

        .tabulator-placeholder {
            border-top: 1px solid var(--dbp-muted);
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
        .no-select,
        .tabulator-row.tabulator-selected.no-select:hover,
        .tabulator-row.no-select:hover,
        .tabulator-row.tabulator-selectable.no-select:hover,
        .tabulator-row.tabulator-selected.no-select-styles:hover,
        .tabulator-row.no-select-styles:hover,
        .tabulator-row.tabulator-selectable.no-select-styles:hover{
            color: var(--dbp-content);
            background-color: var(--dbp-background);
        }

        .tabulator .tabulator-tableholder{
            overflow: inherit;
        }
        
        @media only screen and (orientation: portrait) and (max-width: 768px) {
            
        }
       
    `;
}
