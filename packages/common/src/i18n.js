import {createInstance as _createInstance} from '../i18next.js';

import de from './i18n/de/translation.json';
import en from './i18n/en/translation.json';

export function createInstance() {
    return _createInstance({en: en, de: de}, 'de', 'en');
}

export async function createInstanceAsync(langFile) {
    // check if a path to language files is given
    if(langFile) {
      // request german lang file asynchronously
      let result = await
          fetch(langFile + 'de/translation.json', {
              headers: {'Content-Type': 'application/json'},
          });
      const dynDe = await result.json();

      // request english lang file asynchronously
      result = await
          fetch(langFile + 'en/translation.json', {
              headers: {'Content-Type': 'application/json'},
          });
      const dynEn = await result.json();

      return _createInstance({en: dynEn, de: dynDe}, 'de', 'en');
    }

    return _createInstance({en: en, de: de}, 'de', 'en');
}
