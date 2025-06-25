/**
 * A mixin that adds internationalization (i18next) support to a base class.
 */
export const LangMixin = (superClass, i18nFactory, propertyName = '_i18n') =>
    class extends superClass {
        constructor() {
            super();
            this[propertyName] = i18nFactory();
            this.lang = this[propertyName].language;
        }

        static get properties() {
            return {
                ...super.properties,
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
