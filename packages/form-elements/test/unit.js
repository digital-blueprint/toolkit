import {assert} from 'chai';

import '../src/index';
// import '../src/elements/string';
// import '../src/elements';
import '../src/demo';
// import {DbpStringElement} from "../src/index.js";

// suite('dbp-form-elements basics', () => {
//     let node;
//
//     setup(async () => {
//         // let element = new DbpStringElement();
//         // console.log(' element', element);
//         // console.assert(element);
//         // assert.isNotNull(element);
//         // assert.isNotNull(element);
//
//         node = document.createElement('dbp-string-element');
//         document.body.appendChild(node);
//         await node.updateComplete;
//     });
//
//     teardown(() => {
//         node.remove();
//     });
//
//     test('should render', () => {
//
//         assert.isNotNull(node.shadowRoot);
//     });
// });

suite('dbp-form-elements-demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-form-elements-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
