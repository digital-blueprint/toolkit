import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonStyles from '../styles.js';
import {Button, IconButton, LoadingButton, LangMixin} from '../index.js';

export class DbpButtonDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    static get scopedElements() {
        return {
            'dbp-button': Button,
            'dbp-icon-button': IconButton,
            'dbp-loading-button': LoadingButton,
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
        `;
    }

    buttonClickHandler(e) {
        // add class to button to end2end test if button was clicked
        e.target.classList.add('button-clicked');

        setTimeout(() => {
            this.shadowRoot.querySelectorAll('dbp-button').forEach((element) => {
                element.stop();
            });
        }, 1000);
    }

    loadingButtonClickHandler(e) {
        let button = e.target;
        button.start();
        setTimeout(() => {
            button.stop();
        }, 1000);
    }

    render() {
        return html`
            <div class="content">
                <h2>Button</h2>
                <div class="control">
                    <dbp-button
                        value="Primary"
                        @click="${this.buttonClickHandler}"
                        type="is-primary"></dbp-button>
                    <dbp-button value="No type" @click="${this.buttonClickHandler}"></dbp-button>
                    <dbp-button
                        value="Secondary"
                        @click="${this.buttonClickHandler}"
                        type="is-secondary"></dbp-button>
                    <dbp-button
                        value="Danger"
                        @click="${this.buttonClickHandler}"
                        type="is-danger"></dbp-button>
                    <dbp-button
                        value="Warning"
                        @click="${this.buttonClickHandler}"
                        type="is-warning"></dbp-button>
                    <dbp-button
                        value="Success"
                        @click="${this.buttonClickHandler}"
                        type="is-success"></dbp-button>
                    <dbp-button
                        value="Info"
                        @click="${this.buttonClickHandler}"
                        type="is-info"></dbp-button>
                    <br />
                    <br />
                    <dbp-button
                        value="Small primary"
                        @click="${this.buttonClickHandler}"
                        type="is-small is-primary"></dbp-button>
                    <dbp-button
                        value="Small secondary"
                        @click="${this.buttonClickHandler}"
                        type="is-small is-secondary"></dbp-button>
                    <br />
                    <br />
                    <dbp-loading-button
                        @click="${this.loadingButtonClickHandler}"
                        type="is-primary">
                        Loading Button
                    </dbp-loading-button>
                    <dbp-loading-button
                        @click="${this.loadingButtonClickHandler}"
                        type="is-primary"
                        disabled>
                        Loading Button Disabled
                    </dbp-loading-button>
                    <br />
                    <br />
                    <dbp-icon-button
                        icon-name="checkmark-circle"
                        aria-label="Click to approve this changes"
                        title="Enter input"></dbp-icon-button>
                    <dbp-icon-button
                        icon-name="chrome"
                        aria-label="Select your browser"
                        title="Enter input"></dbp-icon-button>
                    <dbp-icon-button
                        icon-name="steam"
                        aria-label="Play games by pressing this button"
                        title="Enter input"></dbp-icon-button>
                    <dbp-icon-button
                        icon-name="bug"
                        title="No aria-label defined"></dbp-icon-button>
                </div>
            </div>
        `;
    }
}
