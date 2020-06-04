# FileUpload web component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/FileUpload)

Files will be uploaded sequentially (not parallel) to prevent overburdening the destination server. 

## Usage

```html
<vpu-fileupload></vpu-fileupload>
```

## Attributes

- `url`: path to the upload url
    - example `<vpu-fileupload url="path/to/my/page"></vpu-fileupload>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-fileupload lang="de"></vpu-fileupload>`
- `always-send-file` (optional): if set the uploaded or queued file will always be sent in the event
    - example `<vpu-fileupload always-send-file></vpu-fileupload>`
- `deferred` (optional): if set files will not be uploaded immediately but only queued
    - use method `uploadFile` or `uploadOneQueuedFile` to really upload the queued file  
    - example `<vpu-fileupload deferred></vpu-fileupload>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
    - example `<vpu-fileupload allowed-mime-types='application/pdf'></vpu-fileupload>` ... PDFs only
    - example `<vpu-fileupload allowed-mime-types='image/*'></vpu-fileupload>` ... images (of all sub types) only
    - example `<vpu-fileupload allowed-mime-types='image/png,text/plain'></vpu-fileupload>` ... PNGs or TXTs only
    - example `<vpu-fileupload allowed-mime-types='*/*'></vpu-fileupload>` ... all file types (default)
- `disabled` (optional): disable input control
    - example `<vpu-fileupload disabled>`
- `decompress-zip` (optional): decompress zip file and queue the contained files
    - example `<vpu-fileupload decompress-zip>`

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
