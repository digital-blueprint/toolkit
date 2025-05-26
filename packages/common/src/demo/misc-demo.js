import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonStyles from '../styles.js';
import {
    MiniSpinner,
    Spinner,
    InlineNotification,
    Translated,
    Translation,
    LangMixin,
} from '../index.js';

export class DbpMiscDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
            'dbp-spinner': Spinner,
            'dbp-inline-notification': InlineNotification,
            'dbp-translated': Translated,
            'dbp-translation': Translation,
        };
    }

    static get properties() {
        return {
            ...super.properties,
        };
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}

            .control:not(:last-child) {
                margin-bottom: 0.5rem;
            }

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
                margin-top: 2em;
            }
        `;
    }

    render() {
        return html`
            <div class="content">
                <h2>Mini Spinner</h2>
                <div class="control">
                    <dbp-mini-spinner text="Loading..."></dbp-mini-spinner>
                    <dbp-mini-spinner></dbp-mini-spinner>
                    <dbp-mini-spinner style="font-size: 2em"></dbp-mini-spinner>
                    <dbp-mini-spinner style="font-size: 3em"></dbp-mini-spinner>
                </div>
            </div>
            <div class="content">
                <h2>Spinner</h2>
                <div class="control">
                    <dbp-spinner></dbp-spinner>
                </div>
            </div>
            <div class="content">
                <h2>Theming CSS Override API</h2>
                <pre><code style="text-wrap: wrap;">
&lt;style&gt;
html {
    /* This will override --dbp-primary-surface */
    --dbp-override-primary-surface: green;
    /* Same for all other variables, prefix with "override" */
}
&lt;/style&gt;</code></pre>
            </div>
            <div class="content">
                <h2>Inline Notification</h2>
                <div class="control">
                    <dbp-inline-notification
                        summary="Default - no type"
                        body="Item <b>foo</b> was deleted!"></dbp-inline-notification>
                    <br />
                    <dbp-inline-notification
                        summary="Primary - Item deleted"
                        body="Item <b>foo</b> was deleted!"
                        type="primary"></dbp-inline-notification>
                    <br />
                    <dbp-inline-notification
                        summary="Info - Item deleted"
                        body="Item <b>foo</b> was deleted!"
                        type="info"></dbp-inline-notification>
                    <br />
                    <dbp-inline-notification
                        summary="Success - Item deleted"
                        body="Item <b>foo</b> was deleted!"
                        type="success"></dbp-inline-notification>
                    <br />
                    <dbp-inline-notification
                        summary="Warning - item deleted"
                        body="Item <b>foo</b> was deleted!"
                        type="warning"></dbp-inline-notification>
                    <br />
                    <dbp-inline-notification
                        summary="Danger - item will be deleted"
                        body="Item <b>foo</b> was deleted!"
                        type="danger"></dbp-inline-notification>
                </div>
            </div>
            <div class="content">
                <h2>Translated text</h2>
                <div class="control" id="dbp-translated-demo">
                    <dbp-translated subscribe="lang">
                        <div slot="de">
                            Dieser Text ist Deutsch und wird Englisch werden wenn man die Sprache
                            auf Englisch stellt.
                        </div>
                        <div slot="en">
                            This text is English and will be German if the language is changed to
                            German.
                        </div>
                    </dbp-translated>
                </div>
                <div class="control" id="dbp-translation-demo">
                    <dbp-translation
                        key="toolkit-showcase"
                        subscribe="lang, lang-dir"></dbp-translation>
                    <dbp-translation
                        key="toolkit-showcase-link"
                        var='{"link1": "https://www.i18next.com/translation-function/interpolation"}'
                        subscribe="lang, lang-dir"
                        unsafe></dbp-translation>
                    <dbp-translation key="abc" subscribe="lang, lang-dir"></dbp-translation>
                </div>
            </div>
        `;
    }
}
