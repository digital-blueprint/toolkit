import {css, unsafeCSS, CSSResult} from 'lit';
import {getIconSVGURL} from './src/icon.js';

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
export function getThemeCSS() {
    // language=css
    return css`

    :host {
        /* old variables */
        --dbp-primary-bg-color: var(--dbp-override-primary-bg-color, #007bff);
        --dbp-primary-text-color: var(--dbp-override-primary-text-color, #fff);
        --dbp-primary-button-border: var(--dbp-override-primary-button-border, #007bff);
        --dbp-secondary-bg-color: var(--dbp-override-secondary-bg-color, #6c757d);
        --dbp-secondary-text-color: var(--dbp-override-secondary-text-color, #fff);
        --dbp-info-bg-color: var(--dbp-override-info-bg-color, #17a2b8);
        --dbp-info-text-color: var(--dbp-override-info-text-color, #fff);
        --dbp-success-bg-color: var(--dbp-override-success-bg-color, #28a745);
        --dbp-success-text-color: var(--dbp-override-success-text-color, #fff);
        --dbp-warning-bg-color: var(--dbp-override-warning-bg-color, #ffc107);
        --dbp-warning-text-color: var(--dbp-override-warning-text-color, #343a40);
        --dbp-warning-color: var(--dbp-override-warning-color, #D57A1C);
        --dbp-danger-bg-color: var(--dbp-override-danger-bg-color, #dc3545);
        --dbp-danger-text-color: var(--dbp-override-danger-text-color, #fff);
        --dbp-light: var(--dbp-override-light, #f8f9fa);
        --dbp-dark: var(--dbp-override-dark, #343a40);
        --dbp-muted-text: var(--dbp-override-muted-text, #6c757d);
        --dbp-border-width: var(--dbp-override-border-width, 1px);
        --dbp-border-color: var(--dbp-override-border-color, #000);
        --dbp-placeholder-color: #777;
        --dbp-downloaded-bg-color: var(--dbp-override-downloaded-bg-color, #c8dcc8);
        
        
        /* new variables */
        --dbp-base-light: var(--dbp-override-base-light, var(--dbp-override-light, #ffffff));
        --dbp-base-dark: var(--dbp-override-base-dark, var(--dbp-override-dark, #000000));
        --dbp-text-light: var(--dbp-override-text-light, var(--dbp-override-light, #ffffff));
        --dbp-text-dark: var(--dbp-override-text-dark, var(--dbp-override-dark, #000000));
        --dbp-text-muted-light: var(--dbp-override-text-muted-light, var(--dbp-override-muted-text, #adadad));
        --dbp-text-muted-dark: var(--dbp-override-text-muted-dark, var(--dbp-override-muted-text, #767676));
        --dbp-accent-light: var(--dbp-override-accent-light, var(--dbp-override-primary-bg-color, #c24f68));
        --dbp-accent-dark: var(--dbp-override-accent-dark, var(--dbp-override-primary-bg-color, #c24f68));
        --dbp-primary-light: var(--dbp-override-primary-light, var(--dbp-override-primary-bg-color, #8ca4eb)); /*remove second value if no app needs to be backported */
        --dbp-primary-dark: var(--dbp-override-primary-dark, var(--dbp-override-primary-bg-color, #2a4491));
        --dbp-secondary-light: var(--dbp-override-secondary-light, var(--dbp-override-light, #ffffff));
        --dbp-secondary-dark: var(--dbp-override-secondary-dark, var(--dbp-override-dark, #000000));
        --dbp-info-light: var(--dbp-override-info-light, var(--dbp-override-primary-bg-color, #8ca4eb));
        --dbp-info-dark: var(--dbp-override-info-dark, var(--dbp-override-primary-bg-color, #2a4491));
        --dbp-success-light: var(--dbp-override-success-light, var(--dbp-override-success-bg-color, #7acc79));
        --dbp-success-dark: var(--dbp-override-success-dark, var(--dbp-override-success-bg-color, #188018));
        --dbp-warning-light: var(--dbp-override-warning-color, var(--dbp-override-warning-light, #f99a41));
        --dbp-warning-dark: var(--dbp-override-warning-color, var(--dbp-override-warning-dark, #c15500));
        --dbp-danger-light: var(--dbp-override-danger-bg-color, var(--dbp-override-danger-light, #ff887a));
        --dbp-danger-dark: var(--dbp-override-danger-bg-color, var(--dbp-override-danger-dark, #de3535));
        --dbp-border-light: var(--dbp-override-border-light, 1px solid #ffffff);
        --dbp-border-dark: var(--dbp-override-border-dark, 1px solid #000000);
        --dbp-border-radius: var(--dbp-override-border-radius, 0px);
        --dbp-hover-base: var(--dbp-override-hover-base, var(--dbp-override-dark, var(--dbp-base-light)));
        --dbp-hover-text: var(--dbp-override-hover-text, var(--dbp-override-light, var(--dbp-base-dark)));
        
        /* TODO check if there are any uses of this in other apps then remove it */
        --dbp-button-hover-base: var(--dbp-override-button-hover-base, var(--dbp-override-dark, #000000));
        --dbp-button-hover-text: var(--dbp-override-button-hover-text, var(--dbp-override-light, #ffffff));
    }
    
    #main{
        background-color: var(--dbp-base-light);
    }
    
    `;
}

