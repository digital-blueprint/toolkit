import {assert} from 'chai';

import '../src/dbp-resource-select.js';
import '../src/demo.js';

/**
 * Waits until the callback returns an element, so we don't have to guess how long the
 * async select2 setup takes.
 *
 * @param {() => (Element|null)} callback - Called repeatedly until it returns an element
 * @param {number} [timeout] - How long to wait in milliseconds
 * @returns {Promise<Element|null>} The element, or null on timeout
 */
async function waitFor(callback, timeout = 2000) {
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

suite('dbp-resource-select basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-resource-select');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should use the wrapper as dropdown host', () => {
        const dropdownHost = node.shadowRoot.querySelector('#select-resource-dropdown');
        const selectControl = dropdownHost?.querySelector('.select2-control');

        assert.isNotNull(dropdownHost);
        assert.include(dropdownHost.className, 'select');
        assert.isNotNull(selectControl);
    });

    test('should build default query parameters', () => {
        assert.deepEqual(node.getCollectionQueryParameters(node), {});
        assert.deepEqual(node.getSearchQueryParameters(node, ' test '), {search: 'test'});
        assert.deepEqual(node.getSearchQueryParameters(node, ''), {});
        assert.deepEqual(node.getItemParameters(node), {});
    });

    test('should mirror value and values', async () => {
        assert.equal(node.value, null);
        assert.deepEqual(node.values, []);

        node.value = '/base/organizations/1';
        await node.updateComplete;
        assert.deepEqual(node.values, ['/base/organizations/1']);

        node.values = ['/base/organizations/2'];
        await node.updateComplete;
        assert.equal(node.value, '/base/organizations/2');

        node.value = null;
        await node.updateComplete;
        assert.deepEqual(node.values, []);
    });

    test('should only keep one value without multiple', async () => {
        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        assert.deepEqual(node.values, ['/base/organizations/1']);
        assert.equal(node.value, '/base/organizations/1');
    });

    test('should keep all values with multiple', async () => {
        node.multiple = true;
        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        assert.isTrue(node.shadowRoot.querySelector('select').multiple);
        assert.deepEqual(node.values, ['/base/organizations/1', '/base/organizations/2']);
        // "value" mirrors the first selection, like a native <select multiple> does
        assert.equal(node.value, '/base/organizations/1');
        assert.deepEqual(node.valueObjects, [null, null]);
        assert.equal(node.valueObject, null);
    });

    test('should drop duplicated and empty values', async () => {
        node.multiple = true;
        node.values = ['/base/organizations/1', '', '/base/organizations/1', null];
        await node.updateComplete;

        assert.deepEqual(node.values, ['/base/organizations/1']);
    });

    test('should truncate the selection when multiple gets disabled', async () => {
        node.multiple = true;
        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        node.multiple = false;
        await node.updateComplete;
        assert.deepEqual(node.values, ['/base/organizations/1']);
    });

    test('should emit change with both the single and the multiple selection', async () => {
        node.multiple = true;
        await node.updateComplete;

        let events = [];
        node.addEventListener('change', (event) => events.push(event.detail));

        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        assert.equal(events.length, 1);
        assert.equal(events[0].value, '/base/organizations/1');
        assert.deepEqual(events[0].values, ['/base/organizations/1', '/base/organizations/2']);
        assert.deepEqual(events[0].objects, [null, null]);

        // Setting the same selection again shouldn't emit anything
        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;
        assert.equal(events.length, 1);
    });

    test('should apply the selection exactly once and not reflect values', async () => {
        node.multiple = true;
        await node.updateComplete;

        let updateCount = 0;
        const updateAll = node._updateAll.bind(node);
        node._updateAll = () => {
            updateCount += 1;
            return updateAll();
        };

        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        assert.equal(updateCount, 1);
        // "values" must not be reflected: lit would parse our own reflected attribute back
        // into a new array, undoing the normalization and rebuilding select2 again
        assert.isFalse(node.hasAttribute('values'));
    });

    test('should clear the whole selection with a single change event', async () => {
        // No entry point url, so the resources we set here survive the update
        node._resources = [
            {'@id': '/base/organizations/1', name: 'Alpha'},
            {'@id': '/base/organizations/2', name: 'Beta'},
        ];
        node.multiple = true;
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.values = ['/base/organizations/1', '/base/organizations/2'];

        const clear = await waitFor(() =>
            node.shadowRoot.querySelector('.select2-selection__clear'),
        );
        assert.isNotNull(clear, 'the clear button should also be shown with multiple');

        let events = [];
        node.addEventListener('change', (event) => events.push(event.detail.values));
        clear.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));

        // select2 emits select2:clear followed by a select2:unselect per entry, which must
        // not result in additional change events
        assert.deepEqual(events, [[]]);
        assert.deepEqual(node.values, []);
        assert.equal(node.value, null);
    });

    test('should align the clear button with the first line of entries', async () => {
        // Narrow enough to force the selected entries onto more than one line
        node.style.display = 'block';
        node.style.width = '200px';

        // The first entry stays on one line, so we can compare against its center. The others
        // are long, so they fill up the rows and would run underneath the clear button if no
        // room was reserved for it.
        node._resources = [
            'Alpha',
            'Organization Beta',
            'Organization Gamma',
            'Organization Delta',
        ].map((name, i) => {
            return {'@id': `/base/organizations/${i}`, name: name};
        });
        node.multiple = true;
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.values = node._resources.map((resource) => resource['@id']);

        const clear = await waitFor(() =>
            node.shadowRoot.querySelector('.select2-selection__clear'),
        );
        assert.isNotNull(clear);

        const box = node.shadowRoot
            .querySelector('.select2-selection--multiple')
            .getBoundingClientRect();
        const entries = [...node.shadowRoot.querySelectorAll('.select2-selection__choice')].map(
            (entry) => entry.getBoundingClientRect(),
        );
        const rect = clear.getBoundingClientRect();

        assert.isAbove(box.height, 40, 'the entries should wrap for this test to be meaningful');

        // Like with a single selection the button is centered on the first line, so that it
        // stays in place while entries get added and removed
        assert.closeTo(
            rect.top + rect.height / 2,
            entries[0].top + entries[0].height / 2,
            1,
            'the clear button should be centered on the first line',
        );

        // The entries must not end up underneath the clear button
        for (const entry of entries) {
            const overlaps = Math.min(entry.bottom, rect.bottom) - Math.max(entry.top, rect.top);
            if (overlaps > 0) {
                assert.isAtMost(entry.right, rect.left, 'entries must not overlap the button');
            }
        }
    });

    test('should wrap long entries instead of cutting them off', async () => {
        node.style.display = 'block';
        node.style.width = '220px';

        node._resources = [
            {
                '@id': '/base/organizations/0',
                name: 'Institute of Extremely Long Organization Name for Testing',
            },
        ];
        node.multiple = true;
        node.auth = {'login-status': 'logged-in', token: 'token'};
        node.values = ['/base/organizations/0'];

        const entry = await waitFor(() =>
            node.shadowRoot.querySelector('.select2-selection__choice'),
        );
        assert.isNotNull(entry);

        // The entry doesn't fit on one line, so it has to grow instead of being cut off
        assert.isAbove(entry.getBoundingClientRect().height, 30, 'the entry should wrap');
        assert.isAtMost(entry.scrollWidth, entry.clientWidth + 1, 'the entry should be complete');
        assert.isAtMost(entry.scrollHeight, entry.clientHeight + 1, 'the entry should be complete');
    });

    test('should always be clearable with multiple', async () => {
        assert.isFalse(node._isClearable());

        node.multiple = true;
        await node.updateComplete;
        assert.isTrue(node._isClearable());
    });

    test('should clear the selection on reset with multiple', async () => {
        node.multiple = true;
        node.values = ['/base/organizations/1', '/base/organizations/2'];
        await node.updateComplete;

        await node.reset();
        assert.deepEqual(node.values, []);
        assert.equal(node.value, null);
    });

    test('should not refresh select2 when auth token refreshes', async () => {
        let updateCount = 0;
        node._updateAll = () => {
            updateCount += 1;
        };

        node.auth = {'login-status': 'logged-in', token: 'old-token'};
        await node.updateComplete;
        assert.equal(updateCount, 1);

        updateCount = 0;
        node.auth = {'login-status': 'logged-in', token: 'new-token'};
        await node.updateComplete;
        assert.equal(updateCount, 0);

        node.auth = {'login-status': 'logged-out', token: ''};
        await node.updateComplete;
        assert.equal(updateCount, 1);
    });
});

suite('dbp-resource-select-demo basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-resource-select-demo');
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
