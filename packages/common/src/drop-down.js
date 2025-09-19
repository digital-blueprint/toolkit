import {html, css} from 'lit';
import * as commonStyles from './styles.js';
import {ScopedElementsMixin} from './scoped/ScopedElementsMixin.js';
import DBPLitElement from './dbp-lit-element';
import {LangMixin} from './lang-mixin.js';

export class DropDown extends LangMixin(ScopedElementsMixin(DBPLitElement)) {
    constructor() {
        super();
        this.open = false;
        this.disabled = false;
        this.label = ' ';
        this.align = 'right';
        this.hideOnSelect = true;
    }

    static properties = {
        open: {type: Boolean, reflect: true},
        disabled: {type: Boolean, reflect: true},
        label: {type: String},
        align: {type: String},
        hideOnSelect: {type: Boolean, attribute: 'hide-on-select'},
    };

    firstUpdated() {
        this._setupItems();
    }

    openMenu()  {
        if (!this.open && !this.disabled)
        { this.open = true;
            this.updateComplete.then(() => this._focusFirstItem());
            this._bindOutside(); }
    }

    closeMenu() {
        if (this.open) { this.open = false; this._unbindOutside();
            this._focusTrigger(); }
    }

    toggle = () => this.open ? this.closeMenu() : this.openMenu();

    _focusTrigger() {
        const btn = this.renderRoot.querySelector('.trigger'); btn?.focus();
    }

    _focusFirstItem() {
        const items = this._items();
        items.find(i => !i.hasAttribute('disabled'))?.focus();
    }

    _items() {
        const slot = this.renderRoot.querySelector('slot[name="item"]');
        return slot ? slot.assignedElements({flatten: true}) : [];
    }

    _setupItems = () => {
        this._items().forEach(el => {
            el.setAttribute('role', el.getAttribute('role') || 'menuitem');
            if (el.tabIndex < 0)
                el.tabIndex = -1;
            if (!el.__DropDownWired) {
                el.addEventListener('click', (e) => this._onItemClick(e, el));
                el.__DropDownWired = true;
            }
        });
    };

    _onItemClick(e, el) {
        if (el.hasAttribute('disabled')) return;
        const value = el.getAttribute('value') ?? el.dataset.value ?? null;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value, item: el, originalEvent: e },
            bubbles: true,
            composed: true,
        }));
        if (this.hideOnSelect)
            this.closeMenu();
    }

    _onTriggerKeydown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openMenu();
        }
    };

    _onMenuKeydown = (e) => {
        const items = this._items().filter(i => !i.hasAttribute('disabled'));
        const idx = items.indexOf(this.renderRoot?.activeElement ?? document.activeElement);
        if (e.key === 'Escape') { e.preventDefault(); this.closeMenu(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
    };

    _onDocPointerDown = (e) => {
        const path = e.composedPath?.() || [];
        const inside = path.includes(this) || path.includes(this.renderRoot);
        if (!inside) this.closeMenu();
    };

    _bindOutside()   { document.addEventListener('pointerdown', this._onDocPointerDown, true); }
    _unbindOutside() { document.removeEventListener('pointerdown', this._onDocPointerDown, true); }

    static get styles(){
        // language=css
        return css`
                ${commonStyles.getDropDownCss()}
            `;
    }

    render() {
        return html`
              <button
                class="trigger"
                part="trigger"
                @click=${this.toggle}
                @keydown=${this._onTriggerKeydown}
                ?disabled=${this.disabled}
                aria-haspopup="menu"
                aria-expanded=${String(this.open)}
              >
                <slot name="trigger">${this.label}</slot>
              </button>
        
              ${this.open ? html`
                <ul class="menu" part="menu" role="menu" @keydown=${this._onMenuKeydown}>
                  <slot name="item" @slotchange=${this._setupItems}></slot>
                </ul>
              ` : null}
        `;
    }
}