export function getGeneralCSS(doMarginPaddingReset = true) {
    // language=css
    const marginPaddingResetCss = doMarginPaddingReset ? css`
        blockquote, body, dd, dl, dt, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, html, iframe, legend, li, ol, p, pre, textarea, ul {
            margin: 0;
            padding: 0;
        }
    ` : css``;

    // language=css
    return css`
        
        h2 {
            font-weight: 300;
        }
        
        h3{
            font-weight: 300;
            margin-top: 0px;
            margin-bottom: 0.75rem;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input, .textarea, .select select {
            border: solid 1px var(--dbp-text-muted-light);
            border-radius: var(--dbp-border-radius);
            padding-bottom: calc(.375em - 1px);
            padding-left: calc(.625em - 1px);
            padding-right: calc(.625em - 1px);
            padding-top: calc(.375em - 1px);
        }

        .input::placeholder, .textarea::placeholder, .select select::placeholder {
            color: var(--dbp-text-muted-dark);
        }

        input, ::placeholder, textarea, select, .select select {
            font-size: inherit;
            font-family: inherit;
        }

        input::-moz-focus-inner { border: 0; }
        
        :focus-visible{
            outline:none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 4px 2px var(--dbp-accent-dark);
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
            color: var(--dbp-text-dark);
            cursor: pointer;
            text-decoration: none;
        }

        a.is-download {
            border-bottom: var(--dbp-border-dark);
            transition: background-color 0.15s, color 0.15s;
        }

        a.is-download:hover {
            color: var(--dbp-hover-text);
            background-color: var(--dbp-hover-base);
        }

        /* Inline SVG don't work in our web-components */
        /*
        a.is-download:after, a.is-download:hover:after {
            content: "\\00a0\\00a0\\00a0\\00a0";
            background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%228.3021mm%22%20width%3D%228.2977mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2029.401607%2029.41681%22%3E%3Cg%20style%3D%22stroke-width%3A2.1%22%20transform%3D%22translate(-271.68%20-367.92)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m300.13%20390.41v2.3918c0%201.9813-1.6064%203.5877-3.5877%203.5877h-20.326c-1.9813%200-3.5877-1.6064-3.5877-3.5877v-2.3918%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m286.38%20390.27v-21.384%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m295.13%20381.52-8.7501%208.7462-8.7501-8.7462%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            margin: 0 0.25% 0 1.5%;
            font-size: 94%;
        }
        */

        .title {
            color: var(--dbp-text-dark);
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.125;
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

        .input, .select select, .textarea {
            background-color: var(--dbp-base-light);
            border-color: var(--dbp-text-muted-dark);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-text-muted-dark);
        }

        *, ::after, ::before {
            box-sizing: inherit;
        }

        select:not(.select) {
            -moz-appearance: none;.dropdown-menu
            -webkit-appearance: none;
            background: calc(100% - 0.2rem) center no-repeat url("${unsafeCSS(getIconSVGURL('chevron-down'))}");
            background-size: 25%;
            border: var(--dbp-border-dark);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-text-dark);
            padding: 0.14rem 1.0rem 0.14rem 0.14rem;
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

        .buttons.has-addons .button:hover, .buttons.has-addons .button.is-hovered {
            z-index: 2;
        }

        .buttons.has-addons .button:focus, .buttons.has-addons .button.is-focused, .buttons.has-addons .button:active, .buttons.has-addons .button.is-active, .buttons.has-addons .button.is-selected {
            z-index: 3;
        }

        .buttons.has-addons .button:focus:hover, .buttons.has-addons .button.is-focused:hover, .buttons.has-addons .button:active:hover, .buttons.has-addons .button.is-active:hover, .buttons.has-addons .button.is-selected:hover {
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

        .field.has-addons .control .button:not([disabled]):hover, .field.has-addons .control .button:not([disabled]).is-hovered,
        .field.has-addons .control .input:not([disabled]):hover,
        .field.has-addons .control .input:not([disabled]).is-hovered,
        .field.has-addons .control .select select:not([disabled]):hover,
        .field.has-addons .control .select select:not([disabled]).is-hovered {
            z-index: 2;
        }

        .field.has-addons .control .button:not([disabled]):focus, .field.has-addons .control .button:not([disabled]).is-focused, .field.has-addons .control .button:not([disabled]):active, .field.has-addons .control .button:not([disabled]).is-active,
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

        .field.has-addons .control .button:not([disabled]):focus:hover, .field.has-addons .control .button:not([disabled]).is-focused:hover, .field.has-addons .control .button:not([disabled]):active:hover, .field.has-addons .control .button:not([disabled]).is-active:hover,
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
            background-color: var(--dbp-base-light);
            color: var(--dbp-text-dark);
            padding: 1.25rem 2.5rem 1.25rem 1.5rem;
            position: relative;
            border-radius: var(--dbp-border-radius);
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
            color: var(--dbp-text-light);
            background: var(--dbp-muted-text-dark);
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
            background-color: var(--dbp-primary-dark);
            color: var(--dbp-text-light);
        }

        .notification.is-info {
            background-color: var(--dbp-info-dark);
            color: var(--dbp-text-light);
        }

        .notification.is-success {
            background-color: var(--dbp-success-light);
            color: var(--dbp-text-dark);
        }

        .notification.is-warning {
            background-color: var(--dbp-warning-light);
            color: var(--dbp-text-dark);
        }

        .notification.is-danger {
            background-color: var(--dbp-danger-dark);
            color: var(--dbp-text-light);
        }
    `;
}

