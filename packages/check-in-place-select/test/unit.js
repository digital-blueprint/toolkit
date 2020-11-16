import {assert} from 'chai';

import '../src/dbp-check-in-place-select.js';
import '../src/demo.js';

suite('dbp-check-in-place-select basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-check-in-place-select');
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

suite('dbp-check-in-place-select-demo basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-check-in-place-select-demo');
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
