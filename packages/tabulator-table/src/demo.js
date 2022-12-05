import {createInstance, setOverridesByGlobalCache} from './i18n';
import {html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {TabulatorTable} from './tabulator-table';
import * as commonUtils from '@dbp-toolkit/common/utils';

export class TabulatorTableDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.url = '';
        this.selectedFiles = [];
        this.selectedFilesCount = 0;
        this.langDir = '';
    }

    static get scopedElements() {
        return {
            'dbp-tabulator-table': TabulatorTable,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
            langDir: {type: String, attribute: "lang-dir"},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.langDir) {
          setOverridesByGlobalCache(this._i18n, this);
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    render() {
        const i18n = this._i18n;
        let data = [
            {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
            {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
            {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
            {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
            {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
        ];

        let options = {
            layout:"fitColumns",
            columns:[
                {title:"Name", field:"name", width:150},
                {title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
                {title:"Favourite Color", field:"col"},
                {title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
            ],
            columnDefaults: {
                vertAlign: 'middle',
                hozAlign: 'left',
                resizable: false,
            },
        };

        return html`
            <section class="section">
                <div class="content">
                    <h1 class="title">${i18n.t('demo-title')}</h1>
                    <p></p>
                </div>
                <div class="content">
                    <dbp-tabulator-table lang="de" select-all-enabled pagination-enabled="true" data=${JSON.stringify(data)} options=${JSON.stringify(options)}></dbp-tabulator-table>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tabulator-table-demo', TabulatorTableDemo);
