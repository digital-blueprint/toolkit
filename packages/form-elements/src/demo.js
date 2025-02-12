import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {
    DbpStringElement,
    DbpDateElement,
    DbpDateTimeElement,
    DbpEnumElement,
    DbpCheckboxElement,
    DbpStringView,
    DbpDateView,
    DbpDateTimeView,
    DbpEnumView
} from './index.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {classMap} from 'lit/directives/class-map.js';
import {gatherFormDataFromElement, validateRequiredFields} from "./utils.js";

export class FormElementsDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.saveButtonEnabled = true;
        this.mySpecialStringRef = createRef();
        this.myComponentDateTimeRef = createRef();
        this.data = {};
        this.enumItems = {item1: 'Item 1', item2: 'Item 2'};
    }

    static get scopedElements() {
        return {
            'dbp-form-string-element': DbpStringElement,
            'dbp-form-date-element': DbpDateElement,
            'dbp-form-datetime-element': DbpDateTimeElement,
            'dbp-form-enum-element': DbpEnumElement,
            'dbp-form-checkbox-element': DbpCheckboxElement,
            'dbp-form-string-view': DbpStringView,
            'dbp-form-date-view': DbpDateView,
            'dbp-form-datetime-view': DbpDateTimeView,
            'dbp-form-enum-view': DbpEnumView,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            saveButtonEnabled: {type: Boolean, attribute: false},
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
            `,
        ];
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
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
            ${this.renderFormElements()}
            ${this.renderFormViews()}
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
                        <dbp-form-string-element
                                subscribe="lang"
                                name="myComponentString"
                                label="My string"
                                value=${data.myComponentString || ''}
                                required>
                        </dbp-form-string-element>

                        <dbp-form-string-element
                                subscribe="lang"
                                name="myComponentLongString"
                                label="My long string"
                                value=${data.myComponentLongString || ''}
                                rows="5"
                                required>
                        </dbp-form-string-element>

                        <dbp-form-string-element
                                ${ref(this.mySpecialStringRef)}
                                subscribe="lang"
                                name="mySpecialString"
                                description="Shows the evaluation data in the error message if empty"
                                label="My special string"
                                .customValidator=${(value, evaluationData) => {
                                    // If the value is empty, return an error message with the evaluation data
                                    return value === '' ? ['evaluationData: ' + JSON.stringify(evaluationData)] : [];
                                }}
                                value=${data.mySpecialString || ''}
                                required>
                        </dbp-form-string-element>

                        <dbp-form-date-element
                                subscribe="lang"
                                name="myComponentDate"
                                label="My date"
                                value=${data.myComponentDate || ''}
                                required>
                        </dbp-form-date-element>

                        <dbp-form-datetime-element
                                ${ref(this.myComponentDateTimeRef)}
                                subscribe="lang"
                                name="myComponentDateTime"
                                description="Needs to be in the future"
                                label="My datetime"
                                .customValidator=${(value) => {
                                    const date = new Date(value);
                                    return date < new Date() ? ['The date needs to be in the future'] : [];
                                }}
                                value=${data.myComponentDateTime || ''}
                                required>
                        </dbp-form-datetime-element>

                        <dbp-form-enum-element
                                subscribe="lang"
                                name="myComponentEnum"
                                label="My enum"
                                value=${data.myComponentEnum || ''}
                                .items=${this.enumItems}
                                required>
                        </dbp-form-enum-element>

                        <dbp-form-enum-element
                                subscribe="lang"
                                name="myComponentMultipleEnum"
                                label="My multiple enum"
                                .value=${data.myComponentMultipleEnum || ''}
                                .items=${this.enumItems}
                                multiple
                                required>
                        </dbp-form-enum-element>

                        <dbp-form-checkbox-element
                                subscribe="lang"
                                name="myComponentCheckbox"
                                label="My checkbox"
                                description="Check me"
                                value="check"
                                ?checked=${data.myComponentCheckbox || false}>
                        </dbp-form-checkbox-element>

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
                            .value=${data.myComponentString || ''}>
                    </dbp-form-string-view>

                    <dbp-form-string-view
                            subscribe="lang"
                            label="My long string"
                            .value=${data.myComponentLongString || ''}
                            rows="5">
                    </dbp-form-string-view>

                    <dbp-form-string-view
                            subscribe="lang"
                            name="mySpecialString"
                            label="My special string"
                            .value=${data.mySpecialString || ''}>
                    </dbp-form-string-view>

                    <dbp-form-date-view
                            subscribe="lang"
                            label="My date"
                            .value=${data.myComponentDate || ''}>
                    </dbp-form-date-view>

                    <dbp-form-datetime-view
                            subscribe="lang"
                            label="My datetime"
                            .value=${data.myComponentDateTime || ''}>
                    </dbp-form-datetime-view>

                    <dbp-form-enum-view
                            subscribe="lang"
                            label="My enum"
                            .items=${this.enumItems}
                            value=${data.myComponentEnum || ''}>
                    </dbp-form-enum-view>

                    <dbp-form-enum-view
                            subscribe="lang"
                            label="My multiple enum"
                            .items=${this.enumItems}
                            .value=${data.myComponentMultipleEnum || ''}>
                    </dbp-form-enum-view>

                    <dbp-form-string-view
                            subscribe="lang"
                            label="My checkbox"
                            .value=${data.myComponentCheckbox ? 'on' : 'off'}>
                    </dbp-form-string-view>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-form-elements-demo', FormElementsDemo);
