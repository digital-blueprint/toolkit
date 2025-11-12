import {createInstance} from '../i18n.js';
import {css, html, LitElement} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonStyles from '../styles.js';
import {getIconCSS, Icon, LangMixin} from '../index.js';
import ICONS from './icon-names.js';

/**
 * A lazy-load wrapper component that uses Intersection Observer to load its content
 * only when it becomes visible in the viewport.
 *
 * Has a placeholder slot that is shown until the content is loaded.
 */
export class LazyLoad extends LitElement {
    constructor() {
        super();
        this._isVisible = false;
        this._observer = null;
    }

    static get properties() {
        return {
            _isVisible: {type: Boolean, state: true},
            rootMargin: {type: String, attribute: 'root-margin'},
            threshold: {type: Number},
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(() => {
            this._setupIntersectionObserver();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._cleanupObserver();
    }

    _setupIntersectionObserver() {
        this._observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this._isVisible = true;
                        this._cleanupObserver();
                    }
                });
            },
            {
                rootMargin: this.rootMargin || '50px',
                threshold: this.threshold || 0.01,
            },
        );
        this._observer.observe(this);
    }

    _cleanupObserver() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }

    render() {
        if (!this._isVisible) {
            return html`
                <span class="placeholder"></span>
            `;
        }

        return html`
            <slot></slot>
        `;
    }
}

export class DbpIconDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'lazy-load': LazyLoad,
        };
    }

    static get properties() {
        return {
            searchTerm: {type: String, attribute: false},
            iconSize: {type: Number, attribute: false},
        };
    }

    constructor() {
        super();
        this.searchTerm = '';
        this.iconSize = 48;
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}

            .content h2 {
                color: var(--dbp-content);
                font-weight: 600;
                line-height: 1.125;
                margin-top: 2em;
                font-size: 1.5em;
                margin-bottom: 0.75em;
            }

            .control {
                margin-bottom: 1.5rem;
            }

            .control:not(:last-child) {
                margin-bottom: 0.5rem;
            }

            a:hover {
                color: #ffbb00 !important;
                background-color: blue;
            }

            .search-and-size {
                display: flex;
                align-items: flex-start;
                gap: 2rem;
                margin: 1.5rem 0;
            }

            .search-box {
                flex: 1;
            }

            .search-box input {
                width: 100%;
                max-width: 400px;
                padding: 0.75rem;
                font-size: 1rem;
                border: 1px solid var(--dbp-muted);
                box-sizing: border-box;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--dbp-accent);
            }

            .size-control {
                min-width: 250px;
            }

            .size-control label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: var(--dbp-content);
            }

            .slider-container {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .slider-container input[type='range'] {
                flex: 1;
                height: 6px;
                background: var(--dbp-muted);
                outline: none;
                -webkit-appearance: none;
            }

            .slider-container input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: var(--dbp-accent);
                cursor: pointer;
            }

            .slider-container input[type='range']::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: var(--dbp-accent);
                cursor: pointer;
                border: none;
            }

            .size-value {
                min-width: 60px;
                text-align: right;
                font-weight: 500;
                color: var(--dbp-content);
                font-family: monospace;
            }

            .icon-count {
                color: var(--dbp-muted);
                font-size: 0.875rem;
                margin-top: 0.5rem;
            }

            .icon-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1.5rem;
                margin-top: 2rem;
            }

            .icon-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1.5rem;
                border: 1px solid var(--dbp-muted);
                cursor: pointer;
            }

            .icon-item dbp-icon {
                margin-bottom: 0.75rem;
                color: var(--dbp-content);
            }

            .icon-name {
                font-size: 0.875rem;
                color: var(--dbp-content);
                text-align: center;
                word-break: break-word;
                font-family: monospace;
            }

            .no-results {
                text-align: center;
                padding: 3rem;
                color: var(--dbp-muted);
                font-size: 1.125rem;
            }
        `;
    }

    getFilteredIcons() {
        if (!this.searchTerm) {
            return ICONS;
        }
        const term = this.searchTerm.toLowerCase();
        return ICONS.filter((name) => name.toLowerCase().includes(term));
    }

    handleSearchInput(e) {
        this.searchTerm = e.target.value;
    }

    handleSizeChange(e) {
        this.iconSize = parseInt(e.target.value);
    }

    render() {
        const filteredIcons = this.getFilteredIcons();

        return html`
            <style>
                a:after {
                    ${getIconCSS('envelope')};
                }
            </style>
            <div class="content">
                <h2>Icons</h2>
                <div class="control">
                    <p style="text-decoration: underline">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <p style="font-size: 2em;">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <p style="font-size: 2em; color:var(--dbp-warning);">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <span style="background-color: #000">
                        <a href="#" style=" color: #fff">foobar</a>
                    </span>
                    <p style="font-size: 2em; color:var(--dbp-warning);">
                        Foo
                        <dbp-icon name="information" aria-label="Information icon"></dbp-icon>
                        bar
                    </p>
                    <br />

                    ${new Array(100).fill(0).map(
                        (i) => html`
                            <dbp-icon
                                aria-label="A happy face icon"
                                style="color:var(--dbp-success); width: 50px; height: 50px; border: #000 solid 1px"
                                name="happy"></dbp-icon>
                        `,
                    )}
                </div>

                <h2>All Available Icons</h2>

                <div class="search-and-size">
                    <div class="search-box">
                        <input
                            type="text"
                            placeholder="Search icons..."
                            .value="${this.searchTerm}"
                            @input="${this.handleSearchInput}"
                            aria-label="Search icons" />
                        <div class="icon-count">
                            Showing ${filteredIcons.length} of ${ICONS.length} icons
                        </div>
                    </div>

                    <div class="size-control">
                        <label for="icon-size-slider">Icon Size: ${this.iconSize}px</label>
                        <div class="slider-container">
                            <input
                                id="icon-size-slider"
                                type="range"
                                min="16"
                                max="128"
                                step="4"
                                .value="${this.iconSize}"
                                @input="${this.handleSizeChange}"
                                aria-label="Icon size" />
                            <span class="size-value">${this.iconSize}px</span>
                        </div>
                    </div>
                </div>

                ${filteredIcons.length > 0
                    ? html`
                          <div class="icon-grid">
                              ${filteredIcons.map(
                                  (iconName) => html`
                                      <div
                                          class="icon-item"
                                          @click="${() => navigator.clipboard.writeText(iconName)}">
                                          <lazy-load>
                                              <div
                                                  slot="placeholder"
                                                  style="width: ${this.iconSize}px; height: ${this
                                                      .iconSize}px;">
                                                  awdad
                                              </div>
                                              <dbp-icon
                                                  name="${iconName}"
                                                  aria-label="${iconName} icon"
                                                  style="width: ${this.iconSize}px; height: ${this
                                                      .iconSize}px;"></dbp-icon>
                                          </lazy-load>

                                          <span class="icon-name">${iconName}</span>
                                      </div>
                                  `,
                              )}
                          </div>
                      `
                    : html`
                          <div class="no-results">No icons found matching "${this.searchTerm}"</div>
                      `}
            </div>
        `;
    }
}
