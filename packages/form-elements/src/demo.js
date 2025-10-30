import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {
    DbpStringElement,
    DbpDateElement,
    DbpDateTimeElement,
    DbpEnumElement,
    DbpBooleanElement,
    DbpStringView,
    DbpDateView,
    DbpDateTimeView,
    DbpEnumView,
} from './index.js';
import {classMap} from 'lit/directives/class-map.js';
import {gatherFormDataFromElement, validateRequiredFields} from './utils.js';

export class FormElementsDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.saveButtonEnabled = true;
        this.data = {};
        this.enumItems = {item1: 'Item 1', item2: 'Item 2'};
        this.isRequired = true;
    }

    static get scopedElements() {
        return {
            'dbp-form-string-element': DbpStringElement,
            'dbp-form-date-element': DbpDateElement,
            'dbp-form-datetime-element': DbpDateTimeElement,
            'dbp-form-enum-element': DbpEnumElement,
            'dbp-form-boolean-element': DbpBooleanElement,
            'dbp-form-string-view': DbpStringView,
            'dbp-form-date-view': DbpDateView,
            'dbp-form-datetime-view': DbpDateTimeView,
            'dbp-form-enum-view': DbpEnumView,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            saveButtonEnabled: {type: Boolean, attribute: false},
            isRequired: {type: Boolean, attribute: false},
            data: {type: Object, attribute: false},
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
                    <h1 class="title">Form Elements Demo</h1>
                </div>
                <div class="container">
                    <form>
                        <dbp-form-boolean-element
                            subscribe="lang"
                            name="isRequired"
                            label="Fields are required"
                            description="Disable this to make all fields optional"
                            @change=${(e) => {
                                this.isRequired = e.detail.state;
                            }}
                            .state=${this.isRequired}></dbp-form-boolean-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentString"
                            label="My string"
                            value=${data.myComponentString || ''}
                            ?required=${this.isRequired}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentStringInline"
                            label="Inline string"
                            layout-type="inline"
                            value=${data.myComponentStringInline || ''}
                            ?required=${this.isRequired}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentLongString"
                            label="My long string"
                            value=${data.myComponentLongString || ''}
                            rows="5"
                            ?required=${this.isRequired}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="myComponentLongStringInline"
                            label="Inline long string"
                            layout-type="inline"
                            value=${data.myComponentLongStringInline || ''}
                            rows="5"
                            ?required=${this.isRequired}></dbp-form-string-element>

                        <dbp-form-string-element
                            subscribe="lang"
                            name="mySpecialString"
                            description="Shows the evaluation data in the error message if empty"
                            label="My special string"
                            .customValidator=${(value, evaluationData) => {
                                // If the value is empty, return an error message with the evaluation data
                                return value === '' && this.isRequired
                                    ? ['evaluationData: ' + JSON.stringify(evaluationData)]
                                    : [];
                            }}
                            value=${data.mySpecialString || ''}
                            ?required=${this.isRequired}></dbp-form-string-element>

                        <dbp-form-date-element
                            subscribe="lang"
                            name="myComponentDate"
                            label="My date"
                            value=${data.myComponentDate || ''}
                            ?required=${this.isRequired}></dbp-form-date-element>

                        <dbp-form-date-element
                            subscribe="lang"
                            name="myComponentDateInline"
                            label="Inline date"
                            layout-type="inline"
                            value=${data.myComponentDateInline || ''}
                            ?required=${this.isRequired}></dbp-form-date-element>

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
                            ?required=${this.isRequired}></dbp-form-datetime-element>

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
                            ?required=${this.isRequired}></dbp-form-datetime-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnum"
                            label="My enum"
                            .value=${data.myComponentEnum || ''}
                            .items=${this.enumItems}
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumInline"
                            label="Inline enum"
                            layout-type="inline"
                            .value=${data.myComponentEnumInline || ''}
                            .items=${this.enumItems}
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnum"
                            label="My multiple enum"
                            .value=${data.myComponentMultipleEnum || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumList"
                            label="My enum list"
                            .value=${data.myComponentEnumList || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentEnumListInline"
                            .value=${data.myComponentEnumListInline || ''}
                            .items=${this.enumItems}
                            display-mode="list"
                            layout-type="inline"
                            ?required=${this.isRequired}>
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
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumTags"
                            label="My multiple enum tags TAGS"
                            display-mode="tags"
                            .value=${data.myComponentMultipleEnumTags || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isRequired}></dbp-form-enum-element>

                        <dbp-form-enum-element
                            subscribe="lang"
                            name="myComponentMultipleEnumTagsInline"
                            label="Inline multiple enum tags"
                            display-mode="tags"
                            layout-type="inline"
                            .value=${data.myComponentMultipleEnumTagsInline || ''}
                            .items=${this.enumItems}
                            multiple
                            ?required=${this.isRequired}></dbp-form-enum-element>

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
                    <h1 class="title">Form Views Demo</h1>
                </div>
                <div class="container">
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

                    <dbp-form-string-view
                        subscribe="lang"
                        label="My boolean"
                        value=${data.myComponentBoolean ? 'true' : 'false'}></dbp-form-string-view>

                    <dbp-form-string-view
                        subscribe="lang"
                        layout-type="inline"
                        label="Inline boolean"
                        value=${data.myComponentBoolean ? 'true' : 'false'}></dbp-form-string-view>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-elements-demo', FormElementsDemo);
