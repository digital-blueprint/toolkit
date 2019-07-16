module.exports = {
    /**
     * Parses a link header
     *
     * The node module parse-link-header didn't work, so https://gist.github.com/niallo/3109252 became handy
     *
     * @param header
     */
    parseLinkHeader: (header) => {
        if (header.length === 0) {
            throw new Error("input must not be of zero length");
        }

        // Split parts by comma
        const parts = header.split(',');
        const links = {};

        // Parse each part into a named link
        for(let i=0; i<parts.length; i++) {
            const section = parts[i].split(';');
            if (section.length !== 2) {
                throw new Error("section could not be split on ';'");
            }
            const url = section[0].replace(/<(.*)>/, '$1').trim();
            const name = section[1].replace(/rel="(.*)"/, '$1').trim();
            links[name] = url;
        }

        return links;
    },

    /**
     * Parses the base url from an url
     *
     * @param url
     * @returns {string}
     */
    parseBaseUrl: (url) => {
        const pathArray = url.split('/');
        const protocol = pathArray[0];
        const host = pathArray[2];
        return protocol + '//' + host;
    },
};
