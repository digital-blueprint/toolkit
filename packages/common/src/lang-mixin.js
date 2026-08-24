/**
 * @typedef {{lang: string, _i18n: import('i18next').i18n}} LangMixinHost
 * @typedef {new (...args: any[]) => import('lit').LitElement} LitElementConstructor
 * @typedef {new (...args: any[]) => LangMixinHost} LangMixinHostConstructor
 */

/**
 * A mixin that adds internationalization (i18next) support to a base class.
 *
 * @template {LitElementConstructor} T
 * @param {T} superClass
 * @param {() => import('i18next').i18n} i18nFactory
 * @param {string} [propertyName]
 * @returns {T & LangMixinHostConstructor}
 */
export const LangMixin = (superClass, i18nFactory, propertyName = '_i18n') => {
    const LangMixinClass = class extends superClass {
        constructor(...args) {
            super(...args);
            this[propertyName] = i18nFactory();
            this.lang = this[propertyName].language;
        }

        static get properties() {
            return {
                .../** @type {{properties?: object}} */ (superClass).properties,
                lang: {type: String},
            };
        }

        update(changedProperties) {
            changedProperties.forEach((oldValue, propName) => {
                if (propName === 'lang') {
                    this[propertyName].changeLanguage(this.lang);
                }
            });

            super.update(changedProperties);
        }
    };

    return /** @type {T & LangMixinHostConstructor} */ (/** @type {unknown} */ (LangMixinClass));
};
