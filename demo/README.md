# Frontend Toolkit Demo

## Setup

```bash
yarn install
```

## Local development

```bash
yarn run watch-local
```

You can then open <http://127.0.0.1:8085/>.

## Adding demo pages

1) Add demo activity path to `input` list of `rollup.config.js`
2) Create `assets/*.metadata.json` file like `assets/file-handling.metadata.json`
3) Reference in `assets/*.metadata.json` file in the `activities` part of `assets/dbp-toolkit-demo.topic.metadata.json.ejs`
