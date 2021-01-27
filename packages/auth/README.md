# Auth Web Components

You can install the components via npm:

```bash
npm i @dbp-toolkit/auth
```

## Keycloak Component

### Usage

```html
<dbp-auth-keycloak url="https://auth.tugraz.at/auth" realm="tugraz" client-id="some-id"></dbp-auth-keycloak>
<script type="module" src="node_modules/@dbp-toolkit/auth/dist/dbp-auth.js"></script>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-auth-keycloak lang="de" </dbp-auth-keycloak>`
- `load-person` (optional, default: off): if enabled the logged in user will also be loaded as `Person`
   in the `window.DBPPerson` variable
    - example `<dbp-auth-keycloak load-person></dbp-auth-keycloak>`
- `force-login` (optional, default: off): if enabled a login will be forced, there never will be a login button
    - example `<dbp-auth-keycloak force-login></dbp-auth-keycloak>`
- `try-login` (optional, default: off): if enabled the a login will happen if the user is already logged in
  and finishing the login process would not result in a page location change (reload/redirect).
    - example `<dbp-auth-keycloak try-login></dbp-auth-keycloak>`

### Keycloak Specific Attributes

- `url` (required): The base URL of the Keycloak server
- `realm` (required): The Keycloak realm
- `client-id` (required): The Keycloak client to use
- `silent-check-sso-redirect-uri` (optional): URI or path to a separate page for checking the login session in an iframe, see https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
- `scope` (optional): Space separated list of scopes to request. These scopes get added in addition to the default ones, assuming the scope is in the optional scopes list of the Keycloak client in use.

## Login Button

### Usage

```html
<dbp-login-button></dbp-login-button>
<script type="module" src="node_modules/@dbp-toolkit/auth/dist/dbp-auth.js"></script>
```

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/auth

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
