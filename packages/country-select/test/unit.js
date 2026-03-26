import {assert} from 'chai';

import '../src/dbp-country-select.js';
import '../src/demo.js';

suite('dbp-country-select basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-country-select');
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

suite('dbp-country-select-demo basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-country-select-demo');
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
