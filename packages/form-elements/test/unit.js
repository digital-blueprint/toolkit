import {assert} from 'chai';

import '../src/index';
import '../src/demo';

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
});
