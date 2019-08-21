import {html, LitElement, css} from 'lit-element';
import * as commonUtils from './utils.js';


class MiniSpinner extends LitElement {
    constructor() {
        super();
    }

    static get styles() {
        return css`
        .ring {
          display: inline-block;
          position: relative;
          width: 1em;
          height: 1em;
        }
        .ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          border: 0.2em solid #000;
          border-radius: 50%;
          animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #000 transparent transparent transparent;
        }
        .ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }`;
    } 

    render() {
        return html`<div class="ring"><div></div><div></div><div></div><div></div></div>`;
    }
}

commonUtils.defineCustomElement('vpu-mini-spinner', MiniSpinner);
