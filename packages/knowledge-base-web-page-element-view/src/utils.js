import vars from './vars.js';

export const getAPiUrl = function(path = "", withPrefix = true) {
        return vars.apiBaseUrl + (withPrefix ? vars.apiUrlPrefix : "") + path;
}

/**
 * Reads a setting
 *
 * @param key
 * @returns {*}
 */
export const setting = (key) => vars[key]
