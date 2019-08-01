import '../src/person-select';

describe('vpu-library-person-select basics', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-library-person-select');
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
