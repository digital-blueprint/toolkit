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

/**
 * Returns a Document like thing that can be used to create elements.
 *
 * It provides createElement()/createElementNS()/importNode().
 * The Document type annotation, while not correct, is used here for simplicity.
 *
 * https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md#scoped-element-creation-apis
 *
 * @param {HTMLElement} element
 * @returns {Document|null}
 */
export function getShadowRootDocument(element) {
    // In case the polyfill is loaded return the shadowRoot
    // otherwise fall back to the global document
    if (ShadowRoot.prototype.createElement !== undefined) {
        return element.shadowRoot;
    }
    return document;
}
