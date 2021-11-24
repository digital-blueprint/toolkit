import {html, LitElement, TemplateResult} from 'lit';
import {TypeScriptExample} from './typescript-example';
import * as commonUtils from '@dbp-toolkit/common/utils';
import { ScopedElementsMixin, ScopedElementsMap } from '@open-wc/scoped-elements';

export class TypeScriptExampleDemo extends ScopedElementsMixin(LitElement) {

    static get scopedElements(): ScopedElementsMap {
        return {
          'dbp-typescript-example': TypeScriptExample,
        };
    }

    render(): TemplateResult {
        return html`
            <dbp-typescript-example lang="de"></dbp-typescript-example>
        `;
    }
}

commonUtils.defineCustomElement('dbp-typescript-example-demo', TypeScriptExampleDemo);
