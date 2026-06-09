import {css, html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import select2 from 'select2';
import select2LangDe from '../i18n/de/select2';
import select2LangEn from '../i18n/en/select2';
import {DbpBaseElement} from '../base-element.js';

export class DbpSubmissionSelectElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.formElementId = `form-element-${Math.random().toString(36).slice(2, 10)}`;
        this.entryPointUrl = '';
        this.frontendKey = '';
        this.submissionElementName = '';
        this.perPage = 9999;
        this.submissions = [];
        this.loading = false;
        this.loadError = false;
        this.selectRef = createRef();
        this.$select = null;
        this._loadId = 0;
        select2(window, $);
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            frontendKey: {type: String, attribute: 'frontend-key'},
            submissionElementName: {type: String, attribute: 'submission-element-name'},
            perPage: {type: Number, attribute: 'per-page'},
            submissions: {type: Array, attribute: false},
            loading: {type: Boolean, attribute: false},
            loadError: {type: Boolean, attribute: false},
        };
    }

    static get styles() {
        return [
            ...super.styles,
            commonStyles.getSelect2CSS(),
            css`
                :host([layout-type='inline']) fieldset {
                    align-items: center;
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    margin: 0;
                }

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                    white-space: nowrap;
                }

                :host([layout-type='inline']) #select-dropdown {
                    order: 1;
                }

                :host([layout-type='inline']) .select2 {
                    order: 2;
                }

                #select-dropdown {
                    position: relative;
                }

                .select2-container--default .select2-selection--single {
                    border-color: var(--dbp-override-content);
                    border-radius: 0;
                }
            `,
        ];
    }

    $(selector) {
        return $(this.shadowRoot.querySelector(selector));
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateSelect2();
    }

    updated(changedProperties) {
        super.updated?.(changedProperties);

        if (
            changedProperties.has('entryPointUrl') ||
            changedProperties.has('frontendKey') ||
            changedProperties.has('auth') ||
            changedProperties.has('perPage')
        ) {
            this.loadSubmissions();
        }

        if (
            changedProperties.has('submissions') ||
            changedProperties.has('loading') ||
            changedProperties.has('loadError') ||
            changedProperties.has('lang') ||
            changedProperties.has('disabled')
        ) {
            this.updateComplete.then(() => this.updateSelect2());
        }

        if (changedProperties.has('value')) {
            this.updateComplete.then(() => this.syncSelect2Value());
        }
    }

    canLoadSubmissions() {
        return !!(this.entryPointUrl && this.frontendKey && this.auth?.token);
    }

    async loadSubmissions() {
        const loadId = ++this._loadId;

        if (!this.canLoadSubmissions()) {
            this.submissions = [];
            this.loading = false;
            this.loadError = false;
            return;
        }

        this.loading = true;
        this.loadError = false;

        try {
            const forms = await this.fetchForms();
            const submissions = await this.fetchSubmissions(forms);

            if (loadId === this._loadId) {
                this.submissions = submissions;
            }
        } catch (error) {
            console.error('Failed to load submissions for submission-select:', error);
            if (loadId === this._loadId) {
                this.submissions = [];
                this.loadError = true;
            }
        } finally {
            if (loadId === this._loadId) {
                this.loading = false;
            }
        }
    }

    async fetchForms() {
        const formsUrl = new URL(this.entryPointUrl + '/formalize/forms');
        formsUrl.searchParams.set('perPage', String(this.perPage));
        formsUrl.searchParams.append('whereFrontendKeyIn[]', this.frontendKey);

        const response = await fetch(formsUrl.href, {
            headers: this.getRequestHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to load forms: ${response.status}`);
        }

        const data = await response.json();
        return data['hydra:member'] || [];
    }

    async fetchSubmissions(forms) {
        const submissionLists = await Promise.all(
            forms.map(async (form) => {
                const formIdentifier = form.identifier;
                if (!formIdentifier) {
                    return [];
                }

                const submissionsUrl = new URL(this.entryPointUrl + '/formalize/submissions');
                submissionsUrl.searchParams.set('formIdentifier', formIdentifier);
                submissionsUrl.searchParams.set('perPage', String(this.perPage));

                const response = await fetch(submissionsUrl.href, {
                    headers: this.getRequestHeaders(),
                });

                if (!response.ok) {
                    throw new Error(`Failed to load submissions: ${response.status}`);
                }

                const data = await response.json();
                return data['hydra:member'] || [];
            }),
        );

        return submissionLists.flat();
    }

    getRequestHeaders() {
        return {
            'Content-Type': 'application/ld+json',
            Authorization: 'Bearer ' + this.auth.token,
        };
    }

    getSubmissionValue(submission) {
        return submission.identifier || submission['@id'] || '';
    }

    getSubmissionLabel(submission) {
        const dataFeedElement = this.parseDataFeedElement(submission.dataFeedElement);
        const label = dataFeedElement?.[this.submissionElementName];

        if (Array.isArray(label)) {
            return label.join(', ');
        }

        if (label && typeof label === 'object') {
            return JSON.stringify(label);
        }

        return String(label || this.getSubmissionValue(submission));
    }

    parseDataFeedElement(dataFeedElement) {
        if (!dataFeedElement) {
            return {};
        }

        if (typeof dataFeedElement === 'object') {
            return dataFeedElement;
        }

        try {
            return JSON.parse(dataFeedElement);
        } catch (error) {
            console.warn('Failed to parse submission dataFeedElement:', error);
            return {};
        }
    }

    getPlaceholderText() {
        if (this.loading) {
            return this._i18n.t('render-form.submission-select.loading');
        }

        if (this.loadError) {
            return this._i18n.t('render-form.submission-select.load-error');
        }

        if (!this.canLoadSubmissions()) {
            return this._i18n.t('render-form.submission-select.not-configured');
        }

        if (this.submissions.length === 0) {
            return this._i18n.t('render-form.submission-select.no-submissions');
        }

        return this._i18n.t('render-form.submission-select.select-placeholder');
    }

    isSelectDisabled() {
        return this.disabled || this.loading || this.loadError || !this.canLoadSubmissions();
    }

    select2IsInitialized() {
        return this.$select !== null && this.$select.hasClass('select2-hidden-accessible');
    }

    updateSelect2() {
        this.$select = this.$('#' + this.formElementId);

        if (this.$select === null || this.$select.length === 0) {
            return;
        }

        if (this.select2IsInitialized()) {
            this.$select.select2('destroy');
            this.$select.off('change');
        }

        this.$select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2LangDe() : select2LangEn(),
                allowClear: !this.required,
                placeholder: this.getPlaceholderText(),
                dropdownParent: this.$('#select-dropdown'),
            })
            .on('change', this.handleInputValue.bind(this));

        this.syncSelect2Value();
    }

    syncSelect2Value() {
        if (this.select2IsInitialized()) {
            this.$select.val(this.value || null).trigger('change.select2');
        }
    }

    handleInputValue(event) {
        const value = event.target.value || '';
        if (value === this.value) {
            return;
        }

        this.value = value;
        this.handleErrorsIfAny();

        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    fieldName: this.name,
                    name: this.name,
                    value: this.value,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    renderInput() {
        const select2CSS = commonUtils.getAbsoluteURL(select2CSSPath);

        return html`
            <link rel="stylesheet" href="${select2CSS}" />
            <select
                ${ref(this.selectRef)}
                id="${this.formElementId}"
                name="${this.name}"
                class="select"
                ?disabled=${this.isSelectDisabled()}
                ?required=${this.required}>
                <option value="">${this.getPlaceholderText()}</option>
                ${this.submissions.map(
                    (submission) => html`
                        <option
                            value="${this.getSubmissionValue(submission)}"
                            ?selected=${this.getSubmissionValue(submission) === this.value}>
                            ${this.getSubmissionLabel(submission)}
                        </option>
                    `,
                )}
            </select>
            <div id="select-dropdown"></div>
        `;
    }
}
