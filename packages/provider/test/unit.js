import {assert} from 'chai';

import '../src/dbp-provider';
import '../src/dbp-provider-demo';

suite('dbp-provider basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-provider');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});

suite('dbp-provider-demo basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-provider-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});
