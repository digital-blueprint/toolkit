# PdfViewer Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/pdf-viewer
```

## Usage

```html
<dbp-pdf-viewer></dbp-pdf-viewer>
<script type="module" src="node_modules/@dbp-toolkit/pdf-viewer/dist/dbp-pdf-viewer.js"></script>
```

Or directly via CDN:

```html
<dbp-pdf-viewer></dbp-pdf-viewer>
<script type="module" src="https://unpkg.com/@dbp-toolkit/pdf-viewer@0.2.2/dist/dbp-pdf-viewer.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-pdf-viewer lang="de" client-id="my-client-id"></dbp-pdf-viewer>`

## Sending pdfViewers 

```javascript
import { send } from './pdf-viewer';

send({
    "summary": "Item deleted",
    "body": "Item foo was deleted!",
    "type": "info",
    "timeout": 5,
});
``` 

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/pdf-viewer

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
