# Common Code

You can install these components via npm:

```bash
npm i @dbp-toolkit/common
```

## Icon Web Component

For valid icon names see: [LineIcons](https://lineicons.com/icons/)

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/common@0.2.8/dist/components.js"></script>
<dbp-icon style="color: red" name="menu-down"></dbp-icon>
```

### Exposed CSS variables

Variables like `--dbp-override-icon-<icon-name>` can be used to override the icons.

Example CSS: `html { --dbp-override-icon-cloud: url(/icons/cloud.svg); }`

## Translated Web Component

You can use this web component to show translated html.

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/common@0.2.8/dist/components.js"></script>
<dbp-translated subscribe="lang">
    <div slot="de">
        Dieser Text ist Deutsch und wird Englisch werden wenn man die Sprache auf Englisch stellt.
    </div>
    <div slot="en">
        This text is English and will be German if the language is changed to German.
    </div>
</dbp-translated>
```

The English or German text will be shown according to the `lang` attribute.

## Translation Web Component and translation overrides

You can use the `dbp-translation` web component to translate text using i18next.
The English or German text will be shown according to the subscribed `lang` attribute.
Additionally, this component subscribes the `lang-dir` attribute to retrieve the directory where the i18n translation files are located.
If the component does not subscribe to `lang-dir`, the default translations are used!
To get the translation of the key `test`, the component can be used like this:
```html
<dbp-translation subscribe="lang, lang-dir" key="test"></dbp-translation>
```
The i18next translation files are namespaced with the tag name of the component which requests translations. In this case the tag name is `dbp-translation`.
Thus, the translation files for english and german will look like this:
```json
{
  "dbp-translation": {
    "test": "Hallo"
  }
}
```
```json
{
  "dbp-translation": {
    "test": "Hello"
  }
}
```
Furthermore, the component allows interpolation and unsafe translations. Thus, HTML can be injected, if the unsafe attribute is set. **Therefore, this feature has to be used with caution!**

To use the component to display a link, interpolation and unsafe can be used like this:
```html
<dbp-translation subscribe="lang, lang-dir" key="link" var='{"linkDE": "https://www.tugraz.at/home/", "linkEN": "https://www.tugraz.at/en/home/"}' unsafe></dbp-translation>
```
Where the translation files for english and german will look like this:
```json
{
  "dbp-translation": {
    "test": "Hallo",
    "link": "Hier ist ein klickbarer <a class=\"link\" href=\"{{- linkDE}}\">Link</a>"
  }
}
```
```json
{
  "dbp-translation": {
    "test": "Hello",
    "link": "Here is a clickable <a class=\"link\" href=\"{{- linkEN}}\">link</a>"
  }
}
```
Moreover, already exisiting translations using i18next can be overriden by the same engine.
To do this, the tag name of the component where the translations should be overridden is used in the translation.json file.
To override the `dbp-theme-switcher` component, add the tag name and the keys that should be overriden to the translation files.
Namespaces can also be overriden. They have to be added to the tag of the component using them.
Furthermore, the default translations can still be used, however they are in a different i18n namespace.
The default namespace is called `translation` and the override namespace is called `--translation-override`. The override namespace is set as default, when overrides are set.
To use translations from another namespace, the namespace has to be defined by using the name of the namespace as a prefix to the key, joined with a colon in between (`ns:key`).
Therefore, two `dbp-theme-switcher` components, one with overrides and one without, can be displayed using the following code:
```html
<dbp-theme-switcher subscribe="lang, lang-dir"
    themes='[{"class": "light-theme", "icon": "sun", "name": "${this._i18n.t('dbp.themes.light-mode')}"}, {"class": "dark-theme", "icon": "night", "name": "${this._i18n.t('dbp.themes.dark-mode')}"}]'></dbp-theme-switcher>
<dbp-theme-switcher subscribe="lang"
    themes='[{"class": "light-theme", "icon": "sun", "name": "${this._i18n.t('translation:dbp.themes.light-mode')}"}, {"class": "dark-theme", "icon": "night", "name": "${this._i18n.t('translation:dbp.themes.dark-mode')}"}]'></dbp-theme-switcher>
```
with the following translation files:
```json
{
  "dbp-translation": {
    "test": "Hallo",
    "link": "Hier ist ein klickbarer <a class=\"link\" href=\"{{- linkDE}}\">Link</a>"
  },
  "dbp-theme-switcher": {
    "color-mode": "Theme ändern"
  },
  "dbp-common-demo": {
    "themes": {
      "dark-mode": "Neuer dunkler Modus",
      "light-mode": "Neuer heller Modus"
    }
  }
}
```
```json
{
  "dbp-translation": {
    "test": "Hello",
    "link": "Here is a clickable <a class=\"link\" href=\"{{- linkEN}}\">link</a>"
  },
  "dbp-theme-switcher": {
    "color-mode": "Change theme"
  },
  "dbp-common-demo": {
    "themes": {
      "dark-mode": "New dark mode",
      "light-mode": "New light mode"
    }
  }
}
```

The resulting translations example can be seen in the section Translation Demo further down the page.

## Overriding slots in nested web components

If slots are used in web components then it is best to derive your component class from
[DBPLitElement](https://gitlab.tugraz.at/dbp/web-components/toolkit/-/blob/master/packages/common/dbp-lit-element.js)
and subscribe to the attribute `html-overrides` everywhere you use it with `subscribe="html-overrides"`.

This way integrators who are using topics or activities are able to globally override these slots
in their root html.

Example of the part of an `index.html` file for overriding the `auth-info` text in all Nextcloud
file pickers of the signature topic:

```html
<dbp-signature html-overrides="global-override"></dbp-signature>

<template id="global-override">
    <template id="dbp-nextcloud-file-picker">
        <div slot="auth-info">
            <dbp-translated subscribe="lang">
                <div slot="de">
                    Deutscher Text mit <a href="#ein-link">einem Link</a>
                </div>
                <div slot="en">
                    English text with <a href="#a-link">a link</a>
                </div>
            </dbp-translated>
        </div>
    </template>
</template>
```

By using `html-overrides="global-override"` in the topic `dbp-signature` you are able to define
a template with `id="global-override"` that can hold one or more other templates for different components.

In our case we have a template `id="dbp-nextcloud-file-picker"`, because we want to override slots
in the component `dbp-nextcloud-file-picker` inside the signature topic.

You can define one or more slots in that template that should be overridden.

In our example we only want to override the slot `auth-info`, that holds additional text to add in
the Nextcloud file picker component.

We are using the `dbp-translated` component to insert translated text at the specified position
in the Nextcloud file picker.
