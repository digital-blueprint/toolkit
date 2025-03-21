import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {AdapterLitElement} from '@dbp-toolkit/common';

/**
 * Element that renders different content based on the presence of a 'dark-theme' class on the body element.
 */
export class Themed extends AdapterLitElement {
    constructor() {
        super();

        this._observer = null;
        this._dark = false;
    }

    static get properties() {
        return {
            ...super.properties,
            _dark: {type: Boolean},
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

    connectedCallback() {
        super.connectedCallback();

        this._observer = new MutationObserver(() => {
            this._dark = document.body.classList.contains('dark-theme');
        });
        this._observer.observe(document.body, {attributes: true, attributeFilter: ['class']});
    }

    disconnectedCallback() {
        this._observer.disconnect();
        this._observer = null;

        super.disconnectedCallback();
    }

    render() {
        return html`
            <slot class="${classMap({hidden: this._dark})}" name="light"></slot>
            <slot class="${classMap({hidden: !this._dark})}" name="dark"></slot>
        `;
    }
}
