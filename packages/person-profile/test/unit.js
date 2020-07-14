import '../src/dbp-person-profile-demo.js';

describe('dbp-person-profile demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-person-profile-demo');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  afterEach(() => {
    node.remove();
  });

  it('should render', () => {
      expect(node).to.have.property('shadowRoot');
  });
});
