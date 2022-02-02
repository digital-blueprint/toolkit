import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from '../dbp-lit-element';

export class Translated extends DBPLitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
        };
    }

    static get styles() {
        // language=css
        return css`
            .hidden {
                display: none;
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
