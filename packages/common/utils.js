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

    /**
     * Converts a string list to a data array for Select2
     *
     * @param list
     * @returns {Array}
     */
    stringListToSelect2DataArray: (list) => {
        let data = [];
        list.forEach((item) => {data.push({id: item, text: item})});
        return data;
    },

    /**
     * Does generic Base64 Encoding with support for 16-bit encoded strings
     * @see https://www.base64encoder.io/javascript/
     *
     * @param str
     * @returns {string}
     */
    base64EncodeUnicode: (str) => {
        // First we escape the string using encodeURIComponent to get the UTF-8 encoding of the characters,
        // then we convert the percent encodings into raw bytes, and finally feed it to btoa() function.
        const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        });

        return btoa(utf8Bytes);
    },

    /**
     * Like customElements.define() but tries to display an error in case the browser doesn't
     * support everything we need.
     *
     * Returns false in case define failed, true otherwise.
     *
     * @returns {boolean}
     */
    defineCustomElement: (name, constructor, options) => {
        // Checks taken from https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-loader.js
        if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype && window.customElements)) {
            var elements = document.getElementsByTagName(name);
            for(var i=0; i < elements.length; i++) {
                elements[i].innerHTML = "<span style='border: 1px solid red; font-size: 0.8em; "
                    + "opacity: 0.5; padding: 0.2em;'>☹ Your browser is not supported ☹</span>";
            }
           return false;
        }
        customElements.define(name, constructor, options);
        return true;
    }
};
