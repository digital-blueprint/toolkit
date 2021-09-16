import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import tippy from 'tippy.js';
import tippy2CSSPath from 'tippy.js/dist/tippy.css';

export class ButtonTooltip extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this.textContent = 'missing text.';
        this.buttonText = 'submit';
        this.addEventListener('click', this._handleClick);
        this.type = 'submit';
        this.formId = '';
    }

    static get properties() {
        return {
            ...super.properties,
            textContent: { type: String, attribute: 'text-content' },
            buttonText: { type: String, attribute: 'button-text' },
            type: { type: String },
            formId: { type: String, attribute: 'form-id' },
        };
    }

    firstUpdated() {
        this.setOrUpdateTippy();
    }

    setOrUpdateTippy() {
        if (this._('#info-tooltip-button')) {
            if (this._('#info-tooltip-button')._tippy) {
                this._('#info-tooltip-button')._tippy.setProps({
                    content: this.textContent,
                    appendTo: this.shadowRoot,
                });
            } else {
                tippy(this._('#info-tooltip-button'), {
                    content: this.textContent,
                    appendTo: this.shadowRoot,
                });
            }
        }
    }

    _handleClick(event) {
        const form = this.formId ? document.getElementById(this.formId) : this.closest('form');

        if (form) {
            switch (this.type) {
                case 'reset':
                    form.reset();
                    break;
                case 'submit':
                    form.requestSubmit();
                    break;
                default:
            }
        }
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS(false)}
            ${commonStyles.getButtonCSS()}

            .info-icon {
                display: inline;
                opacity: 0.7;
                top: 2px;
                position: relative;
            }

        `;
    }

    render() {

        const tippy2CSS = commonUtils.getAssetURL(tippy2CSSPath);
       
        this.setOrUpdateTippy();

        return html`
            <link rel="stylesheet" href="${tippy2CSS}">
            <button id="info-tooltip-button">
                <div class="info-icon">
                    <!-- https://icons.getbootstrap.com/icons/info-circle/ -->
                    <svg 
                         xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </div>
                ${this.buttonText}
            </button>
            
        `;
    }

}
