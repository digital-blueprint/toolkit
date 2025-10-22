import {assert} from 'chai';

import '../src/dbp-pdf-viewer';

suite('dbp-pdf-viewer basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-pdf-viewer');
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
