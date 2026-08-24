// This file is a partial copy of the scoped-elements v2 type definitions.

import {Constructor} from '@open-wc/dedupe-mixin';

export declare class ScopedElementsHostV2 {
    defineScopedElement<T extends HTMLElement>(tagName: string, klass: Constructor<T>): void;

    createScopedElement(tagName: string): HTMLElement;
}

export type ScopedElementsHostV2Constructor = Constructor<ScopedElementsHostV2>;
