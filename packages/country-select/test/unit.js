import {assert} from 'chai';

import '../src/dbp-country-select.js';
import '../src/demo.js';

suite('dbp-country-select basics', () => {
    let node;

    const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 0));

    setup(async () => {
        node = document.createElement('dbp-country-select');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should clear selected country', async () => {
        node.setAttribute('value', 'AT');
        await node.updateComplete;
        await nextFrame();

        node.clear();
        await node.updateComplete;
        await nextFrame();

        const select = node.shadowRoot.querySelector('select');
        assert.equal(node.value, '');
        assert.equal(node.getAttribute('value'), '');
        assert.equal(select.value, '');
    });
});

suite('dbp-country-select-demo basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-country-select-demo');
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
