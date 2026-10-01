import {expect, assert} from 'chai';
// Load modules outside the test import graph so they appear in bundled coverage.
import '../src/error.js';
import '../src/demo/demo.js';
import * as utils from '../src/common-utils.js';
import * as styles from '../src/styles.js';
import {Translated} from '../src/translated.js';
import {combineURLs} from '../src/index.js';
import {_parseUrlComponents} from '../src/internal.js';

const inlineTranslatedTag = 'test-inline-translated';
if (!customElements.get(inlineTranslatedTag)) {
    customElements.define(inlineTranslatedTag, class extends Translated {});
}

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

    test('renders slotted content inline when requested', async () => {
        const translated = document.createElement(inlineTranslatedTag);
        translated.setAttribute('inline', '');
        const labelText = document.createElement('div');
        labelText.slot = 'de';
        labelText.textContent = 'A translated label';
        translated.appendChild(labelText);
        document.body.appendChild(translated);
        await translated.updateComplete;

        const activeLanguageWrapper = translated.shadowRoot.querySelector('div:not(.hidden)');
        assert.equal(getComputedStyle(activeLanguageWrapper).display, 'inline');
        assert.equal(getComputedStyle(labelText).display, 'inline');

        translated.remove();
    });

    test('getAssetURL', () => {
        // Backwards compat
        assert.equal(
            new URL(
                utils.getAssetURL('foo/bar', undefined, {
                    metaUrl: 'http://localhost/shared/chunk.js',
                }),
            ).pathname,
            '/foo/bar',
        );
        assert.equal(
            new URL(utils.getAssetURL('foo/bar', undefined, {metaUrl: 'http://localhost/entry.js'}))
                .pathname,
            '/foo/bar',
        );
        // Normal usage
        assert.equal(
            new URL(
                utils.getAssetURL('foobar', 'bar/quux', {
                    metaUrl: 'http://localhost/shared/chunk.js',
                }),
            ).pathname,
            '/local/foobar/bar/quux',
        );
        assert.equal(
            new URL(utils.getAssetURL('foobar', 'bar/quux', {metaUrl: 'http://localhost/entry.js'}))
                .pathname,
            '/local/foobar/bar/quux',
        );
    });

    test('getAbsoluteURL', () => {
        assert.equal(
            new URL(
                utils.getAbsoluteURL('foo/bar', {
                    metaUrl: 'http://localhost/shared/chunk.js',
                }),
            ).pathname,
            '/foo/bar',
        );
        assert.equal(
            new URL(utils.getAbsoluteURL('foo/bar', {metaUrl: 'http://localhost/entry.js'}))
                .pathname,
            '/foo/bar',
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
            'http://example.org/foo/bar/',
        );
        assert.equal(combineURLs('http://example.org', '/bar'), 'http://example.org/bar');
        assert.equal(combineURLs('http://example.org', 'bar/'), 'http://example.org/bar/');
        assert.equal(combineURLs('http://example.org', ''), 'http://example.org/');
        assert.equal(combineURLs('http://example.org/bla', ''), 'http://example.org/bla/');
        assert.equal(combineURLs('http://example.org/bla/', ''), 'http://example.org/bla/');
        assert.equal(combineURLs('http://example.org', 'http://other.com'), 'http://other.com/');
        assert.equal(
            combineURLs('http://example.org', 'http://other.com/test'),
            'http://other.com/test',
        );
        assert.equal(
            combineURLs('http://example.org', 'http://other.com/test/'),
            'http://other.com/test/',
        );
    });

    test('_parseUrlComponents', () => {
        let url = 'foo/bar%20quux?foo=bar&quux=42&quux=41#hash';
        assert.deepEqual(_parseUrlComponents(url).pathSegments, ['foo', 'bar quux']);
        assert.equal(_parseUrlComponents(url).pathname, '/foo/bar%20quux');
        assert.deepEqual(Array.from(_parseUrlComponents(url).queryParams.entries()), [
            ['foo', 'bar'],
            ['quux', '42'],
            ['quux', '41'],
        ]);
        assert.equal(_parseUrlComponents(url).queryString, '?foo=bar&quux=42&quux=41');
        assert.equal(_parseUrlComponents(url).fragment, 'hash');
        assert.equal(_parseUrlComponents('/foo').pathname, '/foo');
        assert.equal(_parseUrlComponents('foo').pathname, '/foo');
    });
});
