import '../src/dbp-qr-code-scanner';

describe('dbp-qr-code-scanner basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-qr-code-scanner');
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
