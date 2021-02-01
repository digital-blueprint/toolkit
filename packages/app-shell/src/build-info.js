import {html, css} from 'lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";

export class BuildInfo extends AdapterLitElement {

    constructor() {
        super();
        this.env = '';
        this.gitInfo = '';
        this.buildUrl = '';
        this.buildTime = '';
    }

    static get properties() {
        return {
            ...super.properties,
            env: { type: String },
            buildUrl: { type: String, attribute: "build-url" },
            buildTime: { type: String, attribute: "build-time" },
            gitInfo: { type: String, attribute: "git-info" }
        };
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getTagCSS()}

            :host {
                display: inline-block;
            }
        `;
    } 

    render() {
        const date = new Date(this.buildTime);

        return html`
            <a href="${this.buildUrl}" style="float: right">
                <div class="tags has-addons" title="Build Time: ${date.toString()}">
                    <span class="tag is-light">build</span>
                    <span class="tag is-dark">${this.gitInfo} (${this.env})</span>
                </div>
            </a>
        `;
    }
}