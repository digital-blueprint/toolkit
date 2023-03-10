import {assert} from '@esm-bundle/chai';

import '../src/dbp-pdf-viewer';

suite('dbp-pdf-viewer basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-pdf-viewer');
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
