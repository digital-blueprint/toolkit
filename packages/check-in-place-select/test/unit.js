import '../src/dbp-check-in-place-select.js';
import '../src/demo.js';

describe('dbp-check-in-place-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-check-in-place-select');
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

describe('dbp-check-in-place-select-demo basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-check-in-place-select-demo');
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
