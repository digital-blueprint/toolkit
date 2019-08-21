import '../src/vpu-auth';
import '../src/vpu-auth-demo';

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

describe('vpu-auth-demo basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-auth-demo');
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
