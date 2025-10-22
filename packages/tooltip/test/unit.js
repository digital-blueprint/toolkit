import {assert} from 'chai';
import '../src/dbp-tooltip';

suite('dbp-tooltip', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-tooltip');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
