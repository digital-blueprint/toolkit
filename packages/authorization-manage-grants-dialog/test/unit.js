import {assert} from 'chai';

import '../src/dbp-authorization-manage-grants-dialog.js';

suite('dbp-authorization-manage-grants-dialog', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-authorization-manage-grants-dialog');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should open and close', () => {
        const modal = node.shadowRoot.querySelector('dbp-modal');

        node.open();
        assert.isTrue(modal.isOpen());

        node.close();
        assert.isFalse(modal.isOpen());
    });
});
