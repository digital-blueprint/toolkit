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
            --dbp-modal-max-height: 90vh;
            --dbp-modal-height: 420px;

            --dbp-modal-content-min-height: 0;
            --dbp-modal-content-slot-height: 100%;
            --dbp-modal-slotted-content-height: 100%;

            --dbp-modal-content-overflow-y: hidden;

            --dbp-auth-grants-roles-sidebar-width: 0px;
            /* Disable the decorative line enabled by full-height-line. */
            --dbp-modal-full-height-line-display: none;

            --delete-row-width: 40px;
        }

        select:not(.select),
        .dropdown-menu {
            background-size: 1em;
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
            /* prevent top border not visible on small screens glitches */
            padding-top: 3px;
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

        .grants-list-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
        }

        dbp-icon[name='information-circle'] {
            font-size: 1.5em;
            position: static;
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
            gap: 1em;
            margin-top: 1em;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            height: 100%;
            container: main-content / inline-size;
        }

        .grants-list-container {
            overflow-y: auto;
            min-height: 0;
            margin-top: 1.5em;
        }

        .grant-holder-section {
            padding-block: 1.5em;
            border-top: 1px solid var(--dbp-content);
        }

        .grant-holder-section.highlighted {
            animation: highlight 1s ease-in;
        }

        @keyframes highlight {
            0% {
                background-color: transparent;
            }
            80% {
                background-color: var(--dbp-selected);
            }
            100% {
                background-color: transparent;
            }
        }

        @container main-content (width < 600px) {
            .add-resource-container {
                grid-template-columns: 1fr;
            }

            .grant-holder {
                flex-direction: column;
                align-items: flex-start;
            }

            .show-roles-button,
            .grant-shareable-column-label {
                display: none;
            }
        }

        .grant-holder-heading {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
            gap: 0.5em;
            font-size: 1em;
            margin: 0 0 1em;
            overflow-wrap: anywhere;
        }

        .grant-holder {
            display: flex;
            gap: 0.5em;
            align-items: baseline;
        }

        .holder-type-icon {
            width: 18px;
            height: 18px;
        }

        .grant-holder-name {
            font-weight: bold;
            display: inline-block;
            margin-left: 0.25em;
        }

        .grant-holder-email {
            font-weight: normal;
        }

        .grant-shareable-column-label {
            /* trash icon + flex gap + checkbox user agent margin */
            padding-right: calc(var(--delete-row-width) + 1em + 3px);
        }

        .grant-holder-roles {
            list-style: none;
            margin: 0 0 1em;
            padding: 0;
            display: grid;
            gap: 0.75em;
        }

        .role-grant-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto auto;
            align-items: center;
            gap: 1em;
        }

        .unsaved-role-row {
            background-color: var(--dbp-selected);
        }

        .role-grant-name-selector {
            overflow-wrap: anywhere;
            height: 40px;
            max-width: 250px;
            padding: 0 0.5em;
        }

        .role-grant-shareable {
            display: flex;
            align-items: center;
            gap: 0.5em;
            height: 40px;
            padding: 0 0 0 0.4em;
        }

        .role-grant-shareable input[type='checkbox'] {
            width: 1.25em;
            height: 1.25em;
        }

        .add-role-button-container {
            display: flex;
            gap: 1em;
            /*justify-content: space-between;*/
        }

        @media (max-width: 600px) {
            .role-grant-row {
                gap: 0.5em;
            }

            .role-grant-shareable span {
                display: none;
            }
        }
    `;
}
