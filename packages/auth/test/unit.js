import {assert} from 'chai';

import '../src/dbp-auth';
import '../src/dbp-auth-demo';

suite('dbp-auth basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('dbp-auth-keycloak');
    node.setAttribute('url', 'someurl');
    node.setAttribute('realm', 'somerealm');
    node.setAttribute('client-id', 'someId');
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

suite('dbp-login-button', () => {
    let node;
  
    suiteSetup(async () => {
      node = document.createElement('dbp-login-button');
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

suite('dbp-auth-demo basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('dbp-auth-demo');
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
