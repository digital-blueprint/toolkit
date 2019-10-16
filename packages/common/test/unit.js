import * as utils from '../utils';
import * as styles from '../styles';
import '../vpu-mini-spinner.js';
import '../vpu-spinner.js';
import '../jsonld.js';

describe('utils', () => {
    it('base64EncodeUnicode', () => {
        expect(utils.base64EncodeUnicode('')).to.equal('');
        expect(utils.base64EncodeUnicode('foo')).to.equal('Zm9v');
        expect(utils.base64EncodeUnicode('äöü')).to.equal('w6TDtsO8');
        expect(utils.base64EncodeUnicode('😊')).to.equal('8J+Yig==');
    });

    it('defineCustomElement', () => {
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

    it('getAPiUrl', () => {
        assert(utils.getAPiUrl().startsWith("http"));
    });

    it('setting', () => {
        assert(utils.setting('apiBaseUrl').startsWith("http"));
    });

    it('getAssetURL', () => {
        utils.initAssetBaseURL();
        assert(utils.getAssetURL("foo/bar") === "foo/bar");
        assert(utils.getAssetURL("foo/bar") === "foo/bar");
    });

    it('getThemeCSS', () => {
        styles.getThemeCSS();
    });
});
