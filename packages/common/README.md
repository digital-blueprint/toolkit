# Common Code

You can install these components via npm:

```bash
npm i @dbp-toolkit/common
```

## Icon Web Component

For valid icon names see: [LineIcons](https://lineicons.com/icons/)

```html
 <dbp-icon color="orange" name="menu-down"></dbp-icon>
```

### Exposed CSS variables

Variables like `--dbp-override-icon-<icon-name>` can be used to override the icons.

Example CSS: `html { --dbp-override-icon-cloud: url(/icons/cloud.svg); }`

