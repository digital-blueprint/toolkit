import {css} from 'lit';

export function getFileHandlingCss() {
    // language=css
    return css`
        /**************************\\
          Modal Styles
        \\**************************/

        .modal-container {
            grid-template-columns: 150px 1fr;
            grid-template-rows: auto 1fr;
            gap: 1px 1px;
            grid-template-areas: 'sidebar header' 'sidebar main';
            position: relative;
        }

        .modal-nav {
            cursor: pointer;
            overflow: hidden;
            background-color: var(--dbp-background);
            border-right: var(--dbp-border);
            grid-area: sidebar;
        }

        .modal-nav > div {
            padding: 5px;
            text-align: center;
        }

        .modal-nav .nav-icon {
            width: 35px;
            height: 35px;
        }

        .modal-nav .active {
            background-color: var(--dbp-content-surface);
            color: var(--dbp-on-content-surface);
        }

        .modal-content {
            padding: 10px 20px 20px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        .modal-content .source-main {
            /*flex-grow: 1;*/
            /*justify-content: center;*/
            /*align-items: center;*/
            height: 100%;
            width: 100%;
            display: flex;
            align-items: flex-end;
        }

        .modal-content .source-main.hidden {
            display: none;
        }

        .modal-header {
            grid-area: header;
            display: flex;
            padding: 10px 20px 0px 20px;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
        }

        .clipboard-container {
            height: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100%;
            overflow-x: auto;
        }

        .micromodal-slide .modal-container,
        .micromodal-slide .modal-overlay {
            will-change: auto;
        }

        /**************************\\
         Picker Styles
       \\**************************/

        #nextcloud-file-picker,
        #clipboard-file-picker {
            width: 100%;
            height: 100%;
            margin: var(--FUMargin, 0px);
            padding: var(--FUPadding, 20px);
        }

        #fileElem {
            display: none;
        }

        #nextcloud-file-picker.hidden {
            display: none;
        }

        #modal-picker-content {
            grid-area: main;
        }

        /**********************************\\
            Tabulator table styles
         \\*********************************/

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
            padding-top: 4px;
            padding-bottom: 4px;
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

        .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
            display: inline-flex;
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

        .tabulator .tabulator-tableHolder {
            overflow: hidden;
        }

        .tabulator .tabulator-tableHolder .tabulator-placeholder span {
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
        }

        .force-no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .tabulator .tabulator-tableHolder {
            /* height: unset !important; /*TODO find a better way to do this*/
        }

        .tabulator-row .tabulator-responsive-collapse {
            border: none;
        }

        .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
            height: 100%;
            width: 100%;
            background-color: unset;
        }

        .tabulator-responsive-collapse-toggle-open,
        .tabulator-responsive-collapse-toggle-close {
            content: none;
            visibility: hidden;
        }
        

        .tabulator-responsive-collapse-toggle-open::after,
        .tabulator-responsive-collapse-toggle-close::after {
            content: '\\00a0\\00a0\\00a0\\00a0\\00a0';
            background-color: var(--dbp-content);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center -2px;
            mask-position: center center;
            margin: 0 0 0 4px;
            padding: 0 0 0.25% 0;
            -webkit-mask-size: 100%;
            mask-size: 100%;
            visibility: visible;
        }
        
        .tabulator-responsive-collapse-toggle-open::after {
            -webkit-mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0yOS42LDk3LjZsNDQuMi00NC40YzAuOS0wLjksMS4zLTIuMSwxLjMtMy4zYzAtMS4yLTAuNS0yLjQtMS4zLTMuM0wyOS42LDIuNGMtMS4xLTEuMS0yLjgtMS4xLTMuOSwwCgljLTAuNSwwLjUtMC44LDEuMi0wLjgsMS45YzAsMC43LDAuMywxLjQsMC44LDEuOWw0My42LDQzLjZMMjUuNyw5My43Yy0xLjEsMS4xLTEuMSwyLjgsMCwzLjlDMjYuOCw5OC43LDI4LjUsOTguNywyOS42LDk3LjZ6Ii8+Cjwvc3ZnPgo=');
            mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0yOS42LDk3LjZsNDQuMi00NC40YzAuOS0wLjksMS4zLTIuMSwxLjMtMy4zYzAtMS4yLTAuNS0yLjQtMS4zLTMuM0wyOS42LDIuNGMtMS4xLTEuMS0yLjgtMS4xLTMuOSwwCgljLTAuNSwwLjUtMC44LDEuMi0wLjgsMS45YzAsMC43LDAuMywxLjQsMC44LDEuOWw0My42LDQzLjZMMjUuNyw5My43Yy0xLjEsMS4xLTEuMSwyLjgsMCwzLjlDMjYuOCw5OC43LDI4LjUsOTguNywyOS42LDk3LjZ6Ii8+Cjwvc3ZnPgo=');
        }

        .tabulator-responsive-collapse-toggle-close::after {
            -webkit-mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0yLjQsMjkuNmw0NC40LDQ0LjJjMC45LDAuOSwyLjEsMS4zLDMuMywxLjNjMS4yLDAsMi40LTAuNSwzLjMtMS4zbDQ0LjItNDQuMmMxLjEtMS4xLDEuMS0yLjgsMC0zLjkKCWMtMC41LTAuNS0xLjItMC44LTEuOS0wLjhjLTAuNywwLTEuNCwwLjMtMS45LDAuOEw1MC4xLDY5LjNMNi4zLDI1LjdjLTEuMS0xLjEtMi44LTEuMS0zLjksMEMxLjMsMjYuOCwxLjMsMjguNSwyLjQsMjkuNnoiLz4KPC9zdmc+Cg==');
            mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0yLjQsMjkuNmw0NC40LDQ0LjJjMC45LDAuOSwyLjEsMS4zLDMuMywxLjNjMS4yLDAsMi40LTAuNSwzLjMtMS4zbDQ0LjItNDQuMmMxLjEtMS4xLDEuMS0yLjgsMC0zLjkKCWMtMC41LTAuNS0xLjItMC44LTEuOS0wLjhjLTAuNywwLTEuNCwwLjMtMS45LDAuOEw1MC4xLDY5LjNMNi4zLDI1LjdjLTEuMS0xLjEtMi44LTEuMS0zLjksMEMxLjMsMjYuOCwxLjMsMjguNSwyLjQsMjkuNnoiLz4KPC9zdmc+Cg==');
            margin-left: 6px;
        }

        .tabulator-responsive-collapse-toggle-open:hover::after,
        .tabulator-responsive-collapse-toggle-close:hover::after {
            background-color: var(--dbp-hover-color, var(--dbp-content));
        }

        .tabulator-selected .tabulator-responsive-collapse-toggle-open::after,
        .tabulator-selected .tabulator-responsive-collapse-toggle-close::after {
            background-color: var(--dbp-hover-color, var(--dbp-on-content-surface));
        }

        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles .tabulator-responsive-collapse-toggle-close::after,
        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles:hover .tabulator-responsive-collapse-toggle-close::after,
        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles .tabulator-responsive-collapse-toggle-open::after,
        .tabulator-row.tabulator-selectable.tabulator-selected.no-select-styles:hover .tabulator-responsive-collapse-toggle-open::after{
            background-color: var(--dbp-content);
        }

        .tabulator-row-handle {
            padding: 0px !important;
        }

        .tabulator .tabulator-header .tabulator-col {
            min-height: 37px !important;
        }

        @media only screen and (orientation: portrait) and (max-width: 768px) {
            .tabulator .tabulator-tableHolder {
                white-space: inherit;
            }

            .modal-container {
                width: 100%;
                height: 100%;
                max-width: 100%;
            }
        }

        /**************************\\
         Tablett Portrait Styles
       \\**************************/

        @media only screen and (orientation: portrait) and (max-width: 768px) {
            .modal-nav {
                display: flex;
                /*justify-content: space-around;*/
                grid-area: nav;
                border: none;
                border-bottom: var(--dbp-border);
                border-top: var(--dbp-border);
                white-space: nowrap;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                -ms-overflow-style: -ms-autohiding-scrollbar;
            }

            .modal-nav::-webkit-scrollbar {
                display: none;
            }

            .modal-content {
                grid-area: main;
            }

            .modal-container {
                grid-template-rows: 40px 55px auto;
                grid-template-areas: 'header' 'nav' 'main';
                grid-template-columns: auto;
            }

            .modal-header {
                grid-area: header;
                padding: 5px;
            }

            .modal-nav > div {
                flex-grow: 1;
            }

            .modal-nav .nav-icon {
                height: 20px;
            }

            #nextcloud-file-picker,
            #clipboard-file-picker {
                padding: 0px;
            }
        }

        /**************************\\
         Mobile Portrait Styles
        \\**************************/

        @media only screen and (orientation: portrait) and (max-width: 768px) {
        }
    `;
}
