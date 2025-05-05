import {css, CSSResult} from 'lit';

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
export function getGrantPermissionDialogCSS() {
    // language=css
    return css`
        .modal--permissions {
            --dbp-modal-header-height: 80px;
            --dbp-modal-footer-height: 3em;
            --dbp-modal-min-width: 320px;
            --dbp-modal-max-width: min(90vw, 1300px);
            --dbp-modal-min-height: 300px;
            --dbp-modal-max-height: 90vh;
            --dbp-modal-width: auto;
        }

        dbp-modal .header {
            display: flex;
            margin-bottom: 1em;
        }

        dbp-modal .header h3 {
            font-size: 2em;
            font-weight: bold;
            margin: 0 1em 0 0;
            overflow-wrap: anywhere;
        }

        dbp-modal .footer-menu {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: flex-end;
            gap: 1em;
            padding-top: 1em;
        }

        .content-inner {
            display: flex;
            flex-direction: column;
            gap: 1em;
            margin-top: 1em;
            max-width: 1300px;
            /*min-width: calc((var(--dbp-action-count) * 40px) + (.5em * (var(--dbp-action-count) - 1))  + 250px + 100px);*/
            /*--dbp-container-size: calc((var(--dbp-action-count) * 40px) + (.5em * (var(--dbp-action-count) - 1))  + 250px + 100px);*/
            position: relative;
        }

        .header-row {
            position: sticky;
            top: 0;
            background: var(--dbp-background);
            z-index: 99;
        }

        .header-row,
        .user-row {
            display: grid;
            grid-template-columns: 250px auto 200px;
            gap: 0;
            padding: 0 1em;
        }

        .user-row:nth-child(2n + 1) {
            background-color: rgba(125, 125, 125, 0.1);
        }

        .person-select-header {
            flex-basis: 250px;
        }

        .buttons-header {
            display: flex;
            justify-content: flex-end;
            flex-basis: 200px;
            align-items: flex-end;
            grid-column: 3/4;
        }

        /*
         * For better tab order
         * Add person button is second in tab order
         * No need to go trough all edit/delete buttons
         */
        .body-container {
            display: flex;
            flex-direction: column-reverse;
            gap: 2em;
        }

        .user-row-container {
            display: flex;
            flex-direction: column;
            gap: 0;
            transition: 0.5s margin ease;
        }

        .person-select-container {
            display: flex;
            align-items: center;
            height: 100%;
            flex-basis: 250px;
        }

        /* for the person-select dropdown */
        .user-row-container:has(dbp-person-select) {
            margin-bottom: 180px;
        }

        dbp-person-select {
            width: 320px;
            height: 30px;
        }

        .permissions-header,
        .permission-group {
            display: flex;
            align-items: center;
            gap: 1em;
            flex-wrap: nowrap;
            /*flex-wrap: wrap;*/
            padding: 1em 0;
            /*min-width: calc( ((var(--dbp-action-count) / 2) * 80px) + (1em * ((var(--dbp-action-count) / 2) - 1))); /* 4*80px + (column-count-1) *1em */
            /*width: calc( ((var(--dbp-action-count) / 2) * 80px) + (1em * ((var(--dbp-action-count) / 2) - 1))); /* 4*80px + (column-count-1) *1em */
        }

        .header-row .permission-group {
            padding-bottom: 0;
        }

        .action-buttons {
            display: flex;
            gap: 1em;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
            flex-basis: 200px;
        }

        .checkbox-label-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            font-size: 14px;
            width: 80px;
        }

        .checkbox-label-container label {
            line-height: 1;
            height: 40px;
            display: flex;
            align-items: flex-end;
        }

        .checkbox-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            font-size: 14px;
            width: 80px;
        }

        input[type='checkbox'] {
            width: 1.5em;
            height: 1.5em;
            cursor: pointer;
        }

        input[type='checkbox']:disabled {
            cursor: not-allowed;
        }

        .changed {
            box-shadow: 0 0 3px 3px var(--dbp-accent);
            background: var(--dbp-accent);
        }

        /* animations */
        .user-row {
            opacity: 1;
            transition: opacity 500ms ease;
        }

        .delete-animation {
            opacity: 0;
        }

        /* responsiveness */

        .collapsed {
            .content-inner {
                background-color: rgba(255, 0, 0, 0.2);
            }

            .permission-group {
                flex-wrap: wrap;
            }

            .header-row .permissions-header {
                display: none;
            }

            .checkbox-container label {
                position: initial !important;
                clip: initial !important;
                overflow: initial !important;
                height: 40px !important;
                width: initial !important;
                word-wrap: initial !important;
                display: flex;
                align-items: flex-end;
            }
        }

        .mobile {
            .user-row {
                grid-template-columns: 1fr;
                padding: 1em;
            }
        }

        /* util classes */
        .visually-hidden {
            position: absolute !important;
            clip: rect(1px, 1px, 1px, 1px);
            overflow: hidden;
            height: 1px;
            width: 1px;
            word-wrap: normal;
        }

        .hidden {
            display: none !important;
        }
    `;
}
