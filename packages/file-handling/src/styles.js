import {css} from 'lit-element';

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
            grid-template-areas: "sidebar header" "sidebar main";
            position: relative;
        }

        .modal-nav {
            cursor: pointer;
            overflow: hidden;
            background-color: white;
            border-right: 1px solid black;
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

        .modal-nav .active{
            background-color: var(--dbp-dark);;
            color: var(--dbp-light);;
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
            display:flex;
            align-items: flex-end;
        }

        .modal-content .source-main.hidden {
            display: none;
        }

        .modal-header{
            grid-area: header;
            display: flex;
            padding: 10px 20px 0px 20px;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
        }


        .clipboard-container{
            height: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100%;
            overflow-x: auto;
        }

        /**************************\\
         Picker Styles
       \\**************************/

        #nextcloud-file-picker, #clipboard-file-picker {
            width: 100%;
            height: 100%;
            margin: var(--FUMargin, 0px);
            padding: var(--FUPadding, 20px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #fileElem {
            display: none;
        }

        #nextcloud-file-picker.hidden {
            display: none;
        }

        #modal-picker-content{
            grid-area: main;
        }
        
        
        
        /**********************************\\
            Tabulator table styles
         \\*********************************/


        .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{
            padding-top: 4px;
            padding-bottom: 4px;
            font-weight: normal;
            font-size: 1rem;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow,
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow,
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
            padding-bottom: 6px;
        }

        .tabulator .tabulator-header, .tabulator .tabulator-header, .tabulator .tabulator-header .tabulator-col, .tabulator, .tabulator-row .tabulator-cell, .tabulator-row.tabulator-row-even,
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover{
            background-color: unset;
            background: unset;
            color: unset;
            border: none;
            font-size: 1rem;
        }

        .tabulator-row, .tabulator-row.tabulator-row-even{
            background-color: white;
        }

        .tabulator-row.tabulator-selectable.tabulator-selectable:hover{
            background-color: white;
            color: var(--dbp-dark);
        }

        .tabulator-row.tabulator-selectable.tabulator-selected:hover, .tabulator-row.tabulator-selected{
            background-color: var(--dbp-dark);
            color: var(--dbp-light);
        }

        .tabulator .tabulator-header .tabulator-col .tabulator-col-content{
            display: inline-flex;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
            top: 16px;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow{
            border-top: none;
            border-bottom: 4px solid #666;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow{
            border-top: none;
            border-bottom: 4px solid #bbb;
        }

        .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow{
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow,
        .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
            border-top: 4px solid #666;
            border-bottom: none;
        }

        .tabulator-row, .tabulator-row.tabulator-row-even{
            padding-top: 10px;
            padding-bottom: 10px;
            border-top: 1px solid #eee;
        }

        .tabulator-header{
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .tabulator .tabulator-tableHolder{
            overflow: hidden;
        }

        .tabulator .tabulator-tableHolder .tabulator-placeholder span{
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
        }

        .force-no-select{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        @media only screen
        and (orientation: portrait)
        and (max-device-width: 765px) {

            .tabulator .tabulator-tableHolder{
                white-space: inherit;
            }
        }









            /**************************\\
             Mobile Landscape Styles
           \\**************************/
        
        @media only screen
        and (orientation: landscape)
        and (max-device-width: 896px) {
            .modal-container {
                width: 100%;
                height: 100%;
                max-width: 100%;
            }
        }


        /**************************\\
         Tablett Portrait Styles
       \\**************************/
        
        @media only screen
        and (orientation: portrait)
        and (max-device-width: 800px) {

            .modal-nav{
                display: flex;
                justify-content: space-around;
                grid-area: nav;
                border: none;
                border-bottom: 1px solid black;
                border-top: 1px solid black;
            }

            .modal-content{
                grid-area: main;
            }

            .modal-container{
                grid-template-rows: 40px 55px auto;
                grid-template-areas: "header" "nav" "main";
                grid-template-columns: auto;
            }

            .modal-header{
                grid-area: header;
                padding: 5px;
            }

            .modal-nav > div{
                flex-grow: 1;
            }

            .modal-nav .nav-icon{
                height: 20px;
            }

            #nextcloud-file-picker, #clipboard-file-picker{
                padding: 0px;
            }
        }

        /**************************\\
         Mobile Portrait Styles
        \\**************************/
        
        @media only screen
        and (orientation: portrait)
        and (max-device-width: 765px) {
            

            




        }
    
    `;
}