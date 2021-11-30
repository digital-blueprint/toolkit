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
    if(!baseURL.endsWith('/')) {
        baseURL += '/';
    }
    return new URL(addedURL.replace(/^\/+/, ''), baseURL).href;
};