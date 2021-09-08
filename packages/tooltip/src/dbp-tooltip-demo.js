import {createInstance} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {TooltipElement} from './tooltip';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";
import tippy2CSSPath from 'tippy.js/dist/tippy.css';


export class TooltipDemo extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-tooltip': TooltipElement,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
        };
    }

    update(changedProperties) {
         changedProperties.forEach((oldValue, propName) => {
            if (propName === "lang") {
                this._i18n.changeLanguage(this.lang);
            }
        });

        super.update(changedProperties);
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em; padding-left:20px;}
            `
        ];
    }

    render() {

        const tippy2CSS = commonUtils.getAssetURL(tippy2CSSPath);

        return html`

            <link rel="stylesheet" href="${tippy2CSS}">

            <section class="section">
                <div class="container">
                    <h1 class="title">Tooltip-Demo</h1>
                </div>
                <div class="container">
                    <dbp-tooltip text-content="tippy tooltip demo text"></dbp-tooltip>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tooltip-demo', TooltipDemo);
