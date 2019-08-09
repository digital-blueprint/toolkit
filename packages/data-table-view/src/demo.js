import 'vpu-auth';
import './data-table-view.js';
import {setting, getAPiUrl} from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import commonUtils from 'vpu-common/utils';

class DataTableViewDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    filterChange(e) {
        let datatable = this.shadowRoot.querySelector('#dt1');
        datatable.filter = e.target.value;
    }

    render() {
        return html`
            <style>
                .box {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid orange;
                }
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">

            <section class="section">
                <div class="content">
                    <h1 class="title">DataTableView-Demo</h1>
                </div>
                <div class="content">
                    <vpu-auth lang="${this.lang}" client-id="${setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="content">
                    <label for="filter">Filter für die Suche:</label>
                    <input type="text" id="filter" value="" placeholder="Geben Sie mindestens 3 Zeichen ein" @change="${this.filterChange}">
                    <div class="box">
                    <vpu-data-table-view
                        lang="${this.lang}"
                        value="Person"
                        filter=""
                        blacklisted-columns="@id @type functions roles accountTypes"
                        id="dt1"
                    ></vpu-data-table-view>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view-demo', DataTableViewDemo);
