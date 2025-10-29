import { html, css } from 'lit';
import * as commonStyles from '@dbp-toolkit/common/styles';
import { AdapterLitElement } from '@dbp-toolkit/common';

export class FeatureFlagDropdown extends AdapterLitElement {
    constructor() {
        super();
        this.prefix = 'dbp-feature-';
        this.flags = ['app-shell-ng'];
        this._isOpen = false;
    }

    static get properties() {
        return {
            prefix: { type: String },
            flags: { type: Array },
            _isOpen: { type: Boolean, state: true }
        };
    }

    static get styles() {
        return css`
          ${commonStyles.getThemeCSS()}
          ${commonStyles.getGeneralCSS()}
          ${commonStyles.getButtonCSS()}

          :host {
            display: inline-block;
            font-size: 0.7em;
          }

          .dropdown {
            position: relative;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            bottom: 100%;
            left: 0;
            margin-bottom: 5px;
          }

          .dropdown-content.active {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
            border: solid 1px var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            display: flex;
            flex-direction: column
          }

          .entry {
            display: flex;
            align-items: center;
            white-space: nowrap;
            gap: 4px;
            padding: 2px 6px;
          }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._handleOutsideClick.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._handleOutsideClick.bind(this));
    }

    _handleOutsideClick(e) {
        if (!e.composedPath().includes(this)) {
            this._isOpen = false;
        }
    }

    _toggleDropdown() {
        this._isOpen = !this._isOpen;
    }

    _handleCheckboxChange(e) {
        const key = this.prefix + e.target.dataset.key;
        if (e.target.checked) {
            localStorage.setItem(key, 'true');
        } else {
            localStorage.removeItem(key);
        }
    }

    _isChecked(flag) {
        const key = this.prefix + flag;
        return localStorage.getItem(key) !== null;
    }

    render() {
        return html`
          <div class="dropdown">
            <button class="button" @click="${this._toggleDropdown}">
              Feature Flags
            </button>
            <div class="dropdown-content ${this._isOpen ? 'active' : ''}">
              ${this.flags.map(flag => html`
                <div>
                  <label class="entry">
                    <input 
                      type="checkbox" 
                      data-key="${flag}"
                      .checked="${this._isChecked(flag)}"
                      @change="${this._handleCheckboxChange}"
                    >
                    ${flag}
                  </label>
                </div>
              `)}
            </div>
          </div>
        `;
    }
}