export function getButtonCSS() {
    const docStyle = getComputedStyle(document.documentElement);
    let hoverTextCheck = false;
    let hoverBaseCheck = false;
    if (docStyle) {
        const hoverBase = docStyle.getPropertyValue('--dbp-override-hover-base');
        hoverBaseCheck = hoverBase ? true : false;
        const hoverText = docStyle.getPropertyValue('--dbp-override-hover-text');
        hoverTextCheck = hoverText ? true : false;
    }

    let hoverTextStyle = css``;
    let hoverBaseStyle = css``;

    if (hoverTextCheck) {
        hoverTextStyle = css`
            color: var(--dbp-hover-text);
        `;
    }

    if (hoverBaseCheck) {
        hoverBaseStyle = css`
            background-color: var(--dbp-hover-base);
        `;
    }

    // language=css
    return css`
        button.button, .button, button.dt-button {
            border: var(--dbp-border-dark);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-text-dark);
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
            transition: background-color 0.15s ease 0s, color 0.15s ease 0s;
            background: none;
        }

        button.button:hover:enabled, .button:hover:enabled, button.dt-button:hover:enabled, button.dt-button:hover:not(.disabled), .button:hover {
            ${hoverTextStyle}
            ${hoverBaseStyle}
        }

        button.button.is-small, .button.is-small {
            border-radius: calc(var(--dbp-border-radius) / 2);
            font-size: .75rem;
        }

        button.button.is-primary, .button.is-primary {
            background-color: var(--dbp-primary-dark);
            border-color: var(--dbp-primary-dark);
            color: var(--dbp-text-light);
        }

        button.button.is-info, .button.is-info {
            background-color: var(--dbp-info-dark);
            border-color: var(--dbp-info-dark);
            color: var(--dbp-text-light);
        }

        button.button.is-success, .button.is-success {
            background-color: var(--dbp-success-light);
            border-color: var(--dbp-success-light);
            color: var(--dbp-text-dark);
        }

        button.button.is-warning, .button.is-warning {
            background-color: var(--dbp-warning-light);
            border-color: var(--dbp-warning-light);
            color: var(--dbp-text-dark);
        }

        .button.button.is-danger, .button.is-danger {
            background-color: var(--dbp-danger-dark);
            border-color: var(--dbp-danger-dark);
            color: var(--dbp-text-light);
        }

        button.button[disabled], .button[disabled], fieldset[disabled] .button {
            opacity: .4;
            cursor: not-allowed;
        }

        button:focus-visible{
            outline:none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 4px 2px var(--dbp-accent-dark);
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
        
        .button-container input[type="radio"], .button-container input[type="checkbox"] {
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
            background-color: var(--dbp-base-light);
            border-radius: 0px;
            border: var(--dbp-border-dark);
        }
        
        .radiobutton {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: var(--dbp-base-light);
            border: solid;
            border-radius: 100%;
            border: var(--dbp-border-dark);
            
            box-sizing: content-box;
        }

        .button-container input[type="radio"]:checked ~ .radiobutton:after {
            border-color: var(--dbp-base-light);
        }
        
        .button-container input[type="radio"]:disabled ~ .radiobutton {
            border-color: var(--dbp-text-muted-light);
            background-color: var(--dbp-text-muted-light);
        }

        .button-container input[type="radio"]:checked:disabled ~ .radiobutton:after {
            border-color: var(--dbp-text-muted-light);
            background-color: var(--dbp-text-muted-light);
        }
        
        .radiobutton:after {
            content: "";
            position: absolute;
            display: none;
        }
        
        .button-container input[type="radio"]:checked ~ .radiobutton:after {
            display: block;
        }
        
        .button-container .radiobutton:after {
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            background-color: var(--dbp-base-dark);
            border: none;
            border-radius: 100%;
            border: 2px solid var(--dbp-base-light);
            box-sizing: border-box;
        }
        
        .button-container input[type="checkbox"]:checked ~ .checkmark:after {
            border-bottom: var(--dbp-border-dark);
            border-right: var(--dbp-border-dark);
            border-width: 0 2px 2px 0;
        }

        .button-container input[type="checkbox"]:focus-visible ~ .checkmark{
            outline:none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 4px 2px var(--dbp-accent-dark);
        }
        
        
        .button-container input[type="checkbox"]:disabled ~ .checkmark {
            border-color: var(--dbp-text-muted-light);
            background-color: var(--dbp-text-muted-light);
        }

        .button-container input[type="checkbox"]:checked:disabled ~ .checkmark:after {
            border-color: var(--dbp-text-muted-light);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }
        
        .button-container input[type="checkbox"]:checked ~ .checkmark:after {
            display: block;
        }
        
        .button-container .checkmark:after {
            left: 7px;
            top: 4px;
            width: 6px;
            height: 10px;
            border: var(--dbp-border-dark);
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
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
            background-color: var(--dbp-text-muted-light);
            border-radius: var(--dbp-border-radius);
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
            background-color: var(--dbp-secondary-dark);
            color: var(--dbp-text-light);
        }

        .tag:not(body).is-light {
            background-color: var(--dbp-base-light);
            color: var(--dbp-text-dark);
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
            border-bottom: 1px solid var(--dbp-muted-text-dark);
            transition: background-color 0.15s, color 0.15s;
        }

        .documentation a:hover {
            color: var(--dbp-hover-text);
            background-color: var(--dbp-hover-base);
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
            color: var(--dbp-text-muted-dark);
        }

        /* Work around single selections not wrapping and breaking responsivness */
        .select2-container--default .select2-selection--single {
            height: 100% !important;
        }
        .select2-container--default .select2-selection__rendered{
            word-wrap: break-word !important;
            text-overflow: inherit !important;
            white-space: normal !important;
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
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            background-color: var(--dbp-base-dark);
            opacity: 0.6;
        }

        .modal-container {
            background-color: var(--dbp-base-light);
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
        }
        
        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: var(--dbp-accent-dark);
            cursor: pointer;
            padding: 0px;
        }
        
        .modal-close .close-icon svg, .close-icon{
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

        .micromodal-slide[aria-hidden="false"] .modal-overlay {
            animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden="false"] .modal-container {
            animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);
        }

        .micromodal-slide[aria-hidden="true"] .modal-overlay {
            animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden="true"] .modal-container {
            animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);
        }

        .micromodal-slide .modal-container,
        .micromodal-slide .modal-overlay {
            will-change: transform;
        }
        
        @media only screen
        and (orientation: landscape)
        and (max-width: 768px) {
             .modal-container {
                 width: 100%;
                 height: 100%;
                 max-width: 100%;
             }
            
            .micromodal-slide .modal-container{
                height: 100%;
                width: 100%;
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


        .subheadline{
            font-style: italic;
            padding-left: 2em;
            margin-top: -1px;
            /*line-height: 1.8;*/
            margin-bottom: 1.2em;
        }
    `;
}

