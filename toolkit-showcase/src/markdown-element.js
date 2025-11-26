import {html, LitElement} from 'lit';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import highlightCSSPath from 'highlight.js/styles/github.css';
import highlightCSSPathDark from 'highlight.js/styles/github-dark.css';
import * as demoStyles from './styles.js';

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

function renderMarkdown(mdContent, dark = false) {
    return html`
        <link
            rel="stylesheet"
            href="${commonUtils.getAbsoluteURL(dark ? highlightCSSPathDark : highlightCSSPath)}" />
        ${unsafeHTML(mdContent)}
    `;
}

/* Renders pre-rendered Markdown (the input needs to be trusted!) */
export class MarkdownElement extends LitElement {
    constructor() {
        super();
        this.markdown = '';
        this.theme = new ThemeController(this);
    }

    static get properties() {
        return {
            ...super.properties,
            markdown: {type: String},
        };
    }

    static get styles() {
        return [commonStyles.getThemeCSS(), commonStyles.getGeneralCSS(), demoStyles.getDemoCSS()];
    }

    render() {
        return html`
            ${renderMarkdown(this.markdown, this.theme.isDark)}
        `;
    }
}
