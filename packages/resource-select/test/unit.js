import {assert} from 'chai';

import '../src/dbp-resource-select.js';
import '../src/demo.js';

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
