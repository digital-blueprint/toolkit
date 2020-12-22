# Frontend Toolkit Showcase

## Setup

```bash
yarn install
```

## Local development

```bash
yarn run watch-local
```

You can then open <http://127.0.0.1:8001/>.

## Adding demo pages

1) Add demo activity path to `input` list of `rollup.config.js`
2) Create `assets/*.metadata.json` file like `assets/file-handling.metadata.json`
3) Reference in `assets/*.metadata.json` file in the `activities` part of `assets/dbp-toolkit-demo.topic.metadata.json.ejs`

## Importing demo activities
- imported demo activity has to be a `export class`
- Add the line`import readme from 'path-to-activity/README.md';`
    - example: `import readme from '@dbp-toolkit/person-select/README.md';`
- Add the line `import {ExportclassName} from 'path-to-activity/src/activity-name';`
    - example: `import {PersonSelectDemo} from '@dbp-toolkit/person-select/src/dbp-person-select-demo';`
- Add the class to scopedElements
    - example ` static get scopedElements() {
                       return {
                         'dbp-person-select-demo': PersonSelectDemo,
                       };
                   }'`