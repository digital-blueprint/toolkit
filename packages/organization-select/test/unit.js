import {assert} from 'chai';

import '../src/dbp-organization-select.js';
import '../src/demo.js';

suite('dbp-organization-select basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-organization-select');
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

suite('dbp-organization-select-demo basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-organization-select-demo');
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
