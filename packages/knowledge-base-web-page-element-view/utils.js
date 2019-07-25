const vars = require("./vars");

module.exports = {
    /**
     * Reads a setting
     *
     * @param key
     * @returns {*}
     */
    setting: (key) => vars[key]
};
