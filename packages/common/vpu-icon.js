import {html, LitElement, css} from 'lit-element';
import {until} from 'lit-html/directives/until.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
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
        let svg = fetch('local/vpu-common/icons/' + this.name + '.json').then(response => {
            return response.json().then(data => {
                return unsafeHTML('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +'<path d="' + data + '" />' + '</svg>');
            });
        })

        return html`
            <style>
                :host path {
                    fill: ${this.color};
                }
            </style>

            ${until(svg)}
        `;
    }
}

commonUtils.defineCustomElement('vpu-icon', Icon);
