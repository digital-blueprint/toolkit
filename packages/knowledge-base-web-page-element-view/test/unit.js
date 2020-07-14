import '../src/dbp-knowledge-base-web-page-element-view.js';
import '../src/dbp-knowledge-base-web-page-element-view-demo.js';

describe('dbp-knowledge-base-web-page-element-view basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-knowledge-base-web-page-element-view');
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

describe('dbp-knowledge-base-web-page-element-view demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-knowledge-base-web-page-element-view-demo');
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
