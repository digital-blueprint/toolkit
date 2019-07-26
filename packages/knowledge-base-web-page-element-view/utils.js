const vars = require("./vars");

module.exports = {
    getAPiUrl: function(path = "", withPrefix = true) {
        return vars.apiBaseUrl + (withPrefix ? vars.apiUrlPrefix : "") + path;
    },

    /**
     * Reads a setting
     *
     * @param key
     * @returns {*}
     */
    setting: (key) => vars[key]
};
