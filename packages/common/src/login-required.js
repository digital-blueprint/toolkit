import {html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import DBPLitElement from './dbp-lit-element.js';
import * as commonStyles from './styles.js';
import {createInstance} from './i18n.js';
import {LangMixin} from './lang-mixin.js';
import {AuthMixin} from './auth-mixin.js';
import {ScopedElementsMixin} from './scoped/ScopedElementsMixin.js';

/**
 * Displays a warning when login is required.
 */
export class DBPLoginRequired extends AuthMixin(
    LangMixin(ScopedElementsMixin(DBPLitElement), createInstance),
) {
    static get properties() {
        return {
            ...super.properties,
        };
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getNotificationCSS(),
        ];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    _onLoginClicked(event) {
        event.preventDefault();

        this.dispatchEvent(
            new CustomEvent('dbp-login-requested', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    update(changedProps) {
        if (changedProps.has('auth')) {
            this.requestUpdate();
        }
        super.update(changedProps);
    }

    render() {
        const i18n = this._i18n;

        return html`
            <div
                class="notification is-warning ${classMap({
                    hidden: this.isLoggedIn() || this.isAuthPending(),
                })}">
                ${i18n.t('login-notification.error-login-message')}
                <a href="#" @click=${this._onLoginClicked}>
                    ${i18n.t('login-notification.error-login-link')}
                </a>
            </div>
        `;
    }
}

// Backwards-compatible exports.
export {DBPLoginRequired as loginNotif, DBPLoginRequired as loginNotification};
