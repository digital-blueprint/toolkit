import 'vpu-auth';
import './vpu-data-table-view.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import * as commonUtils from 'vpu-common/utils';
import bulmaCSSPath from "bulma/css/bulma.min.css";

class DataTableViewDemo extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.noAuth = false;
    }

    static get properties() {
        return {
            lang: { type: String },
            noAuth: { type: Boolean, attribute: 'no-auth' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        this.updateComplete.then(()=> {
            /*
                    First Table: with data
             */
            const vdtv1 = that.shadowRoot.querySelector('#vdtv1');
            if (vdtv1 !== null) {
                const vdtv1_columnDefs = [
                    { targets: [3], visible: false },
                    { targets: [2], orderData: [3] },
                    { targets: [3, 4], searchable: false },
                    { targets: [4], sortable: false }
                ];
                const tbl = [];
                for (let i = 0; i<25; ++i) {
                    tbl.push(this.vdtv_create_row());
                }
                vdtv1.set_columns([{title:'Bezeichnung'}, {title:'Nummer'}, {title:'Datum'}, null, null])
                    .set_columnDefs(vdtv1_columnDefs)
                    .set_datatable(tbl);
            }

            /*
                    Second Table: no data definition only
             */
            const vdtv2 = that.shadowRoot.querySelector('#vdtv2');
            if (vdtv2 !== null) {
                const vdtv2_columnDefs = [
                    { targets: [3], visible: false },
                    { targets: [2], orderData: [3] },
                    { targets: [3, 4], searchable: false },
                    { targets: [4], sortable: false }
                ];
                vdtv2.set_columns([{title:'Bezeichnung'}, {title:'Nummer'}, {title:'Datum'}, null, null])
                    .set_columnDefs(vdtv2_columnDefs)
                    .set_datatable([]);
            }
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    vdtv_create_row() {
        const str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const day = Math.floor(Math.random()*(31-1) + 1);
        const month = Math.floor(Math.random()*(12-1) + 1);
        const year = Math.floor(Math.random()*(2019-2016) + 2016);
        return [
            str,
            Math.floor(1000 * Math.random()),
            '' + day + '.' + month + '.' + year,
            '' + year + '-' + month + '-' + day,
            '<button onclick="alert(\'' + str + ' clicked\');">OK</button>'
        ];
    }

    vdtv2_add_rows() {
        console.log('vdtv2_add_rows() clicked');
        const vdtv2 = this.shadowRoot.querySelector('#vdtv2');
        if (vdtv2 !== null) {
            const row = this.vdtv_create_row();
            vdtv2.add_row(row).draw();
        }
    }

    getAuthComponentHtml() {
        return this.noAuth ? html`` : html`
            <div class="content">
                <vpu-auth lang="${this.lang}" client-id="${commonUtils.setting('keyCloakClientId')}" load-person force-login></vpu-auth>
            </div>
        `;
    }

    render() {
        commonUtils.initAssetBaseURL('vpu-data-table-view-src');
        const bulmaCSS = commonUtils.getAssetURL(bulmaCSSPath);
        return html`
            <link rel="stylesheet" href="${bulmaCSS}">
            <style>
                .box {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid orange;
                }
            </style>

            <section class="section">
                <div class="content">
                    <h1 class="title">DataTableView-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="content">
                    <h4>DataTable: with data, paging and searching</h4>
                     <div class="box">
                        <vpu-data-table-view lang="${this.lang}" paging searching id="vdtv1"></vpu-data-table-view>
                    </div>
                    <h4>DataTable: no data, no paging, no searching</h4>
                    <div class="box">
                    <button @click="${this.vdtv2_add_rows}">noch etwas...</button>
                        <vpu-data-table-view lang="${this.lang}" id="vdtv2"></vpu-data-table-view>
                    </div>
                </div>
                <div class="content">
                    <h4>Common Table</h4>
                      <div class="box">
                        <!-- <vpu-data-table-view lang="${this.lang}" paging searching> -->
                            <table class="display">
                                <thead>
                                    <tr>
                                        <th>A</th>
                                        <th>B</th>
                                        <th>C</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>abc</td>
                                        <td>123</td>
                                        <td>a-2-4-g</td>
                                    </tr>
                                </tbody>
                            </table>
                        <!-- </vpu-data-table-view> -->
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view-demo', DataTableViewDemo);
