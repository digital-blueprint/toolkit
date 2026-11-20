import {
    registerFeatureFlag,
    listFeatureFlags,
    getFeatureFlag,
    getFeatureFlagLabel,
    setFeatureFlag,
} from '../src/index.js';
import {assert} from 'chai';

suite('Feature Flags', () => {
    setup(() => {
        localStorage.clear();
        delete globalThis['dbp-feature-flags'];
        delete globalThis['dbp-feature-flag-labels'];
    });

    teardown(() => {
        localStorage.clear();
        delete globalThis['dbp-feature-flags'];
        delete globalThis['dbp-feature-flag-labels'];
    });

    suite('registerFeatureFlag', () => {
        test('should register a flag and make it listable', () => {
            assert.deepEqual(listFeatureFlags(), []);

            registerFeatureFlag('test-flag');

            assert.deepEqual(listFeatureFlags(), ['test-flag']);
        });

        test('should not register duplicate flags', () => {
            registerFeatureFlag('test-flag');
            registerFeatureFlag('test-flag');

            assert.deepEqual(listFeatureFlags(), ['test-flag']);
        });

        test('should reject flag names with invalid characters', () => {
            assert.throws(() => registerFeatureFlag('invalid flag'), /invalid characters/);
            assert.throws(() => registerFeatureFlag('invalid@flag'), /invalid characters/);
        });

        test('should accept flag names with valid characters', () => {
            assert.doesNotThrow(() => registerFeatureFlag('valid-flag_123'));
        });
    });

    suite('getFeatureFlagLabel', () => {
        test('should return the display label', () => {
            registerFeatureFlag('test-flag', 'Test feature');

            assert.equal(getFeatureFlagLabel('test-flag'), 'Test feature');
            assert.deepEqual(listFeatureFlags(), ['test-flag']);
        });

        test('should fall back to the flag name for missing or empty labels', () => {
            registerFeatureFlag('test-flag');
            assert.equal(getFeatureFlagLabel('test-flag'), 'test-flag');

            registerFeatureFlag('test-flag', '');
            assert.equal(getFeatureFlagLabel('test-flag'), 'test-flag');
        });

        test('should throw when getting the label of an unregistered flag', () => {
            assert.throws(() => getFeatureFlagLabel('unregistered'), /not registered/);
        });
    });

    suite('setFeatureFlag', () => {
        test('should store true flag in localStorage', () => {
            registerFeatureFlag('test-flag');

            setFeatureFlag('test-flag', true);

            assert.equal(localStorage.getItem('dbp-feature-test-flag'), 'true');
        });

        test('should remove false flag from localStorage', () => {
            registerFeatureFlag('test-flag');
            setFeatureFlag('test-flag', true);

            setFeatureFlag('test-flag', false);

            assert.equal(localStorage.getItem('dbp-feature-test-flag'), null);
        });

        test('should throw when setting unregistered flag', () => {
            assert.throws(() => setFeatureFlag('unregistered', true), /not registered/);
        });
    });

    suite('getFeatureFlag', () => {
        test('should return false when flag is not set', () => {
            registerFeatureFlag('test-flag');

            assert.equal(getFeatureFlag('test-flag'), false);
        });

        test('should return true when flag is set', () => {
            registerFeatureFlag('test-flag');
            setFeatureFlag('test-flag', true);

            assert.equal(getFeatureFlag('test-flag'), true);
        });

        test('should throw when getting unregistered flag', () => {
            assert.throws(() => getFeatureFlag('unregistered'), /not registered/);
        });
    });
});
