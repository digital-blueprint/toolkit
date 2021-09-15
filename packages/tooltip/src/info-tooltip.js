import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import tippy from 'tippy.js';
import tippy2CSSPath from 'tippy.js/dist/tippy.css';
import {Icon} from '@dbp-toolkit/common';

export class InfoTooltip extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this.tippy = '';
        this.textContent = 'missing text.';
        this.interactive = false;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            tippy: { type: Object, attribute: false },
            textContent: { type: String, attribute: 'text-content' },
            interactive: { type: Boolean, attribute: true },
        };
    }

    firstUpdated() {

        tippy(this._('#info-tooltip-icon'), {
            content: this.textContent,
            appendTo: this.shadowRoot,
            interactive: this.interactive,
            allowHTML: this.interactive ? true : false,
            hideOnClick: this.interactive ? false : true,
        });
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS(false)}
            ${commonStyles.getButtonCSS()}

            .info-icon {
                display: inline;
                opacity: 0.7;
                font-size: 18px;
                padding: 4.5px 7px;
            }

            a {
                text-decoration-line: underline;
                text-decoration-style: dotted;
            }
        `;
    }

    render() {

        const tippy2CSS = commonUtils.getAssetURL(tippy2CSSPath);
       
        if (this._('#info-tooltip-icon')) {
            this.tippy = tippy(this._('#info-tooltip-icon'), { 
                content: this.textContent,
                appendTo: this.shadowRoot,
                interactive: this.interactive,
                allowHTML: this.interactive ? true : false,
                hideOnClick: this.interactive ? false : true,
            });
        }

        return html`
            <link rel="stylesheet" href="${tippy2CSS}">
            <div class="info-icon" id="info-tooltip-icon">
                <dbp-icon name="information-circle"></dbp-icon>
            </div>
            
        `;
    }

}
