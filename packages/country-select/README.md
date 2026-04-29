## Country Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/country-select
```

### Usage

```html
<dbp-country-select></dbp-country-select>
<script
    type="module"
    src="node_modules/@dbp-toolkit/country-select/dist/dbp-country-select.js"></script>
```

Or directly via CDN:

```html
<dbp-country-select></dbp-country-select>
<script
    type="module"
    src="https://unpkg.com/@dbp-toolkit/country-select@0.2.2/dist/dbp-country-select.js"></script>
```

### Attributes

- `value` (optional): ISO country code to preload the selector with
    - example `<dbp-country-select value="AT"></dbp-country-select>`
    - the `value` attribute will also be updated automatically when a country is chosen in the selector
- `disabled` (optional): if set the component will be disabled

### Properties

- The component uses a built-in country list and does not require authentication.

### Events

- `change`: fired when the selected country changes
    - `event.detail.value` contains the selected ISO country code

### Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/country-select

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002
npm run watch

# run tests
npm test

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
