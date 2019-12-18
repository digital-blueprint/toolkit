import {LitElement} from "lit-element";

export default class VPULitElement extends LitElement {
    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }
}
