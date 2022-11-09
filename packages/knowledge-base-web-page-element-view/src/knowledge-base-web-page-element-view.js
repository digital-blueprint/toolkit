import {createInstance, setOverridesByGlobalCache} from './i18n';
import {html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {MiniSpinner} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {AdapterLitElement} from '@dbp-toolkit/common';

/**
 * KnowledgeBaseWebPageElementView web component
 */
export class KnowledgeBaseWebPageElementView extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';
        this.value = '';
        this.html = '';
        this.entryPointUrl = '';
        this.error = '';
        this.eyeClose =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA1ElEQVQ4ja3SMU5CURCF4c+ejpiILe5DZAGyASuJS5CKEoMGKhdAwWKgMkriKjQWFkAkBizgmckNPEgeJ7nVuee/M3eGI2mCehFAHZ/Hgtygizd84wsjPOHsEMgUqx1njvtd4R7uAmSIMipo4SeAHtLwdTCbG8gHLsOdVlJN9LwEY4nSFsh5AhhHwGtinoY/ySDlPEAjMbvByyDDvBbgOZi/eNxUkrUTp9NJw3CCNhbJS0vcBshgWzjqAn28W899Zr1U1dBObR8kT9nGXhWFTIoA/vUHQydS/iUcHx4AAAAASUVORK5CYII=';
        this.eyeOpen =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5UlEQVQ4jc3SvS7EURAF8B+JioSsCokHUFgNiWewQqvzICRew2v4WLFUnoNS/msrazUaFOYm12RlVeIkk9ycM2fmztzLf8U02tiPaAc3EbM4Rh8fKfo4wdxP5nXcV4YhLnGO54p/wEY2b6akHhYqfR7dVHyriMt4qsQRWtiNaw+wFwWHaaQlcc161l4UblIyXKTcM7hL5FUk14tsgsvNumIhb2NG6ISxiXMrtJI3wErZwyHeK/E2DAWLuKn0F2xLOEgdRriOeK34sc9YsIpT37dd4hFHvj7bRMxElw52sIap3xj/Hp9rzGFBhiMSxAAAAABJRU5ErkJggg==';
        //this.css = 'kb.css';
        this.text = '';
        this.class = '';
        this.auth = {};
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            value: {type: String},
            html: {type: String, attribute: false},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            id: {type: String, attribute: false},
            error: {type: String, attribute: false},
            //css: { type: String },
            text: {type: String},
            auth: {type: Object},
        };
    }

    /**
     * Loads the data from the web page element
     */
    loadWebPageElement() {
        const i18n = this._i18n;

        if (this.auth.token === undefined || this.auth.token === '') {
            return;
        }

        // sadly there there is no entity url without "collectionOperations" in entity KnowledgeBaseWebPageElement!
        const apiUrl =
            this.entryPointUrl +
            '/web_page_elements/knowledge_base_web_page_elements/' +
            encodeURIComponent(commonUtils.base64EncodeUnicode(encodeURIComponent(this.value))) +
            '?lang=' +
            encodeURIComponent(this.lang);

        var that = this;
        fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        })
            .then(function (res) {
                if (!res.ok) {
                    let status_msg;
                    switch (res.status) {
                        case 403:
                            status_msg = i18n.t('dbp.is-forbidden');
                            break;
                        case 404:
                            status_msg = i18n.t('dbp.was-not-found');
                            break;
                        case 500:
                            status_msg = i18n.t('dbp.troubled-server');
                            break;
                        default:
                            status_msg = i18n.t('dbp.unknown-problems');
                    }
                    const error_head = i18n.t('dbp.error-head');
                    that.error = html`
                        <p>
                            ${error_head} "
                            <b>${that.value}</b>
                            " ${status_msg} (${res.status}).
                        </p>
                    `;
                    that.html = '';
                    throw new Error(
                        'HTTP ' +
                            error_head +
                            ' ' +
                            that.value +
                            ' ' +
                            status_msg +
                            ', status = ' +
                            res.status
                    );
                }
                return res.json();
            })
            .then((webPageElement) => {
                if (webPageElement !== undefined && webPageElement.text !== undefined) {
                    that.html = webPageElement.text;
                }
            })
            // catch e.g. 404 errors
            .catch();
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.langDir != '') {
        setOverridesByGlobalCache(this._i18n, this);
      }
    }
    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            if (propName === 'lang') {
                this._i18n.changeLanguage(this.lang);
            }

            switch (propName) {
                case 'lang':
                case 'value':
                case 'entry-point-url': {
                    this.html = '';
                    const img = this._('#A2');
                    if (img !== null) {
                        img.src = this.eyeOpen;
                    }
                    const div = this._('#A1');
                    if (div !== null) {
                        div.style.display = 'none';
                    }
                    break;
                }
                case 'text':
                    this.class = this.text !== '' ? 'has-text' : '';
                    break;
            }
        });

        super.update(changedProperties);
    }

    toggle(e) {
        const div = this._('#A1');
        const img = this._('#A2');
        const d = div.style.display;
        if (d === '' || d === 'none') {
            div.style.display = 'block';
            img.src = this.eyeClose;
        } else {
            div.style.display = 'none';
            img.src = this.eyeOpen;
        }
        if (this.html === '' && div.style.display !== 'none') {
            this.html = '<dbp-mini-spinner></dbp-mini-spinner>';
            this.loadWebPageElement();
        }
    }

    render() {
        return html`
            <style>
                .kb {
                    display: none;
                    border-radius: var(--KBBorderRadius, 0);
                    border: var(--KBBorder, 0);
                    margin: var(--KBMargin, 0);
                    padding: var(--KBPadding, 0);
                }
                span.has-text img {
                    margin-left: 5px;
                }
                span.with-pointer {
                    cursor: pointer;
                }
            </style>
            <span class="with-pointer ${this.class}" @click="${this.toggle}">
                ${this.text}
                <img src="${this.eyeOpen}" id="A2" alt="open/close" />
            </span>
            <div class="kb" id="A1">${unsafeHTML(this.html)} ${this.error}</div>
        `;
    }
}
