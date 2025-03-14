import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {GrantPermissionDialog} from './grant-permission-dialog.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {httpGetAsync} from './utils.js';

export class GrantPermissionDialogDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.entryPointUrl = '';
        this.noAuth = false;
        this.resourceClassIdentifier = 'DbpRelayFormalizeForm';
        this.formIdentifier = '';
        // this.auth = {};
        this.forms = [];
    }

    static get scopedElements() {
        return {
            'dbp-grant-permission-dialog': GrantPermissionDialog,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            formIdentifier: {type: String},
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
                div.container {
                    margin-bottom: 1.5em;
                }
                .button-wrap {
                    display: flex;
                    gap: 2em;
                    align-items: center;
                }
                select:not(.select) {
                    background-size: 6%;
                }
            `,
        ];
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }
        // if (changedProperties.has('auth')) {
        //     if (this.auth && this.auth.token) {
        //         this.setForms();
        //     }
        // }
        super.update(changedProperties);
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
        return await httpGetAsync(
            'http://127.0.0.1:8000' + `/formalize/forms?perPage=9999`,
            options,
        );
    }

    async setForms() {
        try {
            let response = await this.apiGetForms();
            let responseBody = await response.json();
            if (responseBody !== undefined && responseBody.status !== 403 && responseBody['hydra:member'] && responseBody['hydra:member'].length > 0) {
                this.forms = responseBody['hydra:member'];
                this.requestUpdate();
                console.log('this.forms', this.forms);
            }
        } catch (e) {
            console.log('setForms error', e);
        }
    }

    setFormToManage(event) {
        this.formIdentifier = event.target.value ? event.target.value : '';
    }

    render() {
        return html`
            <section class="section" id="grant-permission-demo">

                <div class="container">
                    <h1 class="title">Grant permission modal demo</h1>
                </div>

                <div class="container">

                    <div class="button-wrap">

                        <dbp-button type="is-primary" id="modal-trigger-basic"
                            value="Get forms"
                            no-spinner-on-click
                            @click="${() => this.setForms() }"></dbp-button>

                        ${this.forms.length > 0
                            ? html`
                                <label for="form-list">Form List</label>
                                <select id="form-list"
                                    @change="${this.setFormToManage}">
                                    <option value="">- Select a form -</option>>
                                    ${this.forms.map((form) => {
                                        return html`<option value="${form.identifier}">${form.name}</option>`;
                                    })}
                                </select>
                            `
                            : ''
                        }

                        ${this.formIdentifier
                            ? html`
                                <dbp-button type="is-primary" id="modal-trigger-basic"
                                    value="Manage permissions"
                                    no-spinner-on-click
                                    @click="${() => this._('#grant-permission-dialog').open() }"></dbp-button>
                            `
                            : ''
                        }

                        <dbp-grant-permission-dialog
                            id="grant-permission-dialog"
                            lang="${this.lang}"
                            subscribe="auth"
                            entry-point-url="${this.entryPointUrl}"
                            resource-identifier="${this.formIdentifier}"
                            resource-class-identifier="DbpRelayFormalizeForm"
                            ></dbp-grant-permission-dialog>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-grant-permission-dialog-demo', GrantPermissionDialogDemo);
