import '../src/person-select';

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
