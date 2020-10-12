import '../src/dbp-location-select.js';
import '../src/demo.js';

describe('dbp-location-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-location-select');
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

describe('dbp-location-select-demo basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-location-select-demo');
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
