import {css, html} from 'lit';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import {ref, createRef} from 'lit/directives/ref.js';
import {DbpBaseElement} from '../base-element.js';

export class DbpStringElement extends ScopedElementsMixin(DbpBaseElement) {
    constructor() {
        super();
        this.label = 'A string field';
        this.rows = 1;
        this.placeholder = '';
        this.maxLength = null;
        this.wordCountLimit = null;
        /** @type {import('lit/directives/ref.js').Ref<HTMLTextAreaElement>} */
        this.textareaRef = createRef();
        this.inputRef = createRef();
        this._userProvidedValidator = null;
    }

    static get properties() {
        return {
            ...super.properties,
            rows: {type: Number},
            placeholder: {type: String},
            maxLength: {type: Number, attribute: 'maxlength'},
            wordCountLimit: {type: Number, attribute: 'word-count-limit'},
        };
    }

    firstUpdated() {
        super.firstUpdated();

        // Store the user-provided validator if it exists
        if (this.customValidator) {
            this._userProvidedValidator = this.customValidator;
        }

        const formElement = this.rows > 1 ? this.textareaRef.value : this.inputRef.value;

        if (this.wordCountLimit && formElement) {

            formElement.addEventListener('input', (event) => {
                const words = formElement.value.trim().split(/\s+/);
                this.customValidator = () => {
                    // First call the user-provided validator if it exists
                    if (this._userProvidedValidator) {
                        const userError = this._userProvidedValidator(this.value);
                        if (userError) {
                            return userError;
                        }
                    }
                    // Then, check word count limit
                    if (words.length > this.wordCountLimit) {
                        return this._i18n.t('render-form.string.word-count-exceeded', {
                            wordLimit: this.wordCountLimit,
                            wordCount: words.length,
                        });
                    }
                    return null; // No errors
                };
                this.handleErrors();
            });
        }
    }

    static get styles() {
        return [
            ...super.styles,
            // language=css
            css`
                :host([layout-type='inline']) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    align-items: center;
                }

                :host([layout-type='inline'][rows]) fieldset {
                    display: flex;
                    gap: var(--dbp-enum-label-gap, 1em);
                    align-items: flex-start;
                }

                :host([layout-type='inline']) label {
                    margin-bottom: 0;
                    white-space: nowrap;
                }

                textarea {
                    resize: vertical;
                }
            `,
        ];
    }

    renderInput() {
        // With the textarea tag, it's advised to use `.value` to set the value!
        // https://lit.dev/docs/templates/expressions/#binding-properties
        return html`
            ${this.rows > 1
                ? html`
                      <textarea
                          id="${this.formElementId}"
                          ${ref(this.textareaRef)}
                          name="${this.name}"
                          rows="${this.rows}"
                          .value="${this.value}"
                          placeholder="${this.placeholder}"
                          @input="${this.handleInputValue}"
                          maxlength="${this.maxLength}"
                          ?disabled=${this.disabled}
                          ?required=${this.required}></textarea>
                  `
                : html`
                      <input
                          type="text"
                          id="${this.formElementId}"
                          ${ref(this.inputRef)}
                          name="${this.name}"
                          .value="${this.value}"
                          placeholder="${this.placeholder}"
                          @input="${this.handleInputValue}"
                          maxlength="${this.maxLength}"
                          ?disabled=${this.disabled}
                          ?required=${this.required} />
                  `}
        `;
    }
}
