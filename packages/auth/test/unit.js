import {assert} from 'chai';

import '../src/vpu-auth';
import '../src/vpu-auth-demo';

suite('vpu-auth basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('vpu-auth-keycloak');
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

suite('vpu-login-button', () => {
    let node;
  
    suiteSetup(async () => {
      node = document.createElement('vpu-login-button');
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

suite('vpu-auth-demo basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('vpu-auth-demo');
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
