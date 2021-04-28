import {assert} from '@esm-bundle/chai';

import '../src/dbp-data-table-view';
import '../src/dbp-data-table-view-demo';

suite('dbp-data-table-view basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-data-table-view');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  teardown(() => {
    node.remove();
  });

  test('should render', () => {
    assert(node.shadowRoot !== undefined);
  });
});

suite('dbp-data-table-view-demo basics', () => {
  let node;

  setup(async () => {
    node = document.createElement('dbp-data-table-view-demo');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  teardown(() => {
    node.remove();
  });

  test('should render', () => {
    assert(node.shadowRoot !== undefined);
  });
});
