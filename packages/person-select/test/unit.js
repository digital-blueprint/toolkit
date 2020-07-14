import '../src/dbp-person-select.js';
import '../src/demo.js';

describe('dbp-person-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-person-select');
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

describe('dbp-person-select-demo basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-person-select-demo');
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
