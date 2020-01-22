# VPU FileUpload web component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/FileUpload)

## Usage

```html
<vpu-fileupload></vpu-fileupload>
```

## Attributes

- `url`: path to the upload url
    - example `<vpu-fileupload url="path/to/my/page"></vpu-fileupload>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-fileupload lang="de"></vpu-fileupload>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/FileUpload.git
cd FileUpload
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a demo page.
