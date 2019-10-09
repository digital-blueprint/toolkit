import {i18n} from './i18n.js';
import {html, css, LitElement} from 'lit-element';
import JSONLD from 'vpu-common/jsonld'
import * as commonUtils from 'vpu-common/utils';
import 'vpu-common/vpu-icon.js';

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
class VPUAuth extends LitElement {
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
        this.rememberLogin = false
        this.person = null;

        // Create the events
        this.initEvent = new CustomEvent("vpu-auth-init", { "detail": "KeyCloak init event", bubbles: true, composed: true });
        this.personInitEvent = new CustomEvent("vpu-auth-person-init", { "detail": "KeyCloak person init event", bubbles: true, composed: true });
        this.profileEvent = new CustomEvent("vpu-auth-profile", { "detail": "Profile event", bubbles: true, composed: true });
        this.keycloakDataUpdateEvent = new CustomEvent("vpu-auth-keycloak-data-update", { "detail": "KeyCloak data was updated", bubbles: true, composed: true });

        this.closeDropdown = this.closeDropdown.bind(this);
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
        }

        this.updateComplete.then(()=>{
        });

        document.addEventListener('click', this.closeDropdown);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.closeDropdown);
        super.disconnectedCallback();
    }

    loadKeycloak() {
        const that = this;
        console.log("loadKeycloak");

        if (!this.keyCloakInitCalled) {
            // inject Keycloak javascript file
            const script = document.createElement('script');
            script.type = 'text/javascript';
            //script.async = true;
            script.onload = function () {
                that.keyCloakInitCalled = true;

                that._keycloak = Keycloak({
                    url: 'https://auth-dev.tugraz.at/auth',
                    realm: 'tugraz',
                    clientId: that.clientId,
                });

                // See: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
                that._keycloak.init().success((authenticated) => {
                    console.log(authenticated ? 'authenticated' : 'not authenticated!');
                    console.log(that._keycloak);

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

                }).error(function () {
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

        console.log("Bearer " + this.token);
        this.dispatchKeycloakDataUpdateEvent();
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
            ${commonUtils.getThemeCSS()}

            .dropdown.is-active .dropdown-menu, .dropdown.is-hoverable:hover .dropdown-menu {
                display: block;
            }

            .dropdown-menu {
                display: none;
                min-width: 12rem;
                padding-top: 4px;
                position: absolute;
                z-index: 20;
            }

            .dropdown-content {
                background-color: white;
                border-radius: var(--vpu-border-radius);
                box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
                padding-bottom: 0.5rem;
                padding-top: 0.5rem;
            }

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
        `;
    }

    onDropdownClick(event) {
        event.stopPropagation();
        event.currentTarget.classList.toggle('is-active');
        const chevron = this.shadowRoot.querySelector("#menu-chevron-icon");
        if (chevron !== null) {
            chevron.name = event.currentTarget.classList.contains('is-active') ? 'chevron-up' : 'chevron-down';
        }
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
                  ${imageURL ? html`<img src="${imageURL}" width="40%" height="40%" class="dropdown-item">` : ''}
                  <a href="#" @click="${(e) => {e.preventDefault(); this.dispatchProfileEvent();}}" class="dropdown-item">${i18n.t('profile')}</a>
                  <a href="#" @click="${this.logout}" class="dropdown-item">${i18n.t('logout')}</a>
                </div>
              </div>
            </div>
        `;
    }

    renderLoggedOut() {
        return html`
            <img src="/local/vpu-auth/icon_key_normal_tugprod.png"
                class="login"
                @click="${this.login}"
                onmouseover="this.setAttribute('src', '/local/vpu-auth/icon_key_hover_tugprod.png');"
                onmouseout="this.setAttribute('src', '/local/vpu-auth/icon_key_normal_tugprod.png');"
                title="${i18n.t('login')}" alt="${i18n.t('login')}">
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-auth-src');
        return html`
            <div>
            ${this.loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
            </div>
        `;
    }
}

commonUtils.defineCustomElement('vpu-auth', VPUAuth);
