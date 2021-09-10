# Tooltip Web Component

The tooltip component provides an icon as an anker for a tooltip.
There is a generic tooltip `<dbp-tooltip>` which supports any icon the app has bundled.
Another info tooltip `<dbp-info-tooltip>` shows an embedded info icon (small letter i inside a circle) as a convenient
shortcut. 

## Install
You can install this component via npm:

```bash
npm i @dbp-toolkit/tooltip
```

## Usage

```html
<dbp-tooltip text-content="text to show" icon-name="information"></dbp-tooltip>
<dbp-info-tooltip text-content="text to show"></dbp-info-tooltip>
<script type="module" src="node_modules/@dbp-toolkit/tooltip/dist/dbp-tooltip.js"></script>
```

Or directly via CDN:

```html
<dbp-tooltip text-content="text to show" icon-name="information"></dbp-tooltip>
<dbp-info-tooltip text-content="text to show"></dbp-info-tooltip>
<script type="module" src="https://unpkg.com/@dbp-toolkit/tooltip@0.0.1/dist/dbp-tooltip.js"></script>
```

## Attributes

- `text-content`: Text to show as tooltip (default is 'text missing.' as a reminder!)
- `icon-name`: (`<dbp-tooltip>` only, default is a skull) Name of the bundled icon (SVG) for `<dbp-icon>` 
