import {createInstance} from './i18n.js';
import {html, css} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AdapterLitElement, Icon} from '@dbp-toolkit/common';
import {classMap} from 'lit/directives/class-map.js';

export class LayoutSwitcher extends ScopedElementsMixin(AdapterLitElement) {
    /**
     * constructor function of LayoutSwitcher class for creating and initializing objects instance of this class
     */
    constructor() {
        super();

        this._i18n = createInstance();
        /** @type {string} */
        this.lang = this._i18n.language;
        /** @type {string} */
        this.langDir = '';
        /** @type {boolean} */
        this.isDisabled = false;
        /** @type {string} */
        this.appName = '';
        /** @type {Array} */
        this.layouts = [{name: 'wide'}, {name: 'standard'}];
        /** @type {string} */
        this.defaultLayout = null;
        /** @type {string} */
        this.layout = '';
        /** @type {boolean} */
        this.isDefaultLayout = this.layout === 'standard';
        /** @type {string} */
        this.disabledLayout = '';
        /** @type {string} */
        this.defaultModeClass = 'wide-layout';
        /** @type {string} */
        this.alternateModeClass = 'standard-layout';
        /** @type {boolean} */
        this.dropdown = false;
        this.boundCloseAdditionalMenuHandler = this.hideLayoutMenu.bind(this);
    }

