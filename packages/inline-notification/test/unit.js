import '../src/dbp-inline-notification';

describe('dbp-inline-notification basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-inline-notification');
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
