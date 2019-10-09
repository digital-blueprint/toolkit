import {css} from 'lit-element';
import env from './env.js';

export function getThemeCSS() {
    // language=css
    return css`
        :host {
            --vpu-primary-bg-color: var(--vpu-override-primary-bg-color, #007bff);
            --vpu-primary-text-color: var(--vpu-override-primary-text-color, #fff);
            --vpu-secondary-bg-color: var(--vpu-override-secondary-bg-color, #6c757d);
            --vpu-secondary-text-color: var(--vpu-override-secondary-text-color, #fff);
            --vpu-info-bg-color: var(--vpu-override-info-bg-color, #17a2b8);
            --vpu-info-text-color: var(--vpu-override-info-text-color, #fff);
            --vpu-success-bg-color: var(--vpu-override-success-bg-color, #28a745);
            --vpu-success-text-color: var(--vpu-override-success-text-color, #fff);
            --vpu-warning-bg-color: var(--vpu-override-warning-bg-color, #ffc107);
            --vpu-warning-text-color: var(--vpu-override-warning-text-color, #343a40);
            --vpu-danger-bg-color: var(--vpu-override-danger-bg-color, #dc3545);
            --vpu-danger-text-color: var(--vpu-override-danger-text-color, #fff);
            --vpu-light: var(--vpu-override-light, #f8f9fa);
            --vpu-dark: var(--vpu-override-dark, #343a40);
            --vpu-muted-text: var(--vpu-override-muted-text, #6c757d);
            --vpu-border-radius: var(--vpu-override-border-radius, 0px);
            --vpu-border-width: var(--vpu-override-border-width, 1px);
        }
    `;
}

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
    list.forEach((item) => {data.push({id: item, text: item})});
    return data;
};

/**
 * Does generic Base64 Encoding with support for 16-bit encoded strings
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
export const defineCustomElement = (name, constructor, options) => {
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
export const pad10 = (n) => { return n < 10 ? '0' + n : n };

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

let _assetBaseURL = null;

/**
 * Set the base url for future calls to getAssetURL()
 *
 * @param {string} [id] An optional id of the script tag to figure out the
 *  base bundle URL.
 */
export const initAssetBaseURL = (id) => {
    // We don't want future calls to change things
    if (_assetBaseURL)
        return;

    if (id) {
        // Find the id added to the script tag
        const elm = document.getElementById(id);
        if (elm && elm.src) {
            _assetBaseURL = elm.src;
        }
    }

    // In the (unlikely) event that we are bundled as a non-module
    // we can use the old currentScript API
    if (document.currentScript && document.currentScript.src) {
        _assetBaseURL = document.currentScript.src;
    }
};

/**
 * Get an absolute path for assets given a relative path to the js bundle.
 * Call initAssetBaseURL() before this.
 *
 * @param {string} path The relative path based on the js bundle path
 */
export const getAssetURL = (path) => {
    // Maybe initScriptURL() can do something without the id
    if (!_assetBaseURL) {
        initAssetBaseURL();
    }

    // We already found the path before, just go with it
    if (_assetBaseURL) {
        return new URL(path, _assetBaseURL).href;
    }

    // If all fails we just fall back to relative paths and hope the
    // html is on the same path as the bundle
    return path;
};