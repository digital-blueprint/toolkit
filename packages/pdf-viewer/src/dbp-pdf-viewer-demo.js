import {createInstance} from './i18n';
import {css, html, LitElement} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {PdfViewer} from './pdf-viewer.js';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';

export class PdfViewerDemo extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-pdf-viewer': PdfViewer,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
        };
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
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">PdfViewer-Demo</h1>
                </div>
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            TODO
                        </div>
                    </div>
                </div>
                <div class="container">
                    <dbp-pdf-viewer lang="${this.lang}"></dbp-pdf-viewer>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-pdf-viewer-demo', PdfViewerDemo);
