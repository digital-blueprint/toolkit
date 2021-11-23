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
        this.type = '';
        this.summary = '';
        this.body = '';
    }

    static get properties() {
        return {
            type: { type: String },
            summary: { type: String },
            body: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
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
        return document.createRange().createContextualFragment(`<slot name="body">${ this.body }</slot>`);
    }

    render() {
        const bodyHtml = this.createBodyHtml();

        return html`
            <div class="columns">
                <div class="column">
                    <div id="inline-notification" class="notification is-${ this.type !== '' ? this.type : 'info' }">
                        ${ this.summary !== '' ? html`<h3>${ this.summary }</h3>` : `` }
                        ${ bodyHtml }
                    </div>
                </div>
            </div>
        `;
    }
}