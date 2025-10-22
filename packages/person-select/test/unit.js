import {assert} from 'chai';

import '../src/dbp-person-select.js';
import '../src/demo.js';

suite('dbp-person-select basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-person-select');
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

suite('dbp-person-select-demo basics', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-person-select-demo');
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
