import {html, LitElement, css} from 'lit';
import * as commonUtils from '../utils.js';
import {name as pkgName} from './../package.json';
import nameMapping from './icon_mapping.json';

export function getIconSVGURL(name, iconSet) {
    if(iconSet !== '' && iconSet !== undefined) {
        return commonUtils.getAssetURL(pkgName, 'icons_' + encodeURI(iconSet) + '/' + encodeURI(name) + '.svg');
    }
    let mapped = mapName(name);
    return commonUtils.getAssetURL(pkgName, encodeURI(mapped) + '.svg');
}

export function mapName(name) {
    let mappedPath = nameMapping[name];
    if (mappedPath !== undefined && mappedPath !== '') {
        return mappedPath;
    }
    console.warn("Icon name '" + name + "' is not mapped, please add a mapping!");
    return 'icons_lineicons/' + name; // fallback to lineicons should be removed in the future
}

export function getIconCSS(name) {
    const iconURL = getIconSVGURL(name);
    return `
        background-color: currentColor;
        mask-image: url(${iconURL});
        -webkit-mask-image: url(${iconURL});
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
        this.iconSet = '';
    }

    static get properties() {
        return {
            name: {type: String},
            iconSet: {type: String, attribute: "icon-set"},
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
        const iconURL = getIconSVGURL(this.name, this.iconSet);
        const iconPart = this.name.trim().split(' ').join('');

        return html`
            <style>
                #svg {
                    -webkit-mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                    mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                }
            </style>
            <div id="svg"></div>
        `;
    }
}