export function getLinkCss() {
    const docStyle = getComputedStyle(document.documentElement);
    let hoverTextCheck = false;
    let hoverBaseCheck = false;
    if (docStyle) {
        const hoverBase = docStyle.getPropertyValue('--dbp-override-hover-base');
        hoverBaseCheck = hoverBase ? true : false;
        const hoverText = docStyle.getPropertyValue('--dbp-override-hover-text');
        hoverTextCheck = hoverText ? true : false;
    }

    let hoverTextStyle = css``;
    let hoverChevronStyle = css``;
    let hoverBaseStyle = css``;

    if (hoverTextCheck) {
        hoverTextStyle = css`
            color: var(--dbp-hover-text);
            border-color: var(--dbp-hover-text);
        `;
        hoverChevronStyle = css`
            background-color: var(--dbp-hover-text);
        `;
    }

    if (hoverBaseCheck) {
        hoverBaseStyle = css`
            background-color: var(--dbp-hover-base);
        `;
    }
    // language=css
    return css`
        .int-link-external, .int-link-internal, .link, .link-without-hover {
            border-bottom: var(--dbp-border-dark);
        }

        .int-link-external:hover, .int-link-internal:hover, .link:hover {
            ${hoverTextStyle}
            ${hoverBaseStyle}
        }

        .int-link-external:after, .int-link-internal:after, .link:after, .link-without-hover:after {
            content: "\\00a0\\00a0\\00a0";
            background-color: var(--dbp-text-dark);
            -webkit-mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2022.7%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2022.7%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M386.9%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C387.3%2C380.4%2C387.1%2C380.5%2C386.9%2C380.5z%22%0A%09%09%09%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
            mask-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2022.7%2062.4%22%20style%3D%22enable-background%3Anew%200%200%2022.7%2062.4%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cg%20transform%3D%22translate%28-382.21%20-336.98%29%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M386.9%2C380.5c-0.2%2C0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.8%2C0.1-1.1l12.5-10.9l-12.5-10.9c-0.3-0.3-0.4-0.8-0.1-1.1%0A%09%09%09c0.3-0.3%2C0.8-0.4%2C1.1-0.1l13.1%2C11.5c0.2%2C0.2%2C0.3%2C0.4%2C0.3%2C0.6s-0.1%2C0.5-0.3%2C0.6l-13.1%2C11.5C387.3%2C380.4%2C387.1%2C380.5%2C386.9%2C380.5z%22%0A%09%09%09%2F%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A');
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            mask-position: center center;
            margin: 0 2px 0 4px;
            padding: 0 0 0.25% 0;
            -webkit-mask-size: 100%;
            mask-size: 100%;
        }

        .int-link-external:hover::after, .int-link-internal:hover::after, .link:hover::after{
            ${hoverChevronStyle}
        }
    `;
}

