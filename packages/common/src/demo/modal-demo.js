import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import {Modal} from '../modal.js';
import * as commonStyles from '../styles.js';
import {Icon, Button, LangMixin} from '../index.js';

export class DbpModalDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.infoExpanded = false;
        /** @type {ResizeObserver | null} */
        this.footerResizeObserver = null;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-button': Button,
            'dbp-modal': Modal,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            infoExpanded: {state: true},
        };
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

            .content h3 {
                color: var(--dbp-content);
                font-weight: 600;
                line-height: 1.125;
                margin-top: 1.5em;
                font-size: 1.17em;
                margin-bottom: 0.5em;
            }

            .control {
                margin-bottom: 1.5rem;
            }

            .control:not(:last-child) {
                margin-bottom: 0.5rem;
            }

            dbp-modal .header {
                display: flex;
                margin-bottom: 1em;
            }

            dbp-modal .footer-menu {
                margin: 0;
                padding: 0;
                gap: 1em;
                padding-top: 1em;
                display: flex;
                justify-content: flex-end;
            }

            .modal--info .footer-menu {
                flex-wrap: wrap;
            }

            .modal--info .toggle-button {
                flex: 1 0 auto;
            }

            .modal--info .footer-actions {
                display: flex;
                flex: 0 0 auto;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 1em;
                max-width: 100%;
                margin-left: auto;
            }

            .modal--info .footer-menu--wrapped .toggle-button {
                --dbp-button-width: 100%;
            }

            .modal--info .footer-menu--wrapped .footer-actions {
                width: 100%;
                margin-left: 0;
            }

            .modal--info .footer-menu--wrapped .footer-actions dbp-button {
                flex: 1 1 0;
                --dbp-button-width: 100%;
            }

            .modal--basic {
                --dbp-modal-content-min-height: 6em;
                --dbp-modal-max-width: 650px;
            }

            .modal--basic .header h3 {
                margin: 0 1em 0 0;
            }

            .modal--long {
                --dbp-modal-header-height: 110px;
                --dbp-modal-footer-height: 3em;
                --dbp-modal-max-width: 50vw;
                --dbp-modal-max-height: 80vh;
            }

            .modal--long .header h4,
            .modal--long .header h3 {
                margin: 0 1em 0 0;
            }

            .modal--sticky {
                --dbp-modal-header-height: 110px;
                --dbp-modal-footer-height: 3em;
                --dbp-modal-max-width: 50vw;
                --dbp-modal-max-height: 80vh;
            }

            .modal--sticky .header h4,
            .modal--sticky .header h3 {
                margin: 0 1em 0 0;
            }

            .modal--info {
                --dbp-modal-content-min-height: 6em;
                --dbp-info-modal-base-width: 650px;
                --dbp-info-modal-panel-width: 350px;
            }

            .modal--info h2 {
                margin: 0px;
                padding: var(--dbp-modal-title-padding, 0.25em 0 0 0);
                font-weight: 300;
            }

            .panel-button {
                display: flex;
                align-items: center;
                background-color: var(--dbp-background);
                border: none;
                gap: 0.5em;
                cursor: pointer;
            }

            .panel-button dbp-icon {
                color: var(--dbp-accent);
                height: 1.5em;
                width: 1.5em;
            }

            .modal--info .chevron--mobile {
                display: none;
            }

            @media (max-width: 999px) {
                .modal--info .chevron--desktop {
                    display: none;
                }

                .modal--info .chevron--mobile {
                    display: inline-block;
                }
            }

            .header {
                display: flex;
                align-items: center;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        const footer = this._('#modal-info-panel .footer-menu');
        if (footer && this.footerResizeObserver) {
            this.footerResizeObserver.observe(footer);
        }
    }

    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        const footer = this._('#modal-info-panel .footer-menu');
        if (footer) {
            this.footerResizeObserver = new ResizeObserver(() => this.updateInfoFooterLayout());
            this.footerResizeObserver.observe(footer);
        }
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('infoExpanded')) {
            this.updateInfoFooterLayout();
        }
    }

    disconnectedCallback() {
        this.footerResizeObserver?.disconnect();
        super.disconnectedCallback();
    }

    updateInfoFooterLayout() {
        const footer = this._('#modal-info-panel .footer-menu');
        if (!footer || !footer.clientWidth) {
            return;
        }

        // Measure the natural layout so the wrapped class can be removed when space is available.
        footer.classList.remove('footer-menu--wrapped');
        const toggle = footer.querySelector('.toggle-button');
        const actions = footer.querySelector('.footer-actions');
        if (!toggle || !actions) {
            return;
        }
        footer.classList.toggle(
            'footer-menu--wrapped',
            actions.getBoundingClientRect().top > toggle.getBoundingClientRect().top,
        );
    }

    toggleInfoPanel() {
        const modal = this._('#modal-info-panel');
        modal.toggleInfoPanel();
        this.infoExpanded = modal.infoExpanded;
    }

    render() {
        return html`
            <div class="content">
                <h2>Modal component</h2>

                <div class="control">
                    <h3>Basic Modal (with fade-in effect)</h3>
                    <dbp-button
                        type="is-primary"
                        id="modal-trigger-basic"
                        value="open modal"
                        no-spinner-on-click
                        @click="${() => this._('#my-modal-basic').open()}"></dbp-button>

                    <dbp-modal
                        id="my-modal-basic"
                        class="modal modal--basic"
                        modal-id="modal-basic"
                        title="The title of the modal"
                        subscribe="lang">
                        <div slot="header" class="header">
                            <h3>Person name</h3>
                            <dbp-icon name="cog"></dbp-icon>
                        </div>
                        <div slot="content">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <menu slot="footer" class="footer-menu">
                            <dbp-button
                                @click="${() => {
                                    this._('#my-modal-basic').close();
                                }}">
                                Cancel
                            </dbp-button>
                            <dbp-button type="is-primary">Submit</dbp-button>
                        </menu>
                    </dbp-modal>
                </div>

                <div class="control">
                    <h3>Modal with long content</h3>
                    <dbp-button
                        type="is-primary"
                        id="modal-trigger-long"
                        value="open modal"
                        no-spinner-on-click
                        @click="${() => this._('#my-modal-long').open()}"></dbp-button>

                    <dbp-modal
                        id="my-modal-long"
                        class="modal modal--long"
                        modal-id="modal-long"
                        title="The title of the modal"
                        subscribe="lang">
                        <div slot="header" class="header">
                            <div class="top">
                                <h3>Person name</h3>
                                <dbp-icon name="cog"></dbp-icon>
                            </div>
                            <div class="bottom">
                                <h4>Other Person name</h4>
                                <dbp-icon name="ambulance"></dbp-icon>
                            </div>
                        </div>
                        <div slot="content">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Exercitation</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Consectetur</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h5>Eiusmod</h5>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Incididunt</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h5>Consequat</h5>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <menu slot="footer" class="footer-menu">
                            <dbp-button
                                @click="${() => {
                                    this._('#my-modal-long').close();
                                }}">
                                Cancel
                            </dbp-button>
                            <dbp-button type="is-primary">Submit</dbp-button>
                        </menu>
                    </dbp-modal>
                </div>

                <div class="control">
                    <h3>Modal with sticky footer</h3>
                    <dbp-button
                        type="is-primary"
                        id="modal-trigger-sticky"
                        value="open modal"
                        no-spinner-on-click
                        @click="${() => this._('#my-modal-sticky').open()}"></dbp-button>

                    <dbp-modal
                        id="my-modal-sticky"
                        sticky-footer
                        class="modal modal--sticky"
                        modal-id="modal-sticky"
                        title="The title of the modal"
                        subscribe="lang">
                        <div slot="header" class="header">
                            <div class="top">
                                <h3>Person name</h3>
                                <dbp-icon name="cog"></dbp-icon>
                            </div>
                            <div class="bottom">
                                <h4>Other Person name</h4>
                                <dbp-icon name="ambulance"></dbp-icon>
                            </div>
                        </div>
                        <div slot="content">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Exercitation</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Consectetur</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h5>Eiusmod</h5>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h4>Incididunt</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <h5>Consequat</h5>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <menu slot="footer" class="footer-menu">
                            <dbp-button
                                @click="${() => {
                                    this._('#my-modal-sticky').close();
                                }}">
                                Cancel
                            </dbp-button>
                            <dbp-button type="is-primary">Submit</dbp-button>
                        </menu>
                    </dbp-modal>

                    <h3>Modal with info panel</h3>
                    <dbp-button
                        type="is-primary"
                        value="open modal"
                        no-spinner-on-click
                        @click="${() => this._('#modal-info-panel').open()}"></dbp-button>
                    <dbp-modal
                        id="modal-info-panel"
                        class="modal modal--info"
                        info-panel
                        modal-id="modal-info"
                        title="Modal with info panel"
                        subscribe="lang"
                        @dbp-modal-closed="${() => (this.infoExpanded = false)}">
                        <div slot="header" class="header">
                            <p>Click button in footer to expand the info panel</p>
                        </div>
                        <div slot="info-panel">
                            <div class="info-panel-title">
                                <button
                                    class="button panel-button"
                                    @click="${() => this.toggleInfoPanel()}">
                                    <dbp-icon
                                        class="chevron--desktop"
                                        name="chevron-left"></dbp-icon>
                                    <dbp-icon class="chevron--mobile" name="chevron-up"></dbp-icon>
                                    <h2>Panel Headline</h2>
                                </button>
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <menu slot="footer" class="footer-menu">
                            <dbp-button
                                class="toggle-button"
                                no-spinner-on-click
                                @click="${() => this.toggleInfoPanel()}">
                                ${this.infoExpanded ? 'Collapse info panel' : 'Expand info panel'}
                                <dbp-icon
                                    class="chevron--desktop"
                                    name="${this.infoExpanded ? 'chevron-left' : 'chevron-right'}"></dbp-icon>
                                <dbp-icon
                                    class="chevron--mobile"
                                    name="${this.infoExpanded ? 'chevron-up' : 'chevron-down'}"></dbp-icon>
                            </dbp-button>
                            <div class="footer-actions">
                                <dbp-button
                                    @click="${() => {
                                        this._('#modal-info-panel').close();
                                    }}">
                                    Cancel
                                </dbp-button>
                                <dbp-button type="is-primary">Submit</dbp-button>
                            </div>
                        </menu>
                    </dbp-modal>
                </div>
            </div>
        `;
    }
}
