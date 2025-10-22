import {assert} from 'chai';
import '../src/dbp-matomo';

suite('dbp-matomo', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-matomo');
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
