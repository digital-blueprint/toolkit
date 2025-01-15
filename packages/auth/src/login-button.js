import {createInstance} from './i18n.js';
import {html, css} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {LoginStatus} from './util.js';
import {AdapterLitElement, MiniSpinner} from '@dbp-toolkit/common';

let logoutSVG = `
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
  <path
     d="m 20.749313,38.894934 -5.885859,6.967885 h 43.408213 c 1.839331,0 3.433418,1.741972 3.433418,4.064599 0,2.322628 -1.471465,4.064599 -3.433418,4.064599 H 14.863454 l 5.885859,6.967883 c 1.348843,1.596808 1.348843,4.064599 0,5.661406 -1.348843,1.596808 -3.433418,1.596808 -4.782261,0 L 1.9881356,49.927418 15.967052,33.378693 c 1.348843,-1.596806 3.433418,-1.596806 4.782261,0 1.348843,1.596807 1.348843,4.064599 0,5.516241 z"
     id="path2"
     style="stroke-width:1.33417916"
     inkscape:connector-curvature="0" />
  <path
     style="stroke-width:0.67017764"
     d="M 61.663665,16.308792 C 48.158763,16.560171 35.913199,25.828579 30.896087,38.197464 34.816744,37.806184 40.033349,39.91491 41.470306,35.017776 50.594944,21.215302 72.517616,20.362655 82.800384,33.07637 93.497261,44.618596 90.228387,65.093356 76.499603,72.791214 64.104901,80.786232 45.895432,75.593227 39.470306,62.310745 35.613955,62.60637 27.974792,60.593775 32.925384,66.267776 41.232037,82.878292 64.023613,89.46919 79.876556,79.765823 96.140149,70.989504 102.10102,48.145494 91.970306,32.629104 85.705979,22.257901 73.793809,15.772382 61.663665,16.308792 Z"
     id="path4"
     inkscape:connector-curvature="0" />
</g>
</svg>
`;

let loginSVG = `
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
    <path
   style="stroke-width:1.33417916"
   id="path2"
   d="m 42.943908,38.894934 5.885859,6.967885 H 5.4215537 c -1.8393311,0 -3.4334181,1.741972 -3.4334181,4.064599 0,2.322628 1.4714649,4.064599 3.4334181,4.064599 H 48.829767 L 42.943908,60.9599 c -1.348843,1.596808 -1.348843,4.064599 0,5.661406 1.348843,1.596808 3.433418,1.596808 4.782261,0 L 61.705085,49.927418 47.726169,33.378693 c -1.348843,-1.596806 -3.433418,-1.596806 -4.782261,0 -1.348843,1.596807 -1.348843,4.064599 0,5.516241 z" />
    <path
   id="path4"
   d="m 50,2.3007812 c -18.777325,0 -35.049449,10.9124408 -42.8261719,26.7246098 H 13.390625 C 20.672112,16.348362 34.336876,7.8007812 50,7.8007812 73.3,7.8007812 92.300781,26.7 92.300781,50 92.300781,73.3 73.3,92.300781 50,92.300781 c -15.673389,0 -29.345175,-8.60579 -36.623047,-21.326172 H 7.1640625 C 14.942553,86.8272 31.242598,97.800781 50.099609,97.800781 76.399609,97.800781 97.900391,76.4 97.900391,50 97.800391,23.7 76.3,2.3007812 50,2.3007812 Z" />
</g>
</svg>
`;

export class LoginButton extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.auth = {};
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
            auth: {type: Object},
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    _onLoginClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_IN);
        e.preventDefault();
    }

    _onLogoutClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_OUT);
        e.preventDefault();
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
        return [
            commonStyles.getThemeCSS(),
            css`
                :host {
                    display: inline-block;
                }

                a {
                    color: var(--dbp-content);
                    fill: var(--dbp-content);
                    cursor: pointer;
                    text-decoration: none;
                }

                .login-box {
                    display: flex;
                    align-items: center;
                    padding: 0.3em 0.4em;
                    transition: background-color 0.15s, color 0.15s;
                }

                .login-box svg,
                .icon {
                    width: 1.1em;
                    height: 1.1em;
                }

                .login-box svg,
                .spinner {
                    display: flex;
                }

                .login-box:hover svg path {
                    fill: var(--dbp-hover-color);
                }

                .login-box:hover {
                    color: var(--dbp-hover-color, var(--dbp-content));
                    background-color: var(--dbp-hover-background-color);
                    cursor: pointer;
                    transition: none;
                }

                .login-box .label {
                    padding-left: 0.2em;
                }
            `,
        ];
    }

    render() {
        let i18n = this._i18n;
        if (this.auth['login-status'] === LoginStatus.LOGGING_IN) {
            // try to keep the layout the same to avoid layout shifts
            return html`
                <a href="#">
                    <div class="login-box login-button" aria-busy="true">
                        <div class="icon" aria-hidden="false" aria-label="${i18n.t('logging-in')}">
                            <dbp-mini-spinner class="spinner"></dbp-mini-spinner>
                        </div>
                        <div class="label" aria-hidden="true">&#8203;</div>
                    </div>
                </a>
            `;
        } else if (this.auth['login-status'] === LoginStatus.LOGGED_IN) {
            return html`
                <a href="#" @click="${this._onLogoutClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${unsafeHTML(logoutSVG)}</div>
                        <div class="label">${i18n.t('logout')}</div>
                    </div>
                </a>
            `;
        } else {
            return html`
                <a href="#" @click="${this._onLoginClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${unsafeHTML(loginSVG)}</div>
                        <div class="label">${i18n.t('login')}</div>
                    </div>
                </a>
            `;
        }
    }
}
