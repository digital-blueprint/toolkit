# Person Profile Web Component

## Usage

```html
<dbp-person-profile></dbp-person-profile>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-person-profile lang="de"></dbp-person-profile>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<dbp-person-profile entry-point-url="http://127.0.0.1:8000"></dbp-person-profile>`
- `value` (optional): api path of person to preload the selector with
    - example `<dbp-person-profile value="/people/testuser"></dbp-person-profile>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/person-profile
git submodule update --init

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
