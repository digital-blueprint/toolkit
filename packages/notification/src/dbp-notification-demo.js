import {createInstance} from './i18n';
import {send as notify} from '@dbp-toolkit/common/notification';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Notification} from './notification.js';
import {getRandomInt} from './utils.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class NotificationDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-notification': Notification,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
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
        const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Notification-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <button id="send-button" @click="${this.send}" class="button">
                                ${i18n.t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    send() {
        const types = ['primary', 'info', 'success', 'danger', 'warning'];
        const ids = ['download-event', 'upload-event', 'delete-event', 'error-event'];
        const currentId = ids[Math.floor(Math.random() * ids.length)];
        notify({
            summary: 'Item deleted',
            body: `Item ${Math.random().toString(36).substring(7)} foo was deleted! Even ID: ${currentId}`,
            type: types[Math.floor(Math.random() * types.length)],
            timeout: getRandomInt(5, 15),
            replaceId: currentId,
        });
    }
}

commonUtils.defineCustomElement('dbp-notification-demo', NotificationDemo);
