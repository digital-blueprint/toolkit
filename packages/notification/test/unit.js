import {assert} from '@esm-bundle/chai';

import '../src/dbp-notification';

suite('dbp-notification basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-notification');
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
