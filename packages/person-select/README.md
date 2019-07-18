## VPU Person Select Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/PersonSelect)

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/PersonSelect.git
cd PersonSelect
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
