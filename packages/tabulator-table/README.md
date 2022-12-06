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
- `identifier` (optional string, default: `table`): set the css selector id of the table element
  - example `<dbp-tabulator-table identifier="my-table-id"></dbp-tabulator-table>`
- `options` (optional object, can be set later, default: `{
  layout: "fitColumns", autoColumns: true, }`): set the options for the tabulator table
  - example `<dbp-tabulator-table otions="{'myoption': 'a'}"></dbp-tabulator-table>`
- `data` (optional array, can be set later or can be updated): set the data for the tabulator table
  - example `<dbp-tabulator-table data="[{a: 123, b: 123}, {a: 234, b: 234}]"></dbp-tabulator-table>`
- `pagination-enabled` (optional bool, default: `false`): set to true if you want a pagination shown
  - example `<dbp-tabulator-table pagination-enabled></dbp-tabulator-table>`
- `pagination-size` (optional number, default: `10`): sets the pagination size, if pagination is enabled
  - example `<dbp-tabulator-table pagination-size="20"></dbp-tabulator-table>`
- `select-all-enabled` (optional bool, default: `false`): enables a select all button in the left upper corner
  - example `<dbp-tabulator-table select-all-enabled></dbp-tabulator-table>`


## Important functions
- `setData(data)`: This function sets data of the tabulator table.
  - `data` is an array of data which should be shown in the table.

## Note
In best practice `options` is set if the dom is already rendered. 
You can set this attribute with the css selector. (e.g.: `this._('#my-table-component).options = myoptions`)

Set data only works if the options are set before.

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
