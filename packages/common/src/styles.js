import {css, unsafeCSS, CSSResult} from 'lit';
import {getIconSVGURL} from './icon.js';

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
export function getThemeCSS() {
    // language=css
    return css`
        :host {
            /* new new variables */
            --dbp-background: var(--dbp-override-background, #ffffff);
            --dbp-content: var(--dbp-override-content, #222120);
            --dbp-content-surface: var(--dbp-override-content-surface, var(--dbp-content));
            --dbp-on-content-surface: var(--dbp-override-on-content-surface, var(--dbp-background));
            --dbp-border: var(--dbp-override-border, 1px solid #222120);
            --dbp-border-radius: var(--dbp-override-border-radius, 0px);
            --dbp-primary: var(--dbp-override-primary, #3775c1);
            --dbp-primary-surface: var(--dbp-override-primary-surface, var(--dbp-primary));
            --dbp-on-primary-surface: var(
                --dbp-override-on-primary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-primary-surface-border-color: var(
                --dbp-override-primary-surface-border-color,
                var(--dbp-primary)
            );
            --dbp-secondary: var(--dbp-override-secondary, #222120);
            --dbp-secondary-surface: var(--dbp-override-secondary-surface, var(--dbp-secondary));
            --dbp-on-secondary-surface: var(
                --dbp-override-on-secondary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-secondary-surface-border-color: var(
                --dbp-override-secondary-surface-border-color,
                var(--dbp-secondary)
            );
            --dbp-muted: var(--dbp-override-muted, #767676);
            --dbp-muted-surface: var(--dbp-override-muted-surface, var(--dbp-muted));
            --dbp-on-muted-surface: var(
                --dbp-override-on-muted-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-muted-surface-border-color: var(
                --dbp-override-muted-surface-border-color,
                var(--dbp-muted)
            );
            --dbp-accent: var(--dbp-override-accent, #9e1e4d);
            --dbp-accent-surface: var(--dbp-override-accent-surface, var(--dbp-accent));
            --dbp-on-accent-surface: var(
                --dbp-override-on-accent-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-accent-surface-border-color: var(
                --dbp-override-accent-surface-border-color,
                var(--dbp-accent)
            );
            --dbp-info: var(--dbp-override-info, #38808a);
            --dbp-info-surface: var(--dbp-override-info-surface, var(--dbp-info));
            --dbp-on-info-surface: var(
                --dbp-override-on-info-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-info-surface-border-color: var(
                --dbp-override-info-surface-border-color,
                var(--dbp-info)
            );
            --dbp-success: var(--dbp-override-success, #338555);
            --dbp-success-surface: var(--dbp-override-success-surface, var(--dbp-success));
            --dbp-on-success-surface: var(
                --dbp-override-on-success-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-success-surface-border-color: var(
                --dbp-override-success-surface-border-color,
                var(--dbp-success)
            );
            --dbp-warning: var(--dbp-override-warning, #bf8808);
            --dbp-warning-surface: var(--dbp-override-warning-surface, var(--dbp-warning));
            --dbp-on-warning-surface: var(
                --dbp-override-on-warning-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-warning-surface-border-color: var(
                --dbp-override-warning-surface-border-color,
                var(--dbp-warning)
            );
            --dbp-danger: var(--dbp-override-danger, #cc3232);
            --dbp-danger-surface: var(--dbp-override-danger-surface, var(--dbp-danger));
            --dbp-on-danger-surface: var(
                --dbp-override-on-danger-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-danger-surface-border-color: var(
                --dbp-override-danger-surface-border-color,
                var(--dbp-danger)
            );
            --dbp-hover-background-color: var(--dbp-override-hover-background-color);
            --dbp-hover-color: var(--dbp-override-hover-color);
        }

        #root {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}

export function getGeneralCSS(doMarginPaddingReset = true) {
    // language=css
    const marginPaddingResetCss = doMarginPaddingReset
        ? css`
              blockquote,
              body,
              dd,
              dl,
              dt,
              fieldset,
              figure,
              h1,
              h2,
              h3,
              h4,
              h5,
              h6,
              hr,
              html,
              iframe,
              legend,
              li,
              ol,
              p,
              pre,
              textarea,
              ul {
                  margin: 0;
                  padding: 0;
              }
          `
        : css``;

    // language=css
    return css`
        h2 {
            font-weight: 300;
        }

        h3 {
            font-weight: 300;
            margin-top: 0px;
            margin-bottom: 0.75rem;
        }

        p {
            font-size: 1em;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input,
        .textarea,
        .select select {
            border: solid 1px var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            padding-bottom: calc(0.375em - 1px);
            padding-left: calc(0.625em - 1px);
            padding-right: calc(0.625em - 1px);
            padding-top: calc(0.375em - 1px);
        }

        .input::placeholder,
        .textarea::placeholder,
        .select select::placeholder {
            color: var(--dbp-muted);
        }

        input,
        ::placeholder,
        textarea,
        select,
        .select select {
            font-size: inherit;
            font-family: inherit;
        }

        input::-moz-focus-inner {
            border: 0;
        }

        :focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }

        .control {
            box-sizing: border-box;
            clear: both;
            font-size: 1rem;
            position: relative;
            text-align: left;
        }

        .label {
            margin-bottom: 0.5em;
            display: block;
            font-weight: 600;
        }

        .hidden {
            display: none;
        }

        a {
            color: var(--dbp-content);
            cursor: pointer;
            text-decoration: none;
        }

        a.is-download {
            border-bottom: var(--dbp-border);
            transition:
                background-color 0.15s,
                color 0.15s;
        }

        a.is-download:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        .title {
            color: var(--dbp-content);
            font-size: 1em;
            line-height: 1.125;
        }

        #headline h1 {
            font-size: 2em;
        }

        ${marginPaddingResetCss}.int-link-internal

        .button[disabled], .file-cta[disabled], .file-name[disabled], .input[disabled], .pagination-ellipsis[disabled],
        .pagination-link[disabled], .pagination-next[disabled], .pagination-previous[disabled], .select fieldset[disabled] select,
        .select select[disabled], .textarea[disabled], fieldset[disabled] .button, fieldset[disabled] .file-cta,
        fieldset[disabled] .file-name, fieldset[disabled] .input, fieldset[disabled] .pagination-ellipsis,
        fieldset[disabled] .pagination-link, fieldset[disabled] .pagination-next, fieldset[disabled] .pagination-previous,
        fieldset[disabled] .select select, fieldset[disabled] .textarea {
            cursor: not-allowed;
        }

        .input,
        .select select,
        .textarea {
            background-color: var(--dbp-background);
            border-color: var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
        }

        .input[disabled] {
            color: var(--dbp-muted);
        }

        *,
        ::after,
        ::before {
            box-sizing: inherit;
        }

        select:not(.select),
        .dropdown-menu {
            -moz-appearance: none;
            -webkit-appearance: none;
            background-color: var(--dbp-background);
            background: calc(100% - 0.4rem) center no-repeat
                url('${unsafeCSS(getIconSVGURL('chevron-down'))}');
            background-size: 25%;
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            padding: 0.14rem 1rem 0.14rem 0.14rem;
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}

