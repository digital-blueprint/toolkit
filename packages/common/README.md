# Common Code

You can install these components via npm:

```bash
npm i @dbp-toolkit/common
```

## How to add a Webcomponent

First you need to import the class of the element you want to add, for example Button.

```html
Import {Button} from '@dbp-toolkit/common';
```

Then add the new element to scopedElements and give it a name
```html
static get scopedElements() {
    return {
        ...
        'dbp-button': Button,
        ...
    }
}
```

Finally, add it to the render() function inside return html.
```html
<dbp-button>...</dbp-button>
```

## Icon Web Component

The toolkit icons can be seen in ./toolkit/packages/common/assets.

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

## Modal Web Component

You can use this web component to show content in a modal. 
This webcomponent has two function which can be called from outside: `open()` - which opens the modal and `close()` 
- which closes the modal. 

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

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-modal lang="de"></dbp-modal>`
- `modal-id`(default: `modal-id`, should unique): this is the modal css selector id
    - example `<dbp-modal modal-id="my-modal-123"></dbp-modal>`
- `title` (optional): sets the modal title
    - example `<dbp-modal title="This is my modal"></dbp-modal>`
- `width`, `height`, `min-width`, `min-height` (optional): set the size of a modal
    - example `<dbp-modal width="15px" height="100%"></dbp-modal>`

### Callable functions

- `open()` opens a specific modal
  - `this._('#my-modal-webcomponent-id').open();`
- `close()` closes a specific modal
  - `this._('#my-modal-webcomponent-id').close();`

### Events

- `dbp-modal-closed` a event which is triggered if the modal is closed. in the detail attribute there is the modal-id of the closed modal.
  - `<dbp-modal @dbp-modal-closed="${(event) => {
    this.doSomething(event);
    }}"></dbp-modal>`

## Overriding slots in nested web components

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

### CSS Attributes

The css attributes are added to the styles() function in the json file corresponding to a particular activity.

```html
static get styles() {
        return [
            commonStyles.getThemeCSS(),
            css`
                .hidden {
                    display: none;
                }
                .button-style {
                    --dbp-override-secondary-surface: #3793A5;
                }

            `,
        ];
    }
```