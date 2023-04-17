# Auth Web Components

You can install the components via npm:

```bash
npm i @dbp-toolkit/auth
```

## Keycloak Component

### Usage

```html
<dbp-auth-keycloak url="https://auth.tugraz.at/auth" realm="tugraz-vpu" client-id="some-id"></dbp-auth-keycloak>
<script type="module" src="node_modules/@dbp-toolkit/auth/dist/dbp-auth.js"></script>
```

Or directly via CDN:

```html
<dbp-auth-keycloak url="https://auth.tugraz.at/auth" realm="tugraz-vpu" client-id="some-id"></dbp-auth-keycloak>
<script type="module" src="https://unpkg.com/@dbp-toolkit/auth@0.2.2/dist/dbp-auth.js"></script>
```

You need Keycloak to be in place to make use of the auth component.
Best take a look on examples like [index.html](https://gitlab.tugraz.at/dbp/esign/signature/-/blob/main/examples/dbp-signature/index.html)
for more explanation.

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-auth-keycloak lang="de" </dbp-auth-keycloak>`
- `force-login` (optional, default: off): if enabled a login will be forced, there never will be a login button
    - example `<dbp-auth-keycloak force-login></dbp-auth-keycloak>`
- `try-login` (optional, default: off): if enabled the a login will happen if the user is already logged in
  and finishing the login process would not result in a page location change (reload/redirect).
    - example `<dbp-auth-keycloak try-login></dbp-auth-keycloak>`
- `requested-login-status` (optional, default: `unknown`): can be set to `logged-in` or `logged-out` to request a login or logout
    - example `<dbp-auth-keycloak requested-login-status="logged-in"></dbp-auth-keycloak>`
    - note: most often this should be an attribute that is not set directly, but subscribed at a provider

### Keycloak Specific Attributes

- `url` (required): The base URL of the Keycloak server
- `realm` (required): The Keycloak realm
- `client-id` (required): The Keycloak client to use
- `silent-check-sso-redirect-uri` (optional): URI or path to a separate page for checking the login session in an iframe, see https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
- `scope` (optional): Space separated list of scopes to request. These scopes get added in addition to the default ones, assuming the scope is in the optional scopes list of the Keycloak client in use.
- `idp-hint` (optional): Set a client suggested identity provider

### Emitted attributes

The component emits a `dbp-set-property` event for the attribute `auth`:

- `auth.subject`: Keycloak username
- `auth.login-status`: Login status (`unknown`, `logging-in`, `logging-out`, `logged-in`, `logged-out`)
- `auth.token`: Keycloak token to send with your requests
- `auth.user-full-name`: Full name of the user
- `auth.user-id`: Identifier of the user


## Login Button

### Usage

```html
<dbp-login-button></dbp-login-button>
<script type="module" src="node_modules/@dbp-toolkit/auth/dist/dbp-auth.js"></script>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
  - example `<dbp-auth-keycloak lang="de" </dbp-auth-keycloak>`
- `auth` object: you need to set that object property for the auth token
  - example auth property: `{token: "THE_BEARER_TOKEN"}`
  - note: most often this should be an attribute that is not set directly, but subscribed at a provider

### Emitted attributes

The component emits a `dbp-set-property` event for the attribute `requested-login-status` (possible values `logged-in`, `logged-out`).

## Alternative to &lt;dbp-auth&gt;

If embedded in an external page (without `<dbp-provider>`) components can also work together with a different source for the auth token:

```html
<dbp-person-select id="ps-1"></dbp-person-select>
<script>
  function onAuthHasChanged(auth) {
      /* fully featured auth object */
    const ps = document.getElementById('ps-1');
    ps.setProperty('auth', auth);
  }
  /* or */
  function onTokenHasChanged(token) {
      /* only token available */
    const auth = { token: token };
    onAuthHasChanged(auth);
  }
</script>
```

Note: Some components need information about the logged-in person too!

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/auth

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
