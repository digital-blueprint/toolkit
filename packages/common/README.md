## Common Code

You can install these components via npm:

```bash
npm i @dbp-toolkit/common
```

### How to add a Webcomponent

First you need to import the class of the element you want to add, for example Button.

```js
Import {Button} from '@dbp-toolkit/common';
```

Then add the new element to scopedElements and give it a name

```js
static get scopedElements() { return { ... 'dbp-button': Button, ... } }
```

Finally, add it to the render() function inside return html.

```html
<dbp-button>...</dbp-button>
```

### Translated Web Component

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

### Overriding slots in nested web components

If slots are used in web components then it is best to derive your component class from
[DBPLitElement](https://github.com/digital-blueprint/toolkit/-/blob/main/packages/common/dbp-lit-element.js)
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
                    Deutscher Text mit
                    <a href="#ein-link">einem Link</a>
                </div>
                <div slot="en">
                    English text with
                    <a href="#a-link">a link</a>
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

#### CSS Rules

The css rules are added to the styles() function in the json file corresponding to a particular activity.

```js
static get styles() {
        return [
            commonStyles.getThemeCSS(),
            css`
                .hidden { display: none; }
                button-style { --dbp-override-secondary-surface: #3793A5; }
            `
        ];
    }
```

### Icon Web Component

See [README.icon.md](./README.icon.md)

### Select Web Component

See [README.input.md](./README.input.md)

### Modal Web Component

See [README.modal.md](./README.modal.md)
