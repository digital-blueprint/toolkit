/**
 * A mixin that adds internationalization (i18next) support to a base class.
 */
export const LangMixin = (superClass, i18nFactory) =>
    class extends superClass {
        constructor() {
            super();
            this._i18n = i18nFactory();
            this.lang = this._i18n.language;
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
                    this._i18n.changeLanguage(this.lang);
                }
            });

            super.update(changedProperties);
        }
    };
