# KnowledgeBaseWebPageElementView Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/knowledge-base-web-page-element-view
```

## Usage

```html
<dbp-knowledge-base-web-page-element-view></dbp-knowledge-base-web-page-element-view>
<script type="module" src="node_modules/@dbp-toolkit/knowledge-base-web-page-element-view/dist/dbp-knowledge-base-web-page-element-view.js"></script>
```

Or directly via CDN:

```html
<dbp-knowledge-base-web-page-element-view></dbp-knowledge-base-web-page-element-view>
<script type="module" src="https://unpkg.com/@dbp-toolkit/knowledge-base-web-page-element-view@0.2.2/dist/dbp-knowledge-base-web-page-element-view.js"></script>
```

## Attributes

- `value`: path to the web page element
    - example `<dbp-knowledge-base-web-page-element-view value="path/to/my/article"></dbp-knowledge-base-web-page-element-view>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-knowledge-base-web-page-element-view lang="de"></dbp-knowledge-base-web-page-element-view>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-knowledge-base-web-page-element-view entry-point-url="http://127.0.0.1:8000"></dbp-knowledge-base-web-page-element-view>`
- `text` (optional): text to click to show the information loaded from the webpage
    - example `<dbp-knowledge-base-web-page-element-view text="Click me to show more information"></dbp-knowledge-base-web-page-element-view>`
- `auth` object: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/knowledge-base-web-page-element-view

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