export function getFormAddonsCSS() {
    // language=css
    return css`
        .buttons.has-addons .button:not(:first-child) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .buttons.has-addons .button:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            margin-right: -1px;
        }

        .buttons.has-addons .button:last-child {
            margin-right: 0;
        }

        .buttons.has-addons .button:hover,
        .buttons.has-addons .button.is-hovered {
            z-index: 2;
        }

        .buttons.has-addons .button:focus,
        .buttons.has-addons .button.is-focused,
        .buttons.has-addons .button:active,
        .buttons.has-addons .button.is-active,
        .buttons.has-addons .button.is-selected {
            z-index: 3;
        }

        .buttons.has-addons .button:focus:hover,
        .buttons.has-addons .button.is-focused:hover,
        .buttons.has-addons .button:active:hover,
        .buttons.has-addons .button.is-active:hover,
        .buttons.has-addons .button.is-selected:hover {
            z-index: 4;
        }

        .buttons.has-addons .button.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .buttons.is-centered {
            justify-content: center;
        }

        .buttons.is-centered:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }

        .buttons.is-right {
            justify-content: flex-end;
        }

        .buttons.is-right:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
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

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .field.has-addons .control:not(:last-child) {
            margin-right: -1px;
        }

        .field.has-addons .control:not(:first-child):not(:last-child) .button,
        .field.has-addons .control:not(:first-child):not(:last-child) .input,
        .field.has-addons .control:not(:first-child):not(:last-child) .select select {
            border-radius: 0;
        }

        .field.has-addons .control:first-child:not(:only-child) .button,
        .field.has-addons .control:first-child:not(:only-child) .input,
        .field.has-addons .control:first-child:not(:only-child) .select select {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .field.has-addons .control:last-child:not(:only-child) .button,
        .field.has-addons .control:last-child:not(:only-child) .input,
        .field.has-addons .control:last-child:not(:only-child) .select select {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .field.has-addons .control .button:not([disabled]):hover,
        .field.has-addons .control .button:not([disabled]).is-hovered,
        .field.has-addons .control .input:not([disabled]):hover,
        .field.has-addons .control .input:not([disabled]).is-hovered,
        .field.has-addons .control .select select:not([disabled]):hover,
        .field.has-addons .control .select select:not([disabled]).is-hovered {
            z-index: 2;
        }

        .field.has-addons .control .button:not([disabled]):focus,
        .field.has-addons .control .button:not([disabled]).is-focused,
        .field.has-addons .control .button:not([disabled]):active,
        .field.has-addons .control .button:not([disabled]).is-active,
        .field.has-addons .control .input:not([disabled]):focus,
        .field.has-addons .control .input:not([disabled]).is-focused,
        .field.has-addons .control .input:not([disabled]):active,
        .field.has-addons .control .input:not([disabled]).is-active,
        .field.has-addons .control .select select:not([disabled]):focus,
        .field.has-addons .control .select select:not([disabled]).is-focused,
        .field.has-addons .control .select select:not([disabled]):active,
        .field.has-addons .control .select select:not([disabled]).is-active {
            z-index: 3;
        }

        .field.has-addons .control .button:not([disabled]):focus:hover,
        .field.has-addons .control .button:not([disabled]).is-focused:hover,
        .field.has-addons .control .button:not([disabled]):active:hover,
        .field.has-addons .control .button:not([disabled]).is-active:hover,
        .field.has-addons .control .input:not([disabled]):focus:hover,
        .field.has-addons .control .input:not([disabled]).is-focused:hover,
        .field.has-addons .control .input:not([disabled]):active:hover,
        .field.has-addons .control .input:not([disabled]).is-active:hover,
        .field.has-addons .control .select select:not([disabled]):focus:hover,
        .field.has-addons .control .select select:not([disabled]).is-focused:hover,
        .field.has-addons .control .select select:not([disabled]):active:hover,
        .field.has-addons .control .select select:not([disabled]).is-active:hover {
            z-index: 4;
        }

        .field.has-addons .control.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .field.has-addons.has-addons-centered {
            justify-content: center;
        }

        .field.has-addons.has-addons-right {
            justify-content: flex-end;
        }

        .field.has-addons.has-addons-fullwidth .control {
            flex-grow: 1;
            flex-shrink: 0;
        }
    `;
}

