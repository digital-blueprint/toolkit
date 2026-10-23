import {assert} from 'chai';

import '../src/dbp-authorization-manage-grants-dialog.js';
import {AuthorizationSubjectSelect} from '../src/authorization-subject-select.js';

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
