import {assert} from '@esm-bundle/chai';

import '../src/dbp-qr-code-scanner';

suite('dbp-qr-code-scanner basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-qr-code-scanner');
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