export function getNotificationCSS() {
    // language=css
    return css`
        .notification {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
            padding: 1.25rem 2.5rem 1.25rem 1.5rem;
            position: relative;
            border-radius: var(--dbp-border-radius);
            border: var(--dbp-border);
        }

        .notification.has-progress-bar {
            padding-bottom: 1rem;
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
            color: var(--dbp-on-muted-surface);
            background: var(--dbp-muted-surface);
            border-color: var(--dbp-muted-surface-border-color);
        }

        .notification pre code {
            background: transparent;
        }

        .notification dbp-icon {
            font-size: 1.4em;
            margin-right: 0.4em;
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
            background-color: var(--dbp-primary-surface);
            color: var(--dbp-on-primary-surface);
            border-color: var(--dbp-primary-surface-border-color);
        }

        .notification.is-info {
            background-color: var(--dbp-info-surface);
            color: var(--dbp-on-info-surface);
            border-color: var(--dbp-info-surface-border-color);
        }

        .notification.is-success {
            background-color: var(--dbp-success-surface);
            color: var(--dbp-on-success-surface);
            border-color: var(--dbp-success-surface-border-color);
        }

        .notification.is-warning {
            background-color: var(--dbp-warning-surface);
            color: var(--dbp-on-warning-surface);
            border-color: var(--dbp-warning-surface-border-color);
        }

        .notification.is-danger {
            background-color: var(--dbp-danger-surface);
            color: var(--dbp-on-danger-surface);
            border-color: var(--dbp-danger-surface-border-color);
        }

        .progress-container {
            width: 100%;
            margin-top: 0.5rem;
        }

        progress[value] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: none;
            height: 10px;
        }

        .progress {
            height: 10px;
            animation: runProgress var(--dbp-progress-timeout, 5s) linear forwards 0.25s;
        }

        @keyframes runProgress {
            0% {
                width: 0%;
                background: rgba(255, 255, 255, 0.3);
            }

            100% {
                width: 100%;
                background: rgba(255, 255, 255, 1);
            }
        }

        .enter-animation {
            animation: slide-up 0.4s cubic-bezier(0.25, 0, 0.3, 1);
        }

        @keyframes slide-up {
            0% {
                transform: translateY(50%);
                opacity: 0.3;
            }
            75% {
                transform: translateY(10%);
                opacity: 0.75;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes scale-up {
            0% {
                transform: scale(0.75);
                opacity: 0.3;
            }
            75% {
                transform: scale(0.9);
                opacity: 0.75;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .is-removing {
            /*animation: fadeOut 0.25s forwards;*/
            animation: scale-down 2s ease-out; /*cubic-bezier(.25,0,.3,1);*/
        }

        @keyframes scale-down {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(0.9);
                opacity: 0.5;
            }
            100% {
                transform: scale(0.75);
                opacity: 0.15;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
                transform: translateY(-100%);
            }
        }
    `;
}

