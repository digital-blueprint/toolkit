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
            --dbp-modal-min-width: 1300px;
            --dbp-modal-min-height: 300px;
            --dbp-modal-max-width: 100vw;
            --dbp-modal-max-height: 90vh;
        }

        dbp-modal .header {
            display: flex;
            margin-bottom: 1em;
        }

        dbp-modal .header h3 {
            font-size: 2em;
            font-weight: bold;
            margin: 0 1em 0 0;
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
            width: 100%;

            container: permissions-content / inline-size;
        }

        @container permissions-content (width < 75px) {
            .header-row
            .user-row {
                flex-direction: column;
            }
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
            grid-template-columns: 250px 1fr 200px;
            gap: 2em;
        }

        .buttons-header {
            display: flex;
            justify-content: flex-end;
        }

        /*
         * For better tab order
         * Add person button is second in taborder
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
            gap: 1em;
            transition: .5s margin ease;
        }

        .person-select-container {
            display: flex;
            align-items: center;
            height: 100%;
        }

        /* for the person-selct dropdown */
        .user-row-container:has(dbp-person-select) {
            margin-bottom: 180px;
        }

        dbp-person-select {
            width: 320px;
            height: 30px;
        }

        .permission-group {
            display: flex;
            align-items: center;
            gap: 1em;
        }

        .action-buttons {
            display: flex;
            gap: 1em;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
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

        input[type="checkbox"] {
            width: 1.5em;
            height: 1.5em;
            cursor: pointer;
        }

        input[type="checkbox"]:disabled {
            cursor: not-allowed
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

        /* util classes */
        .visually-hidden {
            position: absolute !important;
            clip: rect(1px, 1px, 1px, 1px);
            overflow: hidden;
            height: 1px;
            width: 1px;
            word-wrap: normal;
        }

        /* button:focus-visible {
            border: 3px solid black;
        }
        dbp-button:focus-visible {
            border: 3px solid blue;
        }*/
    `;
}
