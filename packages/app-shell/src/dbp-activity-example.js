import {html} from 'lit';
import {createInstance} from './i18n.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {LangMixin} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';

class ActivityExample extends LangMixin(DBPLitElement, createInstance) {
    render() {
        const i18n = this._i18n;
        return html`
            <h3>${i18n.t('activity-example.hello-world')}</h3>
            <ul>
                ${Array.from(Array(100).keys()).map(
                    (i) => html`
                        <li>${i18n.t('activity-example.hello-world') + ' ' + i}</li>
                    `,
                )}
            </ul>
        `;
    }
}

commonUtils.defineCustomElement('dbp-activity-example', ActivityExample);
