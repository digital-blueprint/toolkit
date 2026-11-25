import {assert} from 'chai';

import '../src/dbp-authorization-manage-grants-dialog.js';
import {AuthorizationSubjectSelect} from '../src/authorization-subject-select.js';
import {
    deriveGrantHolderIdentity,
    getGrantHolderDisplayName,
    toCompactSubject,
} from '../src/grant-holder.js';
import {getRoleName, getRoleNameByIri, isGrantChangeable} from '../src/utils.js';
import {
    addDraftRoleGrant,
    canAddDraftRole,
    getAvailableRoles,
    getPendingGrantChange,
    hasIncompleteDraftRole,
    isHolderSaveable,
    dropGrantedDraftRows,
    dropOrphanedGrantChanges,
    removeDraftRoleGrant,
    setPendingGrantChange,
    updateDraftRoleGrant,
} from '../src/grant-drafts.js';

suite('utils', () => {
    test('should name a role in the given language', () => {
        const role = {
            identifier: 'role-identifier',
            roleNames: [
                {languageTag: 'de', name: 'Rollenname'},
                {languageTag: 'en', name: 'Role name'},
            ],
        };

        // The loaded roles keep all their translations, so switching the language is enough
        assert.equal(getRoleName(role, 'en'), 'Role name');
        assert.equal(getRoleName(role, 'de'), 'Rollenname');
    });

    test('should fall back to the role identifier when a localized name is unavailable', () => {
        assert.equal(getRoleName({identifier: 'missing-role'}, 'en'), 'missing-role');
        assert.equal(
            getRoleName({identifier: 'missing-role', roleNames: []}, 'en'),
            'missing-role',
        );
        assert.equal(
            getRoleName(
                {identifier: 'missing-role', roleNames: [{languageTag: 'en', name: 'Editor'}]},
                'de',
            ),
            'missing-role',
        );
    });

    test('should name a role addressed by its IRI', () => {
        const roles = new Map([
            [
                '/authorization/roles/editor',
                {
                    identifier: 'editor',
                    roleNames: [{languageTag: 'en', name: 'Editor'}],
                },
            ],
        ]);

        assert.equal(getRoleNameByIri(roles, '/authorization/roles/editor', 'en'), 'Editor');
        // An unknown role has no name to show, so the IRI identifies it instead
        assert.equal(
            getRoleNameByIri(roles, '/authorization/roles/missing', 'en'),
            '/authorization/roles/missing',
        );
    });

    test('should only allow changing a grant that may be deleted', () => {
        assert.isTrue(isGrantChangeable({grantedActions: ['read', 'delete']}));
        assert.isFalse(isGrantChangeable({grantedActions: ['read']}));
        assert.isFalse(isGrantChangeable({grantedActions: []}));
        assert.isFalse(isGrantChangeable({}));
    });
});

suite('grant holder', () => {
    test('should identify every grant holder type', () => {
        assert.deepEqual(deriveGrantHolderIdentity({userIdentifier: 'F957F2400C941B72'}), {
            type: 'person',
            identifier: 'F957F2400C941B72',
            iri: null,
            key: 'person:F957F2400C941B72',
        });
        // User groups are keyed by the identifier of their IRI, which stays available for the
        // requests to their item endpoint
        assert.deepEqual(
            deriveGrantHolderIdentity({userGroup: '/authorization/user-groups/019a0ff1-597d'}),
            {
                type: 'user-group',
                identifier: '019a0ff1-597d',
                iri: '/authorization/user-groups/019a0ff1-597d',
                key: 'user-group:019a0ff1-597d',
            },
        );
        assert.deepEqual(
            deriveGrantHolderIdentity({dynamicUserGroupIdentifier: 'dbp_developers'}),
            {
                type: 'dynamic-user-group',
                identifier: 'dbp_developers',
                iri: null,
                key: 'dynamic-user-group:dbp_developers',
            },
        );
    });

    test('should key a user group the same way whatever its IRI looks like', () => {
        const key = 'user-group:019a0ff1-597d';
        assert.equal(
            deriveGrantHolderIdentity({
                userGroup: 'https://api.example.com/authorization/user-groups/019a0ff1-597d',
            }).key,
            key,
        );
        assert.equal(
            deriveGrantHolderIdentity({userGroup: '/authorization/user-groups/019a0ff1-597d/'}).key,
            key,
        );
    });

    test('should have no identity without grant holder fields', () => {
        assert.isNull(deriveGrantHolderIdentity(null));
        assert.isNull(deriveGrantHolderIdentity(undefined));
        assert.isNull(deriveGrantHolderIdentity({}));
        assert.isNull(deriveGrantHolderIdentity({identifier: 'grant-identifier', action: 'read'}));
    });

    test('should name a holder of every type', () => {
        assert.equal(
            getGrantHolderDisplayName({
                identifier: 'frank',
                givenName: 'Frank',
                familyName: 'Schwartz',
            }),
            'Frank Schwartz',
        );
        assert.equal(getGrantHolderDisplayName({identifier: 'frank', givenName: 'Frank'}), 'Frank');
        assert.equal(getGrantHolderDisplayName({identifier: 'team', name: 'Team'}), 'Team');
        // A dynamic user group has no name, and an inaccessible subject has nothing but its
        // identifier either
        assert.equal(getGrantHolderDisplayName({identifier: 'developers'}), 'developers');
    });

    test('should keep only the subject fields a holder is displayed with', () => {
        const person = toCompactSubject(
            {
                '@context': '/contexts/Person',
                '@id': '/base/people/frank',
                '@type': 'https://schema.org/Person',
                identifier: 'frank',
                givenName: 'Frank',
                familyName: 'Schwartz',
                localData: {email: 'frank@example.com', unused: 'discard'},
            },
            'person',
        );
        assert.deepEqual(person, {
            '@id': '/base/people/frank',
            '@type': 'https://schema.org/Person',
            identifier: 'frank',
            givenName: 'Frank',
            familyName: 'Schwartz',
            localData: {email: 'frank@example.com'},
        });

        assert.deepEqual(
            toCompactSubject(
                {
                    '@id': '/authorization/user-groups/team',
                    '@type': 'AuthorizationUserGroup',
                    identifier: 'team',
                    name: 'Team',
                    members: [{identifier: 'member-id'}],
                },
                'user-group',
            ),
            {
                '@id': '/authorization/user-groups/team',
                '@type': 'AuthorizationUserGroup',
                identifier: 'team',
                name: 'Team',
            },
        );

        // A dynamic user group has nothing to show beyond its identity
        assert.deepEqual(
            toCompactSubject(
                {
                    '@id': 'dynamic-user-group:developers',
                    '@type': 'AuthorizationDynamicUserGroup',
                    identifier: 'developers',
                },
                'dynamic-user-group',
            ),
            {
                '@id': 'dynamic-user-group:developers',
                '@type': 'AuthorizationDynamicUserGroup',
                identifier: 'developers',
            },
        );
    });
});

