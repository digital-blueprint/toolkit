import {LitElement} from "lit-element";
import $ from "jquery";

export default class VPULitElement extends LitElement {
    $(selector) {
        return $(this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector));
    }
}
