## Grant Permission Dialog Web Component

[GitHub](https://github.com/digital-blueprint/toolkit/tree/main/packages/grant-permission-dialog) |
[NPM](https://www.npmjs.com/package/@dbp-toolkit/grant-permission-dialog)

This package offers a modal component to manage the permissions of persons, groups and dynamic groups

You can install this component via npm:

```bash
npm i @dbp-toolkit/grant-permission-dialog
```

### Usage

```html
<dbp-grant-permission-dialog></dbp-grant-permission-dialog>
<script
    type="module"
    src="node_modules/@dbp-toolkit/grant-permission-dialogs/dist/index.js"></script>
```

Or directly via CDN:

```html
<dbp-grant-permission-dialog></dbp-grant-permission-dialog>
<script
    type="module"
    src="https://unpkg.com/@dbp-toolkit/grant-permission-dialog@0.1.0/dist/index.js"></script>
```

### Attributes

- `lang` (optional, default: `de`): Language setting
    - Type: String
    - Accepts: `de` (German) or `en` (English)
    - Example: `<element lang="en"></element>`
- `resource-class-identifier` class of resource to manage
    - example `<dbp-grant-permission-dialog resource-class-identifier="DbpRelayFormalizeForm"></dbp-grant-permission-dialog>`
- `resource-identifier` identifier of the resource to manage
    - example `<dbp-grant-permission-dialog resource-identifier="f0b3521b-c5b2-4e27-b6bc-bc3d085f1cf2"></dbp-grant-permission-dialog>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<grant-permission-dialog entry-point-url="http://127.0.0.1:8000"></grant-permission-dialog>`

### Properties

- `resourceIdentifiers` (optional): identifiers of multiple resources to manage at once, overrides `resource-identifier`
    - example `dialog.resourceIdentifiers = ['form-1', 'form-2'];`
- `dynamicGroupLabels` (optional): display names for dynamic groups, either as a string or per language
    - example `dialog.dynamicGroupLabels = {staff: {en: 'Staff', de: 'Bedienstete'}};`
    - dynamic groups without a label are shown with a readable version of their identifier

### Grant holders

Permissions can be granted to

- persons (searched via `/base/people`)
- groups (searched via `/authorization/groups`), all members of the group receive the permissions
- dynamic groups (listed via `/authorization/dynamic-groups`), membership is determined by the API

At least one person has to keep the `manage` permission of a resource. If a resource is only managed by
groups, the last of them can't be removed. Inherited grants, system rules and grants the current user isn't
allowed to remove are shown as read only.

##### Methods

- `open()`: Opens the modal.
    - example `this._('#grant-permission-dialog').open();`

### Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/grant-permission-dialog

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002
npm run watch

# run tests
npm test

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a demo page.
