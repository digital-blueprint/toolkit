import {AdapterLitElement} from './src/adapter-lit-element.js';

export default class DBPLitElement extends AdapterLitElement {
    constructor() {
        super();
        this.htmlOverrides = '';
        this._localTemplateSlotsImported = false;
        this._globalSlotsContainer = null;
        this._globalTemplateSlotsImported = false;
        this._renderDone = false;
        this.routingUrl = '';
    }

    static get properties() {
        return {
            ...super.properties,
            htmlOverrides: {type: String, attribute: 'html-overrides'},
            routingUrl: {type: String, attribute: 'routing-url'},
        };
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this._globalSlotsContainer !== null) {
            this._globalSlotsContainer.remove();
        }
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }

    _a(selector) {
        return this.shadowRoot === null
            ? this.querySelectorAll(selector)
            : this.shadowRoot.querySelectorAll(selector);
    }

    firstUpdated() {
        super.firstUpdated();
        this._renderDone = true;
        this._importTemplateSlots();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'html-overrides':
                    this._importTemplateSlots();
                    break;
            }
        });

        super.update(changedProperties);
    }

    /**
     * Transforms all global override templates or named template slots in the light DOM to named div slots
     * on the first render.
     *
     * Global overrides will replace all existing slotted elements with the same slot name.
     */
    _importTemplateSlots() {
        if (!this._renderDone) {
            return;
        }
        this._importLocalTemplateSlots();
        this._importGlobalTemplateSlots();
    }

    _importLocalTemplateSlots() {
        if (this._localTemplateSlotsImported) {
            return;
        }

        // Now extract slots from templates contained in the light dom
        let lightTemplateSlots = this.querySelectorAll(':scope > template[slot]:not([slot=""]');
        for (let templateElem of lightTemplateSlots) {
            // create a slot div container to put in the cloned template content
            const divElem = document.createElement('div');
            divElem.slot = templateElem.getAttribute('slot');
            divElem.appendChild(templateElem.content.cloneNode(true));
            // remove the old template
            templateElem.remove();
            // put the slot div container with the cloned template in the light DOM
            this.appendChild(divElem);
        }

        this._localTemplateSlotsImported = true;
    }

    _importGlobalTemplateSlots() {
        if (this.htmlOverrides === '' || this._globalTemplateSlotsImported) {
            return;
        }

        // First add global override templates as light dom slots
        let globalOverrideTemplateElem = document.querySelector('template#' + this.htmlOverrides);
        if (globalOverrideTemplateElem !== null) {
            // we need to clone the element so we can access the content
            const overrideTemplateElemClone = globalOverrideTemplateElem.content.cloneNode(true);
            const templateOverrideElem = overrideTemplateElemClone.querySelector(
                'template#' + this.tagName.toLowerCase()
            );
            if (templateOverrideElem !== null) {
                const templateOverrideElemClone = templateOverrideElem.content.cloneNode(true);

                // Find all slots which are direct children (somehow :scope doesn't work here so check parentNode)
                let globalTemplateSlots = [];
                for (let e of templateOverrideElemClone.querySelectorAll('[slot]:not([slot=""]')) {
                    if (e.parentNode === templateOverrideElemClone) {
                        globalTemplateSlots.push(e);
                    }
                }

                // Global overrides will replace local ones.
                // Either normal slotted elements or the ones we create from templates.
                for (let slotElem of globalTemplateSlots) {
                    for (let elm of this.querySelectorAll('[slot="' + slotElem.slot + '"]')) {
                        elm.remove();
                    }
                }

                // Create a dummy node and add it to the the same shadow root the templates are from
                // By adding it into the template we have the nice side effect that it is not visible
                let container = document.createElement('div');
                globalOverrideTemplateElem.append(container);
                this._globalSlotsContainer = container;
                for (let slotElem of globalTemplateSlots) {
                    container.appendChild(slotElem);
                }

                // Now move the slots into the light dom of the target.
                // The parent node in the other shadow root has to stay around for this to work
                while (container.childNodes.length) {
                    this.appendChild(container.removeChild(container.childNodes[0]));
                }
            }
        }

        this._globalTemplateSlotsImported = true;
    }

    getRoutingData() {
        return DBPLitElement._parseUrlComponents(this.routingUrl);
    }

    static _parseUrlComponents(url) {
        // Create a URL object to leverage built-in parsing
        const parsedUrl = new URL(url, 'https://example.com');

        return {
            // Pathname (everything before query and hash)
            pathname: parsedUrl.pathname,

            // Path segments (split pathname into individual segments)
            pathSegments: parsedUrl.pathname
                .split('/')
                .filter(segment => segment !== ''),

            // Query parameters as an object
            queryParams: Object.fromEntries(parsedUrl.searchParams),

            // Raw query string (including the '?')
            queryString: parsedUrl.search,

            // Hash/fragment (including the '#')
            hash: parsedUrl.hash,

            // Hash/fragment without the '#' symbol
            fragment: parsedUrl.hash.replace(/^#/, '')
        };
    }
}
