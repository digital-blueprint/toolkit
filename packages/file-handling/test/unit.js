import {assert} from 'chai';

import '../src/dbp-file-source';
import '../src/demo';

suite('dbp-file-source basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-file-source');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-file-source demo', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-file-source-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
