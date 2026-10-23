/**
 * Fetches all pages of a Hydra collection by following hydra:next links.
 *
 * @param {string} url
 * @param {string} lang
 * @param {() => string} tokenGetter - Called before each request to get a fresh auth token
 * @param {{signal?: AbortSignal, maxPages?: number}} [options] - Cancel the requests with
 *     "signal", limit how many pages get fetched with "maxPages" (all of them by default)
 * @returns {Promise<object[]>}
 */
export async function getCollection(url, lang, tokenGetter, options = {}) {
    const maxPages = options.maxPages ?? Infinity;
    let allMembers = [];
    let pageCount = 0;
    /** @type {string|null} */
    let nextUrl = url;

    while (nextUrl) {
        let response = await fetch(nextUrl, {
            signal: options.signal,
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

        // Follow the next page link if available, resolved against the page we just requested
        // because the API returns it as a relative path
        const nextPath = data['hydra:view']?.['hydra:next'] ?? null;
        nextUrl = nextPath ? new URL(nextPath, nextUrl).href : null;

        pageCount++;
        if (nextUrl && pageCount >= maxPages) {
            console.warn(`Stopped after ${maxPages} page(s), ignoring the rest of "${url}"`);
            nextUrl = null;
        }
    }

    return allMembers;
}