export function getButtonCSS() {
    // language=css
    return css`
        button.button,
        .button,
        button.dt-button {
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            cursor: pointer;
            justify-content: center;
            padding-bottom: calc(0.375em - 1px);
            padding-left: 0.75em;
            padding-right: 0.75em;
            padding-top: calc(0.375em - 1px);
            text-align: center;
            white-space: nowrap;
            font-size: inherit;
            font-weight: bolder;
            font-family: inherit;
            transition:
                all 0.15s ease 0s,
                color 0.15s ease 0s;
            background: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button:hover:enabled,
        .button:hover:enabled,
        button.dt-button:hover:enabled,
        button.dt-button:hover:not(.disabled) {
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-small,
        .button.is-small {
            border-radius: calc(var(--dbp-border-radius) / 2);
            font-size: 0.75rem;
        }

        button.button.is-icon,
        .button.is-icon {
            border: none;
            background: none;
            padding: 0px;
            width: var(--dbp-button-size, 40px);
            height: var(--dbp-button-size, 40px);
            display: flex;
            justify-content: center;
            align-items: center;
            color: currentColor;
        }

        button.button.is-icon dbp-icon,
        .button.is-icon dbp-icon,
        dbp-button-icon {
            top: 0px;
            font-size: 1.2em;
        }

        button.button.is-icon:hover:enabled,
        .button.is-icon:hover:enabled {
            background-color: var(--dbp-hover-background-color, unset);
            color: var(--dbp-hover-color, currentColor);
            border: 0 none;
        }

        button.button.is-primary,
        .button.is-primary {
            background-color: var(--dbp-primary-surface);
            border-color: var(--dbp-primary-surface-border-color);
            color: var(--dbp-on-primary-surface);
        }

        button.button.is-primary:hover:enabled,
        .button.is-primary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-primary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-primary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-primary-surface-border-color)
            );
        }

        button.button.is-secondary,
        .button.is-secondary {
            background-color: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button.is-secondary:hover:enabled,
        .button.is-secondary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-info,
        .button.is-info {
            background-color: var(--dbp-info-surface);
            color: var(--dbp-on-info-surface);
            border-color: var(--dbp-info-surface-border-color);
        }

        button.button.is-info:hover:enabled,
        .button.is-info:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-info-surface));
            color: var(--dbp-hover-color, var(--dbp-on-info-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-info-surface-border-color));
        }

        button.button.is-success,
        .button.is-success {
            background-color: var(--dbp-success-surface);
            border-color: var(--dbp-success-surface-border-color);
            color: var(--dbp-on-success-surface);
        }

        button.button.is-success:hover:enabled,
        .button.is-success:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-success-surface));
            color: var(--dbp-hover-color, var(--dbp-on-success-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-success-surface-border-color)
            );
        }

        button.button.is-warning,
        .button.is-warning {
            background-color: var(--dbp-warning-surface);
            border-color: var(--dbp-warning-surface-border-color);
            color: var(--dbp-on-warning-surface);
        }

        button.button.is-warning:hover:enabled,
        .button.is-warning:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-warning-surface));
            color: var(--dbp-hover-color, var(--dbp-on-warning-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-warning-surface-border-color)
            );
        }

        .button.button.is-danger,
        .button.is-danger {
            background-color: var(--dbp-danger-surface);
            border-color: var(--dbp-danger-surface-border-color);
            color: var(--dbp-on-danger-surface);
        }

        .button.button.is-danger:hover:enabled,
        .button.is-danger:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-danger-surface));
            color: var(--dbp-hover-color, var(--dbp-on-danger-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-danger-surface-border-color));
        }

        button.button[disabled],
        .button[disabled],
        fieldset[disabled] .button {
            opacity: 0.4;
            cursor: not-allowed;
        }

        button:focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }
    `;
}

