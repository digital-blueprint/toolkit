
import JSONLD from '@dbp-toolkit/common/jsonld';
import {css, html} from 'lit-element';
import {i18n} from './i18n.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';


export class PersonProfile extends DBPLitElement {

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
                case "entryPointUrl": {
                    const that = this;

                    JSONLD.initialize(this.entryPointUrl, function (jsonld) {
                        that.jsonld = jsonld;
                    }, {}, that.lang);
                    break;
                }
                case 'value':
                    if (this.value !== '') {
                        const apiUrl = this.entryPointUrl + '/people/' + this.value;

                        // load person
                        fetch(apiUrl, {
                            headers: {
                                'Content-Type': 'application/ld+json',
                                'Authorization': 'Bearer ' + window.DBPAuthToken,
                            },
                        })
                            .then(response => response.json())
                            .then((person) => {
                                this.person = person;
                            });
                    }
                    break;
                default:
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
        `;
    }

    render() {
        let role = i18n.t('person-profile.unknown');
        if (this.person !== null && this.person.roles !== undefined) {
            // roles are only defined for self-disclosure
            if (this.person.roles.indexOf('ROLE_STAFF') > -1) {
                role = i18n.t('person-profile.staff');
            } else if (this.person.roles.indexOf('ROLE_ALUMNI') > -1) {
                role = i18n.t('person-profile.alumni');
            }
        }

        return html`
            <style>
            .profile {
                padding: 1rem
            }
            .td-profile {
                padding-right: 2rem
            }
            </style>

            ${this.person !== null && this.person.name !== '' ? html`<h3>${i18n.t('person-profile.profile-caption')} ${this.person.name}</h3>
            <table class="profile">
            <thead></thead>
            <tbody>
                <tr><td class="td-profile">${i18n.t('person-profile.given-name')}</td><td>${this.person.givenName}</td></tr>
                <tr><td class="td-profile">${i18n.t('person-profile.family-name')}</td><td>${this.person.familyName}</td></tr>
                <tr><td class="td-profile">${i18n.t('person-profile.email')}</td><td>${this.person.email}</td></tr>
                <tr><td class="td-profile">${i18n.t('person-profile.telephone')}</td><td>${this.person.telephone}</td></tr>
                <tr><td class="td-profile">${i18n.t('person-profile.role')}</td><td>${role}</td></tr>
            </tbody>
            <tfoot></tfoot>
            </table>` : i18n.t('person-profile.none-selected') }
        `;
    }
}
