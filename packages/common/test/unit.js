import {expect, assert} from 'chai';
import * as utils from '../utils';
import * as styles from '../styles';
import '../vpu-mini-spinner.js';
import '../vpu-spinner.js';
import '../jsonld.js';

suite('utils', () => {
    test('base64EncodeUnicode', () => {
        expect(utils.base64EncodeUnicode('')).to.equal('');
        expect(utils.base64EncodeUnicode('foo')).to.equal('Zm9v');
        expect(utils.base64EncodeUnicode('äöü')).to.equal('w6TDtsO8');
        expect(utils.base64EncodeUnicode('😊')).to.equal('8J+Yig==');
    });

    test('defineCustomElement', () => {
        class SomeElement extends HTMLElement {
            constructor() {
                super();
                this.foo = 42;
            }
        }
        var res = utils.defineCustomElement("test-some-element", SomeElement);
        expect(res).to.equal(true);

        var node = document.createElement('test-some-element');
        expect(node.foo).to.equal(42);
    });

    test('getAPiUrl', () => {
        assert(utils.getAPiUrl().startsWith("http"));
    });

    test('setting', () => {
        assert(utils.setting('apiBaseUrl').startsWith("http"));
    });

    test('getAssetURL', () => {
        utils.initAssetBaseURL();
        assert.equal(new URL(utils.getAssetURL("foo/bar")).pathname, "/foo/bar");
    });

    test('getThemeCSS', () => {
        styles.getThemeCSS();
    });
});
