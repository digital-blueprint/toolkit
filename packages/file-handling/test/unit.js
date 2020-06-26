import '../src/vpu-file-source';
import '../src/demo';

describe('vpu-file-source basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-file-source');
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

describe('vpu-file-source demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-file-source-demo');
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
