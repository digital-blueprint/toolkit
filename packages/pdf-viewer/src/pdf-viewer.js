import {createInstance} from './i18n';
import {createUUID} from './utils';
import {css, html} from 'lit';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';

/**
 * PdfViewer web component
 */
export class PdfViewer extends DBPLitElement {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;

        window.addEventListener('dbp-pdf-viewer-send', (e) => {
            if (typeof e.detail === 'undefined') {
                return;
            }

            that.pdfViewerBlock = that._('#pdf-viewer');
            const pdfViewerId = `pdf-viewer-${createUUID()}`;

            const type = typeof e.detail.type !== 'undefined' ? e.detail.type : 'info';
            const body = typeof e.detail.body !== 'undefined' ? e.detail.body : '';
            const summary = typeof e.detail.summary !== 'undefined' ? e.detail.summary : '';
            const timeout = typeof e.detail.timeout !== 'undefined' ? e.detail.timeout : 0;
            const icon = typeof e.detail.icon !== 'undefined' ? e.detail.icon : '';
            const iconHTML = icon !== '' ? `<dbp-icon name="${icon}"></dbp-icon>` : '';
            const summaryHTML = summary !== '' ? `<h3>${summary}</h3>` : '';

            that.pdfViewerBlock.innerHTML =
                `
                <div id="${pdfViewerId}" class="pdf-viewer is-${type}">
                    <button id="${pdfViewerId}-button" onclick="parentNode.parentNode.removeChild(parentNode)" class="delete"></button>
                    ${summaryHTML}
                    ${iconHTML} ${body}
                </div>
            ` + that.pdfViewerBlock.innerHTML;

            const messageId = `#${pdfViewerId}`;

            if (timeout > 0) {
                setTimeout(() => {
                    that.removeMessageId(messageId);
                }, timeout * 1000);
            }

            // mark the event as handled
            e.preventDefault();
        });
    }

    removeMessageId(messageElementId) {
        const element = this._(messageElementId);

        if (element) {
            this.pdfViewerBlock.removeChild(element);
        }
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}

            .pdf-viewer:not(:last-child) {
                margin-bottom: 1.5rem;
            }

            .pdf-viewer h3 {
                font-weight: bold;
                margin-bottom: 3px;
            }

            .delete,
            .modal-close {
                -moz-appearance: none;
                -webkit-appearance: none;
                background-color: rgba(10, 10, 10, 0.2);
                border: none;
                border-radius: 290486px;
                cursor: pointer;
                pointer-events: auto;
                display: inline-block;
                flex-grow: 0;
                flex-shrink: 0;
                font-size: 0;
                height: 20px;
                max-height: 20px;
                max-width: 20px;
                min-height: 20px;
                min-width: 20px;
                outline: 0;
                position: relative;
                vertical-align: top;
                width: 20px;
            }

            .delete::before,
            .modal-close::before,
            .delete::after,
            .modal-close::after {
                background-color: var(--dbp-background);
                color: var(--dbp-content);
                content: '';
                display: block;
                left: 50%;
                position: absolute;
                top: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
                transform: translateX(-50%) translateY(-50%) rotate(45deg);
                -webkit-transform-origin: center center;
                transform-origin: center center;
            }

            .delete::before,
            .modal-close::before {
                height: 2px;
                width: 50%;
            }

            .delete::after,
            .modal-close::after {
                height: 50%;
                width: 2px;
            }

            .delete:hover,
            .modal-close:hover,
            .delete:focus,
            .modal-close:focus {
                background-color: rgba(10, 10, 10, 0.3);
            }

            .delete:active,
            .modal-close:active {
                background-color: rgba(10, 10, 10, 0.4);
            }

            #pdf-viewer {
                position: fixed;
                top: 0;
                max-width: 500px;
                margin: 0.75em auto;
                left: 0;
                right: 0;
                z-index: 1000;
                padding: 0;
            }

            .pdf-viewer h3 {
                margin: 0 0 3px 0;
                font: inherit;
                font-weight: bold;
            }
        `;
    }

    render() {
        return html`
            <div class="columns">
                <div class="column" id="pdf-viewer"></div>
            </div>
        `;
    }
}
