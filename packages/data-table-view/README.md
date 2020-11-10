# DataTableView Web Component

# Usage

```html
<dbp-data-table-view></dbp-data-table-view>
```

# Attributes
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-data-table-view lang="de"></dbp-data-table-view>`
- `paging` (optional, required to let datatable do the paging of loaded rows)
    - example `<dbp-data-table-view paging></dbp-data-table-view>`
- `searching` (optional, required if a search box is desired)
    - example `<dbp-data-table-view searching></dbp-data-table-view>`
- `exportable` (optional): set to display export buttons
    - example `<dbp-data-table-view exportable></pu-data-table-view>`
- `export-name` (optional, default: 'Data Export'): add name for download file (without extension)
    - example `<dbp-data-table-view exportable export-name="All Items"></pu-data-table-view>`
- `column-searching` (optional, default: false): add search fields for every column
    - example `<dbp-data-table-view column-searching></pu-data-table-view>`
- `default-order` (optional, default: [ ]): set the default order as column and direction
    - example `<dbp-data-table-view default-order='[1,"asc"]'></pu-data-table-view>` 
    - example `<dbp-data-table-view default-order='[[0,"desc"],[2,"asc"]]'></pu-data-table-view>` 

# Local development
```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/data-table-view

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8003> and you should get a demo page.
