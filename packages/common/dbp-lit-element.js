import {AdapterLitElement} from "./src/adapter-lit-element";

export default class DBPLitElement extends AdapterLitElement {
    constructor() {
        super();
        this.htmlOverrides = '';
        this._rootContainer = null;
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            htmlOverrides: { type: String, attribute: 'html-overrides' },
        };

    }

    connectedCallback() {
        this.updateComplete.then(() => {
            // transform all global override templates or named template slots in the light DOM to named div slots
            this.transformSlots();
        });

        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this._rootContainer !== null) {
            this._rootContainer.remove();
        }
    }

    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }

    getTagName() {
        const tagName = this.dataset ? (this.dataset.tagName || '') : '';

        return tagName !== '' ? tagName : this.tagName.toLowerCase();
    }

    /**
     * Transforms all global override templates or named template slots in the light DOM to named div slots
     */
    transformSlots() {
        // query all named slots of the component
        const slots = this.shadowRoot.querySelectorAll("slot[name]");

        // if there are no slots we can exit
        if (slots.length === 0) {
            return;
        }

        slots.forEach((slot) => {
            const slotName = slot.name;

            // search if there is a template with the name of the slot in the light DOM of the component
            const templateElem = this.querySelector("template[slot=" + slotName + "]");

            if (!templateElem) {
                return;
            }

            // create a slot div container to put in the cloned template content
            const divElem = document.createElement('div');
            divElem.slot = slotName;
            divElem.appendChild(templateElem.content.cloneNode(true));

            // remove the old template
            templateElem.remove();

            // put the slot div container with the cloned template in the light DOM
            this.appendChild(divElem);
        });

        // check if we have an "html-override" attribute set so we need to check for the global override template
        if (this.htmlOverrides !== '') {
            const globalOverrideTemplateElem = document.querySelector('template#' + this.htmlOverrides);

            if (globalOverrideTemplateElem) {
                // we need to clone the element so we can access the content
                const overrideTemplateElemClone = globalOverrideTemplateElem.content.cloneNode(true);
                const tagName = this.getTagName();

                // then we will look if there is an override for the current tag
                const templateOverrideElem = overrideTemplateElemClone.querySelector('template#' + tagName);

                if (templateOverrideElem) {
                    // if there is an override we again need to clone that template so we can access the content
                    const templateOverrideElemClone = templateOverrideElem.content.cloneNode(true);

                    // Create a dummy node and add it to the the same shadow root the templates are from
                    // By adding it into the template we have the nice side effect that it is not visible
                    let container = document.createElement("div");
                    globalOverrideTemplateElem.append(container);
                    container.appendChild(templateOverrideElemClone);
                    this._rootContainer = container;

                    // now we need to look for slots in the override
                    slots.forEach((slot) => {
                        const slotName = slot.name;

                        // if a slot is found we need to remove the current slot in the light DOM
                        // so we are not showing the old and new content at the same time
                        if (templateOverrideElemClone.querySelector('[slot="' + slotName + '"]')) {
                            const currentSlotElement = this.querySelector('[slot="' + slotName + '"]');

                            if (currentSlotElement) {
                                currentSlotElement.remove();
                            }
                        }
                    });

                    // Now move the slots into the light dom of the target.
                    // The parent node in the other shadow root has to stay around for this to work
                    while (container.childNodes.length) {
                        this.appendChild(container.removeChild(container.childNodes[0]));
                    }
                }
            }
        }
    }
}
