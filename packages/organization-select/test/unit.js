import {assert} from 'chai';

import '../src/dbp-knowledge-base-organization-select.js';
import '../src/demo.js';

suite('dbp-knowledge-base-organization-select basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-knowledge-base-organization-select');
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

suite('dbp-knowledge-base-organization-select-demo basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-knowledge-base-organization-select-demo');
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
