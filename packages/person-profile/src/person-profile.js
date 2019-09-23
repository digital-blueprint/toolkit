import {getAssetURL} from './utils.js';
import JSONLD from 'vpu-common/jsonld';
import {html} from 'lit-element';
import {i18n} from './i18n.js';
import VPULitElement from 'vpu-common/vpu-lit-element';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";


class PersonProfile extends VPULitElement {

    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = commonUtils.getAPiUrl();
        this.jsonld = null;
        this.value = '';
        this.person = null;
    }

    static get properties() {
        return {
            lang: { type: String },
            active: { type: Boolean, attribute: false },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            value: { type: String },
            person: { type: Object, attribute: false },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(()=>{
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "entryPointUrl":
                    const that = this;

                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                    }, {}, that.lang);
                    break;
                case 'value':
                    const apiUrl = this.entryPointUrl + '/people/' + this.value;

                    // load person
                    fetch(apiUrl, {
                        headers: {
                            'Content-Type': 'application/ld+json',
                            'Authorization': 'Bearer ' + window.VPUAuthToken,
                        },
                    })
                    .then(response => response.json())
                    .then((person) => {
                        this.person = person;
                    });
                    break;
                default:
            }
        });

        super.update(changedProperties);
    }

    render() {
        let role = 'unbekannt';
        if (this.person !== null && this.person.roles !== undefined) {
            // roles are only defined for self-disclosure
            if (this.person.roles.indexOf('ROLE_STAFF') > -1) {
                role = 'Mitarbeiter/in';
            } else if (this.person.roles.indexOf('ROLE_ALUMNI') > -1) {
                role = 'Absolvent/in';
            }
        }
        const bulmaCSS = getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">
            <style>
            .profile {
                padding: 1rem
            }
            .td-profile {
                padding-right: 2rem
            }
            </style>

            ${this.person !== null && this.person.name !== '' ? html`<h3>PROFILE for ${this.person.name}</h3>
            <table class="profile">
            <thead></thead>
            <tbody>
                <tr><td class="td-profile">Vorname</td><td>${this.person.givenName}</td></tr>
                <tr><td class="td-profile">Nachname</td><td>${this.person.familyName}</td></tr>
                <tr><td class="td-profile">Email</td><td>${this.person.email}</td></tr>
                <tr><td class="td-profile">Telefon</td><td>${this.person.telephone}</td></tr>
                <tr><td class="td-profile">Funktion</td><td>${role}</td></tr>
            </tbody>
            <tfoot></tfoot>
            </table>` : html`Keine Person ausgewählt.` }
        `;
    }
}

commonUtils.defineCustomElement('vpu-person-profile', PersonProfile);
