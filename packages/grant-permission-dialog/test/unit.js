import {assert} from 'chai';

import '../src/dbp-grant-permission-dialog';
import '../src/demo.js';

suite('dbp-grant-permission-dialog', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-grant-permission-dialog');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
