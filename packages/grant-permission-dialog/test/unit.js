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

    test('normalizes multiple resource identifiers', () => {
        node.resourceIdentifier = 'fallback';
        node.resourceIdentifiers = ['form-1', 'form-2', 'form-1', ''];

        assert.deepEqual(node.getResourceIdentifiers(), ['form-1', 'form-2']);
    });

    test('creates a selected permission on every resource', async () => {
        const requests = [];
        node.auth = {token: 'token'};
        node.resourceIdentifiers = ['form-1', 'form-2'];
        node.availableActions = [{manage: {en: 'Manage'}}];
        const permissions = node.createEmptyUserPermission(true);
        const managePermission = permissions.get('manage');
        managePermission.desiredGranted = true;
        managePermission.toSave = true;
        const user = {
            userIdentifier: 'user-1',
            userFullName: 'Test User',
            permissions,
        };
        node.userList = new Map([['user-1', user]]);
        node.usersToAdd = new Map([['user-1', user]]);
        node.apiPostResourceActionGrant = (action, userIdentifier, resourceIdentifier) => {
            requests.push({action, userIdentifier, resourceIdentifier});
            return Promise.resolve({status: 201});
        };
        node.setListOfUsersAndPermissions = () => Promise.resolve();
        await node.updateComplete;

        await node.saveUserPermissions();

        assert.deepEqual(requests, [
            {action: 'manage', userIdentifier: 'user-1', resourceIdentifier: 'form-1'},
            {action: 'manage', userIdentifier: 'user-1', resourceIdentifier: 'form-2'},
        ]);
    });

    test('marks permissions granted on only some resources as mixed', async () => {
        node.resourceIdentifiers = ['form-1', 'form-2'];
        node.availableActions = [{read: {en: 'Read'}}];
        node.apiGetResourceActionGrants = (resourceIdentifier) =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () =>
                    Promise.resolve({
                        'hydra:member':
                            resourceIdentifier === 'form-1'
                                ? [
                                      {
                                          identifier: 'grant-1',
                                          userIdentifier: 'user-1',
                                          action: 'read',
                                          grantedActions: ['delete'],
                                      },
                                  ]
                                : [],
                    }),
            });
        node.getUserFullName = () => Promise.resolve('Test User');

        await node.setListOfUsersAndPermissions();

        const permission = node.userList.get('user-1').permissions.get('read');
        assert.isTrue(permission.mixed);
        assert.isNull(permission.identifier);
        assert.deepEqual([...permission.grantsByResource.keys()], ['form-1']);
    });
});
