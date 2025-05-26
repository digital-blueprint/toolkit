import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonStyles from '../styles.js';
import {getIconCSS, Icon, LangMixin} from '../index.js';

export class DbpIconDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}

            .content h2 {
                color: var(--dbp-content);
                font-weight: 600;
                line-height: 1.125;
                margin-top: 2em;
                font-size: 1.5em;
                margin-bottom: 0.75em;
            }

            .control {
                margin-bottom: 1.5rem;
            }

            .control:not(:last-child) {
                margin-bottom: 0.5rem;
            }

            a:hover {
                color: #ffbb00 !important;
                background-color: blue;
            }
        `;
    }

    render() {
        return html`
            <style>
                a:after {
                    ${getIconCSS('envelope')};
                }
            </style>
            <div class="content">
                <h2>Icons</h2>
                <div class="control">
                    <p style="text-decoration: underline">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <p style="font-size: 2em;">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <p style="font-size: 2em; color:var(--dbp-warning);">
                        Foo
                        <dbp-icon name="cloudnetwork" aria-label="cloudnetwork icon"></dbp-icon>
                        bar
                    </p>
                    <span style="background-color: #000">
                        <a href="#" style=" color: #fff">foobar</a>
                    </span>
                    <p style="font-size: 2em; color:var(--dbp-warning);">
                        Foo
                        <dbp-icon name="information" aria-label="Information icon"></dbp-icon>
                        bar
                    </p>
                    <br />

                    ${new Array(100).fill(0).map(
                        (i) => html`
                            <dbp-icon
                                aria-label="A happy face icon"
                                style="color:var(--dbp-success); width: 50px; height: 50px; border: #000 solid 1px"
                                name="happy"></dbp-icon>
                        `,
                    )}
                </div>
            </div>
        `;
    }
}
