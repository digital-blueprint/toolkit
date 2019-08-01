import '../vpu-kb-wpe-view';

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