export function getRadioAndCheckboxCss() {
    // language=css
    return css`
        /*
        Radiobutton:
            <label class="button-container">
                Labeltext
                <input type="radio" name="myradiobutton">
                <span class="radiobutton"></span>
            </label>

        Checkbox:
            <label class="button-container">
                Labeltext
                <input type="checkbox" name="mycheckbox">
                <span class="checkmark"></span>
            </label>
         */

        .button-container {
            display: block;
            position: relative;
            padding-left: 35px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .button-container input[type='radio'],
        .button-container input[type='checkbox'] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
            left: 0px;
        }

        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 21px;
            width: 21px;
            background-color: var(--dbp-background);
            border-radius: 0px;
            border: var(--dbp-border);
        }

        .radiobutton {
            position: absolute;
            top: 0;
            left: 0;
            height: 19px;
            width: 19px;
            background-color: var(--dbp-background);
            border: solid;
            border-radius: 100%;
            border: var(--dbp-border);

            box-sizing: content-box;
        }

        .button-container input[type='radio']:checked ~ .radiobutton:after {
            border-color: var(--dbp-background);
        }

        .button-container input[type='radio']:disabled ~ .radiobutton {
            border-color: var(--dbp-muted);
            background-color: var(--dbp-muted);
        }

        .button-container input[type='radio']:checked:disabled ~ .radiobutton:after {
            border-color: var(--dbp-muted);
            background-color: var(--dbp-muted);
        }

        .radiobutton:after {
            content: '';
            position: absolute;
            display: none;
        }

        .button-container input[type='radio']:checked ~ .radiobutton:after {
            display: block;
        }

        .button-container .radiobutton:after {
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            background-color: var(--dbp-content);
            border: none;
            border-radius: 100%;
            border: 2px solid var(--dbp-background);
            box-sizing: border-box;
        }

        .button-container input[type='checkbox']:checked ~ .checkmark:after {
            border-bottom: 1px solid var(--dbp-content);
            border-right: 1px solid var(--dbp-content);
            border-width: 0 2px 2px 0;
        }

        .button-container input[type='checkbox']:focus-visible ~ .checkmark {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }

        .button-container input[type='checkbox']:disabled ~ .checkmark {
            border-color: var(--dbp-muted);
            background-color: var(--dbp-muted);
        }

        .button-container input[type='checkbox']:checked:disabled ~ .checkmark:after {
            border-color: var(--dbp-muted);
        }

        .checkmark:after {
            content: '';
            position: absolute;
            display: none;
        }

        .button-container input[type='checkbox']:checked ~ .checkmark:after {
            display: block;
        }

        .button-container .checkmark:after {
            left: 8px;
            top: 3px;
            width: 5px;
            height: 11px;
            border: 1px solid var(--dbp-content);
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        @media only screen and (orientation: portrait) and (max-width: 768px) {
            .checkmark {
                width: 30px;
                height: 30px;
                top: 5px;
            }

            .button-container {
                line-height: 40px;
            }

            .button-container {
                padding-left: 40px;
            }

            .button-container .checkmark::after {
                left: 10px;
                width: 10px;
                height: 19px;
            }

            .button-container input[type='checkbox']:checked ~ .checkmark::after {
                top: 1px;
                left: 6px;
                width: 5px;
                height: 11px;
            }

            .button-container {
                line-height: 1em;
            }
        }
    `;
}

