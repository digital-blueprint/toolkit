const KEY_PREFIX = 'dbp-feature-';

/**
 * Retrieves the status of a feature flag from localStorage.
 *
 * @param {string} flagName - The name of the feature flag to retrieve.
 * @returns {boolean} Returns true if the feature flag exists, false otherwise.
 */
export function getFeatureFlag(flagName) {
    if (!listFeatureFlags().includes(flagName)) {
        throw new Error(`Feature flag "${flagName}" is not registered.`);
    }
    const value = localStorage.getItem(KEY_PREFIX + flagName);
    return value !== null;
}

/**
 * Sets a feature flag to the specified value in localStorage.
 *
 * @param {string} flagName - The name of the feature flag to set
 * @param {boolean} value - The value to set for the feature flag.
 */
export function setFeatureFlag(flagName, value) {
    if (!listFeatureFlags().includes(flagName)) {
        throw new Error(`Feature flag "${flagName}" is not registered.`);
    }
    if (value) {
        localStorage.setItem(KEY_PREFIX + flagName, 'true');
    } else {
        localStorage.removeItem(KEY_PREFIX + flagName);
    }
}

/**
 * Registers a feature flag.
 *
 * @param {string} flagName - The name of the feature flag to register.
 */
export function registerFeatureFlag(flagName) {
    if (!/^[a-zA-Z0-9-_]+$/.test(flagName)) {
        throw new Error(`Feature flag name "${flagName}" contains invalid characters.`);
    }
    globalThis['dbp-feature-flags'] = globalThis['dbp-feature-flags'] || [];
    if (!globalThis['dbp-feature-flags'].includes(flagName)) {
        globalThis['dbp-feature-flags'].push(flagName);
    }
}

/**
 * Returns the list of feature flags currently available in the application.
 *
 * @returns {Array} An array of feature flags.
 */
export function listFeatureFlags() {
    return globalThis['dbp-feature-flags'] || [];
}
