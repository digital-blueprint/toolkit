## VPU Person Select Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/PersonSelect)

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/PersonSelect.git
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
