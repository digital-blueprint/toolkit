# Check-in place select web component

You can install this component via npm:

```bash
npm i @dbp-toolkit/check-in-place-select
```

## Usage

```html
<dbp-check-in-place-select></dbp-check-in-place-select>
<script type="module" src="node_modules/@dbp-toolkit/check-in-place-select/dist/dbp-check-in-place-select.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-check-in-place-select lang="de"></dbp-check-in-place-select>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-check-in-place-select entry-point-url="http://127.0.0.1:8000"></dbp-check-in-place-select>`
- `value` (optional): api path of place to preload the selector with
    - example `<dbp-check-in-place-select value="Besprechungsraum"></dbp-check-in-place-select>`
    - the `value` will also be set automatically when a place is chosen in the selector
- `data-object` (read-only): when a place is selected the place object will be set as json string
    - example `<dbp-check-in-place-select data-object="{"@id":"id", "@type":"http://schema.org/Place", "identifier":"id", "name":"Besprechungsraum", "maximumPhysicalAttendeeCapacity":"50"}"></dbp-check-in-place-select>`
- `show-capacity` (optional): also shows the capacity of the places
    - example `<dbp-check-in-place-select show-capacity></dbp-check-in-place-select>`
- `show-reload-button` (optional): if set a reload button will be viewed next to the select box
    - the button triggers a `change` event on the web component
    - the button is disabled if no place is selected
    - example `<dbp-check-in-place-select show-reload-button></dbp-check-in-place-select>`
- `reload-button-title` (optional): sets a title text on the reload button
    - example `<dbp-check-in-place-select show-reload-button reload-button-text="Reload result list"></dbp-check-in-place-select>`
- `auth` object: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/check-in-place-select

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
