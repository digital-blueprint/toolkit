import {i18n} from './i18n.js';
import {html, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import JSONLD from 'vpu-common/jsonld'
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import * as events from 'vpu-common/events.js';
import 'vpu-common/vpu-icon.js';
import VPULitElement from 'vpu-common/vpu-lit-element';


const LoginStatus = Object.freeze({
    UNKNOWN: 'unknown',
    LOGGING_IN: 'logging-in',
    LOGGED_IN: 'logged-in',
    LOGGING_OUT: 'logging-out',
    LOGGED_OUT: 'logged-out',
});


/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Dispatches an event `vpu-auth-init` and sets some global variables:
 *   window.VPUAuthSubject: Keycloak username
 *   window.VPUAuthToken: Keycloak token to send with your requests
 *   window.VPUUserFullName: Full name of the user
 *   window.VPUPersonId: Person identifier of the user
 *   window.VPUPerson: Person json object of the user (optional, enable by setting the `load-person` attribute,
 *                     which will dispatch a `vpu-auth-person-init` event when loaded)
 */
class VPUAuth extends VPULitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.forceLogin = false;
        this.loadPerson = false;
        this.clientId = "";
        this.keyCloakInitCalled = false;
        this._keycloak = null;
        this.token = "";
        this.subject = "";
        this.name = "";
        this.personId = "";
        this.loggedIn = false;
        this.rememberLogin = false;
        this.person = null;

        const _getLoginData = () => {
            const message = {
                status: this._loginStatus,
                token: this.token,
            };
            console.log('Login status: ' + this._loginStatus);
            return message;
        };

        this._loginStatus = LoginStatus.UNKNOWN;
        this._emitter = new events.EventEmitter('vpu-auth-update', 'vpu-auth-update-request');
        this._emitter.registerCallback(_getLoginData);

        // Create the events
        this.initEvent = new CustomEvent("vpu-auth-init", { "detail": "KeyCloak init event", bubbles: true, composed: true });
        this.personInitEvent = new CustomEvent("vpu-auth-person-init", { "detail": "KeyCloak person init event", bubbles: true, composed: true });
        this.profileEvent = new CustomEvent("vpu-auth-profile", { "detail": "Profile event", bubbles: true, composed: true });
        this.keycloakDataUpdateEvent = new CustomEvent("vpu-auth-keycloak-data-update", { "detail": "KeyCloak data was updated", bubbles: true, composed: true });

        this.closeDropdown = this.closeDropdown.bind(this);
    }

    _setLoginStatus(status, force) {
        if (this._loginStatus === status && !force)
            return;
        this._loginStatus = status;
        this._emitter.emit();
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            forceLogin: { type: Boolean, attribute: 'force-login' },
            rememberLogin: { type: Boolean, attribute: 'remember-login' },
            loggedIn: { type: Boolean},
            loadPerson: { type: Boolean, attribute: 'load-person' },
            clientId: { type: String, attribute: 'client-id' },
            name: { type: String, attribute: false },
            token: { type: String, attribute: false },
            subject: { type: String, attribute: false },
            personId: { type: String, attribute: false },
            keycloak: { type: Object, attribute: false },
            person: { type: Object, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const href = window.location.href;

        if (this.rememberLogin && sessionStorage.getItem('vpu-logged-in')) {
            this.forceLogin = true;
        }

        // load Keycloak if we want to force the login or if we were redirected from the Keycloak login page
        if (this.forceLogin || (href.search('[&#]state=') >= 0 && href.search('[&#]session_state=') >= 0)) {
            this.loadKeycloak();
        } else {
            this._setLoginStatus(LoginStatus.LOGGED_OUT);
        }

        const that = this;

        this.updateComplete.then(()=>{
            window.onresize = () => {
                that.updateDropdownWidth();
            };
        });

        document.addEventListener('click', this.closeDropdown);
    }

    /**
     * Set the dropdown width to almost the width of the web component
     * We need to set the width manually because a percent width is in relation to the viewport
     */
    updateDropdownWidth() {
        const dropdown = this._("div.dropdown-menu");

        if (!dropdown) {
            return;
        }

        dropdown.setAttribute("style", `width: ${this.offsetWidth - 5}px`);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.closeDropdown);
        super.disconnectedCallback();
    }

    loadKeycloak() {
        const that = this;

        if (!this.keyCloakInitCalled) {
            // inject Keycloak javascript file
            const script = document.createElement('script');
            script.type = 'text/javascript';
            //script.async = true;
            script.onload = () => {
                that.keyCloakInitCalled = true;

                that._keycloak = Keycloak({
                    url: 'https://auth-dev.tugraz.at/auth',
                    realm: 'tugraz',
                    clientId: that.clientId,
                });

                this._setLoginStatus(LoginStatus.LOGGING_IN);

                // See: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
                that._keycloak.init().success((authenticated) => {


                    if (!authenticated) {
                        // set locale of Keycloak login page
                        that._keycloak.login({kcLocale: that.lang});

                        return;
                    }

                    that.loggedIn = false;
                    that.updateKeycloakData();
                    that.dispatchInitEvent();

                    if (that.loadPerson) {
                        JSONLD.initialize(commonUtils.getAPiUrl(), (jsonld) => {
                            // find the correct api url for the current person
                            // we are fetching the logged-in person directly to respect the REST philosophy
                            // see: https://github.com/api-platform/api-platform/issues/337
                            const apiUrl = jsonld.getApiUrlForEntityName("Person") + '/' + that.personId;

                            fetch(apiUrl, {
                                headers: {
                                    'Content-Type': 'application/ld+json',
                                    'Authorization': 'Bearer ' + that.token,
                                },
                            })
                            .then(response => response.json())
                            .then((person) => {
                                that.person = person;
                                window.VPUPerson = person;
                                that.dispatchPersonInitEvent();
                            });
                        }, {}, that.lang);
                    }

                }).error(() => {
                    this._setLoginStatus(LoginStatus.LOGGED_OUT);
                    console.error('Keycloak failed to initialize!');
                });

                // auto-refresh token
                that._keycloak.onTokenExpired = function() {
                    that._keycloak.updateToken(5).success(function(refreshed) {
                        if (refreshed) {
                            console.log('Token was successfully refreshed');
                            that.updateKeycloakData();
                        } else {
                            console.log('Token is still valid');
                        }
                    }).error(function() {
                        console.log('Failed to refresh the token, or the session has expired');
                    });
                }
            };

            // https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_a
            script.src = '//auth-dev.tugraz.at/auth/js/keycloak.min.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    login(e) {
        this.loadKeycloak();
    }

    logout(e) {
        this._setLoginStatus(LoginStatus.LOGGING_OUT);
        sessionStorage.removeItem('vpu-logged-in');
        this._keycloak.logout();
    }

    /**
     * Dispatches the init event
     */
    dispatchInitEvent() {
        this.loggedIn = true;
        this.dispatchEvent(this.initEvent);
    }

    /**
     * Dispatches the person init event
     */
    dispatchPersonInitEvent() {
        this.dispatchEvent(this.personInitEvent);
    }

    /**
     * Dispatches the profile event
     */
    dispatchProfileEvent() {
        this.dispatchEvent(this.profileEvent);
    }

    /**
     * Dispatches the keycloak data update event
     */
    dispatchKeycloakDataUpdateEvent() {
        this.dispatchEvent(this.keycloakDataUpdateEvent);
    }

    updateKeycloakData() {
        this.name = this._keycloak.idTokenParsed.name;
        this.token = this._keycloak.token;
        this.subject = this._keycloak.subject;
        this.personId = this._keycloak.idTokenParsed.preferred_username;

        window.VPUAuthSubject = this.subject;
        window.VPUAuthToken = this.token;
        window.VPUUserFullName = this.name;
        window.VPUPersonId = this.personId;

        this.dispatchKeycloakDataUpdateEvent();

        this._setLoginStatus(LoginStatus.LOGGED_IN, true);
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
            if (propName == "loggedIn") {
                if (this.loggedIn)
                    sessionStorage.setItem('vpu-logged-in', true);
                else
                    sessionStorage.removeItem('vpu-logged-in');
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

            .dropdown.is-active .dropdown-menu, .dropdown.is-hoverable:hover .dropdown-menu {
                display: block;
            }

            .dropdown-menu {
                display: none;
                min-width: 8em;
                padding-top: 4px;
                position: absolute;
                z-index: 20;
                border: solid 1px black;
                border-radius: var(--vpu-border-radius);
                overflow: hidden;
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

            .dropdown-trigger {
                white-space: nowrap;
            }

            vpu-icon {
                height: 1em;
                width: 1em;
                vertical-align: -0.1rem;
            }

            .loginbox svg {
                width: 1.2em;
                height: 1.2em;
                top: 0.15em;
                position: relative;
            }

            .loginbox {
                display: flex;

                align-items: center;
                padding: 0 0.1em;
                transition: background-color 0.15s, color 0.15s;
            }

            .loginbox:hover {
                background-color: var(--vpu-dark);
                color: var(--vpu-light);
                cursor: pointer;
                transition: none;
            }

            .loginbox:hover svg path {
                fill: var(--vpu-light);
            }

            .loginbox .icon, .authbox {
                display: inline-block;
            }

            .loginbox .label {
                padding-left: 0.2em;
            }
        `;
    }

    onDropdownClick(event) {
        event.stopPropagation();
        event.currentTarget.classList.toggle('is-active');
        const chevron = this.shadowRoot.querySelector("#menu-chevron-icon");
        if (chevron !== null) {
            chevron.name = event.currentTarget.classList.contains('is-active') ? 'chevron-up' : 'chevron-down';
        }
        this.updateDropdownWidth();
    }

    closeDropdown() {
        var dropdowns = this.shadowRoot.querySelectorAll('.dropdown');
        dropdowns.forEach(function (el) {
            el.classList.remove('is-active');
        });
    }

    renderLoggedIn() {
        const imageURL = (this.person && this.person.image) ? this.person.image : null;

        return html`
            <div class="dropdown" @click="${this.onDropdownClick}">
                <div class="dropdown-trigger">
                    <span>${this.name}</span>
                    <vpu-icon name="chevron-down" id="menu-chevron-icon"></vpu-icon>
                </div>
                <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div class="dropdown-content">
                        ${imageURL ? html`<img alt="" src="${imageURL}" class="dropdown-item">` : ''}
                        <div class="menu">
                            <a href="#" @click="${(e) => {e.preventDefault(); this.dispatchProfileEvent();}}" class="dropdown-item">${i18n.t('profile')}</a>
                            <a href="#" @click="${this.logout}" class="dropdown-item">${i18n.t('logout')}</a>
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
            <div class="loginbox" @click="${this.login}">
                <div class="icon">${unsafeHTML(loginSVG)}</div>
                <div class="label">${i18n.t('login')}</div>
            </div>
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-auth-src');
        return html`
            <div class="authbox">
                ${this.loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-auth', VPUAuth);
