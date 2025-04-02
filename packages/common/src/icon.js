import {html, LitElement, css} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import * as commonUtils from './common-utils.js';
import {name as pkgName} from './../package.json';

export function getIconSVGURL(name) {
    return commonUtils.getAssetURL(pkgName, 'icons/' + encodeURI(name) + '.svg');
}

/**
 * Gives CSS for showing an icon in cases where there is no way to use a web component.
 * For example: <style> a:after { ${getIconCSS('envelope')}; }</style>
 * @param {string} name - The icon name
 * @returns {string}
 */
export function getIconCSS(name) {
    const iconPart = name.trim().split(' ').join('');
    const iconURL = getIconSVGURL(name);
    return `
        background-color: currentColor;
        mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
        -webkit-mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
        mask-size: contain;
        -webkit-mask-size: contain;
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
        mask-position: center center;
        -webkit-mask-position: center center;
        margin-left: 0.2em;
        padding-left: 0.3em;
        content: "X";
    `;
}

/**
 * For icon names see https://lineicons.com
 */
export class Icon extends LitElement {
    constructor() {
        super();
        this.name = 'bolt';
        this.ariaLabel = undefined;
    }

    static get properties() {
        return {
            name: {type: String},
            ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
        };
    }

    static get styles() {
        // language=css
        return css`
            :host {
                display: inline-block;
                height: 1em;
                width: 1em;
                top: 0.125em;
                position: relative;
            }

            #svg {
                height: 100%;
                width: 100%;
                background-repeat: no-repeat;
                background-position: center;
                background-color: currentColor;
                mask-repeat: no-repeat;
                mask-position: center;
                mask-size: 100% 100%;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
                -webkit-mask-size: 100% 100%;
            }
        `;
    }

    render() {
        const iconURL = getIconSVGURL(this.name);
        const iconPart = this.name.trim().split(' ').join('');

        return html`
            <style>
                #svg {
                    -webkit-mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                    mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                }
            </style>
            <div
                id="svg"
                aria-label="${ifDefined(this.ariaLabel ? this.ariaLabel : undefined)}"></div>
        `;
    }
}
