# KnowledgeBaseWebPageElementView Web Component

## Usage

```html
<dbp-knowledge-base-web-page-element-view></dbp-knowledge-base-web-page-element-view>
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

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/knowledge-base-web-page-element-view
git submodule update --init

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
