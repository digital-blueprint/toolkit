import {expect, assert} from '@esm-bundle/chai';
import * as utils from '../utils';
import * as styles from '../styles';
import {combineURLs} from '../';
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
        var res = utils.defineCustomElement('test-some-element', SomeElement);
        expect(res).to.equal(true);

        var node = document.createElement('test-some-element');
        expect(node.foo).to.equal(42);
    });

    test('defineCustomElement multiple times', () => {
        class SomeElement2 extends HTMLElement {}
        let res = utils.defineCustomElement('test-some-element-2', SomeElement2);
        assert.isTrue(res);
        res = utils.defineCustomElement('test-some-element-2', SomeElement2);
        assert.isTrue(res);
    });

    test('getAssetURL', () => {
        // Backwards compat
        assert.equal(new URL(utils.getAssetURL('foo/bar')).pathname, '/foo/bar');
        // Normal usage
        assert.equal(
            new URL(utils.getAssetURL('foobar', 'bar/quux')).pathname,
            '/local/foobar/bar/quux'
        );
    });

    test('getThemeCSS', () => {
        styles.getThemeCSS();
    });

    test('combineURLs', () => {
        assert.equal(combineURLs('http://example.org/foo', 'bar'), 'http://example.org/foo/bar');
        assert.equal(combineURLs('http://example.org/foo', '/bar'), 'http://example.org/foo/bar');
        assert.equal(
            combineURLs('http://example.org/foo/', '/bar/'),
            'http://example.org/foo/bar/'
        );
        assert.equal(combineURLs('http://example.org', '/bar'), 'http://example.org/bar');
        assert.equal(combineURLs('http://example.org', 'bar/'), 'http://example.org/bar/');
        assert.equal(combineURLs('http://example.org', ''), 'http://example.org/');
        assert.equal(combineURLs('http://example.org/bla', ''), 'http://example.org/bla/');
        assert.equal(combineURLs('http://example.org/bla/', ''), 'http://example.org/bla/');
        assert.equal(combineURLs('http://example.org', 'http://other.com'), 'http://other.com/');
        assert.equal(
            combineURLs('http://example.org', 'http://other.com/test'),
            'http://other.com/test'
        );
        assert.equal(
            combineURLs('http://example.org', 'http://other.com/test/'),
            'http://other.com/test/'
        );
    });
});
