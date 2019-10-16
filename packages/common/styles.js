import {css} from 'lit-element';

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
export function getThemeCSS() {
    // language=css
    return css`
        :host {
            --vpu-primary-bg-color: var(--vpu-override-primary-bg-color, #007bff);
            --vpu-primary-text-color: var(--vpu-override-primary-text-color, #fff);
            --vpu-secondary-bg-color: var(--vpu-override-secondary-bg-color, #6c757d);
            --vpu-secondary-text-color: var(--vpu-override-secondary-text-color, #fff);
            --vpu-info-bg-color: var(--vpu-override-info-bg-color, #17a2b8);
            --vpu-info-text-color: var(--vpu-override-info-text-color, #fff);
            --vpu-success-bg-color: var(--vpu-override-success-bg-color, #28a745);
            --vpu-success-text-color: var(--vpu-override-success-text-color, #fff);
            --vpu-warning-bg-color: var(--vpu-override-warning-bg-color, #ffc107);
            --vpu-warning-text-color: var(--vpu-override-warning-text-color, #343a40);
            --vpu-danger-bg-color: var(--vpu-override-danger-bg-color, #dc3545);
            --vpu-danger-text-color: var(--vpu-override-danger-text-color, #fff);
            --vpu-light: var(--vpu-override-light, #f8f9fa);
            --vpu-dark: var(--vpu-override-dark, #343a40);
            --vpu-muted-text: var(--vpu-override-muted-text, #6c757d);
            --vpu-border-radius: var(--vpu-override-border-radius, 0px);
            --vpu-border-width: var(--vpu-override-border-width, 1px);
        }
    `;
}

export function getGeneralCSS() {
    // language=css
    return css`
        code {
            background-color: var(--vpu-light);
            color: var(--vpu-danger-bg-color);
            font-size: 0.875em;
            font-weight: normal;
            padding: 0.25em 0.5em 0.25em;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input, .textarea, .select select {
            border-radius: var(--vpu-border-radius);
            padding-bottom: calc(.375em - 1px);
            padding-left: calc(.625em - 1px);
            padding-right: calc(.625em - 1px);
            padding-top: calc(.375em - 1px);
        }

        input, ::placeholder, textarea, select, .select select {
            font-size: inherit;
            font-family: inherit;
        }

        .control {
            box-sizing: border-box;
            clear: both;
            font-size: 1rem;
            position: relative;
            text-align: left;
        }

        .label {
            margin-bottom: .5em;
            display: block;
            font-weight: 600;
        }

        .hidden { display: none; }

        *, ::after, ::before {
            box-sizing: inherit;
        }
    `;
}

export function getNotificationCSS() {
    // language=css
    return css`
        .notification {
            background-color: var(--vpu-light);
            padding: 1.25rem 2.5rem 1.25rem 1.5rem;
            position: relative;
            border-radius: var(--vpu-border-radius);
        }

        .notification a:not(.button):not(.dropdown-item) {
            color: currentColor;
            text-decoration: underline;
        }

        .notification strong {
            color: currentColor;
        }

        .notification code,
        .notification pre {
            color: var(--vpu-light);
            background: var(--vpu-muted-text);
        }

        .notification pre code {
            background: transparent;
        }

        .notification > .delete {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
        }

        .notification .title,
        .notification .subtitle,
        .notification .content {
            color: currentColor;
        }

        .notification.is-primary {
            background-color: var(--vpu-primary-bg-color);
            color: var(--vpu-primary-text-color);
        }

        .notification.is-info {
            background-color: var(--vpu-info-bg-color);
            color: var(--vpu-info-text-color);
        }

        .notification.is-success {
            background-color: var(--vpu-success-bg-color);
            color: var(--vpu-success-text-color);
        }

        .notification.is-warning {
            background-color: var(--vpu-warning-bg-color);
            color: var(--vpu-warning-text-color);
        }

        .notification.is-danger {
            background-color: var(--vpu-danger-bg-color);
            color: var(--vpu-danger-text-color);
        }
    `;
}

export function getButtonCSS() {
    // language=css
    return css`
        .button {
            border-color: black;
            border-width: 1px;
            border-radius: var(--vpu-border-radius);
            color: black;
            cursor: pointer;
            justify-content: center;
            padding-bottom: calc(0.375em - 1px);
            padding-left: 0.75em;
            padding-right: 0.75em;
            padding-top: calc(0.375em - 1px);
            text-align: center;
            white-space: nowrap;
            font-size: inherit;
            font-family: inherit;
            background-color: transparent;
            transition: background-color 0.15s ease 0s, color 0.15s ease 0s;
        }

        .button:hover {
            color: white;
            background-color: black;
        }

        .button.is-small {
            border-radius: calc(var(--vpu-border-radius) / 2);
            font-size: .75rem;
        }

        .button.is-primary {
            background-color: var(--vpu-primary-bg-color);
            color: var(--vpu-primary-text-color);
        }

        .button.is-info {
            background-color: var(--vpu-info-bg-color);
            color: var(--vpu-info-text-color);
        }

        .button.is-success {
            background-color: var(--vpu-success-bg-color);
            color: var(--vpu-success-text-color);
        }

        .button.is-warning {
            background-color: var(--vpu-warning-bg-color);
            color: var(--vpu-warning-text-color);
        }

        .button.is-danger {
            background-color: var(--vpu-danger-bg-color);
            color: var(--vpu-danger-text-color);
        }
    `;
}
