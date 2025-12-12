## Icon Web Component

The toolkit icons can be seen in ./toolkit/packages/common/assets.

For valid icon names see: [LineIcons](https://lineicons.com/icons/)

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/common@0.2.8/dist/components.js"></script>
<dbp-icon style="color: red" name="menu-down"></dbp-icon>
```

### Exposed CSS variables

Variables like `--dbp-override-icon-<icon-name>` can be used to override the icons.

Example CSS:

```css
html {
    --dbp-override-icon-cloud: url(/icons/cloud.svg);
}
```
