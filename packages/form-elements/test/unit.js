import {assert} from 'chai';

import '../src/elements/string';
import '../src/demo.js';

suite('dbp-form-elements basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-string-element');
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

suite('dbp-form-elements-demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-elements-demo');
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
