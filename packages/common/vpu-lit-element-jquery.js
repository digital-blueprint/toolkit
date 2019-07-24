import VPULitElement from "./vpu-lit-element";
import $ from "jquery";

export default class VPULitElementJQuery extends VPULitElement {
    $(selector) {
        return $(this._(selector));
    }
}
