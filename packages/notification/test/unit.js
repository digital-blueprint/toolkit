import {assert} from 'chai';

import '../src/dbp-notification';

suite('dbp-notification basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-notification');
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
