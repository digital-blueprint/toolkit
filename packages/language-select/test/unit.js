import '../src/language-select.js';
import '../src/demo.js';

describe('vpu-language-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-language-select');
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

describe('vpu-language-select demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-language-select-demo');
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
