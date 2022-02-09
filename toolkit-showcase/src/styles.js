import {css, CSSResult, unsafeCSS} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import highlightCSSPath from 'highlight.js/styles/github.css';

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
export function getDemoCSS() {
    // language=css
    return css`
        @import url('${unsafeCSS(commonUtils.getAssetURL(highlightCSSPath))}');

        h1.title {
            margin-bottom: 1em;
        }
        div.container {
            margin-bottom: 1.5em;
        }
        h1,
        h2,
        h3,
        h4 {
            margin-bottom: 20px;
        }
        h2,
        h3,
        h4 {
            margin: 40px 0 10px 0px;
        }
        p {
            margin: 10px 0;
        }
        ul {
            margin-left: 14px;
        }
        ul ul {
            margin-left: 14px;
        }

        a {
            transition: background-color 0.15s, color 0.15s;
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        }

        a:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        a:after {
            content: '\\00a0\\00a0\\00a0';
            background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%228.6836mm%22%20width%3D%225.2043mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2018.440707%2030.768605%22%3E%3Cg%20transform%3D%22translate(-382.21%20-336.98)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-miterlimit%3A10%3Bstroke-width%3A2%3Bfill%3Anone%22%20d%3D%22m383.22%20366.74%2016.43-14.38-16.43-14.37%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
            background-size: 73%;
            background-repeat: no-repeat;
            background-position: center center;
            margin: 0 0 0 0.75%;
            padding: 0 0 0.25% 0;
            animation: 0.15s linkIconOut;
            font-size: 103%;
        }

        /* TODO Change color(mask) */

        /*
        a:hover::after {
            content: "\\00a0\\00a0\\00a0";
            background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%228.6836mm%22%20width%3D%225.2043mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2018.440707%2030.768605%22%3E%3Cg%20transform%3D%22translate(-382.21%20-336.98)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23FFF%3Bstroke-linecap%3Around%3Bstroke-miterlimit%3A10%3Bstroke-width%3A2%3Bfill%3Anone%22%20d%3D%22m383.22%20366.74%2016.43-14.38-16.43-14.37%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
            background-size: 73%;
            background-repeat: no-repeat;
            background-position: center center;
            margin: 0 0 0 0.75%;
            padding: 0 0 0.25% 0;
            animation: 0s linkIconIn;
            font-size: 103%;
        }
        
         */

        @keyframes linkIconOut {
            0% {
                filter: invert(100%);
                -webkit-filter: invert(100%);
            }
            100% {
                filter: invert(0%);
                -webkit-filter: invert(0%);
            }
        }

        pre {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
            padding: 0.4em;
            overflow-x: auto;
            border: 1px solid #ddd;
        }

        code {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
            line-height: 1.5em;
            font-weight: normal;
            padding: 0.25em 0.5em 0.25em;
        }
    `;
}
