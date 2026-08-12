import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {AuthMixin, ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {
    DbpStringElement,
    DbpNumberElement,
    DbpDateElement,
    DbpDateTimeElement,
    DbpEnumElement,
    DbpBooleanElement,
    DbpStringView,
    DbpNumberView,
    DbpDateView,
    DbpDateTimeView,
    DbpEnumView,
    DbpPersonSelectElement,
    DbpResourceSelectElement,
    DbpSubmissionSelectElement,
    DbpPersonSelectView,
    DbpResourceSelectView,
} from './index.js';
import {classMap} from 'lit/directives/class-map.js';
import {gatherFormDataFromElement, validateRequiredFields} from './utils.js';

export class FormElementsDemo extends LangMixin(
    AuthMixin(ScopedElementsMixin(DBPLitElement)),
    createInstance,
) {
    constructor() {
        super();
        this.saveButtonEnabled = true;
        this.data = {};
        this.enumItems = {item1: 'Item 1', item2: 'Item 2'};
        this.isMandatory = false;
        this.entryPointUrl = '';
        // The current selection of the person select elements, so it survives a rerender of the
        // demo, which happens for example when the auth token gets refreshed after a focus change
        this.personValue = null;
        this.peopleValue = null;
    }

    static get scopedElements() {
        return {
            'dbp-form-string-element': DbpStringElement,
            'dbp-form-number-element': DbpNumberElement,
            'dbp-form-date-element': DbpDateElement,
            'dbp-form-datetime-element': DbpDateTimeElement,
            'dbp-form-enum-element': DbpEnumElement,
            'dbp-form-boolean-element': DbpBooleanElement,
            'dbp-form-person-select-element': DbpPersonSelectElement,
            'dbp-form-resource-select-element': DbpResourceSelectElement,
            'dbp-form-submission-select-element': DbpSubmissionSelectElement,
            'dbp-form-string-view': DbpStringView,
            'dbp-form-number-view': DbpNumberView,
            'dbp-form-date-view': DbpDateView,
            'dbp-form-datetime-view': DbpDateTimeView,
            'dbp-form-enum-view': DbpEnumView,
            'dbp-form-person-select-view': DbpPersonSelectView,
            'dbp-form-resource-select-view': DbpResourceSelectView,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            saveButtonEnabled: {type: Boolean, attribute: false},
            isMandatory: {type: Boolean, attribute: false},
            data: {type: Object, attribute: false},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            personValue: {type: String, attribute: false},
            peopleValue: {type: Array, attribute: false},
        };
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            css`
                h1.title {
                    margin-bottom: 1em;
                }

                .subtitle {
                    margin-top: 2em;
                    margin-bottom: 0.5em;
                }

                div.container {
                    margin-bottom: 1.5em;
                }

                [slot='label'] a {
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
            `,
        ];
    }

    async validate(event) {
        event.preventDefault();

        const formElement = this.shadowRoot.querySelector('form');

        // Validate the form before proceeding
        const validationResult = await validateRequiredFields(formElement);
        console.log('validateAndSendSubmission validationResult', validationResult);

        if (validationResult) {
            this.data = gatherFormDataFromElement(formElement);
            console.log('data', this.data);
        }
    }

    getButtonRowHtml() {
        return html`
            <div class="button-row">
                <button
                    class="button is-primary"
                    type="submit"
                    ?disabled=${!this.saveButtonEnabled}
                    @click=${this.validate}>
                    Save
                    <dbp-mini-spinner
                        class="${classMap({hidden: this.saveButtonEnabled})}"></dbp-mini-spinner>
                </button>
            </div>
        `;
    }

    getDemoPersonValue(data) {
        if (data.myComponentPerson) {
            return data.myComponentPerson;
        }

        const personId = this.auth?.['person-id'];
        if (!personId) {
            return '';
        }
        return personId;
    }

    getDemoPeopleValue(data) {
        if (Array.isArray(data.myComponentPeople)) {
            return data.myComponentPeople;
        }

        const personId = this.auth?.['person-id'];
        return personId ? [personId] : [];
    }

    getDemoResourceValue(data) {
        if (data.myComponentResource) {
            return data.myComponentResource;
        }

        // Fallback default organization identifier so the view renders on load.
        return '37';
    }

    getDemoPersonElementValue(data) {
        return this.personValue ?? this.getDemoPersonValue(data);
    }

    getDemoPeopleElementValue(data) {
        return this.peopleValue ?? this.getDemoPeopleValue(data);
    }

    render() {
        return html`
            ${this.renderFormElements()} ${this.renderFormViews()}
        `;
    }

    renderFormElements() {
        const data = this.data || {};

        return html`
            <section class="section">
                <div class="container">
                    <h2 class="title">Form Elements Demo</h2>
                </div>
                <div class="container">
                    <form>
                        <dbp-form-boolean-element
                            subscribe="lang"
                            name="isMandatory"
                            label="Fields are mandatory"
                            description="Enable this to make all fields mandatory"
                            @change=${(e) => {
                                this.isMandatory = e.detail.state;
                            }}
                            .state=${this.isMandatory}></dbp-form-boolean-element>

                        <h3 class="subtitle">String elements</h3>
                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentString"
                            label="My string"
                            value=${data.myComponentString || ''}
                            ?required=${this.isMandatory}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentStringInline"
                            label="Inline string"
                            layout-type="inline"
                            value=${data.myComponentStringInline || ''}
                            ?required=${this.isMandatory}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentLongString"
                            label="My long string"
                            value=${data.myComponentLongString || ''}
                            rows="5"
                            ?required=${this.isMandatory}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentLongStringInline"
                            label="Inline long string"
                            layout-type="inline"
                            value=${data.myComponentLongStringInline || ''}
                            rows="5"
                            ?required=${this.isMandatory}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="mySpecialString"
                            label="My special string with slotted description"
                            .customValidator=${(value, evaluationData) => {
                                // If the value is empty, return an error message with the evaluation data
                                return value === '' && this.isMandatory
                                    ? ['evaluationData: ' + JSON.stringify(evaluationData)]
                                    : [];
                            }}
                            value=${data.mySpecialString || ''}
                            ?required=${this.isMandatory}>
                            <div slot="description">
                                Shows the evaluation data in the error
                                <b>message</b>
                                if empty
                            </div>
                        </dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentLongStringWordLimit"
                            label="Inline long string with word limit (10)"
                            value=${data.myComponentLongStringWordLimit || ''}
                            rows="5"
                            word-count-limit="10"
                            ?required=${this.isMandatory}></dbp-form-string-element>

                        <h3 class="subtitle">Number elements</h3>
                        <dbp-form-number-element
                            subscribe="lang"
                            name="myComponentNumber"
                            label="My number"
                            value=${data.myComponentNumber || ''}
                            ?required=${this.isMandatory}>
                            <div slot="description">
                                Number element with a
                                <b>slot for description</b>
                            </div>
                        </dbp-form-number-element>

                        <dbp-form-number-element
                            subscribe="lang"
                            name="myComponentNumberInline"
                            label="Inline number"
                            layout-type="inline"
                            value=${data.myComponentNumberInline || ''}
                            ?required=${this.isMandatory}></dbp-form-number-element>

                        <dbp-form-number-element
                            subscribe="lang"
                            name="myComponentNumberRange"
                            label="Number with min/max (1-100)"
                            description="Must be between 1 and 100"
                            value=${data.myComponentNumberRange || ''}
                            min="1"
                            max="100"
                            ?required=${this.isMandatory}></dbp-form-number-element>

                        <dbp-form-number-element
                            subscribe="lang"
                            name="myComponentNumberStep"
                            label="Number with step (0.5)"
                            description="Increments of 0.5"
                            value=${data.myComponentNumberStep || ''}
                            step="0.5"
                            ?required=${this.isMandatory}></dbp-form-number-element>

                        <h3 class="subtitle">Date elements</h3>
                        <dbp-form-date-element
                            subscribe="lang"
                            name="myComponentDate"
                            label="My date"
                            value=${data.myComponentDate || ''}
                            ?required=${this.isMandatory}></dbp-form-date-element>

                        <dbp-form-date-element
                            subscribe="lang"
                            name="myComponentDateInline"
                            label="Inline date"
                            layout-type="inline"
                            value=${data.myComponentDateInline || ''}
                            ?required=${this.isMandatory}></dbp-form-date-element>

                        <dbp-form-datetime-element
                            subscribe="lang"
                            name="myComponentDateTime"
                            description="Needs to be in the future"
                            label="My datetime"
                            .customValidator=${(value) => {
                                const date = new Date(value);
                                return date < new Date()
                                    ? ['The date needs to be in the future']
                                    : [];
                            }}
                            value=${data.myComponentDateTime || ''}
                            ?required=${this.isMandatory}></dbp-form-datetime-element>

                        <dbp-form-datetime-element
                            subscribe="lang"
                            name="myComponentDateTimeInline"
                            description="Needs to be in the future"
                            label="Inline datetime"
                            layout-type="inline"
                            .customValidator=${(value) => {
                                const date = new Date(value);
                                return date < new Date()
                                    ? ['The date needs to be in the future']
                                    : [];
                            }}
                            value=${data.myComponentDateTimeInline || ''}
                            ?required=${this.isMandatory}></dbp-form-datetime-element>

                        <h3 class="subtitle">Enum elements</h3>
                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnum"
                            label="My enum"
                            .value=${data.myComponentEnum || ''}
                            .items=${this.enumItems}
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumInline"
                            label="Inline enum"
                            layout-type="inline"
                            .value=${data.myComponentEnumInline || ''}
                            .items=${this.enumItems}
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnum"
                            label="My multiple enum"
                            .value=${data.myComponentMultipleEnum || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isMandatory}>
                            <div slot="description">
                                Enum element with a
                                <b>slot for description</b>
                            </div>
                        </dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumList"
                            label="My enum list"
                            .value=${data.myComponentEnumList || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumListInline"
                            .value=${data.myComponentEnumListInline || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            layout-type="inline"
                            ?required=${this.isMandatory}>
                            <span slot="label">
                                <em>Inline</em>
                                enum list
                            </span>
                        </dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumList"
                            label="My multiple enum list"
                            .value=${data.myComponentMultipleEnumList || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            multiple>
                            <span slot="label">
                                Label with
                                <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML</a>
                                content. Can be used interchangeably the label property.
                            </span>
                        </dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumListInline"
                            label="Inline multiple enum list"
                            .value=${data.myComponentMultipleEnumListInline || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            layout-type="inline"
                            multiple>
                            <span slot="label">
                                Label with
                                <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML</a>
                                content.
                            </span>
                        </dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumTags"
                            label="My enum tags"
                            display-mode="tags"
                            .value=${data.myComponentEnumTags || ''}
                            .items=${this.enumItems}
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumTags"
                            label="My multiple enum tags TAGS"
                            display-mode="tags"
                            .tagPlaceholder=${{en: 'Select tags', de: 'Wähle Tags'}}
                            .value=${data.myComponentMultipleEnumTags || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumTagsInline"
                            label="Inline multiple enum tags"
                            display-mode="tags"
                            layout-type="inline"
                            .value=${data.myComponentMultipleEnumTagsInline || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isMandatory}></dbp-form-enum-element>

                        <h3 class="subtitle">Boolean elements</h3>
                        <dbp-form-boolean-element
                            subscribe="lang"
                            name="myComponentBoolean"
                            label="My boolean"
                            description="Check me"
                            .state=${data.myComponentBoolean}></dbp-form-boolean-element>

                        <dbp-form-boolean-element
                            subscribe="lang"
                            name="myComponentBooleanInline"
                            label="Inline boolean"
                            description="Check me"
                            layout-type="inline"
                            .state=${data.myComponentBooleanInline}></dbp-form-boolean-element>

                        <h3 class="subtitle">Select elements</h3>
                        <dbp-form-person-select-element
                            subscribe="lang"
                            name="myComponentPerson"
                            label="My person"
                            .auth=${this.auth ?? {}}
                            .value=${this.getDemoPersonElementValue(data)}
                            @change=${(e) => {
                                this.personValue = e.detail.value;
                            }}
                            entry-point-url="${this.entryPointUrl}"
                            ?required=${this.isMandatory}></dbp-form-person-select-element>

                        <dbp-form-person-select-element
                            subscribe="lang"
                            name="myComponentPeople"
                            label="My people (multiple)"
                            .auth=${this.auth ?? {}}
                            .value=${this.getDemoPeopleElementValue(data)}
                            @change=${(e) => {
                                this.peopleValue = e.detail.values;
                            }}
                            entry-point-url="${this.entryPointUrl}"
                            multiple
                            ?required=${this.isMandatory}></dbp-form-person-select-element>

                        <dbp-form-resource-select-element
                            subscribe="lang"
                            name="myComponentResource"
                            label="My resource"
                            .auth=${this.auth ?? {}}
                            .value=${data.myComponentResource || null}
                            entry-point-url="${this.entryPointUrl}"
                            resource-path="/base/organizations"
                            ?required=${this.isMandatory}></dbp-form-resource-select-element>

                        <dbp-form-submission-select-element
                            subscribe="lang"
                            name="myComponentSubmission"
                            label="My submission"
                            description="Loads submissions for forms with frontend-key 'bulletin-company' and shows their 'name' field."
                            .auth=${this.auth ?? {}}
                            .value=${data.myComponentSubmission || ''}
                            entry-point-url="${this.entryPointUrl}"
                            frontend-key="bulletin-company"
                            submission-element-name="name"
                            ?required=${this.isMandatory}></dbp-form-submission-select-element>

                        ${this.getButtonRowHtml()}
                    </form>
                </div>
                ${this.renderResult(data)}
            </section>
        `;
    }

    renderResult(data) {
        if (data && Object.keys(data).length > 0) {
            // Show the form data object
            return html`
                <div class="container">
                    <h2>Form data</h2>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        }

        return html``;
    }

    renderFormViews() {
        const data = this.data || {};

        return html`
            <section class="section">
                <div class="container">
                    <h2 class="title">Form Views Demo</h2>
                </div>
                <div class="container">
                    <h3 class="subtitle">String elements</h3>
                    <dbp-form-string-view
                        subscribe="lang"
                        label="My string"
                        .value=${data.myComponentString || ''}></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        label="My string [layout-type: inline]"
                        layout-type="inline"
                        .value=${data.myComponentStringInline || ''}></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        label="My long string"
                        .value=${data.myComponentLongString || ''}
                        rows="5"></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        label="My long string [layout-type: inline]"
                        layout-type="inline"
                        .value=${data.myComponentLongStringInline || ''}
                        rows="5"></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        name="mySpecialString"
                        label="My special string"
                        .value=${data.mySpecialString || ''}></dbp-form-string-view>

                    <h3 class="subtitle">Number elements</h3>
                    <dbp-form-number-view
                        subscribe="lang"
                        label="My number"
                        .value=${data.myComponentNumber || ''}></dbp-form-number-view>

                    <dbp-form-number-view
                        subscribe="lang"
                        label="My number [layout-type: inline]"
                        layout-type="inline"
                        .value=${data.myComponentNumberInline || ''}></dbp-form-number-view>

                    <dbp-form-number-view
                        subscribe="lang"
                        label="Number with min/max (1-100)"
                        .value=${data.myComponentNumberRange || ''}></dbp-form-number-view>

                    <dbp-form-number-view
                        subscribe="lang"
                        label="Number with step (0.5)"
                        .value=${data.myComponentNumberStep || ''}></dbp-form-number-view>

                    <h3 class="subtitle">Date elements</h3>
                    <dbp-form-date-view
                        subscribe="lang"
                        label="My date"
                        .value=${data.myComponentDate || ''}></dbp-form-date-view>

                    <dbp-form-date-view
                        subscribe="lang"
                        label="My date [layout-type: inline]"
                        layout-type="inline"
                        .value=${data.myComponentDateInline || ''}></dbp-form-date-view>

                    <dbp-form-datetime-view
                        subscribe="lang"
                        label="My datetime"
                        .value=${data.myComponentDateTime || ''}></dbp-form-datetime-view>

                    <h3 class="subtitle">Enum elements</h3>
                    <dbp-form-enum-view
                        subscribe="lang"
                        label="My enum"
                        .items=${this.enumItems}
                        value=${data.myComponentEnum || ''}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        label="My enum [layout-type: inline]"
                        .items=${this.enumItems}
                        layout-type="inline"
                        value=${data.myComponentEnumInline || ''}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        label="My multiple enum"
                        .items=${this.enumItems}
                        .value=${data.myComponentMultipleEnum || ''}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        label="My enum list"
                        .value=${data.myComponentEnumList || ''}
                        .items=${this.enumItems}
                        display-mode="list"></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        label="My enum list [layout-type: inline]"
                        .value=${data.myComponentEnumListInline || ''}
                        .items=${this.enumItems}
                        layout-type="inline"
                        display-mode="list"></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentMultipleEnumList"
                        label="My multiple enum list"
                        .value=${data.myComponentMultipleEnumList || ''}
                        .items=${this.enumItems}
                        display-mode="list"></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentMultipleEnumListInline"
                        label="My multiple enum list [layout-type: inline]"
                        .value=${data.myComponentMultipleEnumListInline || ''}
                        .items=${this.enumItems}
                        display-mode="list"
                        layout-type="inline"></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentEnumTags"
                        label="My enum tags"
                        value=${data.myComponentEnumTags || ''}
                        .items=${this.enumItems}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentEnumTags"
                        label="My enum tags [display-mode: tags]"
                        display-mode="tags"
                        value=${data.myComponentEnumTags || ''}
                        .items=${this.enumItems}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentMultipleEnumTags"
                        label="My multiple enum tags"
                        .value=${data.myComponentMultipleEnumTags || ''}
                        .items=${this.enumItems}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentMultipleEnumTags"
                        label="My multiple enum tags [display-mode: tags]"
                        display-mode="tags"
                        .value=${data.myComponentMultipleEnumTags || ''}
                        .items=${this.enumItems}></dbp-form-enum-view>

                    <dbp-form-enum-view
                        subscribe="lang"
                        name="myComponentMultipleEnumTags"
                        label="My multiple enum tags [display-mode: tags, layout-type: inline]"
                        display-mode="tags"
                        layout-type="inline"
                        .value=${data.myComponentMultipleEnumTags || ''}
                        .items=${this.enumItems}></dbp-form-enum-view>

                    <h3 class="subtitle">Boolean elements</h3>
                    <dbp-form-string-view
                        subscribe="lang"
                        label="My boolean"
                        value=${data.myComponentBoolean ? 'true' : 'false'}></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        layout-type="inline"
                        label="Inline boolean"
                        value=${data.myComponentBoolean ? 'true' : 'false'}></dbp-form-string-view>

                    <h3 class="subtitle">Select elements</h3>
                    <dbp-form-person-select-view
                        subscribe="lang"
                        label="My person"
                        .auth=${this.auth ?? {}}
                        entry-point-url="${this.entryPointUrl}"
                        .value=${this.getDemoPersonValue(data)}></dbp-form-person-select-view>

                    <dbp-form-person-select-view
                        subscribe="lang"
                        label="My people (multiple)"
                        .auth=${this.auth ?? {}}
                        entry-point-url="${this.entryPointUrl}"
                        .value=${this.getDemoPeopleValue(data)}
                        multiple></dbp-form-person-select-view>

                    <dbp-form-resource-select-view
                        subscribe="lang"
                        label="My resource"
                        .auth=${this.auth ?? {}}
                        entry-point-url="${this.entryPointUrl}"
                        resource-path="/base/organizations"
                        .value=${this.getDemoResourceValue(data)}></dbp-form-resource-select-view>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-elements-demo', FormElementsDemo);
