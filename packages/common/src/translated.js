import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from './dbp-lit-element';

export class Translated extends DBPLitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.inline = false;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            inline: {type: Boolean},
        };
    }

    static get styles() {
        // language=css
        return css`
            .hidden {
                display: none;
            }

            :host([inline]) div:not(.hidden) {
                display: inline;
            }

            :host([inline]) ::slotted(*) {
                display: inline;
            }
        `;
    }

    render() {
        return html`
            <div class="${classMap({hidden: this.lang !== 'de'})}">
                <slot name="de"></slot>
            </div>
            <div class="${classMap({hidden: this.lang !== 'en'})}">
                <slot name="en"></slot>
            </div>
        `;
    }
}
