import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

export default class DBPLitElement extends AdapterLitElement {
    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }
}
