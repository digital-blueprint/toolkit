import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {ResourceSelect} from './resource-select.js';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class ResourceSelectDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-resource-select': ResourceSelect,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            noAuth: {type: Boolean, attribute: 'no-auth'},
        };
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            css`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }
            `,
        ];
    }

    getAuthComponentHtml() {
        return this.noAuth
            ? html`
                  <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
              `
            : html`
                  <div class="container">
                      <dbp-auth-keycloak
                          subscribe="requested-login-status"
                          lang="${this.lang}"
                          entry-point-url="${this.entryPointUrl}"
                          silent-check-sso-redirect-uri="/silent-check-sso.html"
                          url="https://auth-dev.tugraz.at/auth"
                          realm="tugraz-vpu"
                          client-id="auth-dev-mw-frontend-local"
                          try-login></dbp-auth-keycloak>
                      <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                  </div>
              `;
    }

    render() {
        let getOrganizationQueryParameters = (select) => {
            return {lang: select.lang};
        };

        let formatResource = (select, resource) => {
            return resource['name'];
        };

        let getPersonSearchQueryParameters = (select, searchTerm) => {
            return {
                search: searchTerm.trim(),
                sort: 'familyName',
            };
        };

        let formatPerson = (select, person) => {
            let text = person['givenName'] ?? '';
            if (person['familyName']) {
                text += ` ${person['familyName']}`;
            }

            return text;
        };

        let change = (event) => {
            console.log('change:', event.detail.value, event.detail.object);
        };

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">resource-select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Organization of the current user</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-library-manager"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/organizations"
                                    @change="${change}"
                                    .getCollectionQueryParameters="${getOrganizationQueryParameters}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Organization without default selection</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-organization-no-default"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/organizations"
                                    placeholder="Custom placeholder"
                                    no-default
                                    @change="${change}"
                                    .getCollectionQueryParameters="${getOrganizationQueryParameters}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Organization disabled</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-organization-disabled"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/organizations"
                                    disabled
                                    @change="${change}"
                                    .getCollectionQueryParameters="${getOrganizationQueryParameters}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">
                                Organization disabled without default selection
                            </label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-organization-disabled-no-default"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/organizations"
                                    no-default
                                    disabled
                                    @change="${change}"
                                    .getCollectionQueryParameters="${getOrganizationQueryParameters}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Organization without auth subscription</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-organization-no-auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/organizations"
                                    @change="${change}"
                                    .getCollectionQueryParameters="${getOrganizationQueryParameters}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                            <p>
                                This component is not subscribed to auth and will not receive a
                                token.
                            </p>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person search</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-person-search"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="base/people"
                                    fetch-mode="search"
                                    @change="${change}"
                                    .getSearchQueryParameters="${getPersonSearchQueryParameters}"
                                    .formatResource="${formatPerson}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-resource-select-demo', ResourceSelectDemo);
