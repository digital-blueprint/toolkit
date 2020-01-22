import '../src/vpu-kb-wpe-view';
import '../src/demo';

describe('vpu-fileupload basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-fileupload');
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

describe('vpu-fileupload demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-fileupload-demo');
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
