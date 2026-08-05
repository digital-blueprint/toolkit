import {assert} from 'chai';

import '../src/build/boolean';
import '../src/build/date';
import '../src/build/string';
import '../src/build/datetime';
import '../src/build/date';
import '../src/build/enum';
import '../src/demo';
import {DbpPersonSelectElement} from '../src/elements/person-select.js';

const personSelectTestTag = 'test-dbp-form-person-select-element';

class TestDbpPersonSelectElement extends DbpPersonSelectElement {}

if (!customElements.get(personSelectTestTag)) {
    customElements.define(personSelectTestTag, TestDbpPersonSelectElement);
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

    test('dispatches normalized multiple values', async () => {
        node.multiple = true;
        await node.updateComplete;

        let eventDetail = null;

        node.addEventListener('change', (event) => {
            eventDetail = event.detail;
        });

        node.handlePersonChange(
            new CustomEvent('change', {
                detail: {
                    values: ['/base/people/person-1', '/base/people/person-2'],
                },
            }),
        );

        await node.updateComplete;

        assert.deepEqual(node.value, ['person-1', 'person-2']);
        assert.deepEqual(eventDetail, {
            fieldName: 'applicant',
            name: 'applicant',
            value: ['person-1', 'person-2'],
            values: ['person-1', 'person-2'],
        });
    });

    test('passes multiple values to the resource selector', async () => {
        node.multiple = true;
        node.value = ['person-1', 'person-2'];

        await node.updateComplete;

        const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');

        assert.isTrue(resourceSelect.multiple);
        assert.deepEqual(resourceSelect.values, ['/base/people/person-1', '/base/people/person-2']);
    });

    test('keeps only the first value in single mode', async () => {
        node.multiple = false;
        node.value = ['person-1', 'person-2'];

        await node.updateComplete;

        const resourceSelect = node.shadowRoot.querySelector('dbp-resource-select');

        assert.isFalse(resourceSelect.multiple);
        assert.deepEqual(resourceSelect.values, ['/base/people/person-1']);
    });
});
