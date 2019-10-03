import '../src/vpu-knowledge-base-web-page-element-view.js';
import '../src/demo.js';

describe('vpu-knowledge-base-web-page-element-view basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-knowledge-base-web-page-element-view');
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

describe('vpu-knowledge-base-web-page-element-view demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-knowledge-base-web-page-element-view-demo');
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
