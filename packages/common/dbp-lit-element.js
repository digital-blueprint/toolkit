import {AdapterLitElement} from "./src/adapter-lit-element";

export default class DBPLitElement extends AdapterLitElement {
    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }

    connectedCallback() {
        this.updateComplete.then(() => {
            // transform all named template slots in the light DOM to named div slots
            this.transformTemplateSlots();
        });

        super.connectedCallback();
    }

    /**
     * Transforms all named template slots in the light DOM to named div slots
     */
    transformTemplateSlots() {
        // query all named slots of the component
        const slots = this.shadowRoot.querySelectorAll("slot[name]");

        slots.forEach((slot) => {
            const name = slot.name;
            // search if there is a template with the name of the slot in the light DOM of the component
            const templateElem = this.querySelector("template[slot=" + name + "]");

            if (!templateElem) {
                return;
            }

            // create a slot div container to put in the cloned template content
            const divElem = document.createElement('div');
            divElem.slot = name;
            divElem.appendChild(templateElem.content.cloneNode(true));

            // remove the old template with slot attribute
            templateElem.remove();

            // put the slot div container with the cloned template in the light DOM
            this.appendChild(divElem);
        });
    }
}
