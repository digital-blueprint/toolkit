export const getAssetURL = (path) => {
    const elm = document.getElementById('vpu-library-shelving-wc-src');
    if (!elm)
        return path;
    const url = elm.src;
    // newer browsers only
    //var url = import.meta.url;
    return new URL(path, url).href;
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
