import {css} from 'lit';

/**
 * @returns {import('lit').CSSResult}
 */
export function getAuthorizationManageGrantsDialogCSS() {
    return css`
        .modal--manage-grants {
            --dbp-modal-min-width: 320px;
            --dbp-modal-max-width: min(90vw, 900px);
            --dbp-modal-width: auto;
            --dbp-modal-min-height: 420px;
            --dbp-modal-height: auto;
            --dbp-modal-content-overflow-y: hidden;
        }

        .header h3 {
            margin: 0;
        }

        .add-resource-container {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-gap: 1em;
        }

        .resource-select-component {
            flex-grow: 1;
        }

        .add-person-button-container {
        }

        .footer-menu {
            display: flex;
            justify-content: flex-end;
            margin-top: 2em;
        }
    `;
}
