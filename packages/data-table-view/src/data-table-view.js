import $ from 'jquery';
import dt from 'datatables.net';
import {setting, getAPiUrl} from './utils.js';
import {i18n} from './i18n';
import {html, LitElement} from 'lit-element';
import commonUtils from 'vpu-common/utils';

dt(window, $);

class DataTableView extends LitElement {
    constructor() {
        super();
        this.lang = 'de';
    }

    static get properties() {
        return {
            lang: { type: String },
            value: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
        };
    }

    loadWebPageElement() {
        if (window.VPUAuthToken === undefined || window.VPUAuthToken === "") {
            return;
        }

        const apiUrl = this.entryPointUrl + this.value; // TODO
        var that = this;

        fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Authorization': 'Bearer ' + window.VPUAuthToken,
            },
        })
            .then(res => res.json())
            .then() // TODO
            .catch();
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
        return html`
            <style>
            </style>
            <table>
                <tr><th>TODO..</th></tr>
            </table>
        `;
    }
}

commonUtils.defineCustomElement('vpu-data-table-view', DataTableView);
