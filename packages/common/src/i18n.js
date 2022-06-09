import {createInstance as _createInstance, setOverridesByPromise} from '../i18next.js';

import de from './i18n/de/translation.json';
import en from './i18n/en/translation.json';

export function createInstance() {
    return _createInstance({en: en, de: de}, 'de', 'en');
}

export function createInstanceGivenResources(en, de) {
    return _createInstance({en: en, de: de}, 'de', 'en');
}

export {setOverridesByPromise};
