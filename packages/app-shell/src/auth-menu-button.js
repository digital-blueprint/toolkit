import {createInstance} from './i18n.js';
import {html, css} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {Icon} from '@dbp-toolkit/common';
import {AdapterLitElement} from '@dbp-toolkit/common';
import {LoginStatus} from '@dbp-toolkit/auth/src/util';

export class AuthMenuButton extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.auth = {};

        this.closeDropdown = this.closeDropdown.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            auth: {type: Object},
        };
    }

    onWindowResize() {
        this.updateDropdownWidth();
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('click', this.closeDropdown);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('click', this.closeDropdown);
        super.disconnectedCallback();
    }

    /**
     * Set the dropdown width to almost the width of the web component
     * We need to set the width manually because a percent width is in relation to the viewport
     */
    updateDropdownWidth() {
        const dropdown = this.shadowRoot.querySelector('div.dropdown-menu');

        if (!dropdown) {
            return;
        }

        let viewportOffset = this.getBoundingClientRect();
        let spaceToRIght = window.innerWidth - viewportOffset.left;
        dropdown.setAttribute('style', `width: ${spaceToRIght - 20}px`);
    }

    onLoginClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_IN);
        e.preventDefault();
    }

    onLogoutClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_OUT);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}

            :host {
                display: inline-block;
            }

            a {
                color: var(--dbp-content);
                fill: var(--dbp-content);
                cursor: pointer;
                text-decoration: none;
                display: block;
            }

            input::-moz-focus-inner {
                border: 0;
            }

            :focus-visible {
                outline: none !important;
                outline-width: 0 !important;
                box-shadow: none;
                -moz-box-shadow: none;
                -webkit-box-shadow: none;
                box-shadow: 0px 0px 4px 2px var(--dbp-primary);
            }

            .dropdown.is-active .dropdown-menu,
            .dropdown.is-hoverable:hover .dropdown-menu {
                display: block;
            }

            .dropdown-menu {
                display: none;
                min-width: 5em;
                max-width: 25em;
                position: absolute;
                z-index: 20;
                border: var(--dbp-border);
                border-radius: 0px;
                overflow: hidden;
                background-color: var(--dbp-background);
            }

            .dropdown-content {
                padding-bottom: 0.5rem;
                padding-top: 0.5rem;
            }

            .menu a {
                /*padding: 0.3em;*/
                font-weight: 400;
                color: var(--dbp-content);
                display: block;
                text-decoration: none;
            }

            .menu a:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
            }

            .menu a.selected {
                color: var(--dbp-on-secondary-surface);
                background-color: var(--dbp-secondary-surface);
            }

            .dropdown-item {
                color: var(--dbp-muted);
                display: block;
                font-size: 0.875rem;
                line-height: 1.5;
                padding: 0.375rem 1rem;
                margin-left: 0.5em;
                margin-right: 0.5em;
                padding-left: 0.5em;
                padding-right: 0.5em;
                position: relative;
            }

            .dropdown {
                cursor: pointer;
            }

            a.dropdown-item {
                width: initial !important;
            }

            .main-button {
                min-width: 150px;
            }

            .menu-icon {
                height: 1em;
                width: 1em;
                vertical-align: -0.1rem;
            }

            .login-box svg {
                width: 1.1em;
                height: 1.1em;
                display: flex;
            }

            .login-button {
                padding: 0.3em 0.4em;
                transition:
                    background-color 0.15s,
                    color 0.15s;
            }

            .login-button:hover {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
                cursor: pointer;
                transition: none;
            }

            .login-box {
                display: flex;
                align-items: center;
            }

            .login-box:hover svg path {
                fill: var(--dbp-hover-color);
            }

            .login-box .label {
                padding-left: 0.2em;
            }

            .dropdown-trigger {
                display: flex;
                align-items: center;
            }

            .dropdown-trigger .name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 0;
                margin-right: 0.5em;
            }
        `;
    }

    setChevron(name) {
        const chevron = this.shadowRoot.querySelector('#menu-chevron-icon');
        if (chevron !== null) {
            chevron.name = name;
        }
    }

    onDropdownClick(event) {
        event.stopPropagation();
        event.currentTarget.classList.toggle('is-active');
        this.setChevron(
            event.currentTarget.classList.contains('is-active') ? 'chevron-up' : 'chevron-down',
        );
        this.updateDropdownWidth();
    }

    closeDropdown() {
        var dropdowns = this.shadowRoot.querySelectorAll('.dropdown');
        dropdowns.forEach(function (el) {
            el.classList.remove('is-active');
        });
        this.setChevron('chevron-down');
    }

    renderLoggedIn() {
        const i18n = this._i18n;

        return html`
            <div class="dropdown" @click="${this.onDropdownClick}">
                <a href="#">
                    <div class="dropdown-trigger login-button">
                        <div class="name">${this.auth['user-full-name']}</div>
                        <dbp-icon
                            class="menu-icon"
                            name="chevron-down"
                            id="menu-chevron-icon"></dbp-icon>
                    </div>
                </a>
                <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div class="dropdown-content" @blur="${this.closeDropdown}">
                        <div class="menu">
                            <a href="#" @click="${this.onLogoutClicked}" class="dropdown-item">
                                ${i18n.t('logout')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoggedOut() {
        const i18n = this._i18n;
        let loginSVG = `
        <svg
           viewBox="0 0 100 100"
           y="0px"
           x="0px"
           id="icon"
           role="img"
           version="1.1">
        <g
           id="g6">
            <path
           style="stroke-width:1.33417916"
           id="path2"
           d="m 42.943908,38.894934 5.885859,6.967885 H 5.4215537 c -1.8393311,0 -3.4334181,1.741972 -3.4334181,4.064599 0,2.322628 1.4714649,4.064599 3.4334181,4.064599 H 48.829767 L 42.943908,60.9599 c -1.348843,1.596808 -1.348843,4.064599 0,5.661406 1.348843,1.596808 3.433418,1.596808 4.782261,0 L 61.705085,49.927418 47.726169,33.378693 c -1.348843,-1.596806 -3.433418,-1.596806 -4.782261,0 -1.348843,1.596807 -1.348843,4.064599 0,5.516241 z" />
            <path
           id="path4"
           d="m 50,2.3007812 c -18.777325,0 -35.049449,10.9124408 -42.8261719,26.7246098 H 13.390625 C 20.672112,16.348362 34.336876,7.8007812 50,7.8007812 73.3,7.8007812 92.300781,26.7 92.300781,50 92.300781,73.3 73.3,92.300781 50,92.300781 c -15.673389,0 -29.345175,-8.60579 -36.623047,-21.326172 H 7.1640625 C 14.942553,86.8272 31.242598,97.800781 50.099609,97.800781 76.399609,97.800781 97.900391,76.4 97.900391,50 97.800391,23.7 76.3,2.3007812 50,2.3007812 Z" />
        </g>
        </svg>
        `;

        return html`
            <a href="#" @click="${this.onLoginClicked}">
                <div class="login-box login-button">
                    <div class="icon" aria-hidden="true">${unsafeHTML(loginSVG)}</div>
                    <div class="label">${i18n.t('login')}</div>
                </div>
            </a>
        `;
    }

    render() {
        const loggedIn = this.auth['login-status'] === 'logged-in';
        return html`
            <div class="authbox">${loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}</div>
        `;
    }
}
