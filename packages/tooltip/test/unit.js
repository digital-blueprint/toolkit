import {assert} from '@esm-bundle/chai';
import '../src/dbp-tooltip';

suite('dbp-tooltip', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tooltip');
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
