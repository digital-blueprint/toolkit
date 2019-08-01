import '../src/vpu-notification';

describe('vpu-notification basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-notification');
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
