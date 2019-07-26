## VPU Auth Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/Auth)

## Usage

```html
<vpu-auth client-id="my-client-id"></vpu-auth>
```

## Attributes

- `client-id` (mandatory): set the client id that you have setup on your Keycloak server
    - example `<vpu-auth client-id="my-client-id"></vpu-auth>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-auth lang="de" client-id="my-client-id"></vpu-auth>`
- `load-person` (optional, default: off): if enabled the logged in user will also be loaded as `Person`
   in the `window.VPUPerson` variable
    - example `<vpu-auth client-id="my-client-id" load-person></vpu-auth>`
- `force-login` (optional, default: off): if enabled a login will be forced, there never will be a login button
    - example `<vpu-auth client-id="my-client-id" force-login></vpu-auth>`

## Events to listen to

- `vpu-auth-init`: Keycloak init event - happens once
- `vpu-auth-person-init`: Keycloak person init event - the person entity was loaded from the server
- `vpu-auth-keycloak-data-update`: Keycloak data was updated - happens for example every time after a token refresh

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/Auth.git
cd Auth
git submodule update --init

# we are creating the symbolic links to our git sub-modules
# (there was no proper script to do this automatically before a "node install"
npm run setup

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
