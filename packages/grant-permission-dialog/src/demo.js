import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin, sendNotification, Button} from '@dbp-toolkit/common';
import {GrantPermissionDialog} from './grant-permission-dialog.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {httpGetAsync} from './utils.js';

export class GrantPermissionDialogDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.noAuth = false;
        this.resourceClassIdentifier = 'DbpRelayFormalizeForm';
        this.formIdentifier = '';
        this.submissionIdentifier = '';
        this.forms = [];
        this.auth = null;
    }

    static get scopedElements() {
        return {
            'dbp-grant-permission-dialog': GrantPermissionDialog,
            'dbp-button': Button,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            formIdentifier: {type: String},
            submissionIdentifier: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
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
                h2 {
                    margin-block: 1em 0.5em;
                }
                h3 {
                    margin-block: 1em 0.5em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }
                .button-wrap {
                    display: flex;
                    gap: 2em;
                    align-items: center;
                }
                label {
                    display: block;
                }
                select:not(.select) {
                    background-size: 6%;
                }
                .submission-id-input {
                    width: 330px;
                    padding: 0 1em;
                }
            `,
        ];
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {});
    }

    firstUpdated() {
        console.log('** Component DEMO rendering **');
    }

    /**
     * Gets the actions for our resource class
     * @returns {Promise<object>} response
     */
    async apiGetForms() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await httpGetAsync(this.entryPointUrl + '/formalize/forms?perPage=9999', options);
    }

    async setForms() {
        const i18n = this._i18n;
        try {
            let response = await this.apiGetForms();
            let responseBody = await response.json();
            if (
                responseBody !== undefined &&
                responseBody.status !== 403 &&
                responseBody['hydra:member'] &&
                responseBody['hydra:member'].length > 0
            ) {
                this.forms = responseBody['hydra:member'];
                this.requestUpdate();
            }
        } catch (e) {
            console.log('setForms error', e);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.could-not-get-forms'),
                type: 'danger',
                timeout: 10,
            });
        }
    }

    setFormToManage(event) {
        this.formIdentifier = event.target.value ? event.target.value : '';
    }

    render() {
        const i18n = this._i18n;
        return html`
            <section class="section" id="grant-permission-demo">
                <div class="container">
                    <h2 class="title">Grant permission modal demo</h2>
                </div>

                <div class="container">
                    <h3>Manage SubmissionCollection Permissions</h3>
                    <div class="button-wrap">
                        <dbp-button
                            type="is-primary"
                            id="modal-trigger-basic"
                            value="Get forms"
                            no-spinner-on-click
                            @click="${() => {
                                if (!this.auth || !this.auth.token) {
                                    sendNotification({
                                        summary: i18n.t(
                                            'grant-permission-dialog.notifications.warning-title',
                                        ),
                                        body: i18n.t(
                                            'grant-permission-dialog.need-login-warning-text',
                                        ),
                                        type: 'warning',
                                        timeout: 10,
                                    });
                                }
                                this.setForms();
                            }}"></dbp-button>

                        ${this.forms.length > 0
                            ? html`
                                  <label for="form-list">Form List</label>
                                  <select id="form-list" @change="${this.setFormToManage}">
                                      <option value="">- Select a form -</option>
                                      >
                                      ${this.forms.map((form) => {
                                          return html`
                                              <option value="${form.identifier}">
                                                  ${form.name}
                                              </option>
                                          `;
                                      })}
                                  </select>
                              `
                            : ''}
                        ${this.formIdentifier
                            ? html`
                                  <dbp-button
                                      type="is-primary"
                                      id="modal-trigger-basic"
                                      value="Manage permissions"
                                      no-spinner-on-click
                                      @click="${() =>
                                          this._('#grant-permission-dialog').open()}"></dbp-button>
                              `
                            : ''}

                        <dbp-grant-permission-dialog
                            id="grant-permission-dialog"
                            lang="${this.lang}"
                            subscribe="auth"
                            entry-point-url="${this.entryPointUrl}"
                            resource-identifier="${this.formIdentifier}"
                            resource-class-identifier="DbpRelayFormalizeSubmissionCollection"></dbp-grant-permission-dialog>
                    </div>
                </div>
                <div class="container">
                    <h3>Manage Submission Permissions</h3>

                    <label for="form-list">Submission ID</label>
                    <input id="submission-id" class="submission-id-input" type="text" />

                    <dbp-button
                        type="is-primary"
                        id="modal-trigger-basic"
                        value="Manage submission permissions"
                        no-spinner-on-click
                        @click="${() => {
                            if (!this.auth || !this.auth.token) {
                                sendNotification({
                                    summary: i18n.t(
                                        'grant-permission-dialog.notifications.warning-title',
                                    ),
                                    body: i18n.t('grant-permission-dialog.need-login-warning-text'),
                                    type: 'warning',
                                    timeout: 10,
                                });
                            }
                            this.submissionIdentifier = this._('#submission-id').value;
                            if (this.submissionIdentifier) {
                                this._('#grant-permission-dialog-submission').open();
                            }
                        }}"></dbp-button>

                    <dbp-grant-permission-dialog
                        id="grant-permission-dialog-submission"
                        lang="${this.lang}"
                        subscribe="auth"
                        entry-point-url="${this.entryPointUrl}"
                        resource-identifier="${this.submissionIdentifier}"
                        resource-class-identifier="DbpRelayFormalizeSubmission"></dbp-grant-permission-dialog>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-grant-permission-dialog-demo', GrantPermissionDialogDemo);
