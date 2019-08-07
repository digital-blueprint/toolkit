import '../src/person-select';
import '../src/demo';

describe('vpu-person-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-person-select');
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

describe('vpu-person-select-demo basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-person-select-demo');
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
