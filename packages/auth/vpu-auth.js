import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';
import JSONLD from 'vpu-common/jsonld'
import utils from "./utils";

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

        // Create the events
        this.initEvent = new CustomEvent("vpu-auth-init", { "detail": "KeyCloak init event", bubbles: true });
        this.personInitEvent = new CustomEvent("vpu-auth-person-init", { "detail": "KeyCloak person init event", bubbles: true });
        this.keycloakDataUpdateEvent = new CustomEvent("vpu-auth-keycloak-data-update", { "detail": "KeyCloak data was updated", bubbles: true });
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            forceLogin: { type: Boolean, attribute: 'force-login' },
            loadPerson: { type: Boolean, attribute: 'load-person' },
            clientId: { type: String, attribute: 'client-id' },
            name: { type: String, attribute: false },
            token: { type: String, attribute: false },
            subject: { type: String, attribute: false },
            personId: { type: String, attribute: false },
            keycloak: { type: Object, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const href = window.location.href;

        // load Keycloak if we want to force the login or if we were redirected from the Keycloak login page
        if (this.forceLogin || (href.indexOf('#state=') > 0 && href.indexOf('&session_state=') > 0)) {
            this.loadKeycloak();
        }

        this.updateComplete.then(()=>{
        });
    }

    loadKeycloak() {
        const that = this;
        console.log("loadKeycloak");

        if (!this.keyCloakInitCalled) {
            // inject Keycloak javascript file
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                that.keyCloakInitCalled = true;

                that._keycloak = Keycloak({
                    url: 'https://auth-dev.tugraz.at/auth',
                    realm: 'tugraz',
                    clientId: that.clientId,
                });

                // See: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
                that._keycloak.init({onLoad: 'login-required'}).success(function (authenticated) {
                    console.log(authenticated ? 'authenticated' : 'not authenticated!');
                    console.log(that._keycloak);

                    that.setStateToLogin(true);
                    that.updateKeycloakData();
                    that.dispatchInitEvent();

                    if (that.loadPerson) {
                        JSONLD.initialize(utils.getAPiUrl(), (jsonld) => {
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
                                window.VPUPerson = person;
                                that.dispatchPersonInitEvent();
                            });
                        });
                    }

                }).error(function () {
                    console.log('Failed to initialize');
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
            script.src = '//auth-dev.tugraz.at/auth/js/keycloak.js';

            //Append it to the document header
            document.head.appendChild(script);
        }
    }

    login(e) {
        this.loadKeycloak();
    }

    logout(e) {
        this._keycloak.logout();
    }

    /**
     * Dispatches the init event
     */
    dispatchInitEvent() {
        this.setStateToLogin(false);
        // we need to use "window", because the event doens't seem to bubble if we use "this"
        window.dispatchEvent(this.initEvent);
    }

    setStateToLogin(state) {
        this.shadowRoot.querySelector('#login-block').style.display = state ? "flex" : "none";
        this.shadowRoot.querySelector('#logout-block').style.display = state ? "none" : "flex";
    }

    /**
     * Dispatches the person init event
     */
    dispatchPersonInitEvent() {
        // we need to use "window", because the event doens't seem to bubble if we use "this"
        window.dispatchEvent(this.personInitEvent);
    }

    /**
     * Dispatches the keycloak data update event
     */
    dispatchKeycloakDataUpdateEvent() {
        // we need to use "window", because the event doens't seem to bubble if we use "this"
        window.dispatchEvent(this.keycloakDataUpdateEvent);
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

    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
                #logout-block { display: none }
            </style>

            <div id="logout-block" class="columns is-vcentered">
                <div class="column">
                    ${this.name}
                </div>
                <div class="column">
                    <button @click="${this.logout}" class="button">${i18n.t('logout')}</button>
                </div>
            </div>

            <div id="login-block" class="columns is-vcentered">
                <div class="column">
                    <button id="login-button" @click="${this.login}" class="button">${i18n.t('login')}</button>
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-auth', VPUAuth);
