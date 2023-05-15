/**
 * @param {string} url
 * @param {string} lang
 * @param {string} token
 * @returns {Array}
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
