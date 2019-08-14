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
        datatable.setAttribute('filter', e.target.value);
    }

    colsChange(e) {
        let datatable = this.shadowRoot.querySelector('#dt1');
        if (datatable === undefined) { alter('datatable not found'); return; }
        datatable.setAttribute('whitelisted-columns', e.target.value);
    }

    render() {
        return html`
            <style>
                .box {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid orange;
                }
                .box2 {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid green;
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
                    <h4>DataTable: paging and searching</h4>
                    <p>
                        <label for="filter">Filter für die Suche:</label>
                        <input type="text" name="filter" id="filter" value="" placeholder="Geben Sie mindestens 3 Zeichen ein" @change="${this.filterChange}">
                    </p>
                    <p>
                        <label for="columns">Spalten im Ergbnis:</label>
                        <input type="text" name="columns" id="columns" value="*" placeholder="Geben Sie einen Stern * für alle ein" @change="${this.colsChange}">
                    </p>
                    <div class="box">
                        <vpu-data-table-view
                            lang="${this.lang}"
                            value="Person"
                            filter=""
                            whitelisted-columns="*"
                            blacklisted-columns="phoneExtension name"
                            id="dt1"
                            paging
                            searching
                        ></vpu-data-table-view>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="content">
                <h4>DataTable: no paging, no searching</h4>
                    <div class="box2">
                        <vpu-data-table-view
                            lang="${this.lang}"
                            value="Person"
                            filter="Ab"
                            whitelisted-columns="name telephone email"
                            blacklisted-columns=""
                            id="dt2"
                            wait-until-all-loaded
                        ></vpu-data-table-view>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view-demo', DataTableViewDemo);
