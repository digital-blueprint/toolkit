import {html, css} from 'lit';
import {
    AuthMixin,
    Button,
    LangMixin,
    MiniSpinner,
    ScopedElementsMixin,
    sendNotification,
} from '@dbp-toolkit/common';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {hydra} from '@dbp-toolkit/resource-select';
import {Notification} from '@dbp-toolkit/notification';
import {AuthorizationManageGrantsDialog} from './authorization-manage-grants-dialog.js';
import {createInstance} from './i18n.js';

const DEMO_RESOURCE_CLASS_IDENTIFIER = 'DbpRelayFormalizeForm';
const DEMO_RESOURCE_IDENTIFIER = '32297d33-1352-4cf2-ba06-1577911c3537';
const DEMO_RESOURCE_TYPE = 0;

export class AuthorizationManageGrantsDialogDemo extends AuthMixin(
    LangMixin(ScopedElementsMixin(DBPLitElement), createInstance),
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.noAuth = false;
        this.forms = [];
        this.formsLoading = false;
        this.formsLoaded = false;
        this.resourceClassIdentifier = '';
        this.resourceIdentifier = '';
        this.resourceType = '';
        /** @type {string} Encoded as "resourceClass:resourceType", e.g. "DbpRelayFormalizeForm:0" */
        this.selectedResourceType = '';
        this.useFixedDemoResource = false;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            noAuth: {type: Boolean, attribute: 'no-auth'},
            forms: {type: Array},
            formsLoading: {type: Boolean},
            formsLoaded: {type: Boolean},
            resourceClassIdentifier: {type: String},
            resourceIdentifier: {type: String},
            resourceType: {type: String},
            selectedResourceType: {type: String},
            useFixedDemoResource: {type: Boolean},
        };
    }

    static get scopedElements() {
        return {
            'dbp-authorization-manage-grants-dialog': AuthorizationManageGrantsDialog,
            'dbp-button': Button,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-notification': Notification,
        };
    }

    /**
     * Loads forms from the formalize API.
     *
     * @returns {Promise<void>}
     */
    async setForms() {
        if (this.formsLoading || this.formsLoaded || !this.isLoggedIn()) {
            return;
        }

        const i18n = this._i18n;
        this.formsLoading = true;
        try {
            const url = new URL('/formalize/forms', this.entryPointUrl);
            // Exclude large frontend-specific form collections from this general-purpose demo.
            for (const frontendKey of ['job-offer', 'bulletin-company', 'career-profile']) {
                url.searchParams.append('whereFrontendKeyNotIn[]', frontendKey);
            }
            this.forms = await hydra.getCollection(
                url.href,
                this.lang,
                () => this.auth?.token ?? '',
            );
            this.formsLoaded = true;
        } catch {
            sendNotification({
                summary: i18n.t('auth-manage-dialog.demo-error-title'),
                body: i18n.t('auth-manage-dialog.demo-error-get-forms'),
                type: 'danger',
                timeout: 0,
            });
        } finally {
            this.formsLoading = false;
        }
    }

    loginCallback() {
        if (this.selectedResourceType) {
            void this.setForms();
        }
    }

    logoutCallback() {
        // The forms and the selection belong to the user that just logged out,
        // so the next user starts over
        this.forms = [];
        this.formsLoaded = false;
        this.selectedResourceType = '';
        this.resourceClassIdentifier = '';
        this.resourceIdentifier = '';
        this.resourceType = '';
        this.useFixedDemoResource = false;
    }

    /**
     * Uses a fixed form to avoid loading the slow forms collection in the demo.
     * @param {Event & {target: HTMLInputElement}} event
     * @returns {void}
     */
    handleUseFixedDemoResourceChange(event) {
        this.useFixedDemoResource = event.target.checked;
        this.selectedResourceType = '';

        if (this.useFixedDemoResource) {
            this.resourceClassIdentifier = DEMO_RESOURCE_CLASS_IDENTIFIER;
            this.resourceIdentifier = DEMO_RESOURCE_IDENTIFIER;
            this.resourceType = String(DEMO_RESOURCE_TYPE);
        } else {
            this.resourceClassIdentifier = '';
            this.resourceIdentifier = '';
            this.resourceType = '';
        }
    }

    /**
     * Handles the resource type select change.
     * Splits the encoded "resourceClass:resourceType" value and updates state.
     * @param {Event & {target: HTMLSelectElement}} event
     */
    handleResourceTypeChange(event) {
        const value = event.target.value;
        this.selectedResourceType = value;
        // Reset derived identifiers when the type changes
        this.resourceIdentifier = '';

        if (value) {
            const [resourceClass, resourceType] = value.split(':');
            this.resourceClassIdentifier = resourceClass;
            this.resourceType = resourceType;

            void this.setForms();
        } else {
            this.resourceClassIdentifier = '';
            this.resourceType = '';
        }
    }

    /**
     * Returns true when all required identifiers are set to open the dialog.
     * @returns {boolean}
     */
    get canOpenDialog() {
        return !!(
            this.resourceClassIdentifier &&
            this.resourceIdentifier &&
            this.resourceType !== ''
        );
    }

    /**
     * Renders the login button, together with the keycloak component unless the surrounding
     * application already provides the authentication.
     *
     * @returns {import('lit').TemplateResult}
     */
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
                          client-id="auth-dev-mw-frontend-local"></dbp-auth-keycloak>
                      <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                  </div>
              `;
    }

    static get styles() {
        // language=css
        return [
            css`
                @layer theme, components;

                @layer theme {
                    ${commonStyles.getThemeCSS()}
                    ${commonStyles.getGeneralCSS()}
                }
            `,
            css`
                @layer components {
                    /* @TODO: fix dark theme select*/
                    select:not(.select) {
                        background-size: 1em;
                    }
            `,
        ];
    }

    /**
     * Renders the inputs that build the compound resource identifier of the dialog, together
     * with the dialog itself.
     *
     * @returns {import('lit').TemplateResult}
     */
    renderResourceSelection() {
        const i18n = this._i18n;
        // Submission mode: resource type is a single submission item.
        const isSubmissionMode = this.selectedResourceType === 'DbpRelayFormalizeSubmission:0';

        return html`
            <label>
                <input
                    type="checkbox"
                    .checked="${this.useFixedDemoResource}"
                    @change="${this.handleUseFixedDemoResourceChange}" />
                ${i18n.t('auth-manage-dialog.demo-use-fixed-resource-label')}
            </label>
            <br />
            <label for="resource-type-select">
                ${i18n.t('auth-manage-dialog.demo-select-resource-type-label')}
            </label>
            <select
                id="resource-type-select"
                .value="${this.selectedResourceType}"
                ?disabled="${this.useFixedDemoResource}"
                @change="${this.handleResourceTypeChange}">
                <option value="">
                    ${i18n.t('auth-manage-dialog.demo-select-resource-type-placeholder')}
                </option>
                <option value="DbpRelayFormalizeForm:0">
                    ${i18n.t('auth-manage-dialog.demo-resource-type-form')}
                </option>
                <option value="DbpRelayFormalizeSubmission:1">
                    ${i18n.t('auth-manage-dialog.demo-resource-type-form-submissions')}
                </option>
                <option value="DbpRelayFormalizeSubmission:0">
                    ${i18n.t('auth-manage-dialog.demo-resource-type-submission')}
                </option>
            </select>

            ${
                this.selectedResourceType && !isSubmissionMode
                    ? this.formsLoading
                        ? html`
                              <dbp-mini-spinner></dbp-mini-spinner>
                          `
                        : this.formsLoaded
                          ? html`
                                <label for="form-select">
                                    ${i18n.t('auth-manage-dialog.demo-select-form-label')}
                                </label>
                                <select
                                    id="form-select"
                                    @change="${(event) => {
                                        this.resourceIdentifier = /** @type {HTMLSelectElement} */ (
                                            event.target
                                        ).value;
                                    }}">
                                    <option value="">
                                        ${i18n.t('auth-manage-dialog.demo-select-form-placeholder')}
                                    </option>
                                    ${this.forms.map(
                                        (form) => html`
                                            <option value="${form.identifier}">${form.name}</option>
                                        `,
                                    )}
                                </select>
                            `
                          : ''
                    : ''
            }
            ${
                isSubmissionMode
                    ? html`
                          <label for="submission-id-input">
                              ${i18n.t('auth-manage-dialog.demo-submission-id-label')}
                          </label>
                          <input
                              id="submission-id-input"
                              type="text"
                              placeholder="${i18n.t('auth-manage-dialog.demo-submission-id-placeholder')}"
                              @input="${(event) => {
                                  this.resourceIdentifier = /** @type {HTMLInputElement} */ (
                                      event.target
                                  ).value.trim();
                              }}" />
                      `
                    : ''
            }
            ${
                this.canOpenDialog
                    ? html`
                          <dbp-button
                              type="is-primary"
                              value="${i18n.t('auth-manage-dialog.buttons.open')}"
                              no-spinner-on-click
                              @click="${() => this._('#manage-grants-dialog').open()}"></dbp-button>
                      `
                    : ''
            }

            <dbp-authorization-manage-grants-dialog
                id="manage-grants-dialog"
                modal-title="${i18n.t('auth-manage-dialog.modal-title')}"
                lang="${this.lang}"
                subscribe="auth"
                resource-class-identifier="${this.resourceClassIdentifier}"
                resource-identifier="${this.resourceIdentifier}"
                resource-type="${this.resourceType}"
                entry-point-url="${this.entryPointUrl}"></dbp-authorization-manage-grants-dialog>
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <h2>${i18n.t('auth-manage-dialog.demo-title')}</h2>
            <dbp-notification id="dbp-notification" lang="${this.lang}"></dbp-notification>
            <div class="login-button-container">${this.getAuthComponentHtml()}</div>

            ${this.isLoggedIn() ? this.renderResourceSelection() : ''}
        `;
    }
}

commonUtils.defineCustomElement(
    'dbp-authorization-manage-grants-dialog-demo',
    AuthorizationManageGrantsDialogDemo,
);
