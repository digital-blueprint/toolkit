import {assert} from '@esm-bundle/chai';

import '../src/dbp-file-source';
import '../src/demo';

suite('dbp-file-source basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-file-source');
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

suite('dbp-file-source demo', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-file-source-demo');
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
