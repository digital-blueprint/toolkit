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
            font-size: 1em;
            line-height: 1.5em;
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

        a {
            color: var(--vpu-override-muted-text);
            cursor: pointer;
            text-decoration: none;
        }

        .title {
            color: #363636;
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.125;
        }

        blockquote, body, dd, dl, dt, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, html, iframe, legend, li, ol, p, pre, textarea, ul {
            margin: 0;
            padding: 0;
        }

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

export function getTagCSS() {
    // language=css
    return css`
        .tags {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }

        .tags .tag {
            margin-bottom: 0.5rem;
        }

        .tags .tag:not(:last-child) {
            margin-right: 0.5rem;
        }

        .tags:last-child {
            margin-bottom: -0.5rem;
        }

        .tags:not(:last-child) {
            margin-bottom: 1rem;
        }

        .tags.are-medium .tag:not(.is-normal):not(.is-large) {
            font-size: 1rem;
        }

        .tags.are-large .tag:not(.is-normal):not(.is-medium) {
            font-size: 1.25rem;
        }

        .tags.is-centered {
            justify-content: center;
        }

        .tags.is-centered .tag {
            margin-right: 0.25rem;
            margin-left: 0.25rem;
        }

        .tags.is-right {
            justify-content: flex-end;
        }

        .tags.is-right .tag:not(:first-child) {
            margin-left: 0.5rem;
        }

        .tags.is-right .tag:not(:last-child) {
            margin-right: 0;
        }

        .tags.has-addons .tag {
            margin-right: 0;
        }

        .tags.has-addons .tag:not(:first-child) {
            margin-left: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .tags.has-addons .tag:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .tag:not(body) {
            align-items: center;
            background-color: whitesmoke;
            border-radius: var(--vpu-border-radius);
            color: #4a4a4a;
            display: inline-flex;
            font-size: 0.75rem;
            height: 2em;
            justify-content: center;
            line-height: 1.5;
            padding-left: 0.75em;
            padding-right: 0.75em;
            white-space: nowrap;
        }

        .tag:not(body) .delete {
            margin-left: 0.25rem;
            margin-right: -0.375rem;
        }

        .tag:not(body).is-dark {
            background-color: var(--vpu-dark);
            color: whitesmoke;
        }

        .tag:not(body).is-light {
            background-color: var(--vpu-light);
            color: #363636;
        }

        .tag:not(body).is-normal {
            font-size: 0.75rem;
        }

        .tag:not(body).is-medium {
            font-size: 1rem;
        }

        .tag:not(body).is-large {
            font-size: 1.25rem;
        }

        .tag:not(body) .icon:first-child:not(:last-child) {
            margin-left: -0.375em;
            margin-right: 0.1875em;
        }

        .tag:not(body) .icon:last-child:not(:first-child) {
            margin-left: 0.1875em;
            margin-right: -0.375em;
        }

        .tag:not(body) .icon:first-child:last-child {
            margin-left: -0.375em;
            margin-right: -0.375em;
        }

        .tag:not(body).is-delete {
            margin-left: 1px;
            padding: 0;
            position: relative;
            width: 2em;
        }

        .tag:not(body).is-delete::before, .tag:not(body).is-delete::after {
            background-color: currentColor;
            content: "";
            display: block;
            left: 50%;
            position: absolute;
            top: 50%;
            -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
            transform: translateX(-50%) translateY(-50%) rotate(45deg);
            -webkit-transform-origin: center center;
            transform-origin: center center;
        }

        .tag:not(body).is-delete::before {
            height: 1px;
            width: 50%;
        }

        .tag:not(body).is-delete::after {
            height: 50%;
            width: 1px;
        }

        .tag:not(body).is-delete:hover, .tag:not(body).is-delete:focus {
            background-color: #e8e8e8;
        }

        .tag:not(body).is-delete:active {
            background-color: #dbdbdb;
        }

        .tag:not(body).is-rounded {
            border-radius: 290486px;
        }

        a.tag:hover {
            text-decoration: underline;
        }
    `;
}

export function getDocumentationCSS() {
    // language=css
    return css`
        .documentation h1, .documentation h2, .documentation h3 {
            margin: 1em 0 0.8em 0;
        }

        .documentation p {
            margin: 1em 0;
        }

        .documentation a {
            border-bottom: 1px solid var(--vpu-muted-text);
            transition: background-color 0.15s, color 0.15s;
        }

        .documentation a:hover {
            color: #fff;
            background-color: #000;
        }

        .documentation ul, .documentation ol, .documentation li {
            margin: inherit;
            padding: inherit;
        }

        .documentation li > ul {
            margin-left: 0.5em;
        }
    `;
}
