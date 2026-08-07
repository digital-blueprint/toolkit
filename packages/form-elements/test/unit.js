import {assert} from 'chai';
import $ from 'jquery';

import '../src/build/boolean';
import '../src/build/date';
import '../src/build/string';
import '../src/build/datetime';
import '../src/build/date';
import '../src/build/enum';
import '../src/demo';
import {DbpPersonSelectElement} from '../src/elements/person-select.js';
import {DbpPersonSelectView} from '../src/views/person-select.js';

const personSelectTestTag = 'test-dbp-form-person-select-element';

class TestDbpPersonSelectElement extends DbpPersonSelectElement {}

if (!customElements.get(personSelectTestTag)) {
    customElements.define(personSelectTestTag, TestDbpPersonSelectElement);
}

const personSelectViewTestTag = 'test-dbp-form-person-select-view';

class TestDbpPersonSelectView extends DbpPersonSelectView {}

if (!customElements.get(personSelectViewTestTag)) {
    customElements.define(personSelectViewTestTag, TestDbpPersonSelectView);
}

/**
 * Waits until the callback returns a truthy value, so we don't have to guess how long the
 * async select2 setup takes.
 * @param {() => (Element|null)} callback - Called repeatedly until it returns an element
 * @param {number} [timeout] - How long to wait in milliseconds
 * @returns {Promise<Element|null>} The element, or null on timeout
 */
async function waitFor(callback, timeout = 500) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const value = callback();
        if (value) {
            return value;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return null;
}

/**
 * Simulates a person being picked in the select2 dropdown of the nested resource select.
 * @param {Element} resourceSelect - The nested dbp-resource-select
 * @param {string} personId - The person identifier to select
 */
