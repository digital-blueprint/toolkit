import {assert} from 'chai';

import '../src/components.js';

suite('dbp-provider basics', () => {
    let node;

    suiteSetup(async () => {
        node = document.createElement('dbp-provider');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    suiteTeardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});
