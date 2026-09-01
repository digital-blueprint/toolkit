/** @typedef {new (...args: any[]) => import('lit').LitElement} LitElementConstructor */

/**
 * @template {string} P
 * @typedef {new (...args: any[]) => ({lang: string} & Record<P, import('i18next').i18n>)} LangMixinHostConstructor
 */

/**
 * A mixin that adds internationalization (i18next) support to a base class.
 *
 * @template {LitElementConstructor} T
 * @template {string} [P='_i18n']
 * @param {T} superClass
 * @param {() => import('i18next').i18n} i18nFactory
 * @param {P} [propertyName]
 * @returns {T & LangMixinHostConstructor<P>}
 */
export const LangMixin = (superClass, i18nFactory, propertyName = /** @type {P} */ ('_i18n')) => {
    const LangMixinClass = class extends superClass {
        constructor(...args) {
            super(...args);
            const i18n = i18nFactory();
            /** @type {Record<string, import('i18next').i18n>} */ (/** @type {unknown} */ (this))[
                propertyName
            ] = i18n;
            this.lang = i18n.language;
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
                    void (
                        /** @type {Record<string, import('i18next').i18n>} */ (
                            /** @type {unknown} */ (this)
                        )[propertyName].changeLanguage(this.lang)
                    );
                }
            });

            super.update(changedProperties);
        }
    };

    return /** @type {T & LangMixinHostConstructor<P>} */ (/** @type {unknown} */ (LangMixinClass));
};
