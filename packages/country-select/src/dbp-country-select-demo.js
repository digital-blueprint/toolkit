import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin, LangMixin} from '@dbp-toolkit/common';
import {CountrySelect} from './country-select.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class CountrySelectDemo extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.selectedCountry = '';
    }

    static get scopedElements() {
        return {
            'dbp-country-select': CountrySelect,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            selectedCountry: {type: String, attribute: false},
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

                .help {
                    color: var(--dbp-muted);
                    margin-top: 0.5rem;
                }

                .result {
                    background: var(--dbp-background);
                    border: var(--dbp-border);
                    border-radius: var(--dbp-border-radius);
                    margin-top: 1rem;
                    padding: 1rem;
                }
            `,
        ];
    }

    handleCountryChange(event) {
        this.selectedCountry = event.detail.value;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">${i18n.t('demo.title')}</h1>
                    <p>${i18n.t('demo.description')}</p>
                </div>
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">${i18n.t('demo.select-label')}</label>
                            <div class="control">
                                <dbp-country-select
                                    lang="${this.lang}"
                                    @change="${this.handleCountryChange}"></dbp-country-select>
                            </div>
                            <!-- prettier-ignore -->
                            <p class="help">
                                ${i18n.t('demo.examples-label')}
                                <code>au</code>, <code>aus</code>, <code>de</code>, <code>at</code>
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">${i18n.t('demo.preselected-label')}</label>
                            <div class="control">
                                <dbp-country-select
                                    lang="${this.lang}"
                                    value="AT"></dbp-country-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">${i18n.t('demo.disabled-label')}</label>
                            <div class="control">
                                <dbp-country-select
                                    lang="${this.lang}"
                                    value="DE"
                                    disabled></dbp-country-select>
                            </div>
                        </div>
                    </form>

                    <div class="result">
                        ${i18n.t('demo.selected-country-label')}
                        <strong>${this.selectedCountry || i18n.t('demo.none')}</strong>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-country-select-demo', CountrySelectDemo);
