import {css} from 'lit';

/**
 * @returns {import('lit').CSSResult}
 */
export function getAuthorizationManageGrantsDialogCSS() {
    return css`
        .modal--manage-grants {
            --dbp-modal-min-width: 280px;
            --dbp-modal-max-width: min(75vw, 700px + var(--dbp-auth-grants-roles-sidebar-width));
            --dbp-modal-width: auto;

            --dbp-modal-min-height: 420px;
            --dbp-modal-max-height: 50vh;
            --dbp-modal-height: 420px;
            --dbp-modal-content-min-height: 0;
            --dbp-modal-content-slot-height: 100%;
            --dbp-modal-slotted-content-height: 100%;

            --dbp-modal-content-overflow-y: hidden;

            --dbp-auth-grants-roles-sidebar-width: 0px;
            /* Disable the decorative line enabled by full-height-line. */
            --dbp-modal-full-height-line-display: none;
        }

        .show-roles {
            --dbp-auth-grants-roles-sidebar-width: 270px;
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
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            align-items: flex-end;
        }

        .show-roles-button {
            appearance: none;
            border: 0 none;
            background: none;
            transition: transform 0.2s ease-in-out;
            font-weight: 300;
            --dbp-border: 0 none;
        }

        .show-roles [slot='content'] {
            display: grid;
            grid-template-columns: minmax(0, 1fr) var(--dbp-auth-grants-roles-sidebar-width);
            grid-gap: 1em;
        }

        .modal--manage-grants [slot='content'] {
            min-height: 0;
        }

        .roles-container {
            min-height: 0;
            overflow-y: auto;
        }

        .show-roles .roles-container {
            width: calc(var(--dbp-auth-grants-roles-sidebar-width) - 1em - 1px);
            height: 100%;
            padding-left: 1em;
            border-left: 1px solid var(--dbp-content);
        }

        .show-roles .show-roles-button dbp-icon {
            transform: rotate(180deg);
        }

        .roles-panel-title {
            margin-bottom: 1em;
        }

        .role-list {
            padding-left: 1em;
        }

        .footer-menu {
            display: flex;
            justify-content: flex-end;
            margin-top: 2em;
        }
    `;
}
