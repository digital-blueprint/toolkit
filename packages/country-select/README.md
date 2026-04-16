## Person Select Web Component

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

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-country-select lang="de"></dbp-country-select>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-country-select entry-point-url="http://127.0.0.1:8000"></dbp-country-select>`
- `value` (optional): api path of country to preload the selector with
    - example `<dbp-country-select value="/base/people/testuser"></dbp-country-select>`
    - the `value` will also be set automatically when a country is chosen in the selector
- `data-object` (read-only): when a country is selected the country object will be set as json string
    - example `<dbp-country-select data-object="{"@id":"/base/people/testuser", "@type":"http://schema.org/Person", "identifier":"testuser", "givenName":"Hans", "familyName":"Tester", "honorificSuffix":"Ing.", "telephone":"+43 (876) 123-4567", "phoneExtension":"4567", "email":"hans.tester@email.com", "name":"Hans Tester"}"></dbp-country-select>`
- `show-reload-button` (optional): if set a reload button will be viewed next to the select box
    - the button triggers a `change` event on the web component
    - the button is disabled if no country is selected
    - example `<dbp-country-select show-reload-button></dbp-country-select>`
- `reload-button-title` (optional): sets a title text on the reload button
    - example `<dbp-country-select show-reload-button reload-button-text="Reload result list"></dbp-country-select>`
- `auth` object: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider
- `disabled` (optional): if set the component will be disabled

### Properties

- `countries` - an array that stores the list of countries in the current language.

### Override Properties

- `buildUrlData` - A function which gets passed the select and the current search context and
  should return the query parameters used for searching.

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
