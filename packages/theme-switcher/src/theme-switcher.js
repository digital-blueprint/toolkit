import {createInstance, setOverridesByGlobalCache} from './i18n.js';
import {html, css} from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AdapterLitElement, Icon} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {classMap} from 'lit/directives/class-map.js';

export class ThemeSwitcher extends ScopedElementsMixin(AdapterLitElement) {
    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.themes = [];
        this.boundCloseAdditionalMenuHandler = this.hideModeMenu.bind(this);
        this.detectBrowserDarkMode = false;
        this.darkModeClass = 'dark-theme';
        this.langDir = '';
        this.dropdownRight = false;
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            themes: {type: Array, attribute: 'themes'},
            darkModeThemeOverride: {type: String, attribute: 'dark-mode-theme-override'},
            dropdownRight: {type: Boolean, attribute: 'dropdown-right'},
            langDir: {type: String, attribute: 'lang-dir'},
        };
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
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

    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(() => {
            if (typeof this.darkModeThemeOverride === 'undefined') {
                this.detectBrowserDarkMode = true;
            } else if (this.darkModeThemeOverride === '') {
                this.detectBrowserDarkMode = false;
            } else {
                this.detectBrowserDarkMode = true;
                this.darkModeClass = this.darkModeThemeOverride;
            }
            this.loadTheme('light-theme');
            this.detectInitialMode();
        });
        if (this.langDir) {
          setOverridesByGlobalCache(this._i18n, this);
        }
    }

    detectInitialMode() {
        //look for saved modes
        let prefMode = localStorage.getItem('prefered-color-mode');
        if (prefMode) {
            // search for prefered mode
            const theme = this.themes.find((theme) => theme.class === prefMode);

            if (theme) {
                this.loadTheme(theme.class);
            }
            return;
        }

        if (this.detectBrowserDarkMode) {
            //look for browser mode
            const useDark = window.matchMedia('(prefers-color-scheme: dark)');
            if (useDark.matches) {
                // search for dark mode
                const theme = this.themes.find((theme) => theme.class === this.darkModeClass);

                if (theme) {
                    this.loadTheme(theme.class);
                }
            }
        }
    }

    toggleModeMenu() {
        const button = this.shadowRoot.querySelector('.mode-button');
        if (!button) {
            return;
        }
        if (button.classList.contains('active')) button.classList.remove('active');
        else button.classList.add('active');
        const menu = this.shadowRoot.querySelector('ul.extended-menu');
        const menuStart = this.shadowRoot.querySelector('.mode-button');
        if (menu === null || menuStart === null) {
            return;
        }

        menu.classList.toggle('hidden');

        if (!menu.classList.contains('hidden')) {
            // add event listener for clicking outside of menu
            document.addEventListener('click', this.boundCloseAdditionalMenuHandler);
            this.initateOpenAdditionalMenu = true;
        } else {
            document.removeEventListener('click', this.boundCloseAdditionalMenuHandler);
        }
    }

    hideModeMenu() {
        if (this.initateOpenAdditionalMenu) {
            this.initateOpenAdditionalMenu = false;
            return;
        }

        const menu = this.shadowRoot.querySelector('ul.extended-menu');
        if (menu && !menu.classList.contains('hidden')) this.toggleModeMenu();
    }

    loadTheme(themeName) {
        const button = this.shadowRoot.querySelector('.button-' + themeName);
        const otherButtons = this.shadowRoot.querySelectorAll('.button-theme');
        const body = this.shadowRoot.host.getRootNode({composed: true}).body;

        if (button === null || otherButtons.length === 0 || body === null) {
            return;
        }

        otherButtons.forEach((button) => button.classList.remove('active'));
        button.classList.add('active');

        if (!body.classList.contains(themeName)) {
            this.themes.forEach((theme) => {
                body.classList.remove(theme.class);
            });

            body.classList.add(themeName);
        }
    }

    saveTheme(themeName) {
        //set active state
        const browserModeDark = window.matchMedia('(prefers-color-scheme: dark)');
        const browserModeLight = window.matchMedia('(prefers-color-scheme: light)');

        if (themeName === 'light-theme' && browserModeLight.matches) {
            localStorage.removeItem('prefered-color-mode');
        } else if (themeName === this.darkModeClass && browserModeDark.matches) {
            localStorage.removeItem('prefered-color-mode');
        } else {
            localStorage.setItem('prefered-color-mode', themeName);
        }
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getButtonCSS()}


            mode-button, button.button {
                border: none;
            }

            .active,
            .extended-menu li a.active dbp-icon {
                color: var(--dbp-accent);
            }

            .active {
                font-weight: bolder;
            }

            a:hover:not(.active),
            .extended-menu li a:hover:not(.active) {
                color: var(--dbp-hover-color, var(--dbp-content));
                background-color: var(--dbp-hover-background-color);
                transition: none;
            }

            a {
                padding: 0.3em;
                display: inline-block;
                text-decoration: none;
                transition: background-color 0.15s, color 0.15s;
                color: var(--dbp-content);
            }

            .extended-menu {
                list-style: none;
                border: var(--dbp-border);
                position: absolute;
                background-color: var(--dbp-background);
                z-index: 1000;
                border-radius: var(--dbp-border-radius);
            }

            .extended-menu li {
                text-align: left;
                min-width: 160px;
            }

            .extended-menu li a {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 12px 15px;
                w1idth: 100%;
                box-sizing: border-box;
                text-align: left;
                color: var(--dbp-content);
                background: none;
                display: block;
            }

            .icon {
                margin-right: 10px;
            }
            
            #theme-menu{
                position: relative;
            }
            
         
            .ul-right{
                right: 0px;
            };

        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <div id="theme-menu" class="${classMap({hidden: this.themes.length <= 1})}">
                <a
                    class="mode-button"
                    title="${i18n.t('color-mode')}"
                    @click="${() => {
                        this.toggleModeMenu();
                    }}">
                    <dbp-icon name="contrast"></dbp-icon>
                </a>
                <ul class="extended-menu hidden ${classMap({'ul-right':this.dropdownRight})}">
                    ${this.themes.map(
                        (theme) => html`
                            <li class="" id="${theme.class}">
                                <a
                                    class="button-theme button-${theme.class}"
                                    @click="${() => {
                                        this.loadTheme(theme.class);
                                        this.saveTheme(theme.class);
                                    }}"
                                    title="${theme.name}">
                                    <dbp-icon class="icon" name="${theme.icon}"></dbp-icon>
                                    ${theme.name}
                                </a>
                            </li>
                        `
                    )}
                </ul>
            </div>
        `;
    }
}
