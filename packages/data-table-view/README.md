# VPU DataTableView Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/KnowledgeBaseWebPageElementView)

# Usage

```html
<vpu-data-table-view></vpu-data-table-view>
```

# Attributes
- `value`: api request
    - example `<vpu-data-table-view value="api/request"></vpu-data-table-view>`
- `filter`: optional filter for the request (append to api url)
    - example 'Abc' will be `?search=Abc`
- `blacklisted-columns`: optional string with all column names to be excluded
    . example '@id @type' (both are hydra columns)
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-data-table-view lang="de"></vpu-data-table-view>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<vpu-data-table-view entry-point-url="http://127.0.0.1:8000"></vpu-data-table-view>`
- `paging` (optional, required to let datatable do the paging of loaded rows)
    - example `<vpu-data-table-view paging></vpu-data-table-view>`
- `searching` (optional, required if a search box is desired)
    - example `<vpu-data-table-view searching></vpu-data-table-view>`
- `wait-until-all-loaded` (optional, required if all rows must load before use)
    - example `<vpu-data-table-view wait-until-all-loaded></vpu-data-table-view>`

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
