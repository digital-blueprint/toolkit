# Auth Web Components

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/Auth)

## Keycloak Component

### Usage

```html
<vpu-auth-keycloak url="https://auth.tugraz.at/auth" realm="tugraz" client-id="some-id"></vpu-auth-keycloak>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-auth-keycloak lang="de" </vpu-auth-keycloak>`
- `load-person` (optional, default: off): if enabled the logged in user will also be loaded as `Person`
   in the `window.VPUPerson` variable
    - example `<vpu-auth-keycloak load-person></vpu-auth-keycloak>`
- `force-login` (optional, default: off): if enabled a login will be forced, there never will be a login button
    - example `<vpu-auth-keycloak force-login></vpu-auth-keycloak>`
- `try-login` (optional, default: off): if enabled the a login will happen if the user is already logged in
  and finishing the login process would not result in a page location change (reload/redirect).
    - example `<vpu-auth-keycloak try-login></vpu-auth-keycloak>`

### Keycloak Specific Attributes

- `url` (required): The base URL of the Keycloak server
- `realm` (required): The Keycloak realm
- `client-id` (required): The Keycloak client to use
- `silent-check-sso-redirect-uri` (optional): URI or path to a separate page for checking the login session in an iframe, see https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
- `scope` (optional): Space separated list of scopes to request. These scopes get added in addition to the default ones, assuming the scope is in the optional scopes list of the Keycloak client in use.

### Events to listen to

- `vpu-auth-init`: Keycloak init event - happens once
- `vpu-auth-person-init`: Keycloak person init event - the person entity was loaded from the server
- `vpu-auth-keycloak-data-update`: Keycloak data was updated - happens for example every time after a token refresh

## Login Button

### Usage

```html
<vpu-login-button></vpu-login-button>
```

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/Auth.git
cd Auth
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
