# Tabulator table web component

This web component allows to create a table with tabulator-tables.

## Installation

You can install these components via npm:

```bash
npm i @dbp-toolkit/tabulator-table
```

After you have installed the tabulator-table component via npm you can use this example to create interactive, sortable tables. This component is a wrapper around [tabulator](https://github.com/olifolkerd/tabulator).

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
  - example `<dbp-tabulator-table options="{'myoption': 'a'}"></dbp-tabulator-table>`
  - you can set a tabulator to automatically generate its own columns by setting the option `autoColumns: true`
    and you can edit automatically generated columns by using the function ``autoColumnsDefinitions:[
    {field:"<field-name>", <property>: value},
    ...
    ],``
- `data` (optional array, can be set later or can be updated): set the data for the tabulator table
  - example `<dbp-tabulator-table data="[{a: 123, b: 123}, {a: 234, b: 234}]"></dbp-tabulator-table>`
- `pagination-enabled` (optional bool, default: `false`): set to true if you want a pagination shown
  - example `<dbp-tabulator-table pagination-enabled></dbp-tabulator-table>`
- `pagination-size` (optional number, default: `10`): sets the pagination size, if pagination is enabled
  - example `<dbp-tabulator-table pagination-size="20"></dbp-tabulator-table>`
- `select-all-enabled` (optional bool, default: `false`): enables a select all button in the left upper corner
  - example `<dbp-tabulator-table select-all-enabled></dbp-tabulator-table>`
- `select-rows-enabled` (optional bool, default: `false`): allows the user to select rows by clicking on them
  - example `<dbp-tabulator-table select-rows-enabled></dbp-tabulator-table>`
- `collapse-enabled` (optional bool, default: `false`): add columns that do not fit into the table into a hidden list of column titles and values
  - example `<dbp-tabulator-table collapse-enabled></dbp-tabulator-table>`
  - hint: If you want to set one or more columns into a list of titles and values, you need to set said columns to a responsive value bigger 
  than 0 (e.g. `responsive:3`) and to set the columns' width so that they will not all fit into the tabulator
  
  

## Important functions
- `setData(data)`: This function sets data of the tabulator table.
  - `data` is an array of data which should be shown in the table.
- `getRows()`: returns an array with all the rows of the table.
- `getSelectedRows()`: returns an array with all the selected rows of the table.
- `updateRow(row, newData)`: updates a given row of the tabulator table with new data.
  -`row` represents the row object we want to update.
  -`newData` represents the new data we want to update. it has to be an object `{'column': 'value', ...}` 
- `deleteRow(row)`: This function deletes the given row from the specified tabulator table.
  -`row` represents the id of the row we want to delete.
- `deleteSelectedRows()`: This function deletes the selected rows (by clicking) of the tabulator.
- `setFilter(listOfFilters)`: This function filters the tabulator table according to the given list of filters.
- `removeFilter()`: This function removes the filters set on the tabulator.
- `expandAll()`: This function expands all the collapsed columns inside hidden lists of the tabulator table
- `collapseAll()`: This function collapses all the expanded columns inside hidden lists of the tabulator table

## Note
In best practice `options` is set if the dom is already rendered. 
You can set this attribute with the css selector. (e.g.: `this._('#my-table-component).options = myoptions`)

Set data only works if the options are set before.

## Requirements
`dbp-tabulator-table` needs the `tabulator-tables/css/tabulator.min.css` in the package path and
the icons in `@dbp-toolkit/common/icons/` imported.

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/tabulator-table

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a demo page.
