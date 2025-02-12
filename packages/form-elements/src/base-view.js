import {css, html} from 'lit';
import {createInstance} from './i18n';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class DbpBaseView extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.label = '';
        this.value = '';
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            label: {type: String},
            value: {type: String},
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

                fieldset label {
                    font-weight: bold;
                    display: block;
                }

                fieldset input, fieldset select, fieldset textarea {
                    width: 95%;
                }
            `,
        ];
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    render() {
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
