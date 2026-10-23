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
<dbp-authorization-manage-grants-dialog
    lang="en"
    modal-title="Manage grants"
    entry-point-url="https://api.example.com"></dbp-authorization-manage-grants-dialog>
<script
    type="module"
    src="node_modules/@dbp-toolkit/authorization-manage-grants-dialog/dist/dbp-authorization-manage-grants-dialog.js"></script>
```

### Selectable resource types

The dialog searches and merges the following authorization subjects into one selector:

| Resource type      | API collection                       | Display format                    |
| ------------------ | ------------------------------------ | --------------------------------- |
| Person             | `/base/people`                       | `Given name Family name [Person]` |
| User group         | `/authorization/user-groups`         | `Group name [User group]`         |
| Dynamic user group | `/authorization/dynamic-user-groups` | `identifier [Dynamic user group]` |

### Grant holders

A grant posted to `/authorization/resource-action-grants` identifies its holder by exactly one
of three fields, depending on the subject type. `getGrantHolder()` builds them:

| Resource type      | Grant holder field           | Example value                              |
| ------------------ | ---------------------------- | ------------------------------------------ |
| Person             | `userIdentifier`             | `1234567890ABCDEF`                         |
| User group         | `userGroup`                  | `/authorization/user-groups/01900000-0000` |
| Dynamic user group | `dynamicUserGroupIdentifier` | `everybody`                                |

Dynamic user groups have no item endpoint, so the API gives them a blank node ID
(`/.well-known/genid/…`) that changes with every request. The component replaces it with a
stable `dynamic-user-group:<identifier>` value, which is also what a selection has to be set
to from the outside.

### Attributes

- `lang` (optional, default: `de`): Language setting (`de` or `en`)
- `modal-title` (optional): Custom dialog title
- `entry-point-url` (optional): API entry point URL

### Methods

- `open()`: Opens the dialog.
- `close()`: Closes the dialog.

The subject select (`dbp-authorization-subject-select`) additionally provides:

- `getGrantHolder(resource)`: Returns the grant holder fields of a selected subject, or `null`
  for an unsupported one.

### Local development

```bash
cd packages/authorization-manage-grants-dialog
npm install
npm run watch
```

Jump to <http://localhost:8002> to view the demo page.
