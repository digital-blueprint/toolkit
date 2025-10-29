import {html, css} from 'lit';
import {createInstance} from './i18n';
import * as commonStyles from './styles.js';
import {ScopedElementsMixin} from './scoped/ScopedElementsMixin.js';
import DBPLitElement from './dbp-lit-element';
import {LangMixin} from './lang-mixin.js';
import {Icon} from './icon';

export class DBPSelect extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.open = false;
        this.disabled = false;
        this.label = ' ';
        this.align = 'right';
        this.hideOnSelect = true;
        this.options = [];
        this.value = '';
        this.buttonType = 'is-secondary';
    }

    static properties = {
        open: {type: Boolean, reflect: true},
        disabled: {type: Boolean, reflect: true},
        label: {type: String},
        align: {type: String},
        hideOnSelect: {type: Boolean, attribute: 'hide-on-select'},
        options: {type: Array},
        value: {type: String, reflect: true},
        buttonType: {type: String, attribute: 'button-type'},
    };

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    setOptions(opts) {
        this.options = Array.isArray(opts) ? opts : [];
    }

    select(name) {
        const opt = this.options.find((o) => o?.name === name);
        if (!opt) return;
        this._emitChange(opt, null);
        if (this.hideOnSelect) this.closeMenu();
    }

    openMenu() {
        if (!this.open && !this.disabled) {
            this.open = true;
            this.updateComplete.then(() => this._focusFirstItem());
            this._bindOutside();
        }
    }

    closeMenu() {
        if (!this.open) return;
        this.open = false;
        this._unbindOutside();
        this._focusTrigger();
    }

    toggle = () => (this.open ? this.closeMenu() : this.openMenu());

    _focusTrigger() {
        const btn = this.renderRoot.querySelector('.trigger');
        btn?.focus();
    }

    _focusFirstItem() {
        const items = this._items();
        items.find((i) => !i.hasAttribute('disabled'))?.focus();
    }

    _items() {
        return Array.from(this.renderRoot.querySelectorAll('.item-button'));
    }

    _onTriggerKeydown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openMenu();
        }
    };

    _onMenuKeydown = (e) => {
        const items = this._items().filter((i) => !i.hasAttribute('disabled'));
        const active = this.renderRoot?.activeElement ?? document.activeElement;
        const idx = items.indexOf(active);
        if (e.key === 'Escape') {
            e.preventDefault();
            this.closeMenu();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            items[(idx + 1) % items.length]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items[(idx - 1 + items.length) % items.length]?.focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            items[0]?.focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            items[items.length - 1]?.focus();
        }
    };

    _onItemClick = (e) => {
        const btn = e.currentTarget;
        if (!btn || btn.hasAttribute('disabled')) return;
        const name = btn.dataset.name;
        const opt = this.options.find((o) => o?.name === name);
        if (!opt) return;
        this._emitChange(opt, e);
        if (this.hideOnSelect) this.closeMenu();
    };

    _emitChange(opt, originalEvent) {
        this.value = opt.name;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {value: opt.name, option: opt, originalEvent},
                bubbles: true,
                composed: true,
            }),
        );
    }

    _onDocPointerDown = (e) => {
        const path = e.composedPath?.() || [];
        const inside = path.includes(this) || path.includes(this.renderRoot);
        if (!inside) this.closeMenu();
    };

    _bindOutside() {
        document.addEventListener('pointerdown', this._onDocPointerDown, true);
    }
    _unbindOutside() {
        document.removeEventListener('pointerdown', this._onDocPointerDown, true);
    }

    static get styles() {
        // language=css
        return css`
            @layer theme, components;
            @layer theme {
                ${commonStyles.getButtonCSS()}
            }
            @layer components {
                ${commonStyles.getDropDownCss()}
            }
        `;
    }

    render() {
        const selected = this.options.find((o) => o?.name === this.value);
        const triggerText = selected?.title ?? this.label ?? '';
        return html`
            <button
                id="action-trigger-button"
                class="trigger button ${this.buttonType}"
                part="trigger"
                @click=${this.toggle}
                @keydown=${this._onTriggerKeydown}
                ?disabled=${this.disabled}
                aria-haspopup="menu"
                aria-expanded=${String(this.open)}
                aria-controls="action-dropdown">
                ${triggerText}
                <dbp-icon class="icon-chevron" name="chevron-down" aria-hidden="true"></dbp-icon>
            </button>

            ${this.open
                ? html`
                      <ul
                          id="action-dropdown"
                          class="menu"
                          part="menu"
                          role="menu"
                          aria-labelledby="action-trigger-button"
                          @keydown=${this._onMenuKeydown}>
                          ${this.options.map(
                              (o) => html`
                                  <li role="none">
                                      <button
                                          class="item-button button"
                                          role="menuitem"
                                          data-name=${o.name}
                                          @click=${this._onItemClick}
                                          ?disabled=${o.disabled ?? false}
                                          aria-checked=${this.value === o.name ? 'true' : 'false'}>
                                          ${o.iconName
                                              ? html`
                                                    <dbp-icon
                                                        name=${o.iconName}
                                                        aria-hidden="true"></dbp-icon>
                                                `
                                              : null}
                                          <span>${o.label ?? o.name}</span>
                                      </button>
                                  </li>
                              `,
                          )}
                      </ul>
                  `
                : null}
        `;
    }
}
