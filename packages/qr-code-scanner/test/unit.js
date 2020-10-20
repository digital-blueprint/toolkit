import {assert} from 'chai';

import '../src/dbp-qr-code-scanner';

suite('dbp-qr-code-scanner basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('dbp-qr-code-scanner');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  suiteTeardown(() => {
    node.remove();
  });

  test('should render', () => {
    assert.isNotNull(node.shadowRoot);
  });
});
