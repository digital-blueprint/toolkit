# Provider Web Component

[GitLab Repository](git@gitlab.tugraz.at:dbp/web-components/toolkit.git)

## Usage

```html
<provider></provider>
```

## Attributes

- `init` (optional): set your vars to values
    - example `<provider init="foo=bar"></provider>`
- `id` (optional): set an id, useful for debugging
    - example `<provider id="p-1"></provider>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/provider

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test
```

Jump to <http://localhost:8002> and you should get a demo page.