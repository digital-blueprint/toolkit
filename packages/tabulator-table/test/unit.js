import {assert} from '@esm-bundle/chai';

import '../src/dbp-theme-switcher';
import '../src/demo';

suite('dbp-tabulator-table basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tabulator-table');
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

suite('dbp-theme-switcher demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tabulator-table-demo');
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
