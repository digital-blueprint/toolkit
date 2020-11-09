# Person Select Web Component

## Usage

```html
<dbp-person-select></dbp-person-select>
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
- `show-birth-date` (optional): also shows the birth date of the persons to distinguish people with the same name
    - the currently logged in user needs to have permissions to show the birth date of people
    - example `<dbp-person-select show-birth-date></dbp-person-select>`
- `show-reload-button` (optional): if set a reload button will be viewed next to the select box
    - the button triggers a `change` event on the web component
    - the button is disabled if no person is selected
    - example `<dbp-person-select show-reload-button></dbp-person-select>`
- `reload-button-title` (optional): sets a title text on the reload button
    - example `<dbp-person-select show-reload-button reload-button-text="Reload result list"></dbp-person-select>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/PersonSelect.git
cd PersonSelect
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# run tests
npm test
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
