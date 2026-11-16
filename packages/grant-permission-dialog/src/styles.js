import {css} from 'lit';

/**
 * We want to have "neutral" colors here
 *
 * @returns {import('lit').CSSResult}
 */
export function getGrantPermissionDialogCSS() {
    // language=css
    return css`
        .modal--permissions {
            --dbp-modal-header-height: initial;
            --dbp-modal-footer-height: 3em;
            --dbp-modal-min-width: 320px;
            --dbp-modal-max-width: min(92vw, 1200px);
            --dbp-modal-min-height: 300px;
            --dbp-modal-max-height: 90vh;
            --dbp-modal-width: auto;
        }

        dbp-modal .header {
            display: flex;
        }

        dbp-modal .footer-menu {
            margin: 0;
            padding: 1em 0 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 1em;
        }

        .footer-status {
            margin-right: auto;
            color: var(--dbp-muted);
            font-size: 0.9em;
        }

        .content-inner {
            --holder-column-width: minmax(220px, 1fr);
            --checkbox-column-width: 96px;
            --actions-column-width: 200px;
            display: flex;
            flex-direction: column;
            gap: 1.25em;
            position: relative;
        }

        /* Intro */

        .intro-text {
            margin: 0;
            color: var(--dbp-muted);
        }

        /* Add toolbar */

        .add-toolbar {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75em 1em;
        }

        .add-toolbar-label {
            font-weight: bold;
        }

        .add-toolbar-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;
        }

        .add-holder-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5em;
            padding: 0.45em 1em;
            border: var(--dbp-border);
            border-color: var(--dbp-muted);
            border-radius: 999px;
            background: var(--dbp-background);
            color: var(--dbp-content);
            font: inherit;
            cursor: pointer;
            transition:
                background-color 150ms ease,
                border-color 150ms ease,
                color 150ms ease;
        }

        .add-holder-button dbp-icon {
            font-size: 1.1em;
        }

        .add-holder-button:hover:not(:disabled),
        .add-holder-button.is-active {
            border-color: var(--dbp-accent);
            color: var(--dbp-accent);
        }

        .add-holder-button.is-active {
            background: color-mix(in srgb, var(--dbp-accent) 10%, var(--dbp-background));
        }

        .add-holder-button:focus-visible {
            outline: 2px solid var(--dbp-accent);
            outline-offset: 2px;
        }

        .add-holder-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Pending holder card */

        .pending-holder {
            /* Keep the select dropdown above the sticky header row */
            position: relative;
            z-index: 3;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: start;
            gap: 1em;
            padding: 1em 1.25em;
            border: 1px dashed var(--dbp-accent);
            border-radius: var(--dbp-border-radius);
            background: color-mix(in srgb, var(--dbp-accent) 5%, var(--dbp-background));
            animation: slide-in 200ms ease;
        }

        .pending-holder-body {
            display: flex;
            flex-direction: column;
            gap: 0.35em;
            min-width: 0;
        }

        .pending-holder-title {
            font-weight: bold;
        }

        .pending-holder-description {
            margin: 0;
            color: var(--dbp-muted);
            font-size: 0.9em;
            max-width: 60ch;
        }

        .pending-holder-select {
            margin-top: 0.5em;
        }

        dbp-resource-select {
            display: block;
            width: min(100%, 420px);
        }

        /* Holder table */

        .header-row,
        .holder-row {
            display: grid;
            grid-template-columns:
                var(--holder-column-width)
                calc(var(--dbp-action-count) * var(--checkbox-column-width))
                var(--actions-column-width);
            align-items: center;
            padding: 0 1em;
        }

        .header-row {
            padding-left: calc(1em + 4px);
            position: sticky;
            top: 0;
            z-index: 2;
            padding-block: 0.5em;
            background: var(--dbp-background);
            border-bottom: 2px solid color-mix(in srgb, var(--dbp-content) 15%, transparent);
            color: var(--dbp-muted);
            font-size: 0.85em;
            font-weight: bold;
        }

        .permissions-header,
        .permission-group {
            display: flex;
            align-items: center;
        }

        .permission-label {
            width: var(--checkbox-column-width);
            padding: 0 0.25em;
            box-sizing: border-box;
            text-align: center;
            line-height: 1.2;
            hyphens: auto;
            overflow-wrap: break-word;
        }

        .holder-sections {
            display: flex;
            flex-direction: column;
            gap: 1.5em;
        }

        .holder-section-title {
            display: flex;
            align-items: center;
            gap: 0.5em;
            margin: 0 0 0.5em;
            padding: 0 1em;
            font-size: 0.8em;
            font-weight: bold;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--dbp-muted);
        }

        .holder-section-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 1.6em;
            height: 1.6em;
            padding: 0 0.4em;
            box-sizing: border-box;
            border-radius: 999px;
            background: color-mix(in srgb, var(--dbp-content) 8%, transparent);
            letter-spacing: 0;
        }

        .holder-rows {
            display: flex;
            flex-direction: column;
            border: 1px solid color-mix(in srgb, var(--dbp-content) 12%, transparent);
            border-radius: var(--dbp-border-radius);
        }

        .holder-row {
            min-height: 3.75em;
            padding-block: 0.5em;
            border-left: 3px solid transparent;
            opacity: 1;
            transition:
                background-color 150ms ease,
                border-color 150ms ease,
                opacity 300ms ease;
        }

        .holder-row + .holder-row {
            border-top: 1px solid color-mix(in srgb, var(--dbp-content) 8%, transparent);
        }

        .holder-row:hover {
            background-color: color-mix(in srgb, var(--dbp-content) 3%, transparent);
        }

        .holder-row.edit-mode {
            border-left-color: var(--dbp-accent);
            background-color: color-mix(in srgb, var(--dbp-accent) 6%, transparent);
        }

        .holder-row.delete-animation {
            opacity: 0;
        }

        .holder-info {
            display: flex;
            align-items: center;
            gap: 0.75em;
            min-width: 0;
        }

        .holder-avatar {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 2.25em;
            height: 2.25em;
            border-radius: 50%;
            font-size: 1em;
        }

        .holder-avatar--user {
            background: color-mix(in srgb, var(--dbp-primary) 14%, var(--dbp-background));
            color: var(--dbp-primary);
        }

        .holder-avatar--group {
            background: color-mix(in srgb, var(--dbp-accent) 16%, var(--dbp-background));
            color: var(--dbp-accent);
        }

        .holder-avatar--dynamic-group {
            background: color-mix(in srgb, var(--dbp-info) 16%, var(--dbp-background));
            color: var(--dbp-info);
        }

        .is-system .holder-avatar {
            background: color-mix(in srgb, var(--dbp-muted) 16%, var(--dbp-background));
            color: var(--dbp-muted);
        }

        .holder-text {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .holder-name {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .holder-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5em;
            color: var(--dbp-muted);
            font-size: 0.85em;
        }

        .badge {
            display: inline-block;
            padding: 0.05em 0.6em;
            border-radius: 999px;
            font-size: 0.85em;
            font-weight: bold;
        }

        .badge--new {
            background: var(--dbp-accent);
            color: var(--dbp-on-accent-surface, #fff);
        }

        .checkbox-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: var(--checkbox-column-width);
        }

        .checkbox-label {
            position: absolute !important;
            clip: rect(1px, 1px, 1px, 1px);
            overflow: hidden;
            height: 1px;
            width: 1px;
        }

        input[type='checkbox'] {
            width: 1.3em;
            height: 1.3em;
            margin: 0;
            accent-color: var(--dbp-accent);
            cursor: pointer;
        }

        input[type='checkbox']:disabled {
            cursor: default;
        }

        .holder-row:not(.edit-mode) input[type='checkbox']:disabled {
            opacity: 0.85;
        }

        .is-locked input[type='checkbox'] {
            cursor: help;
            opacity: 0.55;
        }

        .lock-icon {
            position: absolute;
            top: 50%;
            left: calc(50% + 0.9em);
            transform: translateY(-50%);
            font-size: 0.75em;
            color: var(--dbp-muted);
        }

        .permission-state {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.5em;
            height: 1.5em;
            box-sizing: border-box;
            border-radius: 50%;
            font-size: 0.95em;
        }

        .permission-state::after {
            content: '';
            display: block;
            width: 0.35em;
            height: 0.35em;
            border-radius: 50%;
            background: color-mix(in srgb, var(--dbp-content) 22%, transparent);
        }

        .is-granted .permission-state {
            background: var(--dbp-accent);
            color: var(--dbp-on-accent-surface, #fff);
        }

        .is-granted .permission-state::after {
            display: none;
        }

        .is-granted .permission-state dbp-icon {
            font-size: 0.9em;
        }

        .is-mixed .permission-state {
            border: 2px solid var(--dbp-accent);
        }

        .is-mixed .permission-state::after {
            width: 0.6em;
            height: 2px;
            border-radius: 1px;
            background: var(--dbp-accent);
        }

        .is-locked.is-granted .permission-state {
            background: var(--dbp-muted);
        }

        .is-changed input[type='checkbox'] {
            outline: 2px solid var(--dbp-accent);
            outline-offset: 3px;
            border-radius: 2px;
        }

        .action-buttons {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.35em;
        }

        .row-icon-button {
            font-size: 1.1em;
        }

        .row-icon-button--danger:not([disabled]):hover {
            color: var(--dbp-danger);
        }

        .read-only-hint {
            display: inline-flex;
            align-items: center;
            gap: 0.35em;
            color: var(--dbp-muted);
            font-size: 0.85em;
        }

        /* Loading and empty state */

        .state-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75em;
            padding: 3em 1em;
            border: 1px dashed color-mix(in srgb, var(--dbp-content) 20%, transparent);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-muted);
            text-align: center;
        }

        .state-message dbp-icon {
            font-size: 2em;
        }

        /* Confirmation modal */

        .modal--confirmation {
            --dbp-modal-width: 360px;
            --dbp-modal-max-width: 420px;
            --dbp-modal-min-height: auto;
        }

        .modal--confirmation .footer-menu {
            padding: 0;
            justify-content: flex-end;
            display: flex;
            gap: 1em;
            margin-block: 2em 0;
        }

        /* Stacked layout, used if the permission columns don't fit next to each other */

        .stacked .header-row {
            display: none;
        }

        .stacked .holder-row {
            grid-template-columns: 1fr auto;
            grid-template-areas:
                'holder actions'
                'permissions permissions';
            row-gap: 0.75em;
            padding-block: 0.85em;
        }

        .stacked .holder-info {
            grid-area: holder;
        }

        .stacked .action-buttons {
            grid-area: actions;
        }

        .stacked .permission-group {
            grid-area: permissions;
            flex-wrap: wrap;
            gap: 0.5em;
            padding-left: 3em;
        }

        .stacked .checkbox-container {
            flex-direction: row;
            justify-content: flex-start;
            gap: 0.5em;
            width: auto;
            padding: 0.3em 0.7em;
            border-radius: 999px;
            background: color-mix(in srgb, var(--dbp-content) 5%, transparent);
        }

        .stacked .checkbox-label {
            position: static !important;
            clip: auto;
            overflow: visible;
            height: auto;
            width: auto;
            font-size: 0.85em;
        }

        .stacked input[type='checkbox'],
        .stacked .permission-state {
            order: -1;
        }

        .stacked .checkbox-container:not(.is-granted, .is-mixed):has(.permission-state) {
            opacity: 0.6;
        }

        .stacked .lock-icon {
            position: static;
            transform: none;
        }

        .stacked .pending-holder {
            grid-template-columns: 1fr auto;
        }

        .stacked .pending-holder > .holder-avatar {
            display: none;
        }

        @keyframes slide-in {
            from {
                opacity: 0;
                transform: translateY(-0.5em);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .pending-holder {
                animation: none;
            }

            .holder-row {
                transition: none;
            }
        }

        /* Util classes */

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
