import i18next from 'i18next';

/**
 * Like Intl.DateTimeFormat().format() but uses the current language as locale.
 *
 * A i18next instance can be created with createInstance()
 *
 * @param {i18next.i18n} i18n - The i18next instance
 * @param {Date} date - The date to format
 * @param {object} options - Options passed to Intl.DateTimeFormat
 * @returns {string} The formatted datetime
 */
export function dateTimeFormat(i18n, date, options = {}) {
    return new Intl.DateTimeFormat(i18n.languages, options).format(date);
}

/**
 * Like Intl.NumberFormat().format() but uses the current language as locale.
 *
 * A i18next instance can be created with createInstance()
 *
 * @param {i18next.i18n} i18n - The i18next instance
 * @param {number} number - The number to format
 * @param {object} options - Options passed to Intl.NumberFormat
 * @returns {string} The formatted number
 */
export function numberFormat(i18n, number, options = {}) {
    return new Intl.NumberFormat(i18n.languages, options).format(number);
}

export function humanFileSize(bytes, si = false) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

/**
 * @param {string} namespace The namespace to override
 * @returns {string} The new namespace name
 */
function getOverrideNamespace(namespace) {
    // This just needs to be different to the namespace, make it special
    // so it's clear what it is used for in case it ends up in some error
    // message or something
    return '--' + namespace + '-override';
}

/**
 * Creates a new i18next instance that is fully initialized.
 *
 * Call changeLanguage() on the returned object to change the language.
 *
 * @param {object} languages - Mapping from languages to translation objects
 * @param {string} lng - The default language
 * @param {string} fallback - The fallback language to use for unknown languages or untranslated keys
 * @param {string} [namespace] - The i18next namespace to load, defaults to 'translation'
 * @returns {i18next.i18n} A new independent i18next instance
 */
export function createInstance(languages, lng, fallback, namespace) {
    if (namespace === undefined) {
        namespace = 'translation';
    }
    let overrideNamespace = getOverrideNamespace(namespace);

    var options = {
        lng: lng,
        fallbackLng: fallback,
        debug: false,
        ns: [overrideNamespace, namespace],
        defaultNS: namespace,
        fallbackNS: namespace,
        initImmediate: false, // Don't init async
        resources: {},
    };

    Object.keys(languages).forEach(function(key) {
        options['resources'][key] = {[namespace]: languages[key]};
    });

    var i18n = i18next.createInstance();
    i18n.init(options);
    console.assert(i18n.isInitialized);

    return i18n;
}

/**
 * Sets translation overrides for the given i18next instance. Any previously
 * applied overrides will be removed first. So calling this with an empty overrides
 * object is equal to removing all overrides.
 *
 * @param {i18next.i18n} i18n - The i18next instance
 * @param {object} overrides - The override data in the following format: "{language: {namespace: {key: value}}}"
 */
export function setOverrides(i18n, overrides) {
    // We add a special namespace which gets used with priority and falls back
    // to the original one. This way we an change the overrides at runtime
    // and can even remove them.
    let namespace = i18n.options.fallbackNS;
    let overrideNamespace = getOverrideNamespace(namespace);
    let hasOverrides = false;
    for(let lng of i18n.languages) {
        i18n.removeResourceBundle(lng, overrideNamespace);
        if (overrides[lng] === undefined || overrides[lng][namespace] === undefined)
            continue;
        let resources = overrides[lng][namespace];
        hasOverrides = true;
        i18n.addResourceBundle(lng, overrideNamespace, resources);
    }
    i18n.setDefaultNamespace(hasOverrides ? overrideNamespace : namespace);
}
