# Tabulator table web component

This web component allows to create a table with tabulator-tables.

## Installation

You can install these components via npm:

```bash
npm i @dbp-toolkit/tabulator-table
```

After you have installed the theme-switcher component via npm you can use this example to get a button
that opens a dialogue with multiple themes. After you have selected a theme the class of the theme is 
applied to the body of your html document. To add a style to the specific class you have to 

```html
<script type="module" src="node_modules/@dbp-toolkit/tabulator-table/dist/dbp-tabulator-table.js"></script>
```

Or you can include the JS files directly via CDN:

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/tabulator-table@0.0.1/dist/tabulator-table.js"></script>
```

## Usage

```html
<dbp-tabulator-table></dbp-tabulator-table>
```


## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-tabulator-table lang="de"></dbp-tabulator-table>`
      

## Note

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/tabulator-table

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
