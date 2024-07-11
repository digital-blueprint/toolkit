import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {ResourceSelect} from './resource-select.js';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class ResourceSelectDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
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
            lang: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            noAuth: {type: Boolean, attribute: 'no-auth'},
        };
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
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
        let buildUrlPerson = (select, url) => {
            url += '?person=' + encodeURIComponent(select.auth['person-id']);
            url += '&' + new URLSearchParams({lang: select.lang}).toString();
            return url;
        };

        let buildUrl = (select, url) => {
            return url;
        };

        let formatResource = (resource) => {
            return resource.name ?? resource['@id'];
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
                                    id="resource-select-organization-manager"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="/base/organizations"
                                    @change="${change}"
                                    .buildUrl="${buildUrlPerson}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Authorization groups with search</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-authorization-group-manager"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="/authorization/groups"
                                    use-search
                                    @change="${change}"
                                    .buildUrl="${buildUrl}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Dispatch groups</label>
                            <div class="control">
                                <dbp-resource-select
                                    id="resource-select-dispatch-group-manager"
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    resource-path="/dispatch/groups"
                                    @change="${change}"
                                    .buildUrl="${buildUrl}"
                                    .formatResource="${formatResource}"></dbp-resource-select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-resource-select-demo', ResourceSelectDemo);
