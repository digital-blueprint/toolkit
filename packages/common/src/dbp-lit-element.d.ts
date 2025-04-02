import {AdapterLitElement} from './adapter-lit-element.js';

export default class DBPLitElement extends AdapterLitElement {
    /**
     * Query selector within the shadow DOM or light DOM.
     * @param selector - The selector to query.
     * @returns The selected element or null if not found.
     */
    _(selector: string): HTMLElement | null;

    /** Query selector within the shadow DOM or light DOM.
     * @param selector - The selector to query.
     * @returns The selected elements as a NodeList or null if not found.
     */
    _a(selector: string): NodeList | null;
}
