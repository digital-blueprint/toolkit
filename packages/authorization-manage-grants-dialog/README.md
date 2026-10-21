## Authorization manage grants dialog web component

[GitHub](https://github.com/digital-blueprint/toolkit/tree/main/packages/authorization-manage-grants-dialog) |
[NPM](https://www.npmjs.com/package/@dbp-toolkit/authorization-manage-grants-dialog)

This package provides a dialog component for managing authorization grants.

You can install this component via npm:

```bash
npm i @dbp-toolkit/authorization-manage-grants-dialog
```

### Usage

```html
<dbp-authorization-manage-grants-dialog></dbp-authorization-manage-grants-dialog>
<script
    type="module"
    src="node_modules/@dbp-toolkit/authorization-manage-grants-dialog/dist/dbp-authorization-manage-grants-dialog.js"></script>
```

### Attributes

- `lang` (optional, default: `de`): Language setting (`de` or `en`)
- `modal-title` (optional): Custom dialog title
- `entry-point-url` (optional): API entry point URL

### Methods

- `open()`: Opens the dialog.
- `close()`: Closes the dialog.

### Local development

```bash
cd packages/authorization-manage-grants-dialog
npm install
npm run watch
```

Jump to <http://localhost:8002> to view the demo page.
