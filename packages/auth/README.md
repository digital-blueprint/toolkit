## VPU Auth Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/Auth)

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
