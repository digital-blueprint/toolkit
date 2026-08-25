import {css, html, LitElement} from 'lit';
import {Icon, ScopedElementsMixin} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import highlightCSSPath from 'highlight.js/styles/github.css';
import highlightCSSPathDark from 'highlight.js/styles/github-dark.css';
import * as demoStyles from './styles.js';
import {createInstance} from './i18n.js';

/**
 * Controller that monitors dark/light theme changes and triggers host re-renders.
 */
class ThemeController {
    constructor(host) {
        this.host = host;
        this._observer = null;
        this._dark = false;
        host.addController(this);
    }

    get isDark() {
        return this._dark;
    }

    get isLight() {
        return !this._dark;
    }

    hostConnected() {
        this._dark = document.body.classList.contains('dark-theme');

        this._observer = new MutationObserver(() => {
            const wasDark = this._dark;
            this._dark = document.body.classList.contains('dark-theme');
            if (wasDark !== this._dark) {
                this.host.requestUpdate();
            }
        });

        this._observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
        });
    }

    hostDisconnected() {
        this._observer?.disconnect();
        this._observer = null;
    }
}

function getDocumentIdFromLocation() {
    try {
        return decodeURIComponent(window.location.hash.replace(/^#/, ''));
    } catch {
        return '';
    }
}

function renderMarkdown(mdContent, dark = false) {
    return html`
        <link
            rel="stylesheet"
            href="${commonUtils.getAbsoluteURL(dark ? highlightCSSPathDark : highlightCSSPath)}" />
        ${unsafeHTML(mdContent)}
    `;
}

/**
 * Renders pre-rendered Markdown (the input needs to be trusted!).
 *
 * The markdown build plugin embeds all markdown documents that are linked from the main
 * document into the same HTML blob. Only one of them is visible at a time and links to
 * those documents switch the visible one via the URL fragment.
 */
export class MarkdownElement extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.markdown = '';
        this.lang = 'en';
        // Reflected so the surrounding activity can hide its demo components via CSS
        this.subDocument = false;
        this._i18n = createInstance();
        this.theme = new ThemeController(this);
        // ID of the currently shown document, empty means the main document
        this._documentId = '';
        // Name of the currently shown document, empty means the main document
        this._documentName = '';
        this._onHashChange = () => {
            this._documentId = getDocumentIdFromLocation();
        };
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            markdown: {type: String},
            lang: {type: String},
            subDocument: {type: Boolean, attribute: 'sub-document', reflect: true},
            _documentId: {type: String, state: true},
            _documentName: {type: String, state: true},
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._documentId = getDocumentIdFromLocation();
        window.addEventListener('hashchange', this._onHashChange);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHashChange);
        super.disconnectedCallback();
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            void this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        this._updateVisibleDocument(changedProperties.has('_documentId'));
    }

    /**
     * Shows the document matching the current URL fragment and hides all others.
     *
     * @param {boolean} documentChanged If the requested document has changed
     */
    _updateVisibleDocument(documentChanged) {
        const documents = Array.from(
            this.renderRoot.querySelectorAll('[data-markdown-document]'),
        ).filter((document) => document instanceof HTMLElement);
        if (documents.length === 0) {
            this._documentName = '';
            this.subDocument = false;
            return;
        }

        // Fall back to the main document for unknown fragments
        const active =
            documents.find((doc) => doc.dataset.markdownDocument === this._documentId) ??
            documents[0];

        for (const doc of documents) {
            doc.hidden = doc !== active;
        }

        const name =
            active.dataset.markdownDocument === '' ? '' : (active.dataset.markdownName ?? '');
        const nameChanged = this._documentName !== name;
        this._documentName = name;
        this.subDocument = name !== '';

        if (documentChanged && nameChanged) {
            this.scrollIntoView({block: 'start', behavior: 'instant'});
        }
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            demoStyles.getDemoCSS(),
            css`
                [hidden] {
                    display: none !important;
                }

                .document-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    margin-bottom: 1.5em;
                    padding-bottom: 0.5em;
                    border-bottom: 1px solid var(--dbp-content);
                }

                .document-nav a {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3em;
                    border-bottom: none;
                }

                /* The generic link icon does not make sense for the back link */
                .document-nav a:after {
                    content: none;
                }

                .document-nav .document-name {
                    color: var(--dbp-muted);
                }
            `,
        ];
    }

    render() {
        const i18n = this._i18n;

        return html`
            ${
                this._documentName
                    ? html`
                          <nav
                              class="document-nav"
                              aria-label="${i18n.t('markdown-document-navigation')}">
                              <a href="#">
                                  <dbp-icon name="chevron-left" aria-hidden="true"></dbp-icon>
                                  ${i18n.t('markdown-back-to-main')}
                              </a>
                              <span class="document-name">${this._documentName}</span>
                          </nav>
                      `
                    : ''
            }
            ${renderMarkdown(this.markdown, this.theme.isDark)}
        `;
    }
}
