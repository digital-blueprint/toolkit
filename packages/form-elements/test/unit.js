import {assert} from 'chai';

import '../src/build/boolean';
import '../src/build/date';
import '../src/build/string';
import '../src/build/datetime';
import '../src/build/date';
import '../src/build/enum';
import '../src/demo';

suite('dbp-form-boolean-element', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-boolean-element');
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

suite('dbp-form-date-element', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-date-element');
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

suite('dbp-form-datetime-element', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-datetime-element');
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

suite('dbp-form-enum-element', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-enum-element');
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

suite('dbp-form-string-element', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-string-element');
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

suite('dbp-form-elements-demo', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-form-elements-demo');
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
