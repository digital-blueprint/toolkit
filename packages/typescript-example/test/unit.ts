import {assert} from '@esm-bundle/chai';

import '../src/dbp-typescript-example';

suite('dbp-language-select basics', () => {
  let node

  setup(async () => {
    node = document.createElement('dbp-typescript-example');
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