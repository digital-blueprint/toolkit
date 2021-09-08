import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import tippy from 'tippy.js';
import {Icon} from '@dbp-toolkit/common';
import tippy2CSSPath from 'tippy.js/dist/tippy.css';

export class TooltipElement extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this.tippy = '';
        this.textContent = '';
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
        };
    }

    firstUpdated() {

        tippy(this._('#tooltip-icon'), {
            content: this.textContent,
            appendTo: this.shadowRoot,
        });
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS(false)}
            ${commonStyles.getButtonCSS()}

            .info-icon {
                color: red;
                padding: 0px 4px;
            }

        `;
    }

    render() {

        const tippy2CSS = commonUtils.getAssetURL(tippy2CSSPath);
       
        if (this._('#tooltip-icon')) {
            this.tippy = tippy(this._('#tooltip-icon'), { content: this.textContent });
        }

        return html`
            <link rel="stylesheet" href="${tippy2CSS}">
            <div>
                <dbp-icon name='information' class="info-icon" id="tooltip-icon"></dbp-icon>
            </div>
            
        `;
    }

}
