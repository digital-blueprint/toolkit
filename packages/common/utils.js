import env from './env.js';

/**
 * Parses a link header
 *
 * The node module parse-link-header didn't work, so https://gist.github.com/niallo/3109252 became handy
 *
 * @param header
 */
export const parseLinkHeader = (header) => {
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
};

/**
 * Reads a setting
 *
 * @param key
 * @returns {*}
 */
export const setting = (key) => {
    return env[key];
};

export const getAPiUrl = (path = "", withPrefix = true) => {
    return env.apiBaseUrl + (withPrefix ? env.apiUrlPrefix : "") + path;
};

/**
 * Parses the base url from an url
 *
 * @param url
 * @returns {string}
 */
export const parseBaseUrl = (url) => {
    const pathArray = url.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    return protocol + '//' + host;
};

/**
 * Converts a string list to a data array for Select2
 *
 * @param list
 * @returns {Array}
 */
export const stringListToSelect2DataArray = (list) => {
    let data = [];
    list.forEach((item) => {data.push({id: item, text: item});});
    return data;
};

/**
 * Does generic Base64 Encoding with support for 16-bit encoded strings
 *
 * @see https://www.base64encoder.io/javascript/
 *
 * @param str
 * @returns {string}
 */
export const base64EncodeUnicode = (str) => {
    // First we escape the string using encodeURIComponent to get the UTF-8 encoding of the characters,
    // then we convert the percent encodings into raw bytes, and finally feed it to btoa() function.
    const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });

    return btoa(utf8Bytes);
};

/**
 * Like customElements.define() but tries to display an error in case the browser doesn't
 * support everything we need.
 *
 * Returns false in case define failed, true otherwise.
 *
 * @returns {boolean}
 */

/**
 * 
 * @param {string} name 
 * @param {Function} constructor 
 * @param {object} options 
 */
export const defineCustomElement = (name, constructor, options) => {
    // In case the constructor is already defined just do nothing
    if (customElements.get(name) === constructor) {
        return true;
    }
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
};

/**
 * Creates a random id
 *
 * taken from: https://stackoverflow.com/a/1349426/1581487
 *
 * @param length
 * @returns {string}
 */
export const makeId = (length) => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

/**
 * Pads a number with a 0 so it has two digits
 *
 * @param n
 * @returns {string}
 */
export const pad10 = (n) => { return n < 10 ? '0' + n : n; };

/**
 * Converts a date object or string to a local iso datetime with stripped seconds and timezone for the datetime-local input
 *
 * @param date
 * @returns {string}
 */
export const dateToStrippedIsoDT = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    return `${date.getFullYear()}-${pad10(date.getMonth()+1)}-${pad10(date.getDate())}T${pad10(date.getHours())}:${pad10(date.getMinutes())}`;
};

/**
 * Converts a date object or string to a local date string the date input
 *
 * @param date
 * @returns {string}
 */
export const dateToInputDateString = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    return `${date.getFullYear()}-${pad10(date.getMonth()+1)}-${pad10(date.getDate())}`;
};

/**
 * Converts a date object or string to a local time string the time input
 *
 * @param date
 * @returns {string}
 */
export const dateToInputTimeString = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    return `${pad10(date.getHours())}:${pad10(date.getMinutes())}`;
};

export const initAssetBaseURL = (id) => {
    // No longer needed, remove your call
};

/**
 * Get an absolute path for assets given a relative path to the js bundle.
 *
 * @param {string} path The relative path based on the js bundle path
 */
export const getAssetURL = (path) => {
    return new URL(path, new URL('..', import.meta.url).href).href;
};

/**
 * Poll <fn> every <interval> ms until <timeout> ms
 *
 * @param fn
 * @param timeout
 * @param interval
 */
export const pollFunc = (fn, timeout, interval) => {
    var startTime = (new Date()).getTime();
    interval = interval || 1000;

    (function p() {
        // don't retry if we took longer than timeout ms
        if (((new Date).getTime() - startTime ) > timeout) {
            return;
        }

        // retry until fn() returns true
        if (!fn())  {
            setTimeout(p, interval);
        }
    })();
};

/**
 * Doing a async foreach for non-linear integer keys
 *
 * @param array
 * @param callback
 * @returns {Promise<void>}
 */
export async function asyncObjectForEach(array, callback) {
    const keys = Object.keys(array);

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        await callback(array[key], key, array);
    }
}

/**
 * Doing a async foreach for non-linear integer keys with a copy of the array
 *
 * @param array
 * @param callback
 * @returns {Promise<void>}
 */
export async function asyncCopyObjectForEach(array, callback) {
    const arrayCopy = {...array};
    const keys = Object.keys(arrayCopy);

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        await callback(arrayCopy[key], key, arrayCopy);
    }
}

/**
 * Doing a async foreach for linear integer keys
 *
 * @param array
 * @param callback
 * @returns {Promise<void>}
 */
export async function asyncArrayForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
