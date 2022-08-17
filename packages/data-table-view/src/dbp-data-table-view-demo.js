import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import {DataTableView} from './data-table-view.js';
import {createInstance} from './i18n';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

export class DataTableViewDemo extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.entryPointUrl = '';
        this.noAuth = false;
    }

    static get scopedElements() {
        return {
            'dbp-data-table-view': DataTableView,
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            langDir: {type: String},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            noAuth: {type: Boolean, attribute: 'no-auth'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        this.updateComplete.then(() => {
            /*
                    First Table: with data
             */
            const vdtv1 = that.shadowRoot.querySelector('#vdtv1');
            if (vdtv1 !== null) {
                const vdtv1_columnDefs = [
                    {targets: [3], visible: false},
                    {targets: [2], orderData: [3]},
                    {targets: [3, 4], searchable: false},
                    {targets: [4], sortable: false},
                ];
                const tbl = [];
                for (let i = 0; i < 25; ++i) {
                    tbl.push(this.vdtv_create_row());
                }
                vdtv1
                    .set_columns([
                        {title: 'Bezeichnung'},
                        {title: 'Nummer'},
                        {title: 'Datum'},
                        null,
                        null,
                    ])
                    .set_columnDefs(vdtv1_columnDefs)
                    .set_datatable(tbl)
                    .on('draw', this.vdtv_draw.bind(this));
            }

            /*
                    Second Table: no data definition only
             */
            const vdtv2 = that.shadowRoot.querySelector('#vdtv2');
            if (vdtv2 !== null) {
                const vdtv2_columnDefs = [
                    {targets: [3], visible: false},
                    {targets: [2], orderData: [3]},
                    {targets: [3, 4], searchable: false},
                    {targets: [4], sortable: false},
                ];
                vdtv2
                    .set_columns([
                        {title: 'Bezeichnung-2'},
                        {title: 'Nummer-2'},
                        {title: 'Datum-2'},
                        null,
                        null,
                    ])
                    .set_columnDefs(vdtv2_columnDefs)
                    .set_datatable([]);
            }
            /*
                    Third Table: ordering demo
             */
            const vdtv3 = that.shadowRoot.querySelector('#vdtv3');
            if (vdtv3 !== null) {
                const vdtv3_columnDefs = [{targets: [0, 1, 2], visible: true}];
                vdtv3
                    .set_columns([{title: 'City'}, {title: 'Zip'}, {title: 'Museum'}])
                    .set_columnDefs(vdtv3_columnDefs)
                    // .set_defaultOrder([[1,"desc"],[2,"asc"]])
                    .set_datatable([
                        {0: 'Graz', 1: '8020', 2: 'Alte Galerie'},
                        {0: 'Graz', 1: '8020', 2: 'Kunsthaus'},
                        {0: 'Graz', 1: '8010', 2: 'Haus der Wissenschaft'},
                        {0: 'Graz', 1: '8010', 2: 'Landeszeughaus'},
                        {0: 'Linz', 1: '4020', 2: 'Lentos Kunstmuseum'},
                        {0: 'Linz', 1: '4020', 2: 'Ars Electronica Center'},
                        {0: 'Wien', 1: '1010', 2: 'Museum für Plansprachen'},
                    ]);
            }
        });
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    vdtv_create_row() {
        const str = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5);
        const day = Math.floor(Math.random() * (31 - 1) + 1);
        const month = Math.floor(Math.random() * (12 - 1) + 1);
        const year = Math.floor(Math.random() * (2019 - 2016) + 2016);
        return [
            str,
            Math.floor(1000 * Math.random()),
            '' + day + '.' + month + '.' + year,
            '' + year + '-' + month + '-' + day,
            "<button class='button is-small' onclick=\"alert('" + str + ' clicked\');">OK</button>',
        ];
    }

    vdtv_draw() {
        const vdtv1 = this.shadowRoot.querySelector('#vdtv1');
        const value = vdtv1.columnReduce(1, function (a, b) {
            return a * 1 + b * 1;
        });
        this.shadowRoot.querySelector('#id-sum').value = value;
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
        return this.noAuth
            ? html`
                  <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
              `
            : html`
                  <div class="container">
                      <dbp-auth-keycloak
                          subscribe="requested-login-status"
                          lang="${this.lang}"
                          entry-point-url="${this.entryPointUrl}"
                          silent-check-sso-redirect-uri="/dist/silent-check-sso.html"
                          url="https://auth-dev.tugraz.at/auth"
                          realm="tugraz-vpu"
                          client-id="auth-dev-mw-frontend-local"
                          try-login></dbp-auth-keycloak>
                      <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                  </div>
              `;
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        return html`
            <style>
                .box {
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid orange;
                }
                /* from BULMA.CSS */
                .content h1 {
                    font-size: 2em;
                    margin-bottom: 0.5em;
                }
                .content h1,
                .content h2,
                .content h3,
                .content h4,
                .content h5,
                .content h6 {
                    color: var(--dbp-content);
                    font-weight: 600;
                    line-height: 1.125;
                }
                .content table {
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                .content table th:not([align]) {
                    text-align: left;
                }
                .content table thead th {
                    border-width: 0 0 2px;
                    color: var(--dbp-content);
                }
                .content table th {
                    border: 1px solid #dbdbdb;
                    padding: 0.5em 0.75em;
                    vertical-align: top;
                }
                .content table td {
                    padding: 0.5em 0.75em;
                    vertical-align: top;
                }
            </style>

            <section class="section">
                <div class="content">
                    <h1 class="title">DataTableView-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="content">
                    <h4>DataTable: with data, paging and searching AND exportable</h4>
                    <div class="box">
                        <label for="id-sum">
                            Sum of column
                            <b>Number</b>
                            is
                        </label>
                        <input type="text" readonly value="" name="sum" id="id-sum" />
                        <dbp-data-table-view
                            paging
                            searching
                            column-searching
                            default-order='[1,"asc"]'
                            exportable
                            export-name="Demo Export"
                            lang="${this.lang}"
                            id="vdtv1"></dbp-data-table-view>
                    </div>
                    <h4>DataTable: no data, no paging, no searching</h4>
                    <div class="box">
                        <button class="button is-small" @click="${this.vdtv2_add_rows}">
                            add something...
                        </button>
                        <dbp-data-table-view lang="${this.lang}" id="vdtv2"></dbp-data-table-view>
                    </div>
                    <h4>DataTable: ordering by column 'zip' desc, 'museum' asc</h4>
                    <div class="box">
                        <dbp-data-table-view
                            default-order='[[1,"desc"],[2,"asc"]]'
                            lang="${this.lang}"
                            id="vdtv3"></dbp-data-table-view>
                    </div>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-data-table-view-demo', DataTableViewDemo);
