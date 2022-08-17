import JSONLD from '@dbp-toolkit/common/jsonld';
import {css, html} from 'lit';
import {createInstance, setOverridesByGlobalCache} from './i18n.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class PersonProfile extends DBPLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';
        this.entryPointUrl = '';
        this.jsonld = null;
        this.value = '';
        this.person = null;
        this.auth = {};
    }

    static get properties() {
        return {
            lang: {type: String},
            active: {type: Boolean, attribute: false},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            value: {type: String},
            person: {type: Object, attribute: false},
            auth: {type: Object},
        };
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.langDir != '') {
        setOverridesByGlobalCache(this._i18n, this);
      }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
                case 'entryPointUrl': {
                    const that = this;

                    JSONLD.getInstance(this.entryPointUrl).then(
                        function (jsonld) {
                            that.jsonld = jsonld;
                        },
                        {},
                        that.lang
                    );
                    break;
                }
                case 'value':
                    if (this.value !== '') {
                        const apiUrl = this.entryPointUrl + '/base/people/' + this.value;

                        // load person
                        fetch(apiUrl, {
                            headers: {
                                'Content-Type': 'application/ld+json',
                                Authorization: 'Bearer ' + this.auth.token,
                            },
                        })
                            .then((response) => response.json())
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
        const i18n = this._i18n;

        return html`
            <style>
                .profile {
                    padding: 1rem;
                }
                .td-profile {
                    padding-right: 2rem;
                }
            </style>

            ${this.person !== null
                ? html`
                      <h3>
                          ${i18n.t('person-profile.profile-caption')} ${this.person.givenName}
                          ${this.person.familyName}
                      </h3>
                      <table class="profile">
                          <thead></thead>
                          <tbody>
                              <tr>
                                  <td class="td-profile">${i18n.t('person-profile.given-name')}</td>
                                  <td>${this.person.givenName}</td>
                              </tr>
                              <tr>
                                  <td class="td-profile">
                                      ${i18n.t('person-profile.family-name')}
                                  </td>
                                  <td>${this.person.familyName}</td>
                              </tr>
                              <tr>
                                  <td class="td-profile">${i18n.t('person-profile.email')}</td>
                                  <td>${this.person.email}</td>
                              </tr>
                          </tbody>
                          <tfoot></tfoot>
                      </table>
                  `
                : i18n.t('person-profile.none-selected')}
        `;
    }
}
