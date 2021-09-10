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
        this.textContent = 'missing text.';
        this.iconName = '';
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
            iconName: { type: String, attribute: 'icon-name' },
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

            .tooltip-icon {
                display: inline;
                /* color: TODO CSS var */
                /* opacity: 0.7; TODO CSS var */
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
            <div class="tooltip-icon">
                ${ this.iconName ?
                html`<dbp-icon name="${this.iconName}" id="tooltip-icon"></dbp-icon>`
                        
                : html`<!-- https://www.svgrepo.com/svg/89416/skull -->
<svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor"
     id="tooltip-icon" x="0" y="0" viewBox="0 0 360 360" xml:space="preserve">
    <g>
        <path d="M180,0C97.157,0,30,67.157,30,150v109.667h0.016c0.337,13.559,7.045,22.475,19.879,26.753L105,305v30
c0,13.75,11.25,25,25,25h100c13.75,0,25-11.25,25-25v-30l55.051-18.668c12.834-4.278,19.597-13.106,19.934-26.665H330V150
C330,67.157,262.843,0,180,0z M300,258.063l-54.635,18.526L225,283.495V305v25h-90v-25v-21.544l-20.415-6.884L60,258.168V150
c0-32.053,12.482-62.188,35.147-84.853C117.813,42.482,147.947,30,180,30s62.188,12.482,84.853,35.147
C287.518,87.813,300,117.947,300,150V258.063z"/>
        <path d="M160,281c0,11.046,8.954,20,20,20s20-8.954,20-20s-20-40-20-40S160,269.954,160,281z"/>
        <path d="M125,161c-24.854,0-45,20.146-45,45s20.146,45,45,45s45-20.146,45-45S149.854,161,125,161z M125,221c-8.271,0-15-6.729-15-15s6.729-15,15-15s15,6.729,15,15S133.271,221,125,221z"/>
        <path d="M190,206c0,24.854,20.146,45,45,45s45-20.146,45-45s-20.147-45-45-45S190,181.146,190,206z M250,206c0,8.271-6.729,15-15,15s-15-6.729-15-15s6.729-15,15-15S250,197.729,250,206z"/>
    </g>
</svg>` }
            </div>
            
        `;
    }

}
