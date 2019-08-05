import i18next from 'i18next';

import de from './i18n/de/translation.json';
import en from './i18n/en/translation.json';

const i18n = i18next.createInstance();

i18n.init({
    lng: 'de',
    fallbackLng: ['de'],
    debug: false,
    initImmediate: false, // Don't init async
    resources: {
        en: {translation: en},
        de: {translation: de}
    },
});

console.assert(i18n.isInitialized);

function dateTimeFormat(date, options) {
    return new Intl.DateTimeFormat(i18n.languages, options).format(date);
}

function numberFormat(number, options) {
    return new Intl.NumberFormat(i18n.languages, options).format(number);
}

export {i18n, dateTimeFormat, numberFormat};