suite('grant-drafts', () => {
    const EDITOR = {'@id': '/authorization/roles/editor', identifier: 'editor'};
    const READER = {'@id': '/authorization/roles/reader', identifier: 'reader'};
    const AUTHOR = {'@id': '/authorization/roles/author', identifier: 'author'};
    const HOLDER_KEY = 'person:frank';

    const roles = new Map([EDITOR, READER, AUTHOR].map((role) => [role['@id'], role]));

    /**
     * Builds the saved grants of a holder, keyed the way the dialog keys them.
     * @param {Array<{identifier: string, role: object, shareable?: boolean}>} grants - Grants to build.
     * @returns {Map<string, object>} Grant holders holding the grants.
     */
    function createGrantHolders(grants) {
        return new Map([
            [
                HOLDER_KEY,
                {
                    key: HOLDER_KEY,
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: grants.map((grant) => ({
                        identifier: grant.identifier,
                        shareable: grant.shareable ?? false,
                        grantedActions: ['delete'],
                        roleDefinition: grant.role,
                    })),
                },
            ],
        ]);
    }

    /**
     * Returns the identifiers of role definitions, so expected roles stay readable.
     * @param {Array<{identifier: string}>} roleDefinitions - Role definitions to name.
     * @returns {string[]} Identifiers of the roles.
     */
    function roleIdentifiers(roleDefinitions) {
        return roleDefinitions.map((role) => role.identifier);
    }

    test('should offer only the roles a holder has not taken yet', () => {
        const grantHolders = createGrantHolders([{identifier: 'grant-a', role: EDITOR}]);
        const draftRoleGrants = new Map([
            [HOLDER_KEY, [{clientIdentifier: 'draft-role-1', roleIdentifier: READER['@id']}]],
        ]);
        const state = {
            roles: roles,
            grantHolders: grantHolders,
            draftRoleGrants: draftRoleGrants,
            pendingGrantChanges: new Map(),
            holderKey: HOLDER_KEY,
        };

        assert.deepEqual(roleIdentifiers(getAvailableRoles(state)), ['author']);
        // The row being rendered keeps its own selection, so it stays selectable
        assert.deepEqual(
            roleIdentifiers(getAvailableRoles({...state, currentDraftIdentifier: 'draft-role-1'})),
            ['reader', 'author'],
        );
        assert.deepEqual(
            roleIdentifiers(getAvailableRoles({...state, currentGrantIdentifier: 'grant-a'})),
            ['editor', 'author'],
        );
        // A holder without any grants may take every role
        assert.deepEqual(
            roleIdentifiers(
                getAvailableRoles({
                    ...state,
                    grantHolders: new Map(),
                    draftRoleGrants: new Map(),
                }),
            ),
            ['editor', 'reader', 'author'],
        );
    });

    test('should free the role of a grant that has an unsaved change', () => {
        const available = getAvailableRoles({
            roles: roles,
            grantHolders: createGrantHolders([{identifier: 'grant-a', role: EDITOR}]),
            draftRoleGrants: new Map(),
            pendingGrantChanges: new Map([
                [
                    HOLDER_KEY,
                    [
                        {
                            grantIdentifier: 'grant-a',
                            roleIdentifier: AUTHOR['@id'],
                            shareable: false,
                        },
                    ],
                ],
            ]),
            holderKey: HOLDER_KEY,
        });

        // The change gives up the editor role and takes the author role instead
        assert.deepEqual(roleIdentifiers(available), ['editor', 'reader']);
    });

    test('should offer the available roles as a list of its own', () => {
        const state = {
            roles: roles,
            grantHolders: new Map(),
            draftRoleGrants: new Map(),
            pendingGrantChanges: new Map(),
            holderKey: HOLDER_KEY,
        };

        // Rendering a role selector appends the assigned role to the list it got
        const available = getAvailableRoles(state);
        available.push(EDITOR);
        assert.lengthOf(getAvailableRoles(state), 3);
    });

    test('should find the unsaved change of a grant', () => {
        const change = {
            grantIdentifier: 'grant-a',
            roleIdentifier: READER['@id'],
            shareable: false,
        };
        const pendingGrantChanges = new Map([[HOLDER_KEY, [change]]]);

        assert.deepEqual(getPendingGrantChange(pendingGrantChanges, HOLDER_KEY, 'grant-a'), change);
        assert.isNull(getPendingGrantChange(pendingGrantChanges, HOLDER_KEY, 'grant-b'));
        assert.isNull(getPendingGrantChange(pendingGrantChanges, 'person:bob', 'grant-a'));
        assert.isNull(getPendingGrantChange(new Map(), HOLDER_KEY, 'grant-a'));
    });

    test('should record an unsaved change and drop it once it is reverted', () => {
        const grant = {
            identifier: 'grant-a',
            shareable: true,
            grantedActions: ['delete'],
            roleDefinition: EDITOR,
        };
        const pendingGrantChanges = new Map();

        const changedRole = setPendingGrantChange(pendingGrantChanges, HOLDER_KEY, grant, {
            roleIdentifier: READER['@id'],
        });
        assert.deepEqual(changedRole.get(HOLDER_KEY), [
            {grantIdentifier: 'grant-a', roleIdentifier: READER['@id'], shareable: true},
        ]);
        // The map the change was recorded in stays as it was, so Lit sees a new one
        assert.equal(pendingGrantChanges.size, 0);

        // A second change of the same grant is merged into the recorded one
        const changedBoth = setPendingGrantChange(changedRole, HOLDER_KEY, grant, {
            shareable: false,
        });
        assert.deepEqual(changedBoth.get(HOLDER_KEY), [
            {grantIdentifier: 'grant-a', roleIdentifier: READER['@id'], shareable: false},
        ]);

        // Selecting the assigned role again leaves only the shareable state changed
        const revertedRole = setPendingGrantChange(changedBoth, HOLDER_KEY, grant, {
            roleIdentifier: EDITOR['@id'],
        });
        assert.deepEqual(revertedRole.get(HOLDER_KEY), [
            {grantIdentifier: 'grant-a', roleIdentifier: EDITOR['@id'], shareable: false},
        ]);

        // Reverting the last changed value drops the holder from the map altogether
        const reverted = setPendingGrantChange(revertedRole, HOLDER_KEY, grant, {
            shareable: true,
        });
        assert.isFalse(reverted.has(HOLDER_KEY));
    });

    test('should keep the unsaved changes of the other grants of a holder', () => {
        const editorGrant = {identifier: 'grant-a', shareable: false, roleDefinition: EDITOR};
        const readerGrant = {identifier: 'grant-b', shareable: false, roleDefinition: READER};

        let pendingGrantChanges = setPendingGrantChange(new Map(), HOLDER_KEY, editorGrant, {
            shareable: true,
        });
        pendingGrantChanges = setPendingGrantChange(pendingGrantChanges, HOLDER_KEY, readerGrant, {
            roleIdentifier: AUTHOR['@id'],
        });
        assert.lengthOf(pendingGrantChanges.get(HOLDER_KEY), 2);

        pendingGrantChanges = setPendingGrantChange(pendingGrantChanges, HOLDER_KEY, editorGrant, {
            shareable: false,
        });
        assert.deepEqual(pendingGrantChanges.get(HOLDER_KEY), [
            {grantIdentifier: 'grant-b', roleIdentifier: AUTHOR['@id'], shareable: false},
        ]);
    });

    test('should retain deletion-only changes and remove them on undo', () => {
        const grant = {identifier: 'grant-a', shareable: false, roleDefinition: EDITOR};
        const initial = new Map();
        const marked = setPendingGrantChange(initial, HOLDER_KEY, grant, {markedToDelete: true});

        assert.equal(initial.size, 0);
        assert.isTrue(getPendingGrantChange(marked, HOLDER_KEY, grant.identifier).markedToDelete);
        assert.isTrue(isHolderSaveable(new Map(), marked, HOLDER_KEY));
        const undone = setPendingGrantChange(marked, HOLDER_KEY, grant, {markedToDelete: false});
        assert.equal(undone.size, 0);
    });

    test('should preserve edits across marking and undo while reserving both roles', () => {
        const grantHolders = createGrantHolders([{identifier: 'grant-a', role: EDITOR}]);
        const grant = grantHolders.get(HOLDER_KEY).grants[0];
        const edited = setPendingGrantChange(new Map(), HOLDER_KEY, grant, {
            roleIdentifier: AUTHOR['@id'],
            shareable: true,
        });
        const marked = setPendingGrantChange(edited, HOLDER_KEY, grant, {markedToDelete: true});
        const available = getAvailableRoles({
            roles: roles,
            grantHolders: grantHolders,
            draftRoleGrants: new Map(),
            pendingGrantChanges: marked,
            holderKey: HOLDER_KEY,
        });
        assert.deepEqual(roleIdentifiers(available), ['reader']);
        const undone = setPendingGrantChange(marked, HOLDER_KEY, grant, {markedToDelete: false});
        assert.deepEqual(getPendingGrantChange(undone, HOLDER_KEY, grant.identifier), {
            ...getPendingGrantChange(edited, HOLDER_KEY, grant.identifier),
            markedToDelete: false,
        });
    });

    test('should prune orphaned deletions without dropping those still applicable', () => {
        const grantHolders = createGrantHolders([{identifier: 'grant-a', role: EDITOR}]);
        const grant = grantHolders.get(HOLDER_KEY).grants[0];
        const marked = setPendingGrantChange(new Map(), HOLDER_KEY, grant, {markedToDelete: true});
        assert.deepEqual(dropOrphanedGrantChanges(marked, grantHolders), marked);
        assert.equal(dropOrphanedGrantChanges(marked, new Map()).size, 0);
    });

    test('should drop the unsaved changes of grants that are gone', () => {
        const pendingGrantChanges = new Map([
            [
                HOLDER_KEY,
                [
                    {grantIdentifier: 'grant-a', roleIdentifier: READER['@id'], shareable: false},
                    {
                        grantIdentifier: 'grant-gone',
                        roleIdentifier: AUTHOR['@id'],
                        shareable: false,
                    },
                ],
            ],
            [
                'person:bob',
                [{grantIdentifier: 'grant-c', roleIdentifier: READER['@id'], shareable: false}],
            ],
        ]);

        const pruned = dropOrphanedGrantChanges(
            pendingGrantChanges,
            createGrantHolders([{identifier: 'grant-a', role: EDITOR}]),
        );

        assert.deepEqual(pruned.get(HOLDER_KEY), [
            {grantIdentifier: 'grant-a', roleIdentifier: READER['@id'], shareable: false},
        ]);
        // A holder that lost all of its grants is no longer part of the map
        assert.isFalse(pruned.has('person:bob'));
    });

    test('should add a draft role row without a role', () => {
        const draftRoleGrants = addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1');
        assert.deepEqual(draftRoleGrants.get(HOLDER_KEY), [
            {clientIdentifier: 'draft-role-1', roleIdentifier: null, shareable: false},
        ]);

        const withSecondRow = addDraftRoleGrant(draftRoleGrants, HOLDER_KEY, 'draft-role-2');
        assert.deepEqual(
            withSecondRow.get(HOLDER_KEY).map((draft) => draft.clientIdentifier),
            ['draft-role-1', 'draft-role-2'],
        );
        // Rows are added to a new map, so the rendered rows are not changed in place
        assert.lengthOf(draftRoleGrants.get(HOLDER_KEY), 1);
    });

    test('should update only the addressed draft role row', () => {
        let draftRoleGrants = addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1');
        draftRoleGrants = addDraftRoleGrant(draftRoleGrants, HOLDER_KEY, 'draft-role-2');

        const updated = updateDraftRoleGrant(draftRoleGrants, HOLDER_KEY, 'draft-role-2', {
            roleIdentifier: READER['@id'],
        });

        assert.deepEqual(updated.get(HOLDER_KEY), [
            {clientIdentifier: 'draft-role-1', roleIdentifier: null, shareable: false},
            {clientIdentifier: 'draft-role-2', roleIdentifier: READER['@id'], shareable: false},
        ]);
    });

    test('should remove a draft role row and the draft holder it empties', () => {
        const draftGrantHolders = new Map([
            [
                HOLDER_KEY,
                {
                    key: HOLDER_KEY,
                    type: 'person',
                    subject: {identifier: 'frank'},
                    holderFields: {userIdentifier: 'frank'},
                    grants: [],
                },
            ],
        ]);
        let draftRoleGrants = addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1');
        draftRoleGrants = addDraftRoleGrant(draftRoleGrants, HOLDER_KEY, 'draft-role-2');

        const withoutFirstRow = removeDraftRoleGrant(
            draftRoleGrants,
            draftGrantHolders,
            HOLDER_KEY,
            'draft-role-1',
        );
        assert.deepEqual(
            withoutFirstRow.draftRoleGrants.get(HOLDER_KEY).map((draft) => draft.clientIdentifier),
            ['draft-role-2'],
        );
        // The holder still has a row, so it keeps the map it was rendered from
        assert.strictEqual(withoutFirstRow.draftGrantHolders, draftGrantHolders);

        const withoutAnyRow = removeDraftRoleGrant(
            withoutFirstRow.draftRoleGrants,
            withoutFirstRow.draftGrantHolders,
            HOLDER_KEY,
            'draft-role-2',
        );
        // A draft holder has no saved grants, so its last row takes it with it
        assert.isFalse(withoutAnyRow.draftRoleGrants.has(HOLDER_KEY));
        assert.isFalse(withoutAnyRow.draftGrantHolders.has(HOLDER_KEY));
    });

    test('should keep a saved holder that loses its last draft role row', () => {
        const draftRoleGrants = addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1');
        const draftGrantHolders = new Map();

        const removed = removeDraftRoleGrant(
            draftRoleGrants,
            draftGrantHolders,
            HOLDER_KEY,
            'draft-role-1',
        );

        assert.isFalse(removed.draftRoleGrants.has(HOLDER_KEY));
        assert.strictEqual(removed.draftGrantHolders, draftGrantHolders);
    });

    test('should block adding and saving while a draft row has no role', () => {
        const state = {
            roles: roles,
            grantHolders: createGrantHolders([{identifier: 'grant-a', role: EDITOR}]),
            draftRoleGrants: addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1'),
            pendingGrantChanges: new Map(),
            holderKey: HOLDER_KEY,
        };

        assert.isTrue(hasIncompleteDraftRole(state.draftRoleGrants, HOLDER_KEY));
        assert.isFalse(canAddDraftRole(state));
        assert.isFalse(
            isHolderSaveable(state.draftRoleGrants, state.pendingGrantChanges, HOLDER_KEY),
        );

        // Selecting a role completes the row, which unblocks both buttons
        const draftRoleGrants = updateDraftRoleGrant(
            state.draftRoleGrants,
            HOLDER_KEY,
            'draft-role-1',
            {roleIdentifier: READER['@id']},
        );
        assert.isFalse(hasIncompleteDraftRole(draftRoleGrants, HOLDER_KEY));
        assert.isTrue(canAddDraftRole({...state, draftRoleGrants: draftRoleGrants}));
        assert.isTrue(isHolderSaveable(draftRoleGrants, state.pendingGrantChanges, HOLDER_KEY));
    });

    test('should not offer another draft role row once every role is taken', () => {
        const state = {
            roles: roles,
            grantHolders: createGrantHolders([
                {identifier: 'grant-a', role: EDITOR},
                {identifier: 'grant-b', role: READER},
                {identifier: 'grant-c', role: AUTHOR},
            ]),
            draftRoleGrants: new Map(),
            pendingGrantChanges: new Map(),
            holderKey: HOLDER_KEY,
        };

        assert.isFalse(canAddDraftRole(state));
        assert.isTrue(canAddDraftRole({...state, grantHolders: new Map()}));
    });

    test('should only allow saving a holder that has unsaved work', () => {
        const draftRoleGrants = updateDraftRoleGrant(
            addDraftRoleGrant(new Map(), HOLDER_KEY, 'draft-role-1'),
            HOLDER_KEY,
            'draft-role-1',
            {roleIdentifier: READER['@id']},
        );
        const pendingGrantChanges = new Map([
            [
                HOLDER_KEY,
                [{grantIdentifier: 'grant-a', roleIdentifier: READER['@id'], shareable: false}],
            ],
        ]);

        assert.isFalse(isHolderSaveable(new Map(), new Map(), HOLDER_KEY));
        assert.isTrue(isHolderSaveable(draftRoleGrants, new Map(), HOLDER_KEY));
        assert.isTrue(isHolderSaveable(new Map(), pendingGrantChanges, HOLDER_KEY));
        // Another holder has nothing to save of its own
        assert.isFalse(isHolderSaveable(draftRoleGrants, pendingGrantChanges, 'person:bob'));
    });
});

