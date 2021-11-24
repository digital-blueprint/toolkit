import {createInstance} from './i18n.js';
import {css, html} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {TooltipElement} from './tooltip';
import {InfoTooltip} from './info-tooltip';
import {ButtonTooltip} from './button-tooltip';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";


export class TooltipDemo extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-tooltip': TooltipElement,
            'dbp-info-tooltip': InfoTooltip,
            'dbp-button-tooltip': ButtonTooltip,
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
            .group { display: flex; flex-direction: auto; column-gap: 3px; }
            `
        ];
    }

    render() {

        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">Tooltip-Demo</h1>
                </div>
                <div class="container">
                    <h2>Standard Info Tooltip</h2>
                    <p>Mind the gap!
                        <dbp-info-tooltip text-content="tippy info tooltip demo text" interactive></dbp-info-tooltip>
                    </p>
                </div>
                <div class="container">
                    <h2>Custom Tooltip</h2>
                    <p>Choose an icon from those bundled with your app.</p>
                    <p>Mind the gap!
                        <dbp-tooltip text-content="tippy tooltip demo text" icon-name="information"></dbp-tooltip>
                    </p>
                </div>
                <div class="container">
                    <h2>Incorrectly Configured Tooltip</h2>
                    <p>Missing text, default icon: 
                        <dbp-tooltip></dbp-tooltip>
                    </p>
                </div>
                <div class="container">
                    <h2>Button with Tooltip</h2>
                    <p>Add a tooltip info to your submit/reset button.</p>
                    <form action="/" class="group">
                        <label for="text">Text</label>
                        <input type="text" id="text" name="text" value="" placeholder="text">
                        <div><dbp-button-tooltip button-text="save" text-content="submit to server"></dbp-button-tooltip></div>
                        <div><dbp-button-tooltip button-text="reset" text-content="clear all inputs" type="reset"></dbp-button-tooltip></div>
                        <div><dbp-button-tooltip button-text="silent" text-content="does nothing" type="btn"></dbp-button-tooltip></div>
                    </form>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-tooltip-demo', TooltipDemo);
