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
            background-color: var(--dbp-hover-background-color, var(--dbp-content-surface));
            color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-selected .tabulator-responsive-collapse-toggle, .tabulator-row.tabulator-selected .tabulator-cell .tabulator-responsive-collapse-toggle{
            background-color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-row,
        .tabulator-row.tabulator-row-even {
            border-top: 1px solid #eee;
            color: var(--dbp-content);
        }

        .tabulator-row.tabulator-row-even.tabulator-selected {
            color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-header {
            padding-top: 10px;
            padding-bottom: 10px;
        }

        /* Toggle Button Styles */
        .tabulator-row .tabulator-responsive-collapse {
            border: none;
        }

        .tabulator-row .tabulator-cell.tabulator-row-handle{
            padding: 0px;
        }

        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
            height: 50%;
            width: 50%;
        }

        .tabulator-responsive-collapse-toggle-open,
        .tabulator-responsive-collapse-toggle-close {
            content: none;
            visibility: hidden;
            display: none;
        }

        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{
            opacity: 1;
        }

        .tabulator-responsive-collapse-toggle, .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{
            -webkit-mask-image: url("data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3c!-- Generator: Adobe Illustrator 26.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e %3csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 24.6 62.4' style='enable-background:new 0 0 24.6 62.4%3b' xml:space='preserve'%3e%3cg transform='translate(-382.21 -336.98)'%3e%3cg%3e%3cpath d='M388%2c380.5c-0.2%2c0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2c0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1 c0.3-0.3%2c0.8-0.4%2c1.1-0.1l13.1%2c11.5c0.2%2c0.2%2c0.3%2c0.4%2c0.3%2c0.6s-0.1%2c0.5-0.3%2c0.6l-13.1%2c11.5C388.4%2c380.4%2c388.2%2c380.5%2c388%2c380.5z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
            mask-image: url("data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3c!-- Generator: Adobe Illustrator 26.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e %3csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 24.6 62.4' style='enable-background:new 0 0 24.6 62.4%3b' xml:space='preserve'%3e%3cg transform='translate(-382.21 -336.98)'%3e%3cg%3e%3cpath d='M388%2c380.5c-0.2%2c0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2c0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1 c0.3-0.3%2c0.8-0.4%2c1.1-0.1l13.1%2c11.5c0.2%2c0.2%2c0.3%2c0.4%2c0.3%2c0.6s-0.1%2c0.5-0.3%2c0.6l-13.1%2c11.5C388.4%2c380.4%2c388.2%2c380.5%2c388%2c380.5z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");            content: '';
            background-color: var(--dbp-content);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            mask-position: center center;
            margin: 0 0 0 -30px;
            padding: 0 0 0.25% 0;
            -webkit-mask-size: 40%;
            mask-size: 40%;
        }

        .tabulator-responsive-collapse-toggle.open, .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open{
            -webkit-mask-image: url("data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3c!-- Generator: Adobe Illustrator 26.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e %3csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 24.6 62.4' style='enable-background:new 0 0 24.6 62.4%3b' xml:space='preserve'%3e%3cg transform='translate(-382.21 -336.98)'%3e%3cg%3e%3cpath d='M382.2%2c361.7c0-0.2%2c0.1-0.4%2c0.3-0.6c0.3-0.3%2c0.8-0.3%2c1.1%2c0.1l10.9%2c12.5l10.9-12.5c0.3-0.3%2c0.8-0.4%2c1.1-0.1 c0.3%2c0.3%2c0.4%2c0.8%2c0.1%2c1.1l-11.5%2c13.1c-0.2%2c0.2-0.4%2c0.3-0.6%2c0.3s-0.5-0.1-0.6-0.3l-11.5-13.1C382.3%2c362.1%2c382.2%2c361.9%2c382.2%2c361.7z '/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
            mask-image: url("data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3c!-- Generator: Adobe Illustrator 26.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e %3csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 24.6 62.4' style='enable-background:new 0 0 24.6 62.4%3b' xml:space='preserve'%3e%3cg transform='translate(-382.21 -336.98)'%3e%3cg%3e%3cpath d='M382.2%2c361.7c0-0.2%2c0.1-0.4%2c0.3-0.6c0.3-0.3%2c0.8-0.3%2c1.1%2c0.1l10.9%2c12.5l10.9-12.5c0.3-0.3%2c0.8-0.4%2c1.1-0.1 c0.3%2c0.3%2c0.4%2c0.8%2c0.1%2c1.1l-11.5%2c13.1c-0.2%2c0.2-0.4%2c0.3-0.6%2c0.3s-0.5-0.1-0.6-0.3l-11.5-13.1C382.3%2c362.1%2c382.2%2c361.9%2c382.2%2c361.7z '/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
        }

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

        .tabulator-cell.tabulator-row-header.tabulator-row-handle{
            background-color: var(--dbp-background-color);
            border-style: none;
        }

        .tabulator-row, .tabulator-row.tabulator-row-even, .tabulator-row.tabulator-row-odd{
            padding-top: 0px;
            padding-bottom: 0px;
        }

        .tabulator-row .tabulator-cell{
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
        .tabulator-row.tabulator-selectable.no-select-styles:hover{
            color: var(--dbp-content);
            background-color: var(--dbp-background);
        }

        .tabulator .tabulator-tableholder{
            overflow: inherit;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{
            background-color: unset;
        }



        /*************************************
         * from the other getTabulatorStyles()
         *************************************/
        .tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right, .tabulator-row .tabulator-frozen.tabulator-frozen-right{
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
