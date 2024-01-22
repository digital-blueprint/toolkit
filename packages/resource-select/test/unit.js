import {assert} from 'chai';

import '../src/dbp-resource-select.js';
import '../src/demo.js';

suite('dbp-resource-select basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-resource-select');
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

suite('dbp-resource-select-demo basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-resource-select-demo');
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
