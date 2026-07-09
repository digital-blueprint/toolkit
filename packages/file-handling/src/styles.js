import {css} from 'lit';

export function getFileHandlingCss() {
    // language=css
    return css`
        /**************************\\
          Modal Styles
        \\**************************/

        .file-handling-modal {
            --dbp-modal-height: 70vh;
            --dbp-modal-width: 70%;
            --dbp-modal-min-width: 60%;
            --dbp-modal-max-width: 600px;
            --dbp-modal-min-height: 50%;
            --dbp-modal-max-height: 90vh;
            --dbp-modal-container-height: 100%;
            --dbp-modal-content-min-height: 0;
            --dbp-modal-content-slot-height: 100%;
            --dbp-modal-content-slot-min-height: 0;
            --dbp-modal-slotted-content-height: 100%;
            --dbp-modal-slotted-content-min-height: 0;
            --dbp-modal-content-overflow-y: hidden;
            --dbp-modal-full-height-line-left: 150px;
            --dbp-modal-full-height-line-border: var(--dbp-border);
            --dbp-modal-title-padding: 0.25em 0 0
                calc(var(--dbp-modal-full-height-line-left) + 20px);
        }

        .file-handling-modal.modal-container-full-size {
            --dbp-modal-height: 100%;
            --dbp-modal-width: 100%;
            --dbp-modal-min-width: 100%;
            --dbp-modal-min-height: 100%;
            --dbp-modal-max-height: 100%;
        }

        .nextcloud-modal {
            --dbp-modal-content-overflow-y: hidden;
        }

        .file-handling-modal-content {
            grid-template-columns: 150px 1fr;
            grid-template-rows: 1fr;
            gap: 1px 1px;
            grid-template-areas: 'sidebar main';
            position: relative;
            display: grid;
            height: 100%;
            width: 100%;
            min-height: 0;
            box-sizing: border-box;
        }

        .modal-nav {
            cursor: pointer;
            overflow: hidden;
            background-color: var(--dbp-background);
            border-right: none;
            grid-area: sidebar;
        }

        .modal-nav > button,
        .modal-nav > div {
            padding: 5px;
            text-align: center;
            width: 100%;
            background-color: var(--dbp-background);
            color: var(--dbp-content);
            border: 0;
        }

        .modal-nav > button:focus-visible {
            box-shadow: inset 0px 0px 3px 1px var(--dbp-primary);
        }

        .modal-nav .nav-icon {
            width: 35px;
            height: 35px;
        }

        .modal-nav .active p {
            font-weight: bold;
        }

        .modal-nav .active .nav-icon {
            color: var(--dbp-accent);
        }

        .modal-content {
            padding: 10px 20px 20px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            min-height: 0;
            box-sizing: border-box;
        }

        .modal-content .source-main {
            /*flex-grow: 1;*/
            /*justify-content: center;*/
            /*align-items: center;*/
            height: 100%;
            width: 100%;
            display: flex;
            align-items: flex-end;
            min-height: 0;
            box-sizing: border-box;
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

        /**************************\\
         Picker Styles
       \\**************************/

        #nextcloud-file-picker,
        #clipboard-file-picker {
            width: 100%;
            height: 100%;
            margin: var(--FUMargin, 0px);
            padding: var(--FUPadding, 20px);
            box-sizing: border-box;
        }

        #fileElem {
            position: absolute !important;
            clip: rect(1px, 1px, 1px, 1px);
            overflow: hidden;
            height: 1px;
            width: 1px;
            word-wrap: normal;
        }

        #fileElem:focus + button {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 5px 1px var(--dbp-primary);
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

        .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
            display: inline-flex;
            padding: 0px;
        }

        .checkmark {
            height: 20px;
            width: 20px;
            left: 10px;
            top: 8px;
        }

        .button-container .checkmark::after {
            left: 7px;
            top: 2px;
            width: 5px;
            height: 11px;
        }

        /*.tabulator .tabulator-tableHolder {*/
        /*    overflow: hidden;*/
        /*}*/

        .force-no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        /*.tabulator .tabulator-tableHolder {*/
        /*    !* height: unset !important; !*TODO find a better way to do this*!*/
        /*}*/

        /* .tabulator-row-handle {
            padding: 0px !important;
        }*/

        /*.tabulator .tabulator-header .tabulator-col {*/
        /*    min-height: 37px !important;*/
        /*}*/

        .filename {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            white-space: nowrap;
        }

        .select-all-icon {
            height: 40px;
            position: absolute;
            top: -1.1em;
        }

        .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
            padding-top: 4px;
            padding-bottom: 4px;
            font-weight: normal;
            font-size: 1rem;
        }

        @media only screen and (max-width: 768px) {
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

        @media only screen and (max-width: 768px) {
            .file-handling-modal {
                --dbp-modal-full-height-line-display: none;
                --dbp-modal-title-padding: 0.25em 0 0 0;
                --dbp-modal-width: calc(100% - 40px);
                --dbp-modal-min-width: calc(100% - 40px);
                --dbp-modal-max-width: calc(100% - 40px);
                --dbp-modal-height: 100%;
                --dbp-modal-min-height: 100%;
                --dbp-modal-max-height: 100%;
                --dbp-modal-full-height-line-left: 0;
            }

            .file-handling-modal-content {
                grid-template-columns: 1fr;
                grid-template-rows: minmax(0, 1fr) auto;
                grid-template-areas: 'main' 'nav';
                gap: 0;
            }

            .nav-wrapper.modal-nav {
                display: flex;
                grid-area: nav;
                width: 100%;
                height: auto;
                border: none;
                border-top: var(--dbp-border);
                white-space: nowrap;
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                -ms-overflow-style: -ms-autohiding-scrollbar;
            }

            .nav-wrapper.modal-nav::-webkit-scrollbar {
                display: none;
            }

            .nav-wrapper.modal-nav > nav.modal-nav {
                display: flex;
                width: 100%;
                height: auto;
            }

            .modal-nav > button,
            .modal-nav > div {
                flex: 1 0 auto;
            }

            .modal-nav .nav-icon {
                height: 20px;
            }

            .modal-content {
                grid-area: main;
                padding: 0;
                width: 100%;
                min-width: 0;
                overflow: auto;
            }

            .modal-content .source-main {
                width: 100%;
            }

            .modal-header {
                grid-area: header;
                padding: 5px;
            }

            #nextcloud-file-picker,
            #clipboard-file-picker {
                padding: 0px;
            }
        }

        /**************************\\
         Mobile Portrait Styles
        \\**************************/

        @media only screen and (max-width: 768px) {
        }
    `;
}
