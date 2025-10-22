import {assert, expect} from 'chai';

import '../src/dbp-language-select.js';
import '../src/demo.js';

suite('dbp-language-select basics', () => {
    let node;
    let events = [];

    function handler(e) {
        events.push(e);
    }

    beforeEach(async () => {
        events.length = 0;
        window.addEventListener('dbp-set-property', handler);
        node = document.createElement('dbp-language-select');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
        window.removeEventListener('dbp-set-property', handler);
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('change language events', () => {
        node.lang = 'en';
        expect(node.next).to.equal('de');
        expect(events.length).to.equal(1);
        node.lang = 'de';
        expect(node.next).to.equal('en');
        expect(events.length).to.equal(2);
    });

    test('change next', () => {
        expect(events.length).to.equal(0);
        node.lang = 'en';
        expect(node.next).to.equal('de');
        expect(node.lang).to.equal('en');
        node.next = 'en';
        expect(node.next).to.equal('en');
        expect(node.lang).to.equal('de');
        expect(events.length).to.equal(2);
    });
});

suite('dbp-language-select demo', () => {
    let node;

    beforeEach(async () => {
        node = document.createElement('dbp-language-select-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    afterEach(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