    /**
     * Defines reactive properties for the component
     */
    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            appName: {type: String, attribute: 'app-name'},
            langDir: {type: String, attribute: 'lang-dir'},
            isDisabled: {type: Boolean, attribute: 'disabled', reflect: true},
            layout: {type: String},
            layouts: {type: Array},
            defaultLayout: {type: String, attribute: 'default-layout'},
            disabledLayout: {type: String, attribute: 'disabled-layout'},
            isDefaultLayout: {type: Boolean},
            dropdown: {type: Boolean},
        };
    }

    /**
     * scopedElements Registers custom elements used within the component
     */
    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-layout-switcher': LayoutSwitcher,
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
            if (propName === 'defaultLayout') {
                /* Set default layout based on: */
                if (this._getStoredLayout()) {
                    // 1. Stored layout value
                    this.layout = this._getStoredLayout();
                } else {
                    // 2. Default layout from attribute
                    // 3. Fallback to 'standard'
                    this.layout = this.defaultLayout || 'standard';
                    this._setStoredLayout(this.layout);
                }
            }
            if (propName === 'layout') {
                this.dispatchEvent(new CustomEvent('layout-changed', {detail: this.layout}));
                if (this.layout === 'standard') {
                    this.loadDefaultLayout();
                } else {
                    this.loadAlternateLayout();
                }
            }
        });
        super.update(changedProperties);
    }

    /**
     * connectedCallback lifecycle function is executed whenever a custom element is inserted into the DOM
     */
    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(() =>{
            if (this.disabledLayout) {
                /** Disable layout switcher if disabledLayout is set and only one layout is available */
                this.isDisabled = true;
                this.layout = this.layouts.filter((layout) => layout.name !== this.disabledLayout)[0].name;
                this._setStoredLayout(this.layout);
            }
            if (this.layout === 'standard') {
                this.loadDefaultLayout();
            } else {
                this.loadAlternateLayout();
            }
        });
    }

    /**
     * disconnectedCallback lifecycle function used for cleanup when the element is removed from the DOM
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    loadDefaultLayout() {
        this.isDefaultLayout = true;
    }

    loadAlternateLayout(){
        this.isDefaultLayout = false;
    }

    /**
     * Gets the stored layout value with namespace
     * @returns {string}
     * @private
     */
    _getStoredLayout() {
        if (!this.appName) return '';
        const key = `${this.appName}:layout`;
        return localStorage.getItem(key);
    }

    /**
     * Sets the stored layout value with namespace
     * @param {string} value
     * @private
     */
    _setStoredLayout(value) {
        if (!this.appName) return false;
        const key = `${this.appName}:layout`;
        localStorage.setItem(key, value);
    }

    toggleLayout(newLayout) {
        /* Update the layout property of the component with the new layout. */
        this.layout = newLayout;
        this._setStoredLayout(this.layout);
        /* Dispatch a custom event to inform other parts of the application of the layout change.The new layout state is passed as a detail in the event for use by event listeners. */
        this.dispatchEvent(new CustomEvent('layout-changed', { detail: this.layout }));
        this.loadLayout();
    }

    loadLayout() {
        this.isDefaultLayout = this.layout === 'standard';
    }

    /**
     * toggleLayoutMenu to control the visibility of a dropdown menu by toggling its state based on user interactions
     * @param {object} e
     * @returns {void}
     */
    toggleLayoutMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropdown = !this.dropdown;
        if (this.dropdown) {
            document.addEventListener('click', this.boundCloseAdditionalMenuHandler);
        } else {
            document.removeEventListener('click', this.boundCloseAdditionalMenuHandler);
        }
    }

    /**
     * hideLayoutMenu Hides the layout menu if a click occurs outside of it.
     * @param {object} event
     * @returns {void}
     */
    hideLayoutMenu(event) {
        const menu = this.shadowRoot.querySelector('.extended-menu');
        /**The 'contains' method checks if the event target (where the click occurred) is not inside the '.extended-menu' element. */
        if (!menu.contains(event.target)) {
            this.dropdown = false;
            document.removeEventListener('click', this.boundCloseAdditionalMenuHandler);
            this.requestUpdate();
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            layout-button, button.button {
                cursor: pointer;
                border:none;
            }
            .layout-button.active dbp-icon {
                color: var(--dbp-accent);
            }
            .active {
                font-weight: bold;
            }
            a.active,
            .extended-menu li a.active {
                color: var(--dbp-accent);
            }
            a.active dbp-icon{
                color: var(--dbp-accent);
            }
            a:hover:not(.active),
            .extended-menu li a:hover:not(.active) {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
                transition: none;
            }
            a {
                padding: 0.3em;
                display: inline-block;
                text-decoration: none;
                transition: background-color 0.15s, color 0.15s;
                color: var(--dbp-content);
            }
            .extended-menu {
                list-style: none;
                border: var(--dbp-border);
                position: absolute;
                background-color: var(--dbp-background);
                z-index: 1000;
                border-radius: var(--dbp-border-radius);
                margin: 0px;
                padding: 0px;
            }
            .extended-menu li {
                text-align: left;
                min-width: 160px;
            }
            .extended-menu li a {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 12px 15px;
                width: 100%;
                box-sizing: border-box;
                color: var(--dbp-content);
                background: none;
                display: block;
                text-decoration: none;
            }
            .icon {
                margin-right: 10px;
            }
            #layout-menu{
                position: relative;
            }
            .ul-right{
                right: 0px;
            }
        `;
    }

    render() {
        const i18n = this._i18n;
            if (!this.isDisabled) {
                return html`
                    <div id="layout-menu">
                        <a href="#" class=${classMap({'layout-button': true, 'active': this.dropdown})} title="${i18n.t('switch-layout')}"
                            @click="${this.toggleLayoutMenu}" >
                            <dbp-icon name="layout"></dbp-icon>
                        </a>
                        <ul class="extended-menu" style="display: ${this.dropdown ? 'block' : 'none'};">
                            ${this.layouts.map((layout) => html`
                                <li>
                                    <!-- Title for each layout option -->
                                    <a href="#" class="${this.layout === layout.name ? 'active' : ''}"
                                        title="${layout.name === 'wide' ? i18n.t('switch-to-wide-layout-label') : i18n.t('switch-to-standard-layout-label')}"
                                        @click="${() => this.toggleLayout(layout.name)}">
                                        <!-- Icon based on layout-->
                                        <dbp-icon class="icon" name="${layout.name === 'wide' ? 'wide' : 'standard'}"></dbp-icon>
                                        ${layout.name === 'wide'
                                    ? i18n.t('wide-layout-name')
                                    : i18n.t('standard-layout-name')}
                                    </a>
                                </li>
                            `)}
                        </ul>
                    </div>
                `;
            }
    }
}
