// @ts-nocheck
import {html, LitElement} from 'lit-element';
import {TypeScriptExample} from './typescript-example';
import * as commonUtils from '@dbp-toolkit/common/utils';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TypeScriptExampleDemo extends ScopedElementsMixin(LitElement) {

    static get scopedElements() {
        return {
          'dbp-typescript-example': TypeScriptExample,
        };
    }

    render() {
        return html`
            <dbp-typescript-example lang="de"></dbp-typescript-example>
        `;
    }
}

commonUtils.defineCustomElement('dbp-typescript-example-demo', TypeScriptExampleDemo);
