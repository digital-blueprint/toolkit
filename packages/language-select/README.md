# Language Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/language-select
```

## Usage

```html
<dbp-language-select></dbp-language-select>
<script type="module" src="node_modules/@dbp-toolkit/app-shell/dist/dbp-app-shell.js"></script>
```

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/language-select

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```
