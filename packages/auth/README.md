## VPU Auth Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/Auth)

## Attributes

- `client-id` (mandatory): set the client id that you have setup on your Keycloak server
    - example `<vpu-auth client-id="my-dev-client-id"></vpu-auth>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-auth lang="de" client-id="my-dev-client-id"></vpu-auth>`
- `load-person` (optional, default: off): if enabled the logged in user will also be loaded as `Person`
   in the `window.VPUPerson` variable
    - example `<vpu-auth client-id="my-dev-client-id" load-person></vpu-auth>`
- `force-login` (optional, default: off): if enabled a login will be forced, there never will be a login button
    - example `<vpu-auth client-id="my-dev-client-id" force-login></vpu-auth>`

## Events

TODO

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

# constantly builds dist/bundle.js 
npm run watch-local

# run local webserver
cd dist; php -S localhost:8002
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
