import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {PersonSelect} from './person-select.js';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class PersonSelectDemo extends LangMixin(
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
            'dbp-person-select': PersonSelect,
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
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Person-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Person 1</label>
                            <div class="control">
                                <dbp-person-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"></dbp-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 2</label>
                            <div class="control">
                                <dbp-person-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-person-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Person 3 unsubscribed</label>
                            <div class="control">
                                <dbp-person-select
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-person-select>
                            </div>
                            <p>
                                This component doesn't get any notification about user's login and
                                will not become active.
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Person 4 disabled</label>
                            <div class="control">
                                <dbp-person-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    disabled
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-person-select>
                            </div>
                            <p>This component is disabled.</p>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-person-select-demo', PersonSelectDemo);
