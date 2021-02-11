# Language Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/language-select
```

## Usage

```html
<dbp-language-select></dbp-language-select>
<script type="module" src="node_modules/@dbp-toolkit/language-select/dist/dbp-language-select.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English (note that it will be shown the
  other way around to make it easier to switch to a different language)
    - example `<dbp-language-select lang="de"></dbp-language-select>`

### Emitted attributes

The component emits `dbp-set-property` events for these attributes:

- `lang` to propagate a language change (possible values `en`, `de`)

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
