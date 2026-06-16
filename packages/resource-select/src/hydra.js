/**
 * Fetches all pages of a Hydra collection by following hydra:next links.
 *
 * @param {string} url
 * @param {string} lang
 * @param {function(): string} tokenGetter - Called before each request to get a fresh auth token
 * @returns {Promise<Array>}
 */
export async function getCollection(url, lang, tokenGetter) {
    let allMembers = [];
    let nextUrl = url;

    while (nextUrl) {
        let response = await fetch(nextUrl, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept-Language': lang,
                Authorization: 'Bearer ' + tokenGetter(),
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        let data = await response.json();
        let members = data['hydra:member'];
        if (members) {
            allMembers = allMembers.concat(members);
        }

        // Follow the next page link if available
        nextUrl = data['hydra:view']?.['hydra:next'] ?? null;
        if (nextUrl) {
            nextUrl = new URL(nextUrl, response.url).href;
        }
    }

    return allMembers;
}
