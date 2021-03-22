# Organization Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/organization-select
```

## Usage

```html
<dbp-organization-select></dbp-organization-select>
<script type="module" src="node_modules/@dbp-toolkit/organization-select/dist/dbp-organization-select.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-organization-select lang="de"></dbp-organization-select>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-organization-select entry-point-url="http://127.0.0.1:8000"></dbp-organization-select>`
- `value` (optional): api path of organization to preload the selector with
    - example `<dbp-organization-select value="/people/testuser"></dbp-organization-select>`
    - the `value` will also be set automatically when an organization is chosen in the selector
- `data-object` (read-only): when an organization is selected the organization object will be set as json string
    - example `<dbp-organization-select data-object="{"@id":"/organizations/1190-F2050","@type":"http://schema.org/Organization","identifier":"1190-F2050","name":"Institut für Stahlbau","url":"https://online.tugraz.at/tug_online/wborg.display?pOrgNr=1190","alternateName":"F2050"}"></dbp-organization-select>`
- `auth` object: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/organization-select

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