suite('dbp-authorization-manage-grants-dialog', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-authorization-manage-grants-dialog');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node._resetDialogState();
        node.close();
        node.remove();
    });

    function addUnsavedDraft() {
        const holder = {
            key: 'person:frank',
            type: 'person',
            subject: {identifier: 'frank', givenName: 'Frank'},
            holderFields: {userIdentifier: 'frank'},
            grants: [],
        };
        node.draftGrantHolders = new Map([[holder.key, holder]]);
        node.draftRoleGrants = new Map([
            [holder.key, [{clientIdentifier: 'draft-1', roleIdentifier: null, shareable: false}]],
        ]);
    }

    function addSavedHolder() {
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor'};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader'};
        const grant = {
            identifier: 'grant-1',
            shareable: false,
            grantedActions: ['delete'],
            roleDefinition: editor,
        };
        const holder = {
            key: 'person:frank',
            type: 'person',
            subject: {identifier: 'frank', givenName: 'Frank'},
            grants: [grant],
        };
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([[holder.key, holder]]);
        return {holder, grant};
    }

    test('should save mixed work for existing and draft holders with one reload', async () => {
        const {holder, grant} = addSavedHolder();
        const alice = {
            ...holder,
            key: 'person:alice',
            subject: {identifier: 'alice'},
            grants: [{...grant, identifier: 'alice-grant'}],
        };
        const bob = {
            ...holder,
            key: 'person:bob',
            subject: {identifier: 'bob'},
            grants: [],
            holderFields: {userIdentifier: 'bob'},
        };
        node.grantHolders = new Map([...node.grantHolders, [alice.key, alice]]);
        node.draftGrantHolders = new Map([[bob.key, bob]]);
        node.handleGrantShareableChange({target: {checked: true}}, holder.key, grant);
        node.handleDeleteRoleButtonClick(alice.key, alice.grants[0]);
        for (const key of [holder.key, bob.key]) {
            node.handleAddRoleButtonClick(key);
            const draft = node.draftRoleGrants.get(key)[0];
            node.handleDraftRoleSelectChange(
                {target: {value: '/authorization/roles/reader'}},
                draft,
                key,
            );
        }
        const requests = [];
        node._apiPostResourceActionGrant = async (selection, fields) => {
            requests.push(`POST ${fields.userIdentifier} ${selection.roleIdentifier}`);
            return new Response('{}', {status: 201});
        };
        node._apiDeleteResourceActionGrant = async (identifier) => {
            requests.push(`DELETE ${identifier}`);
            return new Response('{}', {status: 200});
        };
        node._reloadGrantHolders = async () => requests.push('RELOAD');

        await node.updateComplete;
        assert.isFalse(node.shadowRoot.querySelector('.save-all-roles-button').disabled);
        await node.handleSaveAllRolesButtonClick();
        assert.deepEqual(requests, [
            'POST frank /authorization/roles/editor',
            'DELETE grant-1',
            'POST frank /authorization/roles/reader',
            'DELETE alice-grant',
            'POST bob /authorization/roles/reader',
            'RELOAD',
        ]);
        assert.equal(node.pendingGrantChanges.size, 0);
        assert.equal(node.draftRoleGrants.size, 0);
        assert.isFalse(node._savingAllRoles);
    });

    test('should block Save All when any draft is incomplete but allow individual saves', async () => {
        const {holder, grant} = addSavedHolder();
        node.handleGrantShareableChange({target: {checked: true}}, holder.key, grant);
        addUnsavedDraft();
        // Keep the incomplete draft on another holder.
        const draftHolder = node.draftGrantHolders.get(holder.key);
        node.draftGrantHolders = new Map([['person:bob', {...draftHolder, key: 'person:bob'}]]);
        node.draftRoleGrants = new Map([['person:bob', node.draftRoleGrants.get(holder.key)]]);
        node._saveHolderRoles = async () => assert.fail('Incomplete drafts must block the batch');
        await node.updateComplete;
        const button = node.shadowRoot.querySelector('.save-all-roles-button');
        assert.isTrue(button.disabled);
        assert.equal(
            button.title,
            node._i18n.t('auth-manage-dialog.buttons.save-all-select-role-title'),
        );
        assert.isFalse(node._isSaveDisabled(holder.key));
        await node.handleSaveAllRolesButtonClick();
        assert.isFalse(node._savingAllRoles);
    });

    test('should disable Save All without work or while a save or subject addition is running', async () => {
        assert.isTrue(node._isSaveAllDisabled());
        const {holder, grant} = addSavedHolder();
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node._savingHolderKeys = new Set([holder.key]);
        node._saveHolderRoles = async () => assert.fail('Overlapping saves must be blocked');
        assert.isTrue(node._isSaveAllDisabled());
        await node.handleSaveAllRolesButtonClick();
        node._savingHolderKeys = new Set();
        node._addingSubject = true;
        assert.isTrue(node._isSaveAllDisabled());
        await node.handleSaveAllRolesButtonClick();
        node._addingSubject = false;
        assert.isFalse(node._isSaveAllDisabled());
    });

    test('should retain failed work and retry only pending holders', async () => {
        const {holder, grant} = addSavedHolder();
        const alice = {
            ...holder,
            key: 'person:alice',
            subject: {identifier: 'alice'},
            grants: [{...grant, identifier: 'alice-grant'}],
        };
        node.grantHolders = new Map([...node.grantHolders, [alice.key, alice]]);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.handleDeleteRoleButtonClick(alice.key, alice.grants[0]);
        const requests = [];
        let fail = true;
        let reloads = 0;
        node._apiDeleteResourceActionGrant = async (identifier) => {
            requests.push(identifier);
            return new Response('{}', {
                status: identifier === grant.identifier && fail ? 403 : 200,
            });
        };
        node._reloadGrantHolders = async () => {
            reloads += 1;
        };

        await node.handleSaveAllRolesButtonClick();
        assert.deepEqual(requests, ['grant-1', 'alice-grant']);
        assert.isTrue(node._getPendingGrantChange(holder.key, grant.identifier).markedToDelete);
        assert.isFalse(node.pendingGrantChanges.has(alice.key));
        assert.isFalse(node._savingAllRoles);
        fail = false;
        await node.handleSaveAllRolesButtonClick();
        assert.deepEqual(requests, ['grant-1', 'alice-grant', 'grant-1']);
        assert.equal(reloads, 2);
        assert.equal(node.pendingGrantChanges.size, 0);
    });

    test('should freeze every holder and subject control until the final reload finishes', async () => {
        node.open();
        const {holder, grant} = addSavedHolder();
        const alice = {
            ...holder,
            key: 'person:alice',
            subject: {identifier: 'alice'},
            grants: [{...grant, identifier: 'alice-grant'}],
        };
        node.grantHolders = new Map([...node.grantHolders, [alice.key, alice]]);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.handleAddRoleButtonClick(holder.key);
        const draft = node.draftRoleGrants.get(holder.key)[0];
        node.handleDraftRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            draft,
            holder.key,
        );
        node.selectedSubject = {identifier: 'bob'};
        const pending = node.pendingGrantChanges;
        const drafts = node.draftRoleGrants;
        const selected = node.selectedSubject;
        let finishDelete;
        let finishReload;
        let reloadStarted;
        const reloading = new Promise((resolve) => {
            reloadStarted = resolve;
        });
        node._apiDeleteResourceActionGrant = () =>
            new Promise((resolve) => {
                finishDelete = resolve;
            });
        node._apiPostResourceActionGrant = async () => new Response('{}', {status: 201});
        node._reloadGrantHolders = () => {
            reloadStarted();
            return new Promise((resolve) => {
                finishReload = resolve;
            });
        };
        const save = node.handleSaveAllRolesButtonClick();
        await node.updateComplete;
        const controls = node.shadowRoot.querySelectorAll(
            '.role-grant-row select, .role-grant-row input, .role-grant-row dbp-icon-button, .add-role-button, .save-holder-roles-button, .save-all-roles-button, #add-person-button, #resource-select',
        );
        for (const control of controls) assert.isTrue(control.disabled);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.handleDeleteRoleButtonClick(alice.key, alice.grants[0]);
        node.handleGrantShareableChange({target: {checked: true}}, alice.key, alice.grants[0]);
        node.handleRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            alice.key,
            alice.grants[0],
        );
        node.handleAddRoleButtonClick(alice.key);
        node.handleDeleteDraftRoleButtonClick(holder.key, draft.clientIdentifier);
        node.handleDraftShareableChange({target: {checked: true}}, draft, holder.key);
        node.handleDraftRoleSelectChange({target: {value: ''}}, draft, holder.key);
        node.handleSubjectSelectChange({detail: {object: null}});
        await node.handleAddPersonButtonClick();
        await node.handleSaveHolderRolesButtonClick(alice.key);
        await node.handleSaveAllRolesButtonClick();
        assert.strictEqual(node.pendingGrantChanges, pending);
        assert.strictEqual(node.draftRoleGrants, drafts);
        assert.strictEqual(node.selectedSubject, selected);

        finishDelete(new Response('{}', {status: 200}));
        await reloading;
        await node.updateComplete;
        assert.isTrue(node._savingAllRoles);
        assert.isTrue(node.shadowRoot.querySelector('#resource-select').disabled);
        assert.isTrue(node._isSaveDisabled(alice.key));
        node.close();
        await node._focusKeepEditingButton();
        assert.isTrue(node._showCloseConfirmation);
        assert.isTrue(node.shadowRoot.querySelector('.discard-changes-button').disabled);
        node._discardChangesAndClose();
        assert.isTrue(node.modalRef.value.isOpen());
        finishReload();
        await save;
        await node._keepEditing();
        await node.updateComplete;
        assert.isFalse(node._savingAllRoles);
        assert.isFalse(node.shadowRoot.querySelector('#resource-select').disabled);
        assert.isFalse(node._isAddRoleDisabled(alice.key));
    });

    test('should continue after unexpected holder failures and unlock after reload failure', async () => {
        const {holder, grant} = addSavedHolder();
        const alice = {
            ...holder,
            key: 'person:alice',
            subject: {identifier: 'alice'},
            grants: [{...grant, identifier: 'alice-grant'}],
        };
        node.grantHolders = new Map([...node.grantHolders, [alice.key, alice]]);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.handleDeleteRoleButtonClick(alice.key, alice.grants[0]);
        const attempts = [];
        node._saveHolderRoles = async (currentHolder) => {
            attempts.push(currentHolder.key);
            if (currentHolder.key === holder.key) throw new Error('Unexpected holder failure');
        };
        node._reloadGrantHolders = async () => {
            throw new Error('Unexpected reload failure');
        };
        try {
            await node.handleSaveAllRolesButtonClick();
            assert.fail('Expected reload failure');
        } catch (error) {
            assert.equal(error.message, 'Unexpected reload failure');
        }
        assert.deepEqual(attempts, [holder.key, alice.key]);
        assert.isFalse(node._savingAllRoles);
        assert.isFalse(node._isSaveAllDisabled());
    });

    test('should stop an old batch after reset without restoring its pending work', async () => {
        const {holder, grant} = addSavedHolder();
        node.handleGrantShareableChange({target: {checked: true}}, holder.key, grant);
        let finish;
        node._apiPostResourceActionGrant = () =>
            new Promise((resolve) => {
                finish = resolve;
            });
        node._apiDeleteResourceActionGrant = async () =>
            assert.fail('Reset must stop replacement deletion');
        node._reloadGrantHolders = async () =>
            assert.fail('An old batch must not reload a reset dialog');
        const save = node.handleSaveAllRolesButtonClick();
        node._resetDialogState();
        finish(new Response('{}', {status: 201}));
        await save;
        assert.isFalse(node._savingAllRoles);
        assert.equal(node.pendingGrantChanges.size, 0);
        assert.equal(node.draftRoleGrants.size, 0);
    });

    for (const lang of ['en', 'de']) {
        test(`should mark and undo deletion without requests in ${lang}`, async () => {
            node.lang = lang;
            const {holder, grant} = addSavedHolder();
            node._apiDeleteResourceActionGrant = async () =>
                assert.fail('Deletion must wait for Save');
            await node.updateComplete;
            const row = node.shadowRoot.querySelector('.role-grant-row');
            const button = row.querySelector('.delete-role-button');
            button.click();
            await node.updateComplete;

            assert.strictEqual(node.shadowRoot.querySelector('.role-grant-row'), row);
            assert.isTrue(row.classList.contains('marked-to-delete'));
            assert.isTrue(row.querySelector('select').disabled);
            assert.isTrue(row.querySelector('input').disabled);
            assert.isFalse(button.disabled);
            assert.equal(button.getAttribute('icon-name'), 'undo');
            assert.equal(
                button.getAttribute('aria-label'),
                node._i18n.t('auth-manage-dialog.buttons.undo-delete-role', {
                    role: 'editor',
                    holder: 'Frank',
                }),
            );
            assert.isFalse(node._isSaveDisabled(holder.key));
            assert.deepEqual(
                node._getAvailableRolesForHolder(holder.key).map((role) => role.identifier),
                ['reader'],
            );
            assert.equal(getComputedStyle(row, '::after').pointerEvents, 'none');

            button.click();
            await node.updateComplete;
            assert.isFalse(row.classList.contains('marked-to-delete'));
            assert.isFalse(row.querySelector('select').disabled);
            assert.isTrue(node._isSaveDisabled(holder.key));
            assert.equal(node.pendingGrantChanges.size, 0);
            assert.lengthOf(node.grantHolders.get(holder.key).grants, 1);
            assert.equal(grant.identifier, 'grant-1');
        });
    }

    test('should discard a pending deletion only after close confirmation', async () => {
        node.open();
        const {holder, grant} = addSavedHolder();
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.close();
        await node._focusKeepEditingButton();
        assert.isTrue(node._showCloseConfirmation);
        assert.isTrue(node._getPendingGrantChange(holder.key, grant.identifier).markedToDelete);
        node._discardChangesAndClose();
        assert.equal(node.pendingGrantChanges.size, 0);
        assert.lengthOf(node.grantHolders.get(holder.key).grants, 1);
    });

    test('should keep failed deletions marked and retry only DELETE on Save', async () => {
        const {holder, grant} = addSavedHolder();
        let attempts = 0;
        node._apiPostResourceActionGrant = async () =>
            assert.fail('Deletion must not create a grant');
        node._apiDeleteResourceActionGrant = async () =>
            new Response('{}', {status: ++attempts === 1 ? 403 : 200});
        node._reloadGrantHolders = async () => node._dropOrphanedGrantChanges();
        node.handleDeleteRoleButtonClick(holder.key, grant);

        await node.handleSaveHolderRolesButtonClick(holder.key);
        await node.updateComplete;
        assert.equal(attempts, 1);
        assert.isTrue(node._getPendingGrantChange(holder.key, grant.identifier).markedToDelete);
        assert.isNotNull(node.shadowRoot.querySelector('.marked-to-delete'));
        assert.isFalse(node._isSaveDisabled(holder.key));

        await node.handleSaveHolderRolesButtonClick(holder.key);
        await node.updateComplete;
        assert.equal(attempts, 2);
        assert.equal(node.pendingGrantChanges.size, 0);
        assert.isFalse(node.grantHolders.has(holder.key));
        assert.isFalse(node._savingHolderKeys.has(holder.key));
    });

    test('should block edits and deletion toggles while the holder is saving', async () => {
        const {holder, grant} = addSavedHolder();
        node.handleAddRoleButtonClick(holder.key);
        const draft = node.draftRoleGrants.get(holder.key)[0];
        node.handleDraftRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            draft,
            holder.key,
        );
        node.handleDeleteRoleButtonClick(holder.key, grant);
        const pending = node.pendingGrantChanges;
        const drafts = node.draftRoleGrants;
        let finish;
        node._apiDeleteResourceActionGrant = () =>
            new Promise((resolve) => {
                finish = resolve;
            });
        node._apiPostResourceActionGrant = async () => new Response('{}', {status: 201});
        node._reloadGrantHolders = async () => {};
        const save = node.handleSaveHolderRolesButtonClick(holder.key);
        await node.updateComplete;
        assert.isTrue(node._savingHolderKeys.has(holder.key));
        for (const control of node.shadowRoot.querySelectorAll(
            '.role-grant-row select, .role-grant-row input, .role-grant-row dbp-icon-button',
        )) {
            assert.isTrue(control.disabled);
        }
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node.handleRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            holder.key,
            grant,
        );
        node.handleDeleteDraftRoleButtonClick(holder.key, draft.clientIdentifier);
        node.handleDraftShareableChange({target: {checked: true}}, draft, holder.key);
        node.handleAddRoleButtonClick(holder.key);
        assert.strictEqual(node.pendingGrantChanges, pending);
        assert.strictEqual(node.draftRoleGrants, drafts);
        finish(new Response('{}', {status: 200}));
        await save;
        assert.isFalse(node._savingHolderKeys.has(holder.key));
    });

    test('should keep failed new roles reachable after deleting the last saved grant', async () => {
        const {holder, grant} = addSavedHolder();
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.handleAddRoleButtonClick(holder.key);
        const draft = node.draftRoleGrants.get(holder.key)[0];
        node.handleDraftRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            draft,
            holder.key,
        );
        node.handleDeleteRoleButtonClick(holder.key, grant);
        node._apiDeleteResourceActionGrant = async () => new Response('{}', {status: 200});
        node._apiPostResourceActionGrant = async () => new Response('{}', {status: 403});
        node._apiGetResourceActionGrants = async () => [];

        await node.handleSaveHolderRolesButtonClick(holder.key);
        await node.updateComplete;
        assert.isFalse(node.grantHolders.has(holder.key));
        assert.isTrue(node.draftGrantHolders.has(holder.key));
        assert.deepEqual(node.draftGrantHolders.get(holder.key).holderFields, {
            userIdentifier: 'frank',
        });
        assert.lengthOf(node.draftRoleGrants.get(holder.key), 1);
        assert.isNotNull(node.shadowRoot.querySelector('.draft-role-grant-row'));
        assert.isFalse(node._isSaveDisabled(holder.key));
        assert.equal(node.pendingGrantChanges.size, 0);
    });

    test('should preserve edits on Undo and prevent editing a marked grant', () => {
        const {holder, grant} = addSavedHolder();
        node.handleRoleSelectChange(
            {target: {value: '/authorization/roles/reader'}},
            holder.key,
            grant,
        );
        node.handleGrantShareableChange({target: {checked: true}}, holder.key, grant);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        const pending = node.pendingGrantChanges;
        node.handleGrantShareableChange({target: {checked: false}}, holder.key, grant);
        node.handleRoleSelectChange(
            {target: {value: '/authorization/roles/editor'}},
            holder.key,
            grant,
        );
        assert.strictEqual(node.pendingGrantChanges, pending);
        node.handleDeleteRoleButtonClick(holder.key, grant);
        assert.deepEqual(node._getPendingGrantChange(holder.key, grant.identifier), {
            grantIdentifier: grant.identifier,
            roleIdentifier: '/authorization/roles/reader',
            shareable: true,
            markedToDelete: false,
        });
    });

    test('should not mark grants without delete permission', async () => {
        const {holder, grant} = addSavedHolder();
        grant.grantedActions = ['read'];
        node.handleDeleteRoleButtonClick(holder.key, grant);
        await node.updateComplete;
        assert.equal(node.pendingGrantChanges.size, 0);
        assert.isTrue(node.shadowRoot.querySelector('.delete-role-button').disabled);
        assert.isNull(node.shadowRoot.querySelector('.marked-to-delete'));
    });

    for (const closePath of ['footer', 'header', 'escape', 'programmatic']) {
        test(`should confirm unsaved changes when closing via ${closePath}`, async () => {
            node.open();
            addUnsavedDraft();
            await node.updateComplete;
            const drafts = node.draftGrantHolders;
            const modal = node.modalRef.value;
            if (closePath === 'footer') {
                node.shadowRoot
                    .querySelector('.close-dialog-footer-button')
                    .shadowRoot.querySelector('button')
                    .click();
            } else if (closePath === 'header') {
                modal.shadowRoot.querySelector('.modal-close').click();
            } else if (closePath === 'escape') {
                modal.modalDialog.dispatchEvent(new Event('cancel', {cancelable: true}));
            } else {
                node.close();
            }
            await node._focusKeepEditingButton();

            assert.isTrue(modal.isOpen());
            assert.isTrue(node._showCloseConfirmation);
            assert.strictEqual(node.draftGrantHolders, drafts);
            assert.isNotNull(node.shadowRoot.querySelector('.close-confirmation'));
            assert.isTrue(node.shadowRoot.querySelector('.main-content').inert);
            const keepEditing = node.keepEditingButtonRef.value;
            assert.strictEqual(
                keepEditing.shadowRoot.activeElement,
                keepEditing.shadowRoot.querySelector('button'),
            );
        });
    }

    test('should preserve drafts and restore focus when keeping editing', async () => {
        node.open();
        addUnsavedDraft();
        await node.updateComplete;
        const closeButton = node.shadowRoot
            .querySelector('.close-dialog-footer-button')
            .shadowRoot.querySelector('button');
        closeButton.focus();
        closeButton.click();
        await node._focusKeepEditingButton();
        await node._keepEditing();

        assert.isTrue(node.modalRef.value.isOpen());
        assert.isFalse(node._showCloseConfirmation);
        assert.equal(node.draftGrantHolders.size, 1);
        assert.isFalse(node.shadowRoot.querySelector('.main-content').inert);
        assert.strictEqual(closeButton.getRootNode().activeElement, closeButton);
    });

    test('should keep confirmation open on a second Escape', async () => {
        node.open();
        addUnsavedDraft();
        const modal = node.modalRef.value;
        modal.modalDialog.dispatchEvent(new Event('cancel', {cancelable: true}));
        await node._focusKeepEditingButton();
        modal.modalDialog.dispatchEvent(new Event('cancel', {cancelable: true}));
        await node.updateComplete;

        assert.isTrue(modal.isOpen());
        assert.isTrue(node._showCloseConfirmation);
        assert.equal(node.draftGrantHolders.size, 1);
    });

    test('should preserve unsaved changes through repeated Escape keydowns', async () => {
        node.open();
        addUnsavedDraft();
        const drafts = node.draftGrantHolders;
        const modal = node.modalRef.value;
        for (let index = 0; index < 6; index += 1) {
            modal.modalDialog.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                    cancelable: true,
                }),
            );
            await node.updateComplete;
            await new Promise((resolve) => requestAnimationFrame(resolve));
            assert.isTrue(modal.isOpen());
            assert.strictEqual(node.draftGrantHolders, drafts);
            assert.isTrue(node._showCloseConfirmation);
        }
    });

    test('should discard drafts and pending changes only after confirmation', async () => {
        node.open();
        addUnsavedDraft();
        node.pendingGrantChanges = new Map([
            [
                'person:frank',
                [{grantIdentifier: 'grant-1', roleIdentifier: '/roles/editor', shareable: false}],
            ],
        ]);
        node.close();
        await node._focusKeepEditingButton();
        const closed = new Promise((resolve) =>
            node.addEventListener('dbp-modal-closed', resolve, {once: true}),
        );
        node.shadowRoot
            .querySelector('.discard-changes-button')
            .shadowRoot.querySelector('button')
            .click();
        await closed;

        assert.isFalse(node.modalRef.value.isOpen());
        assert.isFalse(node._showCloseConfirmation);
        assert.equal(node.draftGrantHolders.size, 0);
        assert.equal(node.draftRoleGrants.size, 0);
        assert.equal(node.pendingGrantChanges.size, 0);
    });

    test('should require an explicit decision after saving finishes', async () => {
        node.open();
        node._savingHolderKeys = new Set(['person:frank']);
        node.close();
        await node._focusKeepEditingButton();
        assert.isTrue(node.modalRef.value.isOpen());
        assert.isTrue(node.shadowRoot.querySelector('.discard-changes-button').disabled);
        assert.include(
            node.shadowRoot.querySelector('#close-confirmation-description').textContent,
            node._i18n.t('auth-manage-dialog.close-confirmation.saving-description'),
        );
        node._discardChangesAndClose();
        assert.isTrue(node.modalRef.value.isOpen());
        assert.isTrue(node._savingHolderKeys.has('person:frank'));

        node._savingHolderKeys = new Set();
        node.close();
        await node.updateComplete;
        assert.isTrue(node.modalRef.value.isOpen());
        assert.isTrue(node._showCloseConfirmation);
        assert.include(
            node.shadowRoot.querySelector('.discard-changes-button').textContent,
            node._i18n.t('auth-manage-dialog.buttons.close-button-label'),
        );
        node._discardChangesAndClose();
        assert.isFalse(node.modalRef.value.isOpen());
    });

    for (const lang of ['en', 'de']) {
        test(`should update confirmation after partial and complete saves in ${lang}`, async () => {
            node.lang = lang;
            await node.updateComplete;
            node.open();
            addUnsavedDraft();
            const role = {
                '@id': '/authorization/roles/editor',
                identifier: 'editor',
                roleNames: [],
            };
            const alice = {
                key: 'person:alice',
                type: 'person',
                subject: {identifier: 'alice', givenName: 'Alice'},
                grants: [{identifier: 'alice-grant', shareable: false, roleDefinition: role}],
            };
            node.roles = new Map([[role['@id'], role]]);
            node.grantHolders = new Map([[alice.key, alice]]);
            node.pendingGrantChanges = new Map([
                [
                    alice.key,
                    [
                        {
                            grantIdentifier: 'alice-grant',
                            roleIdentifier: role['@id'],
                            shareable: true,
                        },
                    ],
                ],
            ]);
            node.close();
            await node._focusKeepEditingButton();

            const frank = {
                ...node.draftGrantHolders.get('person:frank'),
                grants: [{identifier: 'frank-grant', shareable: false, roleDefinition: role}],
            };
            node.grantHolders = new Map([...node.grantHolders, [frank.key, frank]]);
            node.draftGrantHolders = new Map();
            node.draftRoleGrants = new Map();
            await node.updateComplete;
            let button = node.shadowRoot.querySelector('.discard-changes-button');
            assert.include(
                button.textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.discard-changes'),
            );
            assert.equal(button.type, 'is-danger');
            assert.include(
                node.shadowRoot.querySelector('#close-confirmation-title').textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.title'),
            );
            assert.include(
                node.shadowRoot.querySelector('#close-confirmation-description').textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.description'),
            );

            node.grantHolders = new Map([
                ...node.grantHolders,
                [alice.key, {...alice, grants: [{...alice.grants[0], shareable: true}]}],
            ]);
            node.pendingGrantChanges = new Map();
            await node.updateComplete;
            button = node.shadowRoot.querySelector('.discard-changes-button');
            assert.include(
                button.textContent,
                node._i18n.t('auth-manage-dialog.buttons.close-button-label'),
            );
            assert.notInclude(
                button.textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.discard-changes'),
            );
            assert.equal(button.type, 'is-secondary');
            assert.isFalse(button.disabled);
            assert.include(
                node.shadowRoot.querySelector('#close-confirmation-title').textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.saved-title'),
            );
            assert.include(
                node.shadowRoot.querySelector('#close-confirmation-description').textContent,
                node._i18n.t('auth-manage-dialog.close-confirmation.saved-description'),
            );
            assert.isNotNull(node.shadowRoot.querySelector('.keep-editing-button'));
            const savedHolders = node.grantHolders;
            button.shadowRoot.querySelector('button').click();
            assert.isFalse(node.modalRef.value.isOpen());
            assert.strictEqual(node.grantHolders, savedHolders);
        });
    }

    test('should recognize each kind of unsaved change but ignore empty row lists', () => {
        assert.isFalse(node._hasUnsavedChanges());
        node.draftGrantHolders = new Map([['person:frank', {}]]);
        assert.isTrue(node._hasUnsavedChanges());
        node.draftGrantHolders = new Map();
        node.draftRoleGrants = new Map([['person:frank', [{}]]]);
        assert.isTrue(node._hasUnsavedChanges());
        node.draftRoleGrants = new Map([['person:frank', []]]);
        assert.isFalse(node._hasUnsavedChanges());
        node.pendingGrantChanges = new Map([['person:frank', [{}]]]);
        assert.isTrue(node._hasUnsavedChanges());
        node.pendingGrantChanges = new Map([['person:frank', []]]);
        assert.isFalse(node._hasUnsavedChanges());
    });

    test('should close without confirmation on logout even with unsaved changes', async () => {
        node.open();
        addUnsavedDraft();
        node.logoutCallback();
        await node.updateComplete;
        assert.isFalse(node.modalRef.value.isOpen());
        assert.isFalse(node._showCloseConfirmation);
        assert.equal(node.draftGrantHolders.size, 0);
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    for (const scenario of [
        {
            name: 'the list when both containers overflow',
            listOverflow: 'auto',
            listHeight: 400,
            dialogHeight: 400,
            expected: 'list',
        },
        {
            name: 'the dialog when only the dialog overflows',
            listOverflow: 'auto',
            listHeight: 200,
            dialogHeight: 400,
            expected: 'dialog',
        },
        {
            name: 'the dialog when the overflowing list cannot scroll',
            listOverflow: 'hidden',
            listHeight: 400,
            dialogHeight: 400,
            expected: 'dialog',
        },
        {
            name: 'no container when neither overflows',
            listOverflow: 'auto',
            listHeight: 200,
            dialogHeight: 200,
            expected: null,
        },
    ]) {
        test(`should detect ${scenario.name}`, () => {
            const list = node.shadowRoot.querySelector('.grants-list-container');
            const dialog = node.modalRef.value.modalDialog;
            list.style.overflowY = scenario.listOverflow;
            dialog.style.overflowY = 'auto';
            Object.defineProperties(list, {
                scrollHeight: {value: scenario.listHeight, configurable: true},
                clientHeight: {value: 200, configurable: true},
            });
            Object.defineProperties(dialog, {
                scrollHeight: {value: scenario.dialogHeight, configurable: true},
                clientHeight: {value: 200, configurable: true},
            });

            const expected =
                scenario.expected === 'list'
                    ? list
                    : scenario.expected === 'dialog'
                      ? dialog
                      : null;
            assert.strictEqual(node._getHolderScrollContainer(), expected);
        });
    }

    test('should highlight a holder even when no container needs scrolling', async () => {
        const list = node.shadowRoot.querySelector('.grants-list-container');
        const holder = document.createElement('section');
        list.appendChild(holder);
        node._getHolderScrollContainer = () => null;
        holder.scrollIntoView = () => assert.fail('No scrolling should be requested');

        await node._scrollToAndHighlightExistingHolder(holder);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        assert.isTrue(holder.classList.contains('highlighted'));
    });

    for (const containerType of ['list', 'dialog']) {
        test(`should scroll the detected ${containerType} directly before highlighting`, async () => {
            const list = node.shadowRoot.querySelector('.grants-list-container');
            const dialog = node.modalRef.value.modalDialog;
            const container = containerType === 'list' ? list : dialog;
            for (const element of [list, dialog]) {
                element.style.overflowY = 'auto';
                Object.defineProperties(element, {
                    scrollHeight: {value: element === container ? 1000 : 200, configurable: true},
                    clientHeight: {value: 200, configurable: true},
                    scrollTop: {value: 0, configurable: true},
                });
            }
            container.getBoundingClientRect = () => ({top: 0, height: 200});
            const holder = document.createElement('section');
            holder.getBoundingClientRect = () => ({top: 300, height: 50});
            holder.scrollIntoView = () =>
                assert.fail('The detected container should scroll directly');
            list.appendChild(holder);
            let scrollOptions;
            container.scrollTo = (options) => {
                scrollOptions = options;
                container.dispatchEvent(new Event('scrollend'));
            };

            await node._scrollToAndHighlightExistingHolder(holder);
            await new Promise((resolve) => requestAnimationFrame(resolve));
            assert.deepEqual(scrollOptions, {top: 225, behavior: 'smooth'});
            assert.isTrue(holder.classList.contains('highlighted'));
        });
    }

    for (const lookupFails of [false, true]) {
        test(`should disable subject controls during addition and restore them after a ${lookupFails ? 'failed' : 'successful'} lookup`, async () => {
            const selector = node.subjectSelectorRef.value;
            const addButton = node.shadowRoot.querySelector('#add-person-button');
            const person = {
                '@id': '/base/people/frank',
                '@type': 'https://schema.org/Person',
                identifier: 'frank',
                givenName: 'Frank',
            };
            const role = {
                '@id': '/authorization/roles/editor',
                identifier: 'editor',
                roleNames: [],
            };
            node.roles = new Map([[role['@id'], role]]);
            node.selectedSubject = person;
            let finishLookup;
            let lookupCount = 0;
            node._apiGetPerson = () => {
                lookupCount += 1;
                return new Promise((resolve, reject) => {
                    finishLookup = () =>
                        lookupFails
                            ? reject(new Error('Person lookup failed'))
                            : resolve({...person, localData: {email: 'frank@example.com'}});
                });
            };
            let resetCount = 0;
            selector.reset = async () => {
                resetCount += 1;
                node.selectedSubject = null;
            };

            const addition = node.handleAddPersonButtonClick();
            await node.updateComplete;
            assert.isTrue(selector.hasAttribute('disabled'));
            assert.isTrue(addButton.hasAttribute('disabled'));
            assert.equal(node.draftGrantHolders.size, 0);

            await node.handleAddPersonButtonClick();
            assert.equal(lookupCount, 1);

            finishLookup();
            await addition;
            await node.updateComplete;
            assert.isFalse(node._addingSubject);
            assert.isFalse(selector.hasAttribute('disabled'));
            assert.isTrue(addButton.hasAttribute('disabled'));
            assert.equal(resetCount, 1);
            assert.equal(node.draftGrantHolders.size, 1);
            assert.lengthOf(node.draftRoleGrants.get('person:frank'), 1);

            node.selectedSubject = person;
            await node.updateComplete;
            assert.isFalse(addButton.hasAttribute('disabled'));
        });
    }

    test('should open and close', () => {
        const modal = node.shadowRoot.querySelector('dbp-modal');

        node.open();
        assert.isTrue(modal.isOpen());

        node.close();
        assert.isFalse(modal.isOpen());
    });

    for (const lookupFails of [false, true]) {
        test(`should ignore a ${lookupFails ? 'failed' : 'successful'} old lookup after reopening without unlocking a newer addition`, async () => {
            const selector = node.subjectSelectorRef.value;
            const person = {
                '@id': '/base/people/frank',
                '@type': 'https://schema.org/Person',
                identifier: 'frank',
                givenName: 'Frank',
            };
            const nextPerson = {...person, '@id': '/base/people/alice', identifier: 'alice'};
            const role = {
                '@id': '/authorization/roles/editor',
                identifier: 'editor',
                roleNames: [],
            };
            const finishLookups = new Map();
            node._apiGetPerson = (identifier) =>
                new Promise((resolve, reject) => {
                    finishLookups.set(identifier, () =>
                        lookupFails && identifier === 'frank'
                            ? reject(new Error('Person lookup failed'))
                            : resolve({identifier}),
                    );
                });
            let resetCount = 0;
            selector.reset = async () => {
                resetCount += 1;
                node.selectedSubject = null;
            };

            node.open();
            node.roles = new Map([[role['@id'], role]]);
            node.selectedSubject = person;
            const oldAddition = node.handleAddPersonButtonClick();
            const closed = new Promise((resolve) =>
                node.addEventListener('dbp-modal-closed', resolve, {once: true}),
            );
            node.close();
            await closed;
            node.open();
            assert.isFalse(node._addingSubject);
            node.selectedSubject = nextPerson;
            const newAddition = node.handleAddPersonButtonClick();
            const resetsBeforeOldCompletion = resetCount;

            finishLookups.get('frank')();
            await oldAddition;
            await node.updateComplete;
            assert.equal(node.draftGrantHolders.size, 0);
            assert.equal(node.draftRoleGrants.size, 0);
            assert.strictEqual(node.selectedSubject, nextPerson);
            assert.equal(resetCount, resetsBeforeOldCompletion);
            assert.isTrue(node._addingSubject);
            assert.isTrue(selector.hasAttribute('disabled'));
            assert.isTrue(
                node.shadowRoot.querySelector('#add-person-button').hasAttribute('disabled'),
            );

            finishLookups.get('alice')();
            await newAddition;
            assert.isFalse(node._addingSubject);
            assert.isFalse(node.draftGrantHolders.has('person:frank'));
            assert.isTrue(node.draftGrantHolders.has('person:alice'));
            assert.lengthOf(node.draftRoleGrants.get('person:alice'), 1);
        });
    }

    test('should load roles with the configured compound resource identifier', async () => {
        const originalFetch = globalThis.fetch;
        const requests = [];
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'form-identifier';
        node.resourceType = 1;
        globalThis.fetch = async (url, options) => {
            requests.push({url: new URL(url), options});
            return new Response(
                JSON.stringify({
                    'hydra:member': [
                        {
                            '@id': '/authorization/roles/role-identifier',
                            identifier: 'role-identifier',
                            roleNames: [
                                {languageTag: 'de', name: 'Rollenname'},
                                {languageTag: 'en', name: 'Role name'},
                            ],
                        },
                    ],
                }),
                {
                    status: 200,
                    headers: {'Content-Type': 'application/ld+json'},
                },
            );
        };

        try {
            assert.isTrue(await node._loadRoles());
        } finally {
            globalThis.fetch = originalFetch;
        }

        assert.lengthOf(requests, 1);
        assert.equal(requests[0].url.pathname, '/authorization/roles');
        assert.equal(
            requests[0].url.searchParams.get('resourceClass'),
            'DbpRelayFormalizeSubmission',
        );
        assert.equal(requests[0].url.searchParams.get('resourceIdentifier'), 'form-identifier');
        assert.equal(requests[0].url.searchParams.get('resourceType'), '1');
        assert.equal(requests[0].options.headers.Authorization, 'Bearer token');
        assert.equal(node.roles.size, 1);
        assert.equal(
            node.roles.get('/authorization/roles/role-identifier').identifier,
            'role-identifier',
        );
    });

    test('should stop loading resource data when the roles request fails', async () => {
        const originalFetch = globalThis.fetch;
        const requests = [];
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeForm';
        node.resourceIdentifier = 'form-id';
        globalThis.fetch = async (url) => {
            requests.push(new URL(url).pathname);
            return new Response('', {status: 403, statusText: 'Forbidden'});
        };
        try {
            await node._loadResourceData();
            // The form of the subtitle is loaded next to the grants, so only the
            // authorization requests tell whether the failed roles stopped the load
            assert.deepEqual(
                requests.filter((path) => path.startsWith('/authorization/')),
                ['/authorization/roles'],
            );
            assert.isFalse(node.grantHoldersLoading);
            assert.equal(node.grantHolders.size, 0);
            assert.isTrue(node.grantHoldersLoadFailed);
            await node.updateComplete;
            assert.isNull(node.shadowRoot.querySelector('.grants-list-placeholder'));
            assert.include(
                node.shadowRoot.querySelector('[role="alert"]').textContent,
                node._i18n.t('auth-manage-dialog.grants-load-failed'),
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should group role grants by holder and skip direct actions', async () => {
        const originalFetch = globalThis.fetch;
        const requests = [];
        const editor = {
            '@id': '/authorization/roles/editor',
            '@type': 'AuthorizationRole',
            identifier: 'editor',
            roleNames: [
                {'@type': 'AuthorizationRoleName', languageTag: 'de', name: 'Bearbeiter*in'},
                {'@type': 'AuthorizationRoleName', languageTag: 'en', name: 'Editor'},
            ],
        };
        const manager = {'@id': '/authorization/roles/manager', identifier: 'manager'};
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'form-id';
        node.resourceType = 1;
        node.roles = new Map([editor, manager].map((role) => [role['@id'], role]));
        const grants = [
            {identifier: 'a', userIdentifier: 'person-id', role: editor['@id'], shareable: true},
            {identifier: 'b', userIdentifier: 'person-id', role: manager['@id'], shareable: false},
            {identifier: 'c', userIdentifier: 'ignored', role: null, action: 'read'},
            {identifier: 'd', dynamicUserGroupIdentifier: 'developers', role: manager['@id']},
            {identifier: 'e', userGroup: '/authorization/user-groups/team', role: editor['@id']},
        ];
        globalThis.fetch = async (url) => {
            const parsed = new URL(url);
            requests.push(parsed);
            const body =
                parsed.pathname === '/authorization/resource-action-grants'
                    ? {'hydra:member': grants}
                    : parsed.pathname === '/authorization/dynamic-user-groups'
                      ? {'hydra:member': [{identifier: 'developers'}]}
                      : {
                            '@context': '/contexts/Person',
                            identifier: parsed.pathname.split('/').pop(),
                            givenName: 'Frank',
                            name: 'Team',
                            members: [{identifier: 'member-id'}],
                            localData: {email: 'frank@example.com', unused: 'discard'},
                        };
            return new Response(JSON.stringify(body), {status: 200});
        };
        try {
            await node._loadRoleGrantHolders();
            assert.equal(node.grantHolders.size, 3);
            const person = node.grantHolders.get('person:person-id');
            assert.equal(person.subject.givenName, 'Frank');
            assert.deepEqual(
                person.grants.map((grant) => grant.identifier),
                ['a', 'b'],
            );
            assert.deepEqual(person.grants[0], {
                identifier: 'a',
                shareable: true,
                grantedActions: [],
                roleDefinition: {
                    '@id': '/authorization/roles/editor',
                    identifier: 'editor',
                    roleNames: [
                        {languageTag: 'de', name: 'Bearbeiter*in'},
                        {languageTag: 'en', name: 'Editor'},
                    ],
                },
            });
            assert.deepEqual(person.subject.localData, {email: 'frank@example.com'});
            assert.notProperty(person.subject, '@context');
            const group = node.grantHolders.get('user-group:team');
            assert.equal(group.key, 'user-group:team');
            assert.lengthOf(
                requests.filter((url) => url.pathname === '/authorization/user-groups/team'),
                1,
            );
            assert.equal(group.subject.name, 'Team');
            assert.notProperty(group.subject, 'members');
            assert.notProperty(group.subject, 'localData');
            assert.isTrue(person.grants[0].shareable);
            assert.equal(requests[0].searchParams.get('resourceType'), '1');
            assert.lengthOf(
                requests.filter((url) => url.pathname === '/base/people/person-id'),
                1,
            );
            assert.equal(
                requests
                    .find((url) => url.pathname === '/base/people/person-id')
                    .searchParams.get('includeLocal'),
                'email',
            );
            assert.isFalse(node.grantHoldersLoading);
            assert.isFalse(node.grantHoldersLoadFailed);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should distinguish failed grant loading from a successfully empty collection', async () => {
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'SomeResource';
        node.resourceIdentifier = 'resource-id';
        node._notifyError = () => {};
        node._apiGetResourceActionGrants = async () => {
            throw new Error('Grants request failed');
        };

        await node._loadRoleGrantHolders();
        await node.updateComplete;
        assert.isTrue(node.grantHoldersLoadFailed);
        assert.isNull(node.shadowRoot.querySelector('.grants-list-placeholder'));
        assert.include(
            node.shadowRoot.querySelector('[role="alert"]').textContent,
            node._i18n.t('auth-manage-dialog.grants-load-failed'),
        );

        node._apiGetResourceActionGrants = async () => [];
        await node._loadRoleGrantHolders();
        await node.updateComplete;
        assert.isFalse(node.grantHoldersLoadFailed);
        assert.isNull(node.shadowRoot.querySelector('[role="alert"]'));
        assert.isNotNull(node.shadowRoot.querySelector('.grants-list-placeholder'));
    });

    test('should preserve holders and drafts with a warning when refreshing fails', async () => {
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'SomeResource';
        node.resourceIdentifier = 'resource-id';
        node._notifyError = () => {};
        const role = {
            '@id': '/authorization/roles/editor',
            identifier: 'editor',
            roleNames: [],
        };
        const holder = {
            key: 'person:frank',
            type: 'person',
            subject: {identifier: 'frank', givenName: 'Frank'},
            grants: [{identifier: 'grant-id', shareable: false, roleDefinition: role}],
        };
        const draftHolder = {
            key: 'person:alice',
            type: 'person',
            subject: {identifier: 'alice', givenName: 'Alice'},
            holderFields: {userIdentifier: 'alice'},
            grants: [],
        };
        node.roles = new Map([[role['@id'], role]]);
        node.grantHolders = new Map([[holder.key, holder]]);
        node.draftGrantHolders = new Map([[draftHolder.key, draftHolder]]);
        node.draftRoleGrants = new Map([
            [
                draftHolder.key,
                [{clientIdentifier: 'draft-1', roleIdentifier: role['@id'], shareable: false}],
            ],
        ]);
        const holders = node.grantHolders;
        const draftHolders = node.draftGrantHolders;
        const draftRoles = node.draftRoleGrants;
        node._apiGetResourceActionGrants = async () => {
            throw new Error('Refresh failed');
        };

        await node._loadRoleGrantHolders();
        await node.updateComplete;
        assert.isTrue(node.grantHoldersLoadFailed);
        assert.strictEqual(node.grantHolders, holders);
        assert.strictEqual(node.draftGrantHolders, draftHolders);
        assert.strictEqual(node.draftRoleGrants, draftRoles);
        assert.lengthOf(node.shadowRoot.querySelectorAll('.grant-holder-section'), 2);
        assert.isNull(node.shadowRoot.querySelector('.grants-list-placeholder'));
        assert.include(
            node.shadowRoot.querySelector('[role="alert"]').textContent,
            node._i18n.t('auth-manage-dialog.grants-refresh-failed'),
        );
    });

    test('should ignore an aborted loading failure after resetting the dialog', async () => {
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'SomeResource';
        node.resourceIdentifier = 'resource-id';
        const controller = new AbortController();
        node._resourceDataController = controller;
        let failRequest;
        node._apiGetResourceActionGrants = () =>
            new Promise((resolve, reject) => {
                failRequest = () => reject(new Error('Aborted request'));
            });
        node._notifyError = () => assert.fail('Aborted loads should not report an error');

        const loading = node._loadRoleGrantHolders(controller.signal);
        node._resetDialogState();
        failRequest();
        await loading;
        assert.isTrue(controller.signal.aborted);
        assert.isFalse(node.grantHoldersLoadFailed);
    });

    test('should clear loading failure when resetting or starting a new resource load', async () => {
        node.grantHoldersLoadFailed = true;
        node._resetDialogState();
        assert.isFalse(node.grantHoldersLoadFailed);

        node.grantHoldersLoadFailed = true;
        await node._loadResourceData();
        assert.isFalse(node.grantHoldersLoadFailed);
    });

    test('should preserve role grants when one subject lookup fails', async () => {
        const originalFetch = globalThis.fetch;
        const role = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeForm';
        node.resourceIdentifier = 'form-id';
        node.roles = new Map([[role['@id'], role]]);
        globalThis.fetch = async (url) => {
            const path = new URL(url).pathname;
            if (path === '/base/people/deleted') {
                return new Response('', {status: 404, statusText: 'Not Found'});
            }
            const body =
                path === '/authorization/resource-action-grants'
                    ? {
                          'hydra:member': [
                              {
                                  identifier: 'a',
                                  userIdentifier: 'deleted',
                                  role: role['@id'],
                                  shareable: true,
                              },
                              {
                                  identifier: 'b',
                                  userIdentifier: 'existing',
                                  role: '/authorization/roles/missing-role',
                                  shareable: false,
                              },
                          ],
                      }
                    : {identifier: 'existing', givenName: 'Frank'};
            return new Response(JSON.stringify(body), {status: 200});
        };
        try {
            await node._loadRoleGrantHolders();
            assert.equal(node.grantHolders.size, 2);
            const holders = [...node.grantHolders.values()];
            assert.deepEqual(holders[0].subject, {identifier: 'deleted'});
            assert.equal(holders[0].grants[0].identifier, 'a');
            assert.equal(holders[0].grants[0].roleDefinition['@id'], '/authorization/roles/editor');
            assert.equal(holders[0].grants[0].roleDefinition.identifier, 'editor');
            assert.isTrue(holders[0].grants[0].shareable);
            assert.equal(holders[1].subject.givenName, 'Frank');
            assert.deepEqual(holders[1].grants[0].roleDefinition, {
                '@id': '/authorization/roles/missing-role',
                identifier: 'missing-role',
                roleNames: [],
            });
            assert.isFalse(node.grantHoldersLoading);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should keep holders ordered by type, name and key across reloads', async () => {
        const originalFetch = globalThis.fetch;
        const role = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeForm';
        node.resourceIdentifier = 'form-id';
        node.roles = new Map([[role['@id'], role]]);
        const grants = [
            {userGroup: '/authorization/user-groups/team'},
            {userIdentifier: 'z'},
            {dynamicUserGroupIdentifier: 'developers'},
            {userIdentifier: 'b'},
            {userIdentifier: 'a'},
        ].map((holder, index) => ({...holder, identifier: String(index), role: role['@id']}));
        globalThis.fetch = async (url) => {
            const path = new URL(url).pathname;
            const identifier = path.split('/').pop();
            const body =
                path === '/authorization/resource-action-grants'
                    ? {'hydra:member': grants}
                    : path === '/authorization/dynamic-user-groups'
                      ? {'hydra:member': [{identifier: 'developers'}]}
                      : {identifier, givenName: identifier === 'z' ? 'Zoe' : 'Alex', name: 'Team'};
            return new Response(JSON.stringify(body), {status: 200});
        };
        try {
            const expected = [
                'person:a',
                'person:b',
                'person:z',
                'user-group:team',
                'dynamic-user-group:developers',
            ];
            await node._loadRoleGrantHolders();
            assert.deepEqual([...node.grantHolders.keys()], expected);
            grants.reverse();
            await node._loadRoleGrantHolders();
            assert.deepEqual([...node.grantHolders.keys()], expected);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should render holder sections with emails, localized roles and shareable state', async () => {
        node.lang = 'en';
        await node._i18n.changeLanguage('en');
        const roleDefinition = {
            '@id': '/authorization/roles/editor',
            identifier: 'editor',
            roleNames: [
                {languageTag: 'en', name: 'Editor'},
                {languageTag: 'de', name: 'Bearbeiter*in'},
            ],
        };
        node.roles = new Map([
            ['/authorization/roles/editor', roleDefinition],
            [
                '/authorization/roles/reader',
                {
                    '@id': '/authorization/roles/reader',
                    identifier: 'reader',
                    roleNames: [
                        {languageTag: 'en', name: 'Reader'},
                        {languageTag: 'de', name: 'Leser'},
                    ],
                },
            ],
        ]);
        const holders = [
            {
                key: 'person:frank',
                type: 'person',
                subject: {
                    identifier: 'frank',
                    givenName: 'Frank',
                    familyName: 'Schwartz',
                    localData: {email: 'frank@example.com'},
                },
                grants: [
                    {identifier: 'a', shareable: true, roleDefinition, grantedActions: ['delete']},
                    {
                        identifier: 'b',
                        shareable: false,
                        roleDefinition: {
                            '@id': '/authorization/roles/missing-role',
                            identifier: 'missing-role',
                            roleNames: [],
                        },
                    },
                ],
            },
            {
                key: 'user-group:team',
                type: 'user-group',
                subject: {identifier: 'team', name: 'Example Team'},
                grants: [],
            },
            {
                key: 'dynamic-user-group:developers',
                type: 'dynamic-user-group',
                subject: {identifier: 'developers'},
                grants: [],
            },
        ];
        node.grantHolders = new Map(holders.map((holder) => [holder.key, holder]));
        await node.updateComplete;
        const sections = node.shadowRoot.querySelectorAll('.grant-holder-section');
        assert.lengthOf(sections, 3);
        const selectors = sections[0].querySelectorAll('select.role-grant-name-selector');
        assert.equal(selectors[0].value, '/authorization/roles/editor');
        assert.deepEqual(
            [...selectors[0].options].map((option) => option.value),
            ['/authorization/roles/editor', '/authorization/roles/reader'],
        );
        assert.equal(selectors[1].value, '/authorization/roles/missing-role');
        // The editor role is assigned to the other row, so only the remaining roles and the
        // role of the grant itself can be selected.
        assert.deepEqual(
            [...selectors[1].options].map((option) => option.value),
            ['/authorization/roles/missing-role', '/authorization/roles/reader'],
        );
        assert.include(sections[0].textContent, 'Frank Schwartz');
        assert.equal(
            sections[0].querySelector('.grant-holder-email').textContent,
            'frank@example.com',
        );
        assert.deepEqual(
            [...sections[0].querySelectorAll('.role-grant-name-selector')].map((el) =>
                el.selectedOptions[0].textContent.trim(),
            ),
            ['Editor', 'missing-role'],
        );
        assert.deepEqual(
            [...sections[0].querySelectorAll('input[type="checkbox"]')].map((el) => el.checked),
            [true, false],
        );
        assert.lengthOf(sections[0].querySelectorAll('dbp-icon-button[icon-name="trash"]'), 2);
        assert.deepEqual(
            [...sections[0].querySelectorAll('dbp-icon-button')].map((button) =>
                button.hasAttribute('disabled'),
            ),
            [false, true],
        );
        assert.include(
            sections[0].querySelector('dbp-icon-button').getAttribute('aria-label'),
            'Editor',
        );
        assert.include(sections[0].querySelector('.add-role-button').textContent, 'Add role');
        assert.equal(
            sections[0].querySelector('.add-role-button dbp-icon').getAttribute('name'),
            'plus',
        );
        assert.include(sections[1].textContent, 'Example Team');
        assert.include(sections[2].textContent, 'developers');
        assert.isNull(sections[1].querySelector('.grant-holder-email'));
        node.lang = 'de';
        await node._i18n.changeLanguage('de');
        await node.updateComplete;
        assert.equal(
            node.shadowRoot
                .querySelector('.role-grant-name-selector')
                .selectedOptions[0].textContent.trim(),
            'Bearbeiter*in',
        );
    });

    test('should add empty draft roles from a holder add-role button', async () => {
        node.lang = 'en';
        await node._i18n.changeLanguage('en');
        node.roles = new Map([
            [
                '/authorization/roles/editor',
                {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []},
            ],
            [
                '/authorization/roles/reader',
                {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []},
            ],
        ]);
        const holder = {
            key: 'person:david',
            type: 'person',
            subject: {identifier: 'david', givenName: 'David'},
            grants: [],
        };
        node.grantHolders = new Map([[holder.key, holder]]);
        await node.updateComplete;

        const addRoleButton = node.shadowRoot.querySelector('.add-role-button');
        const initialDraftRoleGrants = node.draftRoleGrants;
        addRoleButton.click();

        assert.notStrictEqual(node.draftRoleGrants, initialDraftRoleGrants);
        assert.deepEqual(node.draftRoleGrants.get(holder.key), [
            {
                clientIdentifier: 'draft-role-1',
                roleIdentifier: null,
                shareable: false,
            },
        ]);
        await node.updateComplete;
        assert.isTrue(addRoleButton.hasAttribute('disabled'));

        const firstDraftRow = node.shadowRoot.querySelector('.draft-role-grant-row');
        const roleSelect = firstDraftRow.querySelector('.role-grant-name-selector');
        assert.equal(roleSelect.value, '');
        assert.deepEqual(
            [...roleSelect.options].map((option) => option.textContent.trim()),
            [node._i18n.t('auth-manage-dialog.role-select-placeholder'), 'editor', 'reader'],
        );
        roleSelect.value = '/authorization/roles/editor';
        roleSelect.dispatchEvent(new Event('change'));
        const shareableCheckbox = firstDraftRow.querySelector('input[type="checkbox"]');
        shareableCheckbox.checked = true;
        shareableCheckbox.dispatchEvent(new Event('change'));
        assert.deepInclude(node.draftRoleGrants.get(holder.key)[0], {
            roleIdentifier: '/authorization/roles/editor',
            shareable: true,
        });

        addRoleButton.click();
        assert.lengthOf(node.draftRoleGrants.get(holder.key), 1);
        await node.updateComplete;
        assert.lengthOf(node.shadowRoot.querySelectorAll('.draft-role-grant-row'), 1);

        node.shadowRoot.querySelector('.draft-role-grant-row dbp-icon-button').click();
        await node.updateComplete;
        assert.lengthOf(node.shadowRoot.querySelectorAll('.draft-role-grant-row'), 0);
        assert.isFalse(node.draftRoleGrants.has(holder.key));
        assert.isFalse(addRoleButton.hasAttribute('disabled'));
    });

    test('should render draft holders above persisted holders', async () => {
        const role = {
            '@id': '/authorization/roles/editor',
            identifier: 'editor',
            roleNames: [],
        };
        const draftHolder = {
            type: 'person',
            key: 'person:alice',
            subject: {identifier: 'alice', givenName: 'Alice'},
            holderFields: {userIdentifier: 'alice'},
            grants: [],
        };
        const persistedHolder = {
            type: 'person',
            key: 'person:bob',
            subject: {identifier: 'bob', givenName: 'Bob'},
            grants: [],
        };
        node.roles = new Map([[role['@id'], role]]);
        node.draftGrantHolders = new Map([[draftHolder.key, draftHolder]]);
        node.grantHolders = new Map([[persistedHolder.key, persistedHolder]]);
        node.handleAddRoleButtonClick(draftHolder.key);
        await node.updateComplete;

        const sections = node.shadowRoot.querySelectorAll('.grant-holder-section');
        assert.lengthOf(sections, 2);
        assert.equal(sections[0].id, `grant-holder-${draftHolder.key}`);
        assert.isNotNull(sections[0].querySelector('.draft-role-grant-row'));
        assert.equal(sections[1].id, `grant-holder-${persistedHolder.key}`);
    });

    test('should sort role rows by language and preserve keyed DOM after deletion', async () => {
        node.lang = 'en';
        const makeGrant = (identifier, en, de) => ({
            identifier,
            shareable: true,
            grantedActions: ['delete'],
            roleDefinition: {
                '@id': `/authorization/roles/${identifier}`,
                identifier,
                roleNames: [
                    {languageTag: 'en', name: en},
                    {languageTag: 'de', name: de},
                ],
            },
        });
        const holder = {
            key: 'person:david',
            type: 'person',
            subject: {identifier: 'david', givenName: 'David'},
            grants: [
                makeGrant('c', 'Reader', 'Leser'),
                makeGrant('b', 'Manager', 'Manager'),
                makeGrant('a', 'Editor', 'Bearbeiter'),
            ],
        };
        node.grantHolders = new Map([[holder.key, holder]]);
        await node.updateComplete;
        const rows = [...node.shadowRoot.querySelectorAll('.role-grant-row')];
        assert.deepEqual(
            rows.map((row) =>
                row
                    .querySelector('.role-grant-name-selector')
                    .selectedOptions[0].textContent.trim(),
            ),
            ['Editor', 'Manager', 'Reader'],
        );
        node.grantHolders = new Map([
            [
                holder.key,
                {...holder, grants: holder.grants.filter((grant) => grant.identifier !== 'a')},
            ],
        ]);
        await node.updateComplete;
        const remaining = [...node.shadowRoot.querySelectorAll('.role-grant-row')];
        assert.strictEqual(remaining[0], rows[1]);
        assert.strictEqual(remaining[1], rows[2]);
        node.lang = 'de';
        await node.updateComplete;
        assert.deepEqual(
            [...node.shadowRoot.querySelectorAll('.role-grant-name-selector')].map((el) =>
                el.selectedOptions[0].textContent.trim(),
            ),
            ['Leser', 'Manager'],
        );
    });

    test('should show a spinner instead of holder rows while loading', async () => {
        node.grantHoldersLoading = true;
        await node.updateComplete;
        assert.isNotNull(node.shadowRoot.querySelector('.grants-list-container dbp-mini-spinner'));
        assert.isNull(node.shadowRoot.querySelector('.grant-holder'));
    });

    test('should record and revert an unsaved role change of a saved grant', async () => {
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: true,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        await node.updateComplete;
        assert.isTrue(node._isSaveDisabled('person:frank'));

        const selector = node.shadowRoot.querySelector('select.role-grant-name-selector');
        selector.value = reader['@id'];
        selector.dispatchEvent(new Event('change'));
        await node.updateComplete;

        assert.deepEqual(node.pendingGrantChanges.get('person:frank'), [
            {grantIdentifier: 'a', roleIdentifier: reader['@id'], shareable: true},
        ]);
        assert.isFalse(node._isSaveDisabled('person:frank'));
        assert.isNotNull(node.shadowRoot.querySelector('.role-grant-row.unsaved-role-row'));

        // Selecting the originally assigned role again drops the change
        selector.value = editor['@id'];
        selector.dispatchEvent(new Event('change'));
        await node.updateComplete;

        assert.isFalse(node.pendingGrantChanges.has('person:frank'));
        assert.isTrue(node._isSaveDisabled('person:frank'));
        assert.isNull(node.shadowRoot.querySelector('.role-grant-row.unsaved-role-row'));
    });

    test('should create the new grant before deleting the changed one', async () => {
        const originalFetch = globalThis.fetch;
        const requests = [];
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        node.pendingGrantChanges = new Map([
            [
                'person:frank',
                [{grantIdentifier: 'a', roleIdentifier: reader['@id'], shareable: true}],
            ],
        ]);
        globalThis.fetch = async (url, options = {}) => {
            const parsed = new URL(url);
            const method = options.method ?? 'GET';
            requests.push({method: method, path: parsed.pathname, body: options.body});
            return new Response(method === 'GET' ? '{"hydra:member": []}' : '{}', {
                status: method === 'POST' ? 201 : 200,
            });
        };

        try {
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }

        const changeRequests = requests.filter((request) => request.method !== 'GET');
        assert.deepEqual(
            changeRequests.map((request) => `${request.method} ${request.path}`),
            [
                'POST /authorization/resource-action-grants',
                'DELETE /authorization/resource-action-grants/a',
            ],
        );
        assert.deepEqual(JSON.parse(changeRequests[0].body), {
            resourceClass: 'DbpRelayFormalizeSubmission',
            resourceIdentifier: 'submission-id',
            resourceType: 0,
            role: reader['@id'],
            shareable: true,
            userIdentifier: 'frank',
        });
        assert.isFalse(node.pendingGrantChanges.has('person:frank'));
        assert.isFalse(node._savingHolderKeys.has('person:frank'));
    });

    test('should report a change that only makes a role shareable as an update', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([[editor['@id'], editor]]);
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank', familyName: 'Schwartz'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        // The role stays the same, only the shareable state changes
        node.pendingGrantChanges = new Map([
            [
                'person:frank',
                [{grantIdentifier: 'a', roleIdentifier: editor['@id'], shareable: true}],
            ],
        ]);
        globalThis.fetch = async (url, options = {}) => {
            const method = options.method ?? 'GET';
            return new Response(method === 'GET' ? '{"hydra:member": []}' : '{}', {
                status: method === 'POST' ? 201 : 200,
            });
        };

        try {
            await node.updateComplete;
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }

        // The notifications of the dialog are shown by its own notification component
        const notifications = node.shadowRoot.querySelector(
            '#auth-manage-dialog-notification',
        ).notifications;
        assert.deepEqual(
            notifications.map((notification) => notification.body),
            ['Role "editor" has been updated for Frank Schwartz'],
        );
    });

    test('should keep an unsaved change when its grant could not be created', async () => {
        const originalFetch = globalThis.fetch;
        const requests = [];
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        const pendingChange = {
            grantIdentifier: 'a',
            roleIdentifier: reader['@id'],
            shareable: false,
        };
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        node.pendingGrantChanges = new Map([['person:frank', [pendingChange]]]);
        globalThis.fetch = async (url, options = {}) => {
            const method = options.method ?? 'GET';
            requests.push(method);
            if (method !== 'GET') {
                return new Response('{}', {status: 403});
            }
            // The reload still returns the grant, so its unsaved change stays applicable
            const parsed = new URL(url);
            const body =
                parsed.pathname === '/authorization/resource-action-grants'
                    ? {
                          'hydra:member': [
                              {
                                  identifier: 'a',
                                  userIdentifier: 'frank',
                                  role: editor['@id'],
                                  shareable: false,
                                  grantedActions: ['delete'],
                              },
                          ],
                      }
                    : {identifier: 'frank', givenName: 'Frank'};
            return new Response(JSON.stringify(body), {status: 200});
        };

        try {
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }

        // The grant it replaces must survive a failed creation
        assert.notInclude(requests, 'DELETE');
        assert.deepEqual(node.pendingGrantChanges.get('person:frank'), [pendingChange]);
    });

    test('should keep a marked grant and incomplete draft until Save is possible', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        // The holder needs a role it has not taken yet, so a row can be added for it
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        // The user starts a role row and deletes the only saved role of the holder before
        // choosing a role for it
        node.handleAddRoleButtonClick('person:frank');
        await node.updateComplete;
        assert.isNotNull(node.shadowRoot.querySelector('.draft-role-grant-row'));

        const methods = [];
        globalThis.fetch = async (url, options = {}) => {
            methods.push(options.method ?? 'GET');
            return new Response('{}', {status: 200});
        };
        try {
            node.handleDeleteRoleButtonClick(
                'person:frank',
                node.grantHolders.get('person:frank').grants[0],
            );
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }
        await node.updateComplete;

        // An incomplete draft still blocks saving, so marking sends no requests.
        assert.deepEqual(methods, []);
        // The holder keeps its place, so the row the user started stays where it was
        assert.lengthOf(node.shadowRoot.querySelectorAll('.grant-holder-section'), 1);
        assert.lengthOf(node.shadowRoot.querySelectorAll('.draft-role-grant-row'), 1);
        assert.lengthOf(node.grantHolders.get('person:frank').grants, 1);
        assert.isNotNull(node.shadowRoot.querySelector('.marked-to-delete'));
        assert.lengthOf(
            node.shadowRoot.querySelectorAll('.role-grant-row:not(.draft-role-grant-row)'),
            1,
        );
        assert.isFalse(node.draftGrantHolders.has('person:frank'));
    });

    test('should remove a holder without draft rows when its last role is deleted', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([[editor['@id'], editor]]);
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        // Deletion takes precedence over an earlier shareable edit.
        node.pendingGrantChanges = new Map([
            [
                'person:frank',
                [{grantIdentifier: 'a', roleIdentifier: editor['@id'], shareable: true}],
            ],
        ]);
        const methods = [];
        globalThis.fetch = async (url, options = {}) => {
            methods.push(options.method ?? 'GET');
            return new Response('{"hydra:member": []}', {status: 200});
        };

        try {
            node.handleDeleteRoleButtonClick(
                'person:frank',
                node.grantHolders.get('person:frank').grants[0],
            );
            assert.isTrue(node.grantHolders.has('person:frank'));
            assert.deepEqual(methods, []);
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }
        await node.updateComplete;

        // A holder exists through its grants only, so it goes with its last one
        assert.isFalse(node.grantHolders.has('person:frank'));
        assert.lengthOf(node.shadowRoot.querySelectorAll('.grant-holder-section'), 0);
        assert.isFalse(node.pendingGrantChanges.has('person:frank'));
        assert.deepEqual(methods, ['DELETE', 'GET']);
    });

    test('should drop draft rows of a holder another session removed', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([[editor['@id'], editor]]);
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [],
                },
            ],
        ]);
        node.draftRoleGrants = new Map([
            [
                'person:frank',
                [
                    {
                        clientIdentifier: 'draft-role-1',
                        roleIdentifier: editor['@id'],
                        shareable: false,
                    },
                ],
            ],
        ]);
        // Someone else removed the grants of the holder, which the reload after saving
        // another holder is the first to notice
        globalThis.fetch = async () =>
            new Response('{"hydra:member": []}', {
                status: 200,
                headers: {'Content-Type': 'application/ld+json'},
            });

        try {
            await node._loadRoleGrantHolders();
        } finally {
            globalThis.fetch = originalFetch;
        }
        await node.updateComplete;

        // Nothing renders the rows any more, so keeping them would hide them from the user
        assert.isFalse(node.draftRoleGrants.has('person:frank'));
        assert.lengthOf(node.shadowRoot.querySelectorAll('.grant-holder-section'), 0);
    });

    test('should not let a role be switched when the holder has every role', async () => {
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        const makeGrant = (identifier, role) => ({
            identifier: identifier,
            shareable: false,
            grantedActions: ['delete'],
            roleDefinition: role,
        });
        node.lang = 'en';
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [makeGrant('a', editor)],
                },
            ],
        ]);
        await node.updateComplete;

        // One role is still free, so the assigned one can be switched to it
        const selector = node.shadowRoot.querySelector('select.role-grant-name-selector');
        assert.isFalse(selector.disabled);
        assert.lengthOf(selector.options, 2);

        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [makeGrant('a', editor), makeGrant('b', reader)],
                },
            ],
        ]);
        await node.updateComplete;

        // Both roles are taken, so each selector only holds the role of its own row
        const selectors = node.shadowRoot.querySelectorAll('select.role-grant-name-selector');
        assert.lengthOf(selectors, 2);
        for (const roleSelector of selectors) {
            assert.lengthOf(roleSelector.options, 1);
            assert.isTrue(roleSelector.disabled);
            assert.equal(
                roleSelector.getAttribute('title'),
                node._i18n.t('auth-manage-dialog.role-select-no-roles-left-title'),
            );
        }
    });

    test('should not let a draft row be filled in without a role to choose', async () => {
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        node.lang = 'en';
        node.roles = new Map([[editor['@id'], editor]]);
        node.grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        // The only role was granted after the row had been started
        node.draftRoleGrants = new Map([
            [
                'person:frank',
                [{clientIdentifier: 'draft-role-1', roleIdentifier: null, shareable: false}],
            ],
        ]);
        await node.updateComplete;

        const draftSelector = node.shadowRoot.querySelector(
            '.draft-role-grant-row select.role-grant-name-selector',
        );
        assert.isTrue(draftSelector.disabled);
        assert.equal(
            draftSelector.getAttribute('title'),
            node._i18n.t('auth-manage-dialog.role-select-no-roles-left-title'),
        );
        // The row can still be removed, so the holder does not stay unsaveable
        assert.isNotNull(node.shadowRoot.querySelector('.draft-role-grant-row dbp-icon-button'));
    });

    test('should drop a draft row the failed save created anyway', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.draftGrantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    holderFields: {userIdentifier: 'frank'},
                    grants: [],
                },
            ],
        ]);
        node.draftRoleGrants = new Map([
            [
                'person:frank',
                [
                    {
                        clientIdentifier: 'draft-role-1',
                        roleIdentifier: editor['@id'],
                        shareable: false,
                    },
                ],
            ],
        ]);
        // The grant is created, but a listener of the API fails afterwards, so the request
        // reports an error for a role the holder has been given
        globalThis.fetch = async (url, options = {}) => {
            const parsed = new URL(url);
            const method = options.method ?? 'GET';
            if (method === 'POST') {
                return new Response('{}', {status: 500});
            }
            const body =
                parsed.pathname === '/authorization/resource-action-grants'
                    ? {
                          'hydra:member': [
                              {
                                  identifier: 'a',
                                  userIdentifier: 'frank',
                                  role: editor['@id'],
                                  shareable: false,
                                  grantedActions: ['delete'],
                              },
                          ],
                      }
                    : {identifier: 'frank', givenName: 'Frank'};
            return new Response(JSON.stringify(body), {status: 200});
        };

        try {
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }
        await node.updateComplete;

        // Saving the row again would grant the role a second time
        assert.isFalse(node.draftRoleGrants.has('person:frank'));
        assert.lengthOf(node.shadowRoot.querySelectorAll('.draft-role-grant-row'), 0);
        assert.isTrue(node._isSaveDisabled('person:frank'));
        // The role the request reported as failed is shown as the saved role it became
        assert.lengthOf(
            node.shadowRoot.querySelectorAll('.role-grant-row:not(.draft-role-grant-row)'),
            1,
        );
    });

    test('should keep a draft row of a role the holder does not have', async () => {
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        const grantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank'},
                    grants: [
                        {
                            identifier: 'a',
                            shareable: false,
                            grantedActions: ['delete'],
                            roleDefinition: editor,
                        },
                    ],
                },
            ],
        ]);
        const draftRoleGrants = new Map([
            [
                'person:frank',
                [
                    // Granted in the meantime, whatever its shareable state asks for
                    {
                        clientIdentifier: 'draft-role-1',
                        roleIdentifier: editor['@id'],
                        shareable: true,
                    },
                    {
                        clientIdentifier: 'draft-role-2',
                        roleIdentifier: reader['@id'],
                        shareable: false,
                    },
                    // Still being filled in, so it cannot ask for a role twice
                    {clientIdentifier: 'draft-role-3', roleIdentifier: null, shareable: false},
                ],
            ],
        ]);

        const remaining = dropGrantedDraftRows(grantHolders, draftRoleGrants);

        assert.deepEqual(
            remaining.get('person:frank').map((row) => row.clientIdentifier),
            ['draft-role-2', 'draft-role-3'],
        );
        // Nothing to drop leaves the rendered map as it is
        assert.strictEqual(dropGrantedDraftRows(new Map(), draftRoleGrants), draftRoleGrants);
    });

    test('should keep a partially saved draft holder from rendering twice', async () => {
        const originalFetch = globalThis.fetch;
        const editor = {'@id': '/authorization/roles/editor', identifier: 'editor', roleNames: []};
        const reader = {'@id': '/authorization/roles/reader', identifier: 'reader', roleNames: []};
        node.lang = 'en';
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = 'submission-id';
        node.roles = new Map([editor, reader].map((role) => [role['@id'], role]));
        node.draftGrantHolders = new Map([
            [
                'person:frank',
                {
                    key: 'person:frank',
                    type: 'person',
                    subject: {identifier: 'frank', givenName: 'Frank'},
                    holderFields: {userIdentifier: 'frank'},
                    grants: [],
                },
            ],
        ]);
        node.draftRoleGrants = new Map([
            [
                'person:frank',
                [
                    {
                        clientIdentifier: 'draft-role-1',
                        roleIdentifier: editor['@id'],
                        shareable: false,
                    },
                    {
                        clientIdentifier: 'draft-role-2',
                        roleIdentifier: reader['@id'],
                        shareable: false,
                    },
                ],
            ],
        ]);
        globalThis.fetch = async (url, options = {}) => {
            const parsed = new URL(url);
            const method = options.method ?? 'GET';
            // Only the first of the two roles can be created
            if (method === 'POST') {
                const payload = JSON.parse(options.body);
                return new Response('{}', {
                    status: payload.role === editor['@id'] ? 201 : 500,
                });
            }
            // The created grant makes the holder part of the reloaded list
            const body =
                parsed.pathname === '/authorization/resource-action-grants'
                    ? {
                          'hydra:member': [
                              {
                                  identifier: 'a',
                                  userIdentifier: 'frank',
                                  role: editor['@id'],
                                  shareable: false,
                                  grantedActions: ['delete'],
                              },
                          ],
                      }
                    : {identifier: 'frank', givenName: 'Frank'};
            return new Response(JSON.stringify(body), {status: 200});
        };

        try {
            await node.handleSaveHolderRolesButtonClick('person:frank');
        } finally {
            globalThis.fetch = originalFetch;
        }
        await node.updateComplete;

        // The saved holder replaces the draft one, which may not be rendered next to it
        assert.lengthOf(node.shadowRoot.querySelectorAll('.grant-holder-section'), 1);
        assert.lengthOf(node.shadowRoot.querySelectorAll('#grant-holder-person\\:frank'), 1);
        assert.isFalse(node.draftGrantHolders.has('person:frank'));
        // The role that could not be created stays, so the user can try again
        assert.deepEqual(
            node.draftRoleGrants.get('person:frank').map((draft) => draft.roleIdentifier),
            [reader['@id']],
        );
        assert.lengthOf(node.shadowRoot.querySelectorAll('.draft-role-grant-row'), 1);
    });

    test('should not request roles without a compound resource identifier', async () => {
        const originalFetch = globalThis.fetch;
        let requestCount = 0;
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.resourceClassIdentifier = 'DbpRelayFormalizeSubmission';
        node.resourceIdentifier = '';
        globalThis.fetch = async () => {
            requestCount++;
            return new Response('{}', {status: 200});
        };

        try {
            await node._loadRoles();
        } finally {
            globalThis.fetch = originalFetch;
        }

        assert.equal(requestCount, 0);
        assert.equal(node.roles.size, 0);
    });
});

