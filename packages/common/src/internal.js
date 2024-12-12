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