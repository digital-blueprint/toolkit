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
