import {html, LitElement, css} from 'lit-element';
import * as commonUtils from 'vpu-common/utils';
import * as commonStyles from 'vpu-common/styles';
import buildinfo from 'consts:buildinfo';

class VPUBuildInfo extends LitElement {

    constructor() {
        super();
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
        const date = new Date(buildinfo.time);

        return html`
            <a href="${buildinfo.url}" style="float: right">
                <div class="tags has-addons" title="Build Time: ${date.toString()}">
                    <span class="tag is-light">build</span>
                    <span class="tag is-dark">${buildinfo.info} (${buildinfo.env})</span>
                </div>
            </a>
        `;
    }
}

commonUtils.defineCustomElement('vpu-build-info', VPUBuildInfo);
