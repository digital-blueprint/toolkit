import {i18n} from './i18n.js';
import {html, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonStyles from 'vpu-common/styles';
import {LitElement} from "lit-element";
import {Icon, EventBus} from 'vpu-common';
import {LoginStatus} from './util.js';

export class AuthButton extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
        this.lang = 'de';
        this.showProfile = false;
        this.showImage = false;
        this._loginData = {};

        this.closeDropdown = this.closeDropdown.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    static get scopedElements() {
        return {
            'vpu-icon': Icon,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
            showProfile: { type: Boolean, attribute: 'show-profile' },
            showImage: { type: Boolean, attribute: 'show-image' },
            _loginData: { type: Object, attribute: false },
        };
    }

    onWindowResize() {
        this.updateDropdownWidth();
    }

    connectedCallback() {
        super.connectedCallback();

        this._bus = new EventBus();
        this._bus.subscribe('auth-update', (data) => {
            this._loginData = data;
        });

        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('click', this.closeDropdown);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.onWindowResize);
        this._bus.close();
        document.removeEventListener('click', this.closeDropdown);
        super.disconnectedCallback();
    }

    /**
     * Set the dropdown width to almost the width of the web component
     * We need to set the width manually because a percent width is in relation to the viewport
     */
    updateDropdownWidth() {
        const dropdown = this.shadowRoot.querySelector("div.dropdown-menu");

        if (!dropdown) {
            return;
        }

        let viewportOffset = this.getBoundingClientRect();
        let spaceToRIght = window.innerWidth - viewportOffset.left;
        dropdown.setAttribute("style", `width: ${spaceToRIght - 20}px`);
    }

    onLoginClicked(e) {
        this._bus.publish('auth-login');
        e.preventDefault();
    }

    onLogoutClicked(e) {
        this._bus.publish('auth-logout');
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
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
                color: currentColor;
                cursor: pointer;
                text-decoration: none;
            }

            img {
                border-width: var(--vpu-border-width);
                border-color: var(--vpu-dark);
                border-style: solid;
            }

            .dropdown.is-active .dropdown-menu, .dropdown.is-hoverable:hover .dropdown-menu {
                display: block;
            }

            .dropdown-menu {
                display: none;
                min-width: 5em;
                max-width: 25em;
                position: absolute;
                z-index: 20;
                border: solid 1px black;
                border-radius: var(--vpu-border-radius);
                overflow: hidden;
                background-color: white;
            }

            .dropdown-content {
                background-color: white;
                padding-bottom: 0.5rem;
                padding-top: 0.5rem;
            }

            .dropdown-content img {
                max-width: 120px;
            }

            .menu a {
                /*padding: 0.3em;*/
                font-weight: 400;
                color: #000;
                display: block;
                text-decoration: none;
            }

            .menu a:hover {
                color: #E4154B;
            }

            .menu a.selected { color: white; background-color: black; }

            .dropdown-item {
                color: #4a4a4a;
                display: block;
                font-size: 0.875rem;
                line-height: 1.5;
                padding: 0.375rem 1rem;
                position: relative;
            }

              .dropdown, img.login {
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
                transition: background-color 0.15s, color 0.15s;
            }

            .login-button:hover {
                background-color: var(--vpu-dark);
                color: var(--vpu-light);
                cursor: pointer;
                transition: none;
            }

            .login-box {
                display: flex;
                align-items: center;
            }

            .login-box:hover svg path {
                fill: var(--vpu-light);
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
                margin-right: 0.5em
            }
        `;
    }

    setChevron(name) {
        const chevron = this.shadowRoot.querySelector("#menu-chevron-icon");
        if (chevron !== null) {
            chevron.name = name;
        }
    }

    onDropdownClick(event) {
        event.stopPropagation();
        event.currentTarget.classList.toggle('is-active');
        this.setChevron(event.currentTarget.classList.contains('is-active') ? 'chevron-up' : 'chevron-down');
        this.updateDropdownWidth();
    }

    closeDropdown() {
        var dropdowns = this.shadowRoot.querySelectorAll('.dropdown');
        dropdowns.forEach(function (el) {
            el.classList.remove('is-active');
        });
        this.setChevron('chevron-down');
    }

    onProfileClicked(event) {
        event.preventDefault();
        const profileEvent = new CustomEvent("vpu-auth-profile", {
            "detail": "Profile event",
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(profileEvent);
    }

    renderLoggedIn() {
        const person = this._loginData.person;
        const imageURL = (this.showImage && person && person.image) ? person.image : null;

        return html`
            <div class="dropdown" @click="${this.onDropdownClick}">
                <a href="#">
                    <div class="dropdown-trigger login-button">
                        <div class="name">${this._loginData.name}</div>
                        <vpu-icon class="menu-icon" name="chevron-down" id="menu-chevron-icon"></vpu-icon>
                    </div>
                </a>
                <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div class="dropdown-content" @blur="${this.closeDropdown}">
                        ${imageURL ? html`<div class="dropdown-item"><img alt="" src="${imageURL}"></div>` : ''}
                        <div class="menu">
                            ${this.showProfile ? html`<a href="#" @click="${this.onProfileClicked}" class="dropdown-item">${i18n.t('profile')}</a>` :''}
                            <a href="#" @click="${this.onLogoutClicked}" class="dropdown-item">${i18n.t('logout')}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoggedOut() {
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
                    <div class="icon">${unsafeHTML(loginSVG)}</div>
                    <div class="label">${i18n.t('login')}</div>
                </div>
            </a>
        `;
    }

    render() {
        const loggedIn = (this._loginData.status === LoginStatus.LOGGED_IN);
        return html`
            <div class="authbox">
                ${loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
            </div>
        `;
    }
}