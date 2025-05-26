import {css, html} from 'lit';
import {createInstance} from './i18n';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class DbpBaseView extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.hidden = false;
    }

    static get properties() {
        return {
            ...super.properties,
            label: {type: String},
            value: {type: String},
            hidden: {type: Boolean},
        };
    }

    static get styles() {
        return [
            // language=css
            css`
                fieldset {
                    border: none;
                    margin: 15px 0;
                    padding: 0;
                }

                slot[name='label'],
                fieldset label {
                    font-weight: bold;
                    display: block;
                }

                fieldset input:not([type='radio']):not([type='checkbox']),
                fieldset select,
                fieldset textarea {
                    width: calc(100% - 12px);
                    padding: 2px 5px;
                    border: 1px solid var(--dbp-border);
                }
            `,
        ];
    }

    render() {
        if (this.hidden) {
            return html``;
        }

        return html`
            <fieldset>
                <label>${this.label}</label>
                ${this.renderValue()}
            </fieldset>
        `;
    }

    renderValue() {
        return html`
            Please implement renderValue() in your subclass!
        `;
    }
}
