import {html, LitElement, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {until} from 'lit-html/directives/until.js';
import * as commonUtils from '../utils.js';
import {name as pkgName} from './../package.json';

// Use in case the icon fails to load
const errorIcon = `
<svg version="1.1" id="Layer_2_1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
<g>
	<path d="M38.2,98.7c-1.1,0-2.2-0.6-2.8-1.6c-0.5-0.8-0.6-1.8-0.3-2.6l8.9-37.8H24.5c-1.2,0-2.2-0.6-2.8-1.5c-0.6-1-0.7-2.2-0.1-3.2
		l0.2-0.3L54.9,3.1c0.9-1.6,2.3-1.8,2.8-1.8c1.1,0,2.2,0.6,2.8,1.6c0.5,0.8,0.6,1.7,0.3,2.6l-6.9,30.4L75.6,36
		c1.1,0,2.2,0.6,2.8,1.5c0.6,1,0.7,2.2,0.1,3.2l-0.2,0.3L40.8,97.4l-0.2,0.2C40.3,97.9,39.5,98.7,38.2,98.7z M28.6,51.2h18.1
		c1.8,0,3.2,1.5,3.2,3.4v0.3l-6.8,29l28.2-42.4l-20.3-0.1c-1.8,0-3.2-1.5-3.2-3.4v-0.3l5-21.9L28.6,51.2z M75.5,41.5
		C75.5,41.5,75.5,41.5,75.5,41.5L75.5,41.5z M51.1,35.9L51.1,35.9C51.2,35.9,51.1,35.9,51.1,35.9z"/>
</g>
</svg>
`;

function getCSSVariable(name) {
    let value = window.getComputedStyle(document.documentElement).getPropertyValue(name);

    if (!value) {
        return null;
    }

    return value.replaceAll('"', '').replaceAll('\'', '').trim();
}

export function getIconSVGURL(name) {
    const varName = '--dbp-override-icon-' + name;
    const cssVarValue = getCSSVariable(varName);
    const iconBasePath = getCSSVariable('--dbp-icon-base-path');
    // console.log("varName", varName);
    // console.log("cssVarValue", cssVarValue);
    // console.log("iconBasePath", iconBasePath);

    // check if we want to override the icon
    if (cssVarValue) {
        let path = cssVarValue;

        // try to take care of relative paths
        if (!path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://') && iconBasePath) {
            path = iconBasePath + path;
        }

        // console.log("path", path);

        return path;
    }

    return commonUtils.getAssetURL(pkgName, 'icons/' + encodeURI(name) + '.svg');
}

export function getIconCSS(name) {
    const iconURL = getIconSVGURL(name);
    return `
        background-color: currentColor;
        mask-image: url(${ iconURL });
        -webkit-mask-image: url(${ iconURL });
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

async function getSVGTextElement(name) {
    const iconURL = getIconSVGURL(name);
    // console.log("iconURL: " + iconURL);

    const response = await fetch(iconURL);
    if (!response.ok) {
        return unsafeHTML(errorIcon);
    }
    let text = await response.text();
    if (text.indexOf('<svg') === -1) {
        return unsafeHTML(errorIcon);
    }
    text = text.slice(text.indexOf('<svg'));
    return unsafeHTML(text);
}

const iconCache =  {};

/**
 * Avoid lots of requests in case an icon is used multiple times on the same page.
 *
 * @param {string} name
 */
async function getSVGTextElementCached(name) {
    if (iconCache[name] === undefined) {
        let promise = getSVGTextElement(name);
        iconCache[name] = promise;
        return promise;
    } else {
        return iconCache[name];
    }
}

/**
 * For icon names see https://lineicons.com
 */
export class Icon extends LitElement {

    constructor() {
        super();
        this.name = "bolt";
    }

    static get properties() {
        return { 
          name: { type: String },
        };
      }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                height: 1em;
                top: .125em;
                position: relative;
            }

            svg {
                height: 100%;
<!--                background-image: url(/dist/icons/nextcloud.svg);-->
<!--                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='black'><path d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' /></svg>");-->
<!--                background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 97.6 81.74'%3E%3Cg%3E%3Cpath d='M89.8,22.7a28.51,28.51,0,0,0-16.9-9.1,27.84,27.84,0,0,0-14.8-12A24,24,0,0,0,48.9,0,28.36,28.36,0,0,0,20.6,27.4,22.42,22.42,0,0,0,13,70.11v-6.3A16.7,16.7,0,0,1,5.5,50a17,17,0,0,1,17-17h3.6V28.5A23,23,0,0,1,49,5.6a19.75,19.75,0,0,1,7.2,1.2h.1A22.48,22.48,0,0,1,68.9,17.5l.6,1.3,1.4.2a23.07,23.07,0,0,1,14.9,7.5,23.85,23.85,0,0,1-1.23,33.74v7A29.56,29.56,0,0,0,89.8,22.7Z'/%3E%3Cg%3E%3Cpath d='M16.39,71.61H36.65V51.36H16.39Z' style='fill: %23e4154b'/%3E%3Cpath d='M38.67,71.61H58.93V51.36H38.67Z' style='fill: %23e4154b'/%3E%3Cpath d='M61,71.61H81.21V51.36H61Z' style='fill: %23e4154b'/%3E%3Cpath d='M26.52,81.74H46.78V61.49H26.52Z' style='fill: %23e4154b'/%3E%3Cpath d='M50.83,61.49H71.08V41.23H50.83Z' style='fill: %23e4154b'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");-->
<!--                mask-image: url(/dist/icons/nextcloud.svg);-->
<!--                content: url(/dist/icons/nextcloud.svg);-->
            }

            #svg {
                height: 100%;
                width: 100%;
                background-repeat: no-repeat;
                background-position: center;
<!--                background-image: url(/dist/icons/nextcloud.svg);-->
<!--                content: url(/dist/icons/nextcloud.svg);-->
<!--                content: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='black'><path d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' /></svg>");-->
<!--                content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 97.6 81.74'%3E%3Cg%3E%3Cpath d='M89.8,22.7a28.51,28.51,0,0,0-16.9-9.1,27.84,27.84,0,0,0-14.8-12A24,24,0,0,0,48.9,0,28.36,28.36,0,0,0,20.6,27.4,22.42,22.42,0,0,0,13,70.11v-6.3A16.7,16.7,0,0,1,5.5,50a17,17,0,0,1,17-17h3.6V28.5A23,23,0,0,1,49,5.6a19.75,19.75,0,0,1,7.2,1.2h.1A22.48,22.48,0,0,1,68.9,17.5l.6,1.3,1.4.2a23.07,23.07,0,0,1,14.9,7.5,23.85,23.85,0,0,1-1.23,33.74v7A29.56,29.56,0,0,0,89.8,22.7Z'/%3E%3Cg%3E%3Cpath d='M16.39,71.61H36.65V51.36H16.39Z' style='fill: %23e4154b'/%3E%3Cpath d='M38.67,71.61H58.93V51.36H38.67Z' style='fill: %23e4154b'/%3E%3Cpath d='M61,71.61H81.21V51.36H61Z' style='fill: %23e4154b'/%3E%3Cpath d='M26.52,81.74H46.78V61.49H26.52Z' style='fill: %23e4154b'/%3E%3Cpath d='M50.83,61.49H71.08V41.23H50.83Z' style='fill: %23e4154b'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");-->
            }

            svg * {
                fill: currentColor;
            }
        `;
    } 

    render() {
        const iconURL = getIconSVGURL(this.name);
        console.log("iconURL", iconURL);
        let svg = getSVGTextElementCached(this.name);
        return html`
            <style>
                #svg {
                    background-image: url(${iconURL});
                }
            </style>
<!--            ${until(svg)}-->
            <div id="svg"></div>
        `;
    }
}