function selectPerson(resourceSelect, personId) {
    const id = `/base/people/${personId}`;
    const resource = {'@id': id, givenName: 'Person', familyName: personId};

    $(resourceSelect.renderRoot.querySelector('#' + resourceSelect._selectId)).trigger({
        type: 'select2:select',
        params: {data: {id: id, text: `Person ${personId}`, resource: resource}},
    });
}
suite('dbp-form-boolean-element', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-boolean-element');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-form-date-element', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-date-element');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-form-datetime-element', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-datetime-element');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-form-enum-element', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-enum-element');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-form-string-element', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-string-element');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('dbp-form-elements-demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-elements-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('starts the multiple person demo with the current person selected', () => {
        node.auth = {'person-id': 'person-1'};

        assert.deepEqual(node.getDemoPeopleValue({}), ['person-1']);
        assert.deepEqual(node.getDemoPeopleValue({myComponentPeople: ['person-2']}), ['person-2']);
    });

    test('keeps the selected people while the demo rerenders', async () => {
        node.auth = {'person-id': 'person-1'};
        await node.updateComplete;

        const personSelect = node.shadowRoot.querySelector(
            'dbp-form-person-select-element[name="myComponentPeople"]',
        );
        assert.isNotNull(personSelect);

        // Wait until the nested selector applied the initial selection
        const resourceSelect = personSelect.shadowRoot.querySelector('dbp-resource-select');
        await waitFor(() => (resourceSelect.values.length ? resourceSelect : null));

        personSelect.handlePersonChange(
            new CustomEvent('change', {
                detail: {values: ['/base/people/person-1', '/base/people/person-2']},
            }),
        );
        await node.updateComplete;
        await personSelect.updateComplete;

        // A rerender happens for example when the auth token gets refreshed after a focus change
        node.requestUpdate();
        await node.updateComplete;
        await personSelect.updateComplete;

        assert.deepEqual(personSelect.value, ['person-1', 'person-2']);
    });
});
suite('dbp-form-person-select-element', () => {
    let node;

    setup(async () => {
        node = document.createElement(personSelectTestTag);
        node.name = 'applicant';
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('dispatches a normalized single value', async () => {
        let eventDetail = null;

        node.addEventListener('change', (event) => {
            eventDetail = event.detail;
        });

        node.handlePersonChange(
            new CustomEvent('change', {
                detail: {
                    values: ['/base/people/person-1'],
                },
            }),
        );

        await node.updateComplete;

        assert.equal(node.value, 'person-1');
        assert.deepEqual(eventDetail, {
            fieldName: 'applicant',
            name: 'applicant',
            value: 'person-1',
            values: ['person-1'],
        });
    });

    test('normalizes a resource path handed in as single value', async () => {
        node.value = '/base/people/person-1';

        await node.updateComplete;

        assert.equal(node.value, 'person-1');

        const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');
        assert.deepEqual(resourceSelect.values, ['/base/people/person-1']);
    });

    test('keeps a normalized single value untouched when the selection is confirmed', async () => {
        node.value = '/base/people/person-1';

        await node.updateComplete;

        // This is what the resource selector emits once it has loaded the preselected person
        node.handlePersonChange(
            new CustomEvent('change', {
                detail: {values: ['/base/people/person-1']},
            }),
        );

        await node.updateComplete;

        assert.equal(node.value, 'person-1');
    });

    test('normalizes resource paths handed in as multiple values', async () => {
        node.multiple = true;
        node.value = ['/base/people/person-1', 'person-2'];

        await node.updateComplete;

        assert.deepEqual(node.value, ['person-1', 'person-2']);
    });

    test('dispatches normalized multiple values', async () => {
        node.multiple = true;
        await node.updateComplete;

        let eventDetail = null;
        const resourceValues = ['/base/people/person-1', '/base/people/person-2'];

        node.addEventListener('change', (event) => {
            eventDetail = event.detail;
        });

        node.handlePersonChange(
            new CustomEvent('change', {
                detail: {
                    values: resourceValues,
                },
            }),
        );

        assert.strictEqual(node.getPersonSelectValues(), resourceValues);

        await node.updateComplete;

        assert.deepEqual(node.value, ['person-1', 'person-2']);
        assert.deepEqual(eventDetail, {
            fieldName: 'applicant',
            name: 'applicant',
            value: ['person-1', 'person-2'],
            values: ['person-1', 'person-2'],
        });
    });

    test('ignores repeated multiple selection events with unchanged values', async () => {
        node.multiple = true;
        await node.updateComplete;

        let changeCount = 0;
        node.addEventListener('change', () => {
            changeCount += 1;
        });

        const event = () =>
            new CustomEvent('change', {
                detail: {
                    values: ['/base/people/person-1', '/base/people/person-2'],
                },
            });

        node.handlePersonChange(event());
        const selectedPeople = node.value;
        node.handlePersonChange(event());

        assert.equal(changeCount, 1);
        assert.strictEqual(node.value, selectedPeople);
    });

    test('passes stable multiple values to the resource selector', async () => {
        node.multiple = true;
        node.value = ['person-1', 'person-2'];

        await node.updateComplete;

        const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');
        const resourceValues = resourceSelect.values;

        node.requestUpdate();
        await node.updateComplete;

        assert.isTrue(resourceSelect.multiple);
        assert.deepEqual(resourceSelect.values, ['/base/people/person-1', '/base/people/person-2']);
        assert.strictEqual(resourceSelect.values, resourceValues);
    });

    test('normalizes the public value when switching to single mode', async () => {
        node.multiple = true;
        node.value = ['person-1', 'person-2'];

        await node.updateComplete;

        node.multiple = false;

        await node.updateComplete;

        const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');

        assert.equal(node.value, 'person-1');
        assert.isFalse(resourceSelect.multiple);
        assert.deepEqual(resourceSelect.values, ['/base/people/person-1']);
    });
    test('keeps earlier people selected when picking another one', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url) => {
            const id = String(url).replace(/^.*\/base\/people\//, '');
            return new Response(
                JSON.stringify({
                    '@id': `/base/people/${id}`,
                    givenName: 'Person',
                    familyName: id,
                }),
                {status: 200, headers: {'Content-Type': 'application/ld+json'}},
            );
        };

        try {
            node.multiple = true;
            node.entryPointUrl = 'https://api.example.com';
            node.auth = {'login-status': 'logged-in', token: 'token'};

            const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');
            const control = await waitFor(() =>
                resourceSelect.renderRoot.querySelector('.select2-selection--multiple'),
            );
            assert.isNotNull(control, 'the multiple selector should be initialized');

            // Rebuilding select2 while people get picked would drop the visible selection
            let rebuildCount = 0;
            const clearSelect2 = resourceSelect._clearSelect2.bind(resourceSelect);
            resourceSelect._clearSelect2 = () => {
                rebuildCount += 1;
                return clearSelect2();
            };

            selectPerson(resourceSelect, 'person-1');
            await node.updateComplete;
            await resourceSelect.updateComplete;

            assert.deepEqual(node.value, ['person-1']);

            selectPerson(resourceSelect, 'person-2');
            await node.updateComplete;
            await resourceSelect.updateComplete;

            assert.deepEqual(node.value, ['person-1', 'person-2']);
            assert.deepEqual(resourceSelect.values, [
                '/base/people/person-1',
                '/base/people/person-2',
            ]);
            assert.equal(rebuildCount, 0, 'the selector must not be rebuilt while selecting');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    suite('dbp-form-person-select-view', () => {
        let node;

        setup(async () => {
            node = document.createElement(personSelectViewTestTag);
            document.body.appendChild(node);
            await node.updateComplete;
        });

        teardown(() => {
            node.remove();
        });

        test('keeps the first person when switching to single mode', async () => {
            node.multiple = true;
            node.value = ['person-1', 'person-2'];

            await node.updateComplete;

            node.multiple = false;
            await node.loadPersonNames();

            assert.deepEqual(node.normalizeValues(), ['person-1']);
            assert.equal(node.name, 'person-1');
        });
    });
});
