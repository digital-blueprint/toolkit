# VPU Person Profile Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/PersonProfile)

## Usage

```html
<vpu-person-profile></vpu-person-profile>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-person-profile lang="de"></vpu-person-profile>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<vpu-person-profile entry-point-url="http://127.0.0.1:8000"></vpu-person-profile>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/PersonProfile.git
cd PersonProfile
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# run tests
npm test
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
