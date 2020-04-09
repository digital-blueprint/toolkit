import {createI18nInstance} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import 'vpu-person-profile';

const i18n = createI18nInstance();

class AppShellUserProfile extends LitElement {

    constructor() {
        super();
        this.lang = i18n.language;
        this._personId = window.VPUPersonId;
        this.entryPointUrl = commonUtils.getAPiUrl();

    }

    static get properties() {
        return {
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            _personId: {type: String, attribute: false},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener("vpu-auth-person-init", () => {
            this._personId = window.VPUPersonId;
        });
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
        `;
    }

    render() {
        return html`
            <vpu-person-profile value="${this._personId}" entry-point-url="${this.entryPointUrl}"" lang="${this.lang}"></vpu-person-profile>
        `;
    }
}

export const userProfileMeta = {
    "element": "vpu-app-shell-user-profile",
    "module_src": "",
    "routing_name": "user-profile",
    "name": {
      "de": "Benutzerprofil",
      "en": "User profile"
    },
    "short_name": {
      "de": "Profil",
      "en": "Profile"
    },
    "description": {
      "de": "Zeigt informationen über den Benutzer an",
      "en": "Shows information about the user"
    },
    visible: false
};

commonUtils.defineCustomElement('vpu-app-shell-user-profile', AppShellUserProfile);
