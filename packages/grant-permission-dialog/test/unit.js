import {assert} from 'chai';

import '../src/dbp-grant-permission-dialog';
import '../src/demo.js';

suite('dbp-grant-permission-dialog', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-grant-permission-dialog');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('opens safely while a permission row is incomplete', async () => {
        node.auth = {token: 'token'};
        node.setAvailableActions = () => {
            node.availableActions = null;
            return Promise.resolve();
        };
        node.setListOfUsersAndPermissions = () => {
            node.userList = new Map([
                [
                    'user-id',
                    {
                        userIdentifier: 'user-id',
                        userFullName: 'Test User',
                        permissions: new Map(),
                        buttonState: 'edit',
                    },
                ],
            ]);
            return Promise.resolve();
        };

        await node.open();
        await new Promise((resolve) => requestAnimationFrame(resolve));

        assert.isTrue(node.shadowRoot.querySelector('#permission-modal').isOpen());
    });
});