export function getTagCSS() {
    // language=css
    return css`
        .tags {
            align-items: center;
            display: flex;
            flex-wrap: nowrap;
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
            background-color: var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-muted);
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
            background-color: var(--dbp-content-surface);
            color: var(--dbp-on-content-surface);
        }

        .tag:not(body).is-light {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
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

        .tag:not(body).is-delete::before,
        .tag:not(body).is-delete::after {
            background-color: currentColor;
            content: '';
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

        .tag:not(body).is-delete:hover,
        .tag:not(body).is-delete:focus {
            background-color: var(--dbp-background);
        }

        .tag:not(body).is-delete:active {
            background-color: var(--dbp-background);
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
        .documentation h1,
        .documentation h2,
        .documentation h3 {
            margin: 1em 0 0.8em 0;
        }

        .documentation p {
            margin: 1em 0;
        }

        .documentation a {
            border-bottom: 1px solid var(--dbp-muted-text-dark);
            transition:
                background-color 0.15s,
                color 0.15s;
        }

        .documentation a:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        .documentation ul,
        .documentation ol,
        .documentation li {
            margin: inherit;
            padding: inherit;
        }

        .documentation li > ul {
            margin-left: 0.5em;
        }
    `;
}

export function getSelect2CSS() {
    // language=css
    return css`
        .select2-dropdown {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single .select2-selection__rendered {
            color: inherit;
        }

        .select2-container--default .select2-selection--single .select2-selection__clear {
            font-size: 1.5em;
            font-weight: 300;
        }

        .select2-container--default .select2-selection--single .select2-selection__placeholder {
            color: var(--dbp-muted);
        }

        /* Work around single selections not wrapping and breaking responsivness */
        .select2-container--default .select2-selection--single {
            height: 100% !important;
        }
        .select2-container--default .select2-selection__rendered {
            word-wrap: break-word !important;
            text-overflow: inherit !important;
            white-space: normal !important;
        }

        .select2-dropdown {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-selection--single,
        .select2-dropdown,
        .select2-container--default .select2-search--dropdown .select2-search__field {
            background: var(--dbp-background);
            color: var(--dbp-content);
            border: var(--dbp-border);
            border-color: var(--dbp-muted);
        }
    `;
}

export function getModalDialogCSS() {
    // language=css
    return css`
        /**************************\\
          Modal Styles
        \\**************************/

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .modal-overlay::before {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            background-color: var(--dbp-content-surface);
            opacity: 0.6;
        }

        .modal-container {
            background-color: var(--dbp-background);
            max-width: 600px;
            max-height: 100vh;
            min-width: 60%;
            min-height: 50%;
            overflow-y: auto;
            box-sizing: border-box;
            display: grid;
            height: 70%;
            width: 70%;
            position: relative;
            border-radius: var(--dbp-border-radius);
        }

        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: var(--dbp-accent);
            cursor: pointer;
            padding: 0px;
            position: relative;
            z-index: 9;
        }

        .modal-close .close-icon svg,
        .close-icon {
            pointer-events: none;
        }

        button.modal-close:focus {
            outline: none;
        }

        /**************************\\
          Modal Animation Style
        \\**************************/
        @keyframes mmfadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes mmfadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        @keyframes mmslideIn {
            from {
                transform: translateY(15%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes mmslideOut {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-10%);
            }
        }

        .micromodal-slide {
            display: none;
        }

        .micromodal-slide.is-open {
            display: block;
        }

        .micromodal-slide[aria-hidden='false'] .modal-overlay {
            animation: mmfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden='false'] .modal-container {
            animation: mmslideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden='true'] .modal-overlay {
            animation: mmfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden='true'] .modal-container {
            animation: mmslideOut 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        .micromodal-slide .modal-container,
        .micromodal-slide .modal-overlay {
            will-change: transform;
        }

        @media only screen and (orientation: landscape) and (max-width: 768px) {
            .modal-container {
                width: 100%;
                height: 100%;
                max-width: 100%;
            }

            .micromodal-slide .modal-container {
                height: 100%;
                width: 100%;
            }
        }

        @media only screen and (max-width: 768px) {
            .modal-close {
                width: 40px;
                height: 40px;
            }
        }
    `;
}

