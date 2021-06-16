# Person Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/person-select
```

## Usage

```html
<dbp-person-select></dbp-person-select>
<script type="module" src="node_modules/@dbp-toolkit/person-select/dist/dbp-person-select.js"></script>
```

Or directly via CDN:

```html
<dbp-person-select></dbp-person-select>
<script type="module" src="https://unpkg.com/@dbp-toolkit/person-select@0.2.2/dist/dbp-person-select.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-person-select lang="de"></dbp-person-select>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-person-select entry-point-url="http://127.0.0.1:8000"></dbp-person-select>`
- `value` (optional): api path of person to preload the selector with
    - example `<dbp-person-select value="/people/testuser"></dbp-person-select>`
    - the `value` will also be set automatically when a person is chosen in the selector
- `data-object` (read-only): when a person is selected the person object will be set as json string
    - example `<dbp-person-select data-object="{"@id":"/people/testuser", "@type":"http://schema.org/Person", "identifier":"testuser", "givenName":"Hans", "familyName":"Tester", "honorificSuffix":"Ing.", "telephone":"+43 (876) 123-4567", "phoneExtension":"4567", "email":"hans.tester@email.com", "name":"Hans Tester"}"></dbp-person-select>`
- `show-details` (optional): also shows the email address of the persons to distinguish people with the same name
    - the currently logged in user needs to have permissions to show the email address of people
    - example `<dbp-person-select show-details></dbp-person-select>`
- `show-reload-button` (optional): if set a reload button will be viewed next to the select box
    - the button triggers a `change` event on the web component
    - the button is disabled if no person is selected
    - example `<dbp-person-select show-reload-button></dbp-person-select>`
- `reload-button-title` (optional): sets a title text on the reload button
    - example `<dbp-person-select show-reload-button reload-button-text="Reload result list"></dbp-person-select>`
- `auth` object: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/person-select

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
