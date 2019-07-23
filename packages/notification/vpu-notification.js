import {i18n} from './i18n.js';
import {html, LitElement} from 'lit-element';

/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Dispatches an event `vpu-notification-init` and sets some global variables:
 *   window.VPUNotificationSubject: Keycloak username
 *   window.VPUNotificationToken: Keycloak token to send with your requests
 *   window.VPUUserFullName: Full name of the user
 *   window.VPUPersonId: Person identifier of the user
 *   window.VPUPerson: Person json object of the user (optional, enable by setting the `load-person` attribute,
 *                     which will dispatch a `vpu-notification-person-init` event when loaded)
 */
class VPUNotification extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(()=>{
        });
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <style>
            </style>

            <div class="columns">
                <div class="column">
                    TODO
                </div>
            </div>
        `;
    }
}

customElements.define('vpu-notification', VPUNotification);
