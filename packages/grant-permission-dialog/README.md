# Form Element Web Components

[GitHub](https://github.com/digital-blueprint/toolkit/tree/main/packages/form-elements) |
[NPM](https://www.npmjs.com/package/@dbp-toolkit/form-elements)

This package offers form components to be used to create an HTML form.

You can install this component via npm:

```bash
npm i @dbp-toolkit/grant-permission-dialog
```

## Usage

```html
<dbp-grant-permission-dialog></dbp-grant-permission-dialog>
<script type="module" src="node_modules/@dbp-toolkit/grant-permission-dialogs/dist/index.js"></script>
```

Or directly via CDN:

```html
<dbp-grant-permission-dialog></dbp-grant-permission-dialog>
<script type="module" src="https://unpkg.com/@dbp-toolkit/grant-permission-dialog@0.1.0/dist/index.js"></script>
```

## Attributes


### General Attributes

- `lang` (optional, default: `de`): Language setting
    - Type: String
    - Accepts: `de` (German) or `en` (English)
    - Example: `<element lang="en"></element>`

#### Methods


## Local development

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
