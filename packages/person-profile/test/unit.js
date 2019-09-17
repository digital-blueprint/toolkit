import '../src/person-profile.js';
import '../src/demo.js';

describe('vpu-person-profile demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('vpu-person-profile-demo');
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
