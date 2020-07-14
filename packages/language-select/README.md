# Language Select Web Component

[GitLab Repository](https://gitlab.tugraz.at/dbp/web-components/LanguageSelect)

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/LanguageSelect.git
cd LanguageSelect
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# run tests
npm test
```
