import '../src/vpu-auth';

describe('vpu-auth basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-auth');
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