export function getNativeModalDialogPrintCSS() {
    // language=css
    return css`
        @media print {
            dialog[open] {
                display: block !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                max-width: 100%;
                max-height: inherit;
                height: auto;
                box-shadow: none;
                border: none;
                background: white;
                filter: none;
            }

            .modal-container {
                max-height: inherit;
            }

            .modal-content {
                overflow-y: visible;
            }
        }
    `;
}

export function getNativeModalDialogCSS() {
    // language=css
    return css`
        :host {
            font-size: var(--dbp-modal--font-size, 1rem);
            --dbp-modal-animation: mmFadeIn;
            --dbp-modal-title-font-size: 1rem;
            --dbp-modal-title-font-weight: 300;
            --dbp-modal-content-overflow-y: auto;
        }

        dialog:not([open]) {
            pointer-events: none;
            opacity: 0;
        }

        dialog[open] {
            animation-name: var(--dbp-modal-animation);
            animation-duration: 0.5s;
            animation-fill-mode: forwards;
        }

        dialog {
            min-width: var(--dbp-modal-min-width, 250px);
            max-width: var(--dbp-modal-max-width, 75vw);
            min-height: var(--dbp-modal-min-height, 200px);
            max-height: var(--dbp-modal-max-height, 90vh);
            width: var(--dbp-modal-width);

            overflow: hidden;
            padding: var(--dbp-modal-padding-top, 15px) 20px 20px;
            border: 0 none;
            color: var(--dbp-content);
            background-color: var(--dbp-background);
            box-shadow:
                rgba(0, 0, 0, 0.3) 2px 4px 16px,
                rgba(0, 0, 0, 0.2) 4px 8px 32px,
                rgba(0, 0, 0, 0.1) 8px 16px 64px;

            transition: height 5s ease-in-out;
            transform: translateY(var(--dbp-modal-translate-y, 0));
        }

        .modal-container {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            align-items: start;
            min-height: var(--dbp-modal-min-height);
            max-height: var(--dbp-modal-max-height, 90vh);
        }

        .modal-header {
            height: var(--dbp-modal-header-height);
            overflow: hidden;
        }

        .modal-content {
            position: relative;
            overflow-y: var(--dbp-modal-content-overflow-y);
            max-height: 100%;
            min-height: 100%;
            height: 100%;
        }

        .modal-footer {
            height: var(--dbp-modal-footer-height);
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin-bottom: 1em;
        }

        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: var(--dbp-accent);
            cursor: pointer;
            padding: 0px;
        }

        .modal-close .close-icon svg,
        .modal-close .close-icon {
            pointer-events: none;
        }

        button.modal-close:focus {
            filter: drop-shadow(rgba(255, 255, 255, 0.5), 1px 2px 4px);
        }

        .modal-title {
            margin: 0;
            padding: var(--dbp-modal-title-padding, 0.25em 0 0 0);
            font-weight: var(--dbp-modal-title-font-weight, 300);
            font-size: var(--dbp-modal-title-font-size, 1rem);
            background: var(--dbp-modal-title-background);
        }

        ::slotted([slot='header']) {
        }

        ::slotted([slot='footer']) {
        }

        ::backdrop {
            backdrop-filter: blur(5px);
            transition: backdrop-filter 0.5s ease;
            background: color-mix(in srgb, var(--dbp-background-color) 60%, transparent);
        }

        dialog + .backdrop {
            /* polyfill */
            backdrop-filter: blur(5px);
            transition: backdrop-filter 0.5s ease;
            background: color-mix(in srgb, var(--dbp-background-color) 60%, transparent);
        }

        @media only screen and (max-width: 490px) {
            dialog {
                max-width: none;
            }
        }

        /**************************\\
          Modal Animation Style
        \\**************************/
        @keyframes mmFadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes mmFadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        @keyframes mmSlideIn {
            from {
                transform: translateY(15%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes mmSlideOut {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-10%);
            }
        }
    `;
}

