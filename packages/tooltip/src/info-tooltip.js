import {css, html} from 'lit';
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
            textContent: { type: String, attribute: 'text-content' },
            interactive: { type: Boolean, attribute: true },
        };
    }

    firstUpdated() {
        this.setOrUpdateTippy();
    }

    setOrUpdateTippy() {
        if (this._('#info-tooltip-icon')) {
            if (this._('#info-tooltip-icon')._tippy) {
                this._('#info-tooltip-icon')._tippy.setProps({
                    content: this.textContent,
                    appendTo: this.shadowRoot,
                    interactive: this.interactive,
                    allowHTML: this.interactive ? true : false,
                    hideOnClick: this.interactive ? false : true,
                });
            } else {
                tippy(this._('#info-tooltip-icon'), {
                    content: this.textContent,
                    appendTo: this.shadowRoot,
                    interactive: this.interactive,
                    allowHTML: this.interactive ? true : false,
                    hideOnClick: this.interactive ? false : true,
                });
            }
        }
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

            .tippy-box {
                background-color: var(--dbp-base-inverted);
                color: var(--dbp-text-inverted);
            }

            .tippy-arrow{
               color: var(--dbp-text);
            }
        `;
    }

    render() {

        const tippy2CSS = commonUtils.getAssetURL(tippy2CSSPath);
       
        this.setOrUpdateTippy();

        return html`
            <link rel="stylesheet" href="${tippy2CSS}">
            <div class="info-icon" id="info-tooltip-icon">
                <dbp-icon name="information-circle"></dbp-icon>
            </div>
        `;
    }

}
