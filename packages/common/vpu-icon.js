import {html, LitElement, css} from 'lit-element';
import {until} from 'lit-html/directives/until.js';
import * as commonUtils from './utils.js';

/**
 * For icon names see https://materialdesignicons.com/
 */
class Icon extends LitElement {
    constructor() {
        super();
        this.name = "alert-circle";
        this.color = "black";
    }

    static get properties() {
        return { 
          name: { type: String },
          color: { type: String },
        };
      }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                height: 1em;
                width: 1em;
            }
        `;
    } 

    render() {
        let iconPath = commonUtils.getAssetURL('local/vpu-common/icons/' + this.name + '.json');
        let svgPath = fetch(iconPath)
            .then(response => {
                if (!response.ok) {
                    console.error("Failed to load icon: " + this.name);
                    return "M0,0H24V24H0";
                }
                return response.json();
            });

        return html`
            <style>
                :host path {
                    fill: currentColor;
                }
            </style>

            <svg aria-labelledby="title" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                <title id="title">${this.name}</title>
                <path d=${until(svgPath)} />
            </svg>
        `;
    }
}

commonUtils.defineCustomElement('vpu-icon', Icon);
