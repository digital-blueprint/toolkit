import vars from './vars.js';

export const getAssetURL = (path) => {
    const elm = document.getElementById('vpu-library-shelving-wc-src');
    if (!elm)
        return path;
    const url = elm.src;
    // newer browsers only
    //var url = import.meta.url;
    return new URL(path, url).href;
}

export const getAPiUrl = function(path = "", withPrefix = true) {
    return vars.apiBaseUrl + (withPrefix ? vars.apiUrlPrefix : "") + path;
}

/**
 * Finds an object in a JSON result by identifier
 *
 * @param identifier
 * @param results
 * @param identifierAttribute
 */
export const findObjectInApiResults = (identifier, results, identifierAttribute = "@id") => {
    const members = results["hydra:member"];

    if (members === undefined) {
        return;
    }

    for (const object of members){
        if (object[identifierAttribute] === identifier) {
            return object;
        }
    }
}

/**
 * Reads a setting
 *
 * @param key
 * @returns {*}
 */
export const setting = (key) => vars[key];
