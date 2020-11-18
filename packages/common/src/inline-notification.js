import {i18n} from '../i18n';
import {createUUID} from '../utils'
import {css, html} from 'lit-element';
import DBPLitElement from '../dbp-lit-element';
import * as commonStyles from '../styles';

/**
 * Inline Notification
 * 
 * Summary can be a string or empty
 * 
 * Body can be a string, html or empty
 * 
 * Type can be primary/info/success/warning/danger (default: info)
 *  
 */
export class InlineNotification extends DBPLitElement {
    constructor() {
        super();
        this.lang = 'de';
        this.type = '';
        this.summary = '';
        this.body = '';
    }

    static get properties() {
        return {
            lang: { type: String },
            type: { type: String },
            summary: { type: String },
            body: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getNotificationCSS()}

            .notification:not(:last-child) {
                margin-bottom: 1.5rem;
            }

            .notification h3 {
                font-weight: bold;
                margin-bottom: 3px;
            }

            .notification h3 {
                margin: 0 0 3px 0;
                font: inherit;
                font-weight: bold; 
            }
        `;
    }

    createBodyHtml() {
        return document.createRange().createContextualFragment(`${ this.body }`);
    }

    render() {
        const notificationId = createUUID();
        const bodyHtml = this.createBodyHtml();

        return html`
            <div class="columns">
                <div class="column">
                    <div id="inline-notification-${ notificationId }" class="notification is-${ this.type !== '' ? this.type : 'info' }">
                        ${ this.summary !== '' ? html`<h3>${ this.summary }</h3>` : `` }
                        ${ bodyHtml }
                    </div>
                </div>
            </div>
        `;
    }
}