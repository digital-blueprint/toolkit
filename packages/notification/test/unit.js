import '../src/dbp-notification';

describe('dbp-notification basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-notification');
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
