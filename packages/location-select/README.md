# Location Select Web Component

[GitLab Repository](https://gitlab.tugraz.at/dbp/web-components/LocationSelect)

## Usage

```html
<dbp-location-select></dbp-location-select>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-location-select lang="de"></dbp-location-select>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-location-select entry-point-url="http://127.0.0.1:8000"></dbp-location-select>`
- `value` (optional): api path of location to preload the selector with
    - example `<dbp-location-select value="Besprechungsraum"></dbp-location-select>`
    - the `value` will also be set automatically when a location is chosen in the selector
- `data-object` (read-only): when a location is selected the location object will be set as json string
    - example `<dbp-location-select data-object="{"@id":"id", "@type":"http://schema.org/Place", "identifier":"id", "name":"Besprechungsraum", "maximumPhysicalAttendeeCapacity":"50"}"></dbp-location-select>`
- `show-capacity` (optional): also shows the capacity of the locations
    - example `<dbp-location-select show-capacity></dbp-location-select>`
- `show-reload-button` (optional): if set a reload button will be viewed next to the select box
    - the button triggers a `change` event on the web component
    - the button is disabled if no location is selected
    - example `<dbp-location-select show-reload-button></dbp-location-select>`
- `reload-button-title` (optional): sets a title text on the reload button
    - example `<dbp-location-select show-reload-button reload-button-text="Reload result list"></dbp-location-select>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/location-select
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# run tests
yarn test
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
