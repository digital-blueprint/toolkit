import {assert} from 'chai';

import '../src/dbp-toolkit-showcase.js';

suite('dbp-signature-app basics', () => {
    let node;

    suiteSetup(async () => {
        node = document.createElement('dbp-toolkit-showcase');
        node.keycloakConfig = {url: 'foo', realm: 'foo', clientId: 'foo'};
        document.body.appendChild(node);
        await node.updateComplete;
    });

    suiteTeardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});
