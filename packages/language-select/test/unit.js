import '../src/dbp-language-select.js';
import '../src/demo.js';

describe('dbp-language-select basics', () => {
  let node;
  let events = [];

  function handler(e) {
    events.push(e);
  }

  beforeEach(async () => {
    events.length = 0;
    window.addEventListener('dbp-language-changed', handler);
    node = document.createElement('dbp-language-select');
    document.body.appendChild(node);
    await node.updateComplete;
  });

  afterEach(() => {
    node.remove();
    window.removeEventListener('dbp-language-changed', handler);
  });

  it('should render', () => {
      expect(node).to.have.property('shadowRoot');
  });

  it('change language events', () => {
    node.lang = 'en';
    expect(node.next).to.equal('de');
    expect(events.length).to.equal(1);
    node.lang = 'de';
    expect(node.next).to.equal('en');
    expect(events.length).to.equal(2);
  });

  it('change next', () => {
    node.lang = 'en';
    expect(node.next).to.equal('de');
    expect(node.lang).to.equal('en');
    node.next = 'en';
    expect(node.next).to.equal('en');
    expect(node.lang).to.equal('de');
    expect(events.length).to.equal(2);
  });
});

describe('dbp-language-select demo', () => {
  let node;

  beforeEach(async () => {
    node = document.createElement('dbp-language-select-demo');
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
