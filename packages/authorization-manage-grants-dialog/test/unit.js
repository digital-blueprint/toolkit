import {assert} from 'chai';

import '../src/dbp-authorization-manage-grants-dialog.js';
import {AuthorizationSubjectSelect} from '../src/authorization-subject-select.js';
import {getGrantHolderParts} from '../src/grant-holder.js';

suite('grant holder', () => {
    test('should identify every grant holder type', () => {
        assert.deepEqual(getGrantHolderParts({userIdentifier: 'F957F2400C941B72'}), {
            type: 'person',
            identifier: 'F957F2400C941B72',
            iri: null,
            key: 'person:F957F2400C941B72',
        });
        // User groups are keyed by the identifier of their IRI, which stays available for the
        // requests to their item endpoint
        assert.deepEqual(
            getGrantHolderParts({userGroup: '/authorization/user-groups/019a0ff1-597d'}),
            {
                type: 'user-group',
                identifier: '019a0ff1-597d',
                iri: '/authorization/user-groups/019a0ff1-597d',
                key: 'user-group:019a0ff1-597d',
            },
        );
        assert.deepEqual(getGrantHolderParts({dynamicUserGroupIdentifier: 'dbp_developers'}), {
            type: 'dynamic-user-group',
            identifier: 'dbp_developers',
            iri: null,
            key: 'dynamic-user-group:dbp_developers',
        });
    });

    test('should key a user group the same way whatever its IRI looks like', () => {
        const key = 'user-group:019a0ff1-597d';
        assert.equal(
            getGrantHolderParts({
                userGroup: 'https://api.example.com/authorization/user-groups/019a0ff1-597d',
            }).key,
            key,
        );
        assert.equal(
            getGrantHolderParts({userGroup: '/authorization/user-groups/019a0ff1-597d/'}).key,
            key,
        );
    });

    test('should have no parts without a grant holder', () => {
        assert.isNull(getGrantHolderParts(null));
        assert.isNull(getGrantHolderParts(undefined));
        assert.isNull(getGrantHolderParts({}));
        assert.isNull(getGrantHolderParts({identifier: 'grant-identifier', action: 'read'}));
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
            assert.deepEqual(requests, ['/authorization/roles']);
            assert.isFalse(node.grantHoldersLoading);
            assert.isEmpty(node.grantHolders);
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
            assert.lengthOf(node.grantHolders, 3);
            const person = node.grantHolders.find((holder) => holder.key === 'person:person-id');
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
                    identifier: 'editor',
                    roleNames: [
                        {languageTag: 'de', name: 'Bearbeiter*in'},
                        {languageTag: 'en', name: 'Editor'},
                    ],
                },
            });
            assert.deepEqual(person.subject.localData, {email: 'frank@example.com'});
            assert.notProperty(person.subject, '@context');
            const group = node.grantHolders.find((holder) => holder.key.startsWith('user-group:'));
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
        } finally {
            globalThis.fetch = originalFetch;
        }
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
            assert.lengthOf(node.grantHolders, 2);
            assert.deepEqual(node.grantHolders[0].subject, {identifier: 'deleted'});
            assert.equal(node.grantHolders[0].grants[0].identifier, 'a');
            assert.equal(node.grantHolders[0].grants[0].roleDefinition.identifier, 'editor');
            assert.isTrue(node.grantHolders[0].grants[0].shareable);
            assert.equal(node.grantHolders[1].subject.givenName, 'Frank');
            assert.deepEqual(node.grantHolders[1].grants[0].roleDefinition, {
                identifier: 'missing-role',
                roleNames: [],
            });
            assert.isFalse(node.grantHoldersLoading);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should fall back to the role identifier when a localized name is unavailable', () => {
        node.lang = 'en';
        assert.equal(node._getRoleName({identifier: 'missing-role'}), 'missing-role');
        assert.equal(
            node._getRoleName({identifier: 'missing-role', roleNames: []}),
            'missing-role',
        );
        node.lang = 'de';
        assert.equal(
            node._getRoleName({
                identifier: 'missing-role',
                roleNames: [{languageTag: 'en', name: 'Editor'}],
            }),
            'missing-role',
        );
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
            assert.deepEqual(
                node.grantHolders.map((holder) => holder.key),
                expected,
            );
            grants.reverse();
            await node._loadRoleGrantHolders();
            assert.deepEqual(
                node.grantHolders.map((holder) => holder.key),
                expected,
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test('should name a role in the current language', async () => {
        const role = {
            identifier: 'role-identifier',
            roleNames: [
                {languageTag: 'de', name: 'Rollenname'},
                {languageTag: 'en', name: 'Role name'},
            ],
        };

        node.lang = 'en';
        assert.equal(node._getRoleName(role), 'Role name');

        // The loaded roles keep all their translations, so switching the language is enough
        node.lang = 'de';
        assert.equal(node._getRoleName(role), 'Rollenname');
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
            subjects.map((subject) => getGrantHolderParts(node.getGrantHolder(subject)).key),
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
