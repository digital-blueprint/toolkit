import {assert} from '@esm-bundle/chai';
import * as i18next from '../i18next.js';

suite('i18next', () => {
    test('createInstance', () => {
        var inst = i18next.createInstance({de: {}}, 'de', 'en');
        assert.exists(inst);
        assert.deepEqual(inst.languages, ['de', 'en']);
    });

    test('translations', () => {
        var inst = i18next.createInstance(
            {de: {foo: 'bar'}, en: {foo: 'baz', extra: 'quux'}},
            'de',
            'en'
        );
        assert.deepEqual(inst.languages, ['de', 'en']);
        assert.equal(inst.t('foo'), 'bar');
        assert.equal(inst.t('nope'), 'nope');
        assert.equal(inst.t('extra'), 'quux');
        inst.changeLanguage('en');
        assert.deepEqual(inst.languages, ['en', 'de']);
        assert.equal(inst.t('foo'), 'baz');
        assert.equal(inst.t('nope'), 'nope');
        inst.changeLanguage('nope');
        assert.deepEqual(inst.languages, ['nope', 'en', 'de']);
        assert.equal(inst.t('foo'), 'baz');
        assert.equal(inst.t('nope'), 'nope');
    });

    test('date format', () => {
        var inst = i18next.createInstance({de: {}}, 'de', 'en');
        assert.deepEqual(inst.languages, ['de', 'en']);

        var date = new Date('1995-12-17T03:24:00');
        assert.equal(i18next.dateTimeFormat(inst, date), '17.12.1995');
        inst.changeLanguage('en');
        // TODO: not sure it's a good idea to use the english format even if english is selected because it's just confusing
        assert.equal(i18next.dateTimeFormat(inst, date), '12/17/1995');
    });

    test('number format', () => {
        var inst = i18next.createInstance({de: {}}, 'de', 'en');
        assert.deepEqual(inst.languages, ['de', 'en']);

        assert.equal(i18next.numberFormat(inst, 42), '42');
        assert.equal(i18next.numberFormat(inst, 1.25), '1,25');
        assert.equal(i18next.numberFormat(inst, 1234), '1.234');
        inst.changeLanguage('en');
        assert.equal(i18next.numberFormat(inst, 42), '42');
        assert.equal(i18next.numberFormat(inst, 1.25), '1.25');
        assert.equal(i18next.numberFormat(inst, 1234), '1,234');
    });

    test('overrides', () => {
        let namespace = 'some-ns';
        let element = document.createElement(namespace);
        var inst = i18next.createInstance({en: {foo: 'bar'}}, 'en', 'en', namespace);
        assert.equal(inst.t('foo'), 'bar');
        assert.equal(inst.t('quux'), 'quux');
        i18next.setOverrides(inst, element, {en: {[namespace]: {quux: 'bla'}}});
        assert.equal(inst.t('quux'), 'bla');
        assert.equal(inst.t('foo'), 'bar');
        i18next.setOverrides(inst, element, {en: {[namespace]: {}}});
        assert.equal(inst.t('quux'), 'quux');
        assert.equal(inst.t('foo'), 'bar');
        i18next.setOverrides(inst, element, {en: {[namespace]: {foo: 'hmm'}}});
        assert.equal(inst.t('foo'), 'hmm');
        i18next.setOverrides(inst, element, {en: {[namespace]: {quux: 'bla'}}});
        assert.equal(inst.t('foo'), 'bar');
        assert.equal(inst.t('quux'), 'bla');
        i18next.setOverrides(inst, element, {});
        assert.equal(inst.t('foo'), 'bar');
        assert.equal(inst.t('quux'), 'quux');
    });
});