export function getTextUtilities() {
    // language=css
    return css`
        .text-left {
            text-align: left;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-lowercase {
            text-transform: lowercase;
        }

        .text-uppercase {
            text-transform: uppercase;
        }

        .text-capitalize {
            text-transform: capitalize;
        }
    `;
}

export function getActivityCSS() {
    // language=css
    return css`
        h2:first-child {
            margin-top: 0;
            margin-bottom: 0px;
        }

        .subheadline {
            font-style: italic;
            padding-left: 2em;
            margin-top: -1px;
            /*line-height: 1.8;*/
            margin-bottom: 1.2em;
        }
    `;
}

export function getLinkCss() {
    // language=css
    return css`
        .int-link-external,
        .int-link-internal,
        .link,
        .link-without-hover {
            border-bottom: var(--dbp-border);
            border-color: var(--dbp-content);
        }

        .int-link-external:hover,
        .int-link-internal:hover,
        .link:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            border-color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        .int-link-external:after,
        .int-link-internal:after,
        .link:after,
        .link-without-hover:after {
            content: '\\00a0\\00a0\\00a0';
            background-color: var(--dbp-content);
            -webkit-mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2022.7%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2022.7%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M386.9%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C387.3%2C380.4%2C387.1%2C380.5%2C386.9%2C380.5z%22%0A%09%09%09%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
            mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2022.7%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2022.7%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M386.9%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C387.3%2C380.4%2C387.1%2C380.5%2C386.9%2C380.5z%22%0A%09%09%09%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center -2px;
            mask-position: center center;
            margin: 0 0 0 4px;
            padding: 0 0 0.25% 0;
            -webkit-mask-size: 100%;
            mask-size: 120%;
        }

        .int-link-external:hover::after,
        .int-link-internal:hover::after,
        .link:hover::after {
            background-color: var(--dbp-hover-color, var(--dbp-content));
        }
    `;
}

export function getDropDownCss() {
    // language=css
    return css`
        :host {
            display: inline-block;
            position: relative;
        }
        :host([disabled]) {
            opacity: 0.6;
            pointer-events: none;
        }

        .trigger {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.6rem;
            border: 1px solid var(--dbp-border);
            border-radius: 0.5rem;
            background: var(--dbp-background);
            cursor: pointer;
            font: inherit;
        }

        .menu {
            position: absolute;
            top: calc(100% + 0.25rem);
            min-width: 12rem;
            padding: 0.25rem;
            margin: 0;
            list-style: none;
            border: 1px solid var(--dbp-border);
            border-radius: 0.5rem;
            background: var(--dbp-background);
            box-shadow:
                0 6px 24px rgba(0, 0, 0, 0.08),
                0 2px 8px rgba(0, 0, 0, 0.06);
            z-index: 1000;
        }
        :host([align='right']) .menu {
            right: 0;
        }
        :host(:not([align='right'])) .menu {
            left: 0;
        }

        ::slotted([slot='item']) {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.6rem;
            border: 0;
            background: transparent;
            font: inherit;
            text-align: left;
            border-radius: 0.4rem;
            width: 100%;
            cursor: pointer;
        }
        ::slotted([slot='item']:hover),
        ::slotted([slot='item']:focus-visible) {
            background: rgba(0, 0, 0, 0.06);
            outline: none;
        }
        ::slotted([slot='item'][disabled]) {
            opacity: 0.5;
            pointer-events: none;
        }
    `;
}
