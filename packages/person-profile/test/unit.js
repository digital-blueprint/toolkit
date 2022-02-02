import {assert} from '@esm-bundle/chai';

import '../src/dbp-person-profile-demo.js';

suite('dbp-person-profile demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-person-profile-demo');
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
