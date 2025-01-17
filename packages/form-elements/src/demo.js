import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {DbpStringElement, DbpDateElement, DbpDateTimeElement, DbpEnumElement, DbpCheckboxElement} from './index.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {classMap} from 'lit/directives/class-map.js';
import {gatherFormDataFromElement, validateRequiredFields} from "./utils.js";

export class FormElementsDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.saveButtonEnabled = true;
        this.mySpecialComponentStringRef = createRef();
        this.myComponentDateTimeRef = createRef();
        this.myComponentEnumRef = createRef();
        this.data = {};
    }

    static get scopedElements() {
        return {
            'dbp-string-element': DbpStringElement,
            'dbp-date-element': DbpDateElement,
            'dbp-datetime-element': DbpDateTimeElement,
            'dbp-enum-element': DbpEnumElement,
            'dbp-checkbox-element': DbpCheckboxElement,
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

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            // Add a custom validation function to the special string component
            this.mySpecialComponentStringRef.value.customValidationFnc = (value, evaluationData) => {
                // If the value is empty, return an error message with the evaluation data
                return value === '' ? ['evaluationData: ' + JSON.stringify(evaluationData)] : [];
            };

            // Add a custom validation function to the datetime component
            this.myComponentDateTimeRef.value.customValidationFnc = (value) => {
                const date = new Date(value);
                return date < new Date() ? ['The date needs to be in the future'] : [];
            };

            // Set items for the enum component
            this.myComponentEnumRef.value.setItems({item1: 'Item 1', item2: 'Item 2'});
        });
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
        const data = this.data || {};

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Form Elements Demo</h1>
                </div>
                <div class="container">
                    <form>
                        <dbp-string-element
                                subscribe="lang"
                                name="myComponentString"
                                label="My string"
                                value=${data.myComponentString || ''}
                                required>
                        </dbp-string-element>

                        <dbp-string-element
                                subscribe="lang"
                                name="myComponentLongString"
                                label="My long string"
                                value=${data.myComponentLongString || ''}
                                rows="5"
                                required>
                        </dbp-string-element>

                        <dbp-string-element
                                ${ref(this.mySpecialComponentStringRef)}
                                subscribe="lang"
                                name="mySpecialComponentString"
                                description="Shows the evaluation data in the error message if empty"
                                label="My special string"
                                value=${data.mySpecialComponentString || ''}
                                required>
                        </dbp-string-element>

                        <dbp-date-element
                                subscribe="lang"
                                name="myComponentDate"
                                label="My date"
                                value=${data.myComponentDate || ''}
                                required>
                        </dbp-date-element>

                        <dbp-datetime-element
                                ${ref(this.myComponentDateTimeRef)}
                                subscribe="lang"
                                name="myComponentDateTime"
                                description="Needs to be in the future"
                                label="My datetime"
                                value=${data.myComponentDateTime || ''}
                                required>
                        </dbp-datetime-element>

                        <dbp-enum-element
                                ${ref(this.myComponentEnumRef)}
                                subscribe="lang"
                                name="myComponentEnum"
                                label="My enum"
                                value=${data.myComponentEnum || ''}
                                required>
                        </dbp-enum-element>

                        <dbp-checkbox-element
                                subscribe="lang"
                                name="myComponentCheckbox"
                                label="My checkbox"
                                description="Check me"
                                value="check"
                                ?checked=${data.myComponentCheckbox || false}>
                        </dbp-checkbox-element>

                        ${this.getButtonRowHtml()}
                    </form>
                </div>
                ${this.renderResult(this.data)}
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
}

commonUtils.defineCustomElement('dbp-form-elements-demo', FormElementsDemo);
