# VPU DataTableView Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/KnowledgeBaseWebPageElementView)

# Usage

```html
<vpu-data-table-view></vpu-data-table-view>
```

# Attributes
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-data-table-view lang="de"></vpu-data-table-view>`
- `paging` (optional, required to let datatable do the paging of loaded rows)
    - example `<vpu-data-table-view paging></vpu-data-table-view>`
- `searching` (optional, required if a search box is desired)
    - example `<vpu-data-table-view searching></vpu-data-table-view>`
- `exportable` (optional): set to display export buttons
    - example `<vpu-data-table-view exportable></pu-data-table-view>`
- `export-name` (optional, default: 'Data Export'): add name for download file (without extension)
    - example `<vpu-data-table-view exportable export-name="All Items"></pu-data-table-view>`

# Local development
```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/DataTableView.git
cd DataTableView
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8003
npm run watch-local
```

Jump to <http://localhost:8003> and you should get a demo page.
