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
        }

        .header h3 {
            margin: 0;
        }

        .content-placeholder {
            padding: 1em 0;
        }

        .footer-menu {
            display: flex;
            justify-content: flex-end;
            margin-top: 2em;
        }
    `;
}
