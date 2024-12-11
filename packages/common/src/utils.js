/**
 * Appends the second relative or absolute URL by treating
 * the base URL as the root path. Unlike normal URL join which
 * treats the host as root path.
 *
 * http://example.com/foo + bar -> http://example.com/foo/bar
 * http://example.com/foo/ + /bar -> http://example.com/foo/bar
 *
 * @param {string} baseURL The bas URL
 * @param {string} addedURL The URL to append ot the baseURL
 */
export const combineURLs = (baseURL, addedURL) => {
    if (!baseURL.endsWith('/')) {
        baseURL += '/';
    }
    return new URL(addedURL.replace(/^\/+/, ''), baseURL).href;
};

export function _parseUrlComponents(url) {
    // Create a URL object to leverage built-in parsing
    const parsedUrl = new URL(url, 'https://example.com');

    return {
        // Pathname (everything before query and hash)
        pathname: parsedUrl.pathname,

        // Path segments (split pathname into individual segments)
        pathSegments: parsedUrl.pathname
            .split('/')
            .filter(segment => segment !== '')
            .map(segment => decodeURIComponent(segment)),

        // Query parameters as an object
        queryParams: parsedUrl.searchParams,

        // Raw query string (including the '?')
        queryString: parsedUrl.search,

        // Hash/fragment (including the '#')
        hash: parsedUrl.hash,

        // Hash/fragment without the '#' symbol
        fragment: parsedUrl.hash.replace(/^#/, '')
    };
}