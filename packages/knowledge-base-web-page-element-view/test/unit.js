import {assert} from 'chai';

import '../src/dbp-knowledge-base-web-page-element-view.js';
import '../src/dbp-knowledge-base-web-page-element-view-demo.js';

suite('dbp-knowledge-base-web-page-element-view basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-knowledge-base-web-page-element-view');
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

suite('dbp-knowledge-base-web-page-element-view demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-knowledge-base-web-page-element-view-demo');
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
