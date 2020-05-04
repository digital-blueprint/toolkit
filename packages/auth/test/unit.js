import {expect} from 'chai';

import '../src/vpu-auth';
import '../src/vpu-auth-demo';

suite('vpu-auth basics', () => {
  let node;

  suiteSetup(async () => {
    node = document.createElement('vpu-auth');
    node.setAttribute('keycloak-config', JSON.stringify({
        url: 'url',
        realm: 'realm',
        clientId: 'clientId',
    }));
    document.body.appendChild(node);
    await node.updateComplete;
  });

  suiteTeardown(() => {
    node.remove();
  });

  test('should render', () => {
      expect(node).to.have.property('shadowRoot');
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
      expect(node).to.have.property('shadowRoot');
  });
});
