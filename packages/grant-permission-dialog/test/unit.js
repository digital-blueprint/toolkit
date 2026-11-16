import {assert} from 'chai';

import '../src/dbp-grant-permission-dialog';
import '../src/demo.js';
import {getGroupIri, humanizeIdentifier} from '../src/grant-permission-dialog.js';

/**
 * Creates a fake grant collection response
 * @param {object[]} grants
 * @returns {Promise<object>}
 */
function grantsResponse(grants) {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({'hydra:member': grants}),
    });
}

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
        node.setListOfHoldersAndPermissions = () => {
            node.holderList = new Map([
                [
                    'user:user-id',
                    {
                        key: 'user:user-id',
                        holderType: 'user',
                        holderIdentifier: 'user-id',
                        displayName: 'Test User',
                        permissions: new Map(),
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

    test('normalizes group references to IRIs', () => {
        assert.equal(getGroupIri('/authorization/groups/g-1'), '/authorization/groups/g-1');
        assert.equal(getGroupIri('g-1'), '/authorization/groups/g-1');
        assert.equal(getGroupIri({identifier: 'g-1'}), '/authorization/groups/g-1');
        assert.equal(
            getGroupIri({'@id': '/authorization/groups/g-2', identifier: 'g-2'}),
            '/authorization/groups/g-2',
        );
        assert.isNull(getGroupIri(null));
    });

    test('humanizes dynamic group identifiers', () => {
        assert.equal(humanizeIdentifier('registrars_office_staff'), 'Registrars office staff');
        assert.equal(humanizeIdentifier('summerCourseCreators'), 'Summer course creators');
    });

    test('builds the grant holder payload for every holder type', () => {
        assert.deepEqual(node.getHolderPayload({holderType: 'user', holderIdentifier: 'user-1'}), {
            userIdentifier: 'user-1',
        });
        assert.deepEqual(
            node.getHolderPayload({
                holderType: 'group',
                holderIdentifier: '/authorization/groups/g-1',
            }),
            {group: '/authorization/groups/g-1'},
        );
        assert.deepEqual(
            node.getHolderPayload({holderType: 'dynamic-group', holderIdentifier: 'staff'}),
            {dynamicGroupIdentifier: 'staff'},
        );
    });

    test('creates a selected permission on every resource', async () => {
        const requests = [];
        node.auth = {token: 'token'};
        node.resourceIdentifiers = ['form-1', 'form-2'];
        node.availableActions = [{manage: {en: 'Manage'}}];
        const group = node.createHolder('group', '/authorization/groups/g-1', 'Team');
        const managePermission = group.permissions.get('manage');
        managePermission.desiredGranted = true;
        managePermission.toSave = true;
        node.holderList = new Map([[group.key, group]]);
        node.holdersInEdit = new Map([[group.key, group]]);
        node.apiPostResourceActionGrant = (action, holder, resourceIdentifier) => {
            requests.push({action, holder: holder.holderIdentifier, resourceIdentifier});
            return Promise.resolve({status: 201});
        };
        node.setListOfHoldersAndPermissions = () => Promise.resolve();
        await node.updateComplete;

        await node.saveHolderPermissions();

        assert.deepEqual(requests, [
            {action: 'manage', holder: '/authorization/groups/g-1', resourceIdentifier: 'form-1'},
            {action: 'manage', holder: '/authorization/groups/g-1', resourceIdentifier: 'form-2'},
        ]);
    });

    test('marks permissions granted on only some resources as mixed', async () => {
        node.resourceIdentifiers = ['form-1', 'form-2'];
        node.availableActions = [{read: {en: 'Read'}}];
        node.apiGetResourceActionGrants = (resourceIdentifier) =>
            grantsResponse(
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
            );
        node.getUserFullName = () => Promise.resolve('Test User');

        await node.setListOfHoldersAndPermissions();

        const permission = node.holderList.get('user:user-1').permissions.get('read');
        assert.isTrue(permission.mixed);
        assert.isNull(permission.identifier);
        assert.deepEqual([...permission.grantsByResource.keys()], ['form-1']);
    });

    test('loads person, group and dynamic group grants', async () => {
        node.resourceIdentifiers = ['form-1'];
        node.availableActions = [{manage: {en: 'Manage'}}, {read: {en: 'Read'}}];
        node.apiGetResourceActionGrants = () =>
            grantsResponse([
                {
                    identifier: 'grant-1',
                    userIdentifier: 'user-1',
                    action: 'manage',
                    grantedActions: ['delete'],
                },
                {
                    identifier: 'grant-2',
                    group: '/authorization/groups/g-1',
                    action: 'read',
                    grantedActions: ['delete'],
                },
                {
                    identifier: 'grant-3',
                    dynamicGroupIdentifier: 'staff',
                    action: 'read',
                    grantedActions: ['delete'],
                },
                {
                    identifier: 'grant-4',
                    dynamicGroupIdentifier: '@DbpRelayFormalizeForm',
                    action: 'manage',
                    grantedActions: ['delete'],
                },
                {
                    identifier: 'grant-5_inherited',
                    userIdentifier: 'user-2',
                    action: 'read',
                    grantedActions: [],
                },
            ]);
        node.getUserFullName = (id) => Promise.resolve(id === 'user-1' ? 'Ada' : 'Bob');
        node.getGroupName = () => Promise.resolve('Editorial team');
        node.dynamicGroupLabels = {staff: {en: 'Staff members', de: 'Bedienstete'}};
        node.lang = 'en';

        await node.setListOfHoldersAndPermissions();

        const group = node.holderList.get('group:/authorization/groups/g-1');
        assert.equal(group.displayName, 'Editorial team');
        assert.equal(group.permissions.get('read').identifier, 'grant-2');

        const dynamicGroup = node.holderList.get('dynamic-group:staff');
        assert.equal(dynamicGroup.displayName, 'Staff members');

        // System policy grants can't be changed in the dialog
        const systemRule = node.holderList.get('dynamic-group:@DbpRelayFormalizeForm');
        assert.isTrue(systemRule.isSystem);
        assert.isTrue(systemRule.permissions.get('manage').locked);

        const inherited = node.holderList.get('user:user-2').permissions.get('read');
        assert.isTrue(inherited.locked);
        assert.isTrue(inherited.inherited);
    });

    test('keeps at least one person as manager', () => {
        node.resourceIdentifiers = ['form-1'];
        node.availableActions = [{manage: {en: 'Manage'}}];
        const person = node.createHolder('user', 'user-1', 'Ada');
        person.permissions
            .get('manage')
            .grantsByResource.set('form-1', {identifier: 'g-1', locked: false, inherited: false});
        const group = node.createHolder('group', '/authorization/groups/g-1', 'Team');
        group.permissions
            .get('manage')
            .grantsByResource.set('form-1', {identifier: 'g-2', locked: false, inherited: false});
        node.holderList = new Map([
            [person.key, person],
            [group.key, group],
        ]);

        node.updateProtectedHolders();

        assert.isTrue(node.protectedHolderKeys.has(person.key));
        assert.isFalse(node.protectedHolderKeys.has(group.key));
    });

    test('protects the only manager if no person manages the resource', () => {
        node.resourceIdentifiers = ['form-1'];
        node.availableActions = [{manage: {en: 'Manage'}}];
        const group = node.createHolder('group', '/authorization/groups/g-1', 'Team');
        group.permissions
            .get('manage')
            .grantsByResource.set('form-1', {identifier: 'g-2', locked: false, inherited: false});
        node.holderList = new Map([[group.key, group]]);

        node.updateProtectedHolders();

        assert.isTrue(node.protectedHolderKeys.has(group.key));
    });

    test('blocks saving the removal of the last person manager', async () => {
        const deleted = [];
        node.auth = {token: 'token'};
        node.resourceIdentifiers = ['form-1'];
        node.availableActions = [{manage: {en: 'Manage'}}];
        const person = node.createHolder('user', 'user-1', 'Ada');
        const managePermission = person.permissions.get('manage');
        managePermission.grantsByResource.set('form-1', {
            identifier: 'grant-1',
            locked: false,
            inherited: false,
        });
        managePermission.identifier = 'grant-1';
        managePermission.desiredGranted = false;
        managePermission.toSave = true;
        node.holderList = new Map([[person.key, person]]);
        node.holdersInEdit = new Map([[person.key, person]]);
        node.apiDeleteResourceActionGrant = (identifier) => {
            deleted.push(identifier);
            return Promise.resolve({status: 204});
        };
        node.setListOfHoldersAndPermissions = () => Promise.resolve();

        await node.saveHolderPermissions();

        assert.deepEqual(deleted, []);
    });
});
