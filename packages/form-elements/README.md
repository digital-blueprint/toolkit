# PdfViewer Web Component

[GitHub](https://github.com/digital-blueprint/toolkit/tree/main/packages/form-elements) |
[NPM](https://www.npmjs.com/package/@dbp-toolkit/form-elements)

This package offers form components to be used to create an HTML form.

You can install this component via npm:

```bash
npm i @dbp-toolkit/form-elements
```

## Usage

```html
<dbp-string-element></dbp-string-element>
<script type="module" src="node_modules/@dbp-toolkit/form-elements/dist/dbp-string-element.js"></script>
```

Or directly via CDN:

```html
<dbp-string-element></dbp-string-element>
<script type="module" src="https://unpkg.com/@dbp-toolkit/form-elements@0.0.1/dist/dbp-string-element.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-string-element lang="de"></dbp-string-element>`

## Methods

- `setItems()`: Set the items to be displayed in the enum element
    - example ``

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/form-elements

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
