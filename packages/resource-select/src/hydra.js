/**
 * @param {string} url
 * @param {string} lang
 * @param {string} token
 * @returns {Promise<any[]>}
 */
export async function getCollection(url, lang, token) {
    let response = await fetch(url, {
        headers: {
            'Content-Type': 'application/ld+json',
            'Accept-Language': lang,
            Authorization: 'Bearer ' + token,
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    let data = await response.json();

    return data['hydra:member'];
}


/**
 * Finds an object in a JSON result by identifier
 *
 * @param {string} identifier
 * @param {object} results
 * @param {string} identifierAttribute
 */
export const findObjectInApiResults = (identifier, results, identifierAttribute = '@id') => {
    const members = results['hydra:member'];

    if (members === undefined) {
        return;
    }

    for (const object of members) {
        if (object[identifierAttribute] === identifier) {
            return object;
        }
    }
};