suite('authorization subject select', () => {
    let node;
    let originalFetch;

    setup(async () => {
        originalFetch = globalThis.fetch;
        node = new AuthorizationSubjectSelect();
        node.entryPointUrl = 'https://api.example.com';
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.lang = 'en';
        await node._subjectI18n.changeLanguage('en');
    });

    teardown(() => {
        globalThis.fetch = originalFetch;
        node.remove();
    });

    test('should format all supported subject types', () => {
        assert.equal(
            node.formatResource(node, {
                '@id': '/base/people/1234567890ABCDEF',
                '@type': 'https://schema.org/Person',
                identifier: '1234567890ABCDEF',
                givenName: 'Max',
                familyName: 'Mustermann',
                localData: null,
            }),
            'Max Mustermann [Person]',
        );
        assert.equal(
            node.formatResource(node, {
                '@id': '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '@type': 'AuthorizationUserGroup',
                identifier: '01900000-0000-7000-8000-000000000001',
                name: 'Example Group',
            }),
            'Example Group [User group]',
        );
        assert.equal(
            node.formatResource(node, {
                '@id': '/.well-known/genid/1',
                '@type': 'AuthorizationDynamicUserGroup',
                identifier: 'everybody',
            }),
            'everybody [Dynamic user group]',
        );
    });

    test('should render the subject type of a dropdown entry separately', () => {
        const resource = {
            '@id': '/base/people/1234567890ABCDEF',
            '@type': 'https://schema.org/Person',
            identifier: '1234567890ABCDEF',
            givenName: 'Max',
            familyName: 'Mustermann',
        };

        const entry = node._renderResult({text: node.formatResource(node, resource), resource});

        assert.equal(entry.classList.contains('subject-entry'), true);
        assert.deepEqual(
            [...entry.children].map((child) => child.textContent),
            ['Max Mustermann', '[Person]'],
        );
        assert.equal(entry.querySelector('.subject-entry-type').textContent, '[Person]');
    });

    test('should leave entries without a subject to the base class', () => {
        // The "Searching…" entry select2 adds while a search request is running
        assert.equal(typeof node._renderResult({loading: true, text: 'Searching…'}), 'object');
        assert.equal(node._renderResult({text: 'Plain text'}), 'Plain text');
    });

    test('should translate the subject types for the current language', async () => {
        document.body.appendChild(node);
        const resource = {
            '@id': 'dynamic-user-group:everybody',
            '@type': 'AuthorizationDynamicUserGroup',
            identifier: 'everybody',
        };

        node.lang = 'de';
        await node.updateComplete;
        // changeLanguage() is asynchronous and not awaited by the update
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(node.formatResource(node, resource), 'everybody [Dynamische Benutzergruppe]');

        node.lang = 'en';
        await node.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(node.formatResource(node, resource), 'everybody [Dynamic user group]');
    });

    test('should not use opaque identifiers as display labels', () => {
        assert.equal(
            node.formatResource(node, {
                '@id': '/base/people/1234567890ABCDEF',
                '@type': 'https://schema.org/Person',
                identifier: '1234567890ABCDEF',
            }),
            '',
        );
        assert.equal(
            node.formatResource(node, {
                '@id': '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '@type': 'AuthorizationUserGroup',
                identifier: '01900000-0000-7000-8000-000000000001',
            }),
            '',
        );
    });

    test('should search and merge all subject collections', async () => {
        const requests = [];
        const resources = {
            '/base/people': {
                '@id': '/base/people/1234567890ABCDEF',
                '@type': 'https://schema.org/Person',
                identifier: '1234567890ABCDEF',
                givenName: 'Max',
                familyName: 'Mustermann',
                localData: null,
            },
            '/authorization/user-groups': {
                '@id': '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '@type': 'AuthorizationUserGroup',
                identifier: '01900000-0000-7000-8000-000000000001',
                name: 'Example Group',
                members: [
                    {
                        '@type': 'AuthorizationUserGroupMember',
                        identifier: '01900000-0000-7000-8000-000000000002',
                        // Members are identified by their person identifier, not by a UUID
                        userIdentifier: 'FEDCBA0987654321',
                    },
                ],
            },
            '/authorization/dynamic-user-groups': {
                '@id': '/.well-known/genid/1',
                '@type': 'AuthorizationDynamicUserGroup',
                identifier: 'everybody',
            },
        };

        globalThis.fetch = async (url, options) => {
            const parsedUrl = new URL(url);
            requests.push({url: parsedUrl, options});
            return new Response(
                JSON.stringify({
                    'hydra:member': [resources[parsedUrl.pathname]],
                }),
                {
                    status: 200,
                    headers: {'Content-Type': 'application/ld+json'},
                },
            );
        };

        const results = await node._fetchSubjectResources('  every  ');

        assert.lengthOf(requests, 3);
        assert.deepEqual(
            requests.map((request) => request.url.pathname),
            ['/base/people', '/authorization/user-groups', '/authorization/dynamic-user-groups'],
        );
        assert.isTrue(
            requests
                .filter((request) => request.url.pathname !== '/authorization/dynamic-user-groups')
                .every((request) => request.url.searchParams.get('search') === 'every'),
        );
        assert.isNull(
            requests
                .find((request) => request.url.pathname === '/authorization/dynamic-user-groups')
                .url.searchParams.get('search'),
        );
        assert.isTrue(
            requests.every((request) => request.url.searchParams.get('perPage') === '100'),
        );
        assert.isTrue(
            requests.every((request) => request.options.headers.Authorization === 'Bearer token'),
        );
        assert.deepEqual(
            results.map((resource) => resource['@id']),
            // Sorted by their label: "everybody", "Example Group", "Max Mustermann"
            [
                // The blank node ID of the dynamic group is replaced by a stable one
                'dynamic-user-group:everybody',
                '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '/base/people/1234567890ABCDEF',
            ],
        );
    });

    test('should only fetch the first page of a collection', async () => {
        const requestedPages = [];
        globalThis.fetch = async (url) => {
            const parsedUrl = new URL(url);
            const page = parsedUrl.searchParams.get('page') ?? '1';
            requestedPages.push(page);

            return new Response(
                JSON.stringify({
                    'hydra:member': [
                        {
                            '@id': `/authorization/user-groups/${page}`,
                            '@type': 'AuthorizationUserGroup',
                            identifier: page,
                            name: `Group ${page}`,
                        },
                    ],
                    'hydra:view': {
                        '@type': 'hydra:PartialCollectionView',
                        'hydra:next': `/authorization/user-groups?search=group&perPage=100&page=${
                            Number(page) + 1
                        }`,
                    },
                }),
                {
                    status: 200,
                    headers: {'Content-Type': 'application/ld+json'},
                },
            );
        };

        const results = await node._fetchSubjectCollection('/authorization/user-groups', 'group');

        assert.deepEqual(requestedPages, ['1']);
        assert.deepEqual(
            results.map((resource) => resource.name),
            ['Group 1'],
        );
    });

    test('should keep the results of the other collections when one fails', async () => {
        globalThis.fetch = async (url) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.pathname === '/authorization/dynamic-user-groups') {
                return new Response('', {status: 403, statusText: 'Forbidden'});
            }

            const member =
                parsedUrl.pathname === '/base/people'
                    ? {
                          '@id': '/base/people/1234567890ABCDEF',
                          '@type': 'https://schema.org/Person',
                          givenName: 'Max',
                          familyName: 'Mustermann',
                      }
                    : {
                          '@id': '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                          '@type': 'AuthorizationUserGroup',
                          name: 'Example Group',
                      };

            return new Response(JSON.stringify({'hydra:member': [member]}), {
                status: 200,
                headers: {'Content-Type': 'application/ld+json'},
            });
        };

        const results = await node._fetchSubjectResources('every');

        assert.deepEqual(
            results.map((resource) => resource['@id']),
            [
                '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '/base/people/1234567890ABCDEF',
            ],
        );
    });

    test('should give dynamic user groups the same ID on every request', async () => {
        let requestCount = 0;
        globalThis.fetch = async () => {
            requestCount++;

            return new Response(
                JSON.stringify({
                    'hydra:member': [
                        {
                            // The API mints a new blank node ID for every request
                            '@id': `/.well-known/genid/${requestCount}`,
                            '@type': 'AuthorizationDynamicUserGroup',
                            identifier: 'students',
                        },
                    ],
                }),
                {status: 200, headers: {'Content-Type': 'application/ld+json'}},
            );
        };

        const first = await node._fetchSubjectCollection(
            '/authorization/dynamic-user-groups',
            'stud',
        );
        const second = await node._fetchSubjectCollection(
            '/authorization/dynamic-user-groups',
            'stud',
        );

        assert.equal(requestCount, 2);
        assert.equal(first[0]['@id'], 'dynamic-user-group:students');
        assert.equal(second[0]['@id'], first[0]['@id']);
    });

    test('should resolve a selected dynamic user group from the collection', async () => {
        const requestedUrls = [];
        globalThis.fetch = async (url) => {
            requestedUrls.push(new URL(url).pathname);

            return new Response(
                JSON.stringify({
                    'hydra:member': [
                        {
                            '@id': '/.well-known/genid/1',
                            '@type': 'AuthorizationDynamicUserGroup',
                            identifier: 'staff',
                        },
                        {
                            '@id': '/.well-known/genid/2',
                            '@type': 'AuthorizationDynamicUserGroup',
                            identifier: 'students',
                        },
                    ],
                }),
                {status: 200, headers: {'Content-Type': 'application/ld+json'}},
            );
        };

        const resource = await node._fetchResource('dynamic-user-group:students');

        assert.deepEqual(requestedUrls, ['/authorization/dynamic-user-groups']);
        assert.equal(resource.identifier, 'students');
        assert.equal(resource['@id'], 'dynamic-user-group:students');
    });

    test('should fail to resolve an unknown dynamic user group', async () => {
        globalThis.fetch = async () => {
            return new Response(JSON.stringify({'hydra:member': []}), {
                status: 200,
                headers: {'Content-Type': 'application/ld+json'},
            });
        };

        let error = null;
        try {
            await node._fetchResource('dynamic-user-group:nobody');
        } catch (caughtError) {
            error = caughtError;
        }

        assert.isNotNull(error);
    });

    test('should fetch the other subjects from their item endpoint', async () => {
        const requestedUrls = [];
        globalThis.fetch = async (url) => {
            requestedUrls.push(new URL(url).pathname);

            return new Response(
                JSON.stringify({
                    '@id': '/base/people/1234567890ABCDEF',
                    '@type': 'https://schema.org/Person',
                    identifier: '1234567890ABCDEF',
                    givenName: 'Max',
                    familyName: 'Mustermann',
                }),
                {status: 200, headers: {'Content-Type': 'application/ld+json'}},
            );
        };

        const resource = await node._fetchResource('/base/people/1234567890ABCDEF');

        assert.deepEqual(requestedUrls, ['/base/people/1234567890ABCDEF']);
        assert.equal(resource.identifier, '1234567890ABCDEF');
    });

    test('should build the grant holder of all supported subject types', () => {
        assert.deepEqual(
            node.getGrantHolder({
                '@id': '/base/people/1234567890ABCDEF',
                '@type': 'https://schema.org/Person',
                identifier: '1234567890ABCDEF',
                givenName: 'Max',
                familyName: 'Mustermann',
            }),
            {userIdentifier: '1234567890ABCDEF'},
        );
        assert.deepEqual(
            node.getGrantHolder({
                '@id': '/authorization/user-groups/01900000-0000-7000-8000-000000000001',
                '@type': 'AuthorizationUserGroup',
                identifier: '01900000-0000-7000-8000-000000000001',
                name: 'Example Group',
            }),
            {userGroup: '/authorization/user-groups/01900000-0000-7000-8000-000000000001'},
        );
        assert.deepEqual(
            node.getGrantHolder({
                '@id': 'dynamic-user-group:everybody',
                '@type': 'AuthorizationDynamicUserGroup',
                identifier: 'everybody',
            }),
            {dynamicUserGroupIdentifier: 'everybody'},
        );
    });

    test('should key a selected subject like the holder of its grants', () => {
        // The dialog groups the grants of the API by the same key, so a selected subject can
        // be matched against the holders that are already listed
        const subjects = [
            {
                '@id': '/base/people/1234567890ABCDEF',
                '@type': 'https://schema.org/Person',
                identifier: '1234567890ABCDEF',
                givenName: 'Max',
                familyName: 'Mustermann',
            },
            {
                '@id': '/authorization/user-groups/01900000-0000',
                '@type': 'AuthorizationUserGroup',
                identifier: '01900000-0000',
                name: 'Example Group',
            },
            {
                '@id': 'dynamic-user-group:everybody',
                '@type': 'AuthorizationDynamicUserGroup',
                identifier: 'everybody',
            },
        ];

        assert.deepEqual(
            subjects.map((subject) => deriveGrantHolderIdentity(node.getGrantHolder(subject)).key),
            ['person:1234567890ABCDEF', 'user-group:01900000-0000', 'dynamic-user-group:everybody'],
        );
    });

    test('should not build a grant holder of an unsupported subject', () => {
        assert.isNull(
            node.getGrantHolder({
                '@id': '/base/organizations/1234',
                '@type': 'Organization',
                identifier: '1234',
                name: 'Some organization',
            }),
        );
    });
});
