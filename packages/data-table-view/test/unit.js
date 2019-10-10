import {assert} from 'chai';

import '../src/vpu-data-table-view';
import '../src/vpu-data-table-view-demo';

suite('vpu-data-table-view basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('vpu-data-table-view');
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

suite('vpu-data-table-view-demo basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('vpu-data-table-view-demo');
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
