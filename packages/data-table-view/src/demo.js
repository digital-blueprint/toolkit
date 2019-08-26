import 'vpu-auth';
import './data-table-view.js';
import {setting, getAssetURL,} from './utils.js';
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

    render() {
        // datatable.net tyles must be applied here :-/
        let dt_css = getAssetURL('datatables/css/jquery.dataTables.min.css');
        let rs_css = getAssetURL('datatables/css/responsive.dataTables.css');
        return html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
            <link rel="stylesheet" href="${dt_css}">
            <link rel="stylesheet" href="${rs_css}">
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
                <div class="content">
                    <vpu-auth lang="${this.lang}" client-id="${setting('keyCloakClientId')}" load-person force-login></vpu-auth>
                </div>
                <div class="content">
                    <h4>DataTable: paging and searching</h4>
                     <div class="box">
                        <vpu-data-table-view lang="${this.lang}" paging searching>
                            <div slot="table"><!-- slot encapsulates table -->
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
                                        <tr>
                                            <td>def</td>
                                            <td>456</td>
                                            <td>b-3-5-h</td>
                                        </tr>
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                        <tr>
                                            <td>abc</td>
                                            <td>123</td>
                                            <td>a-2-4-g</td>
                                        </tr>
                                        <tr>
                                            <td>def</td>
                                            <td>456</td>
                                            <td>b-3-5-h</td>
                                        </tr>
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                        <tr>
                                            <td>abc</td>
                                            <td>123</td>
                                            <td>a-2-4-g</td>
                                        </tr>
                                        <tr>
                                            <td>def</td>
                                            <td>456</td>
                                            <td>b-3-5-h</td>
                                        </tr>
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </vpu-data-table-view>
                    </div>
                    <h4>DataTable: no paging, no searching</h4>
                    <div class="box">
                        <vpu-data-table-view lang="${this.lang}">
                            <div slot="table"><!-- slot encapsulates table -->
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
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </vpu-data-table-view>
                    </div>
                </div>
                <div class="content">
                    <h4>Common Table</h4>
                      <div class="box">
                        <!-- <vpu-data-table-view lang="${this.lang}" paging searching> -->
                            <div slot="table">
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
                                        <tr>
                                            <td>def</td>
                                            <td>456</td>
                                            <td>b-3-5-h</td>
                                        </tr>
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                        <tr>
                                            <td>abc</td>
                                            <td>123</td>
                                            <td>a-2-4-g</td>
                                        </tr>
                                        <tr>
                                            <td>def</td>
                                            <td>456</td>
                                            <td>b-3-5-h</td>
                                        </tr>
                                        <tr>
                                            <td>ghi</td>
                                            <td>789</td>
                                            <td>c-4-6-i</td>
                                        </tr>
                                        <tr>
                                            <td>jkl</td>
                                            <td>012</td>
                                            <td>x-8-0-a</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        <!-- </vpu-data-table-view> -->
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view-demo', DataTableViewDemo);
