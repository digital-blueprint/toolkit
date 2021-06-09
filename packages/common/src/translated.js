import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";
import {classMap} from "lit-html/directives/class-map";

export class Translated extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
        };
      }

    static get styles() {
        // language=css
        return css`
            .hidden {display: none}
        `;
    }

    render() {
        return html`
            <slot class="${classMap({hidden: this.lang !== 'de'})}" name="de"></slot>
            <slot class="${classMap({hidden: this.lang !== 'en'})}" name="en"></slot>
        `;
    }
}
