import {assert} from 'chai';

import '../src/dbp-data-table-view';
import '../src/dbp-data-table-view-demo';

suite('dbp-data-table-view basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('dbp-data-table-view');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  suiteTeardown(() => {
    node.remove();
  });

  test('should render', () => {
    assert(node.shadowRoot !== undefined);
  });
});

suite('dbp-data-table-view-demo basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('dbp-data-table-view-demo');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  suiteTeardown(() => {
    node.remove();
  });

  test('should render', () => {
    assert(node.shadowRoot !== undefined);
  });
});
