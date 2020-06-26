# File handling web components

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/FileHandling)

## FileSource

### Usage

```html
<vpu-file-source></vpu-file-source>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-file-source lang="de"></vpu-file-source>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
    - example `<vpu-file-source allowed-mime-types='application/pdf'></vpu-file-source>` ... PDFs only
    - example `<vpu-file-source allowed-mime-types='image/*'></vpu-file-source>` ... images (of all sub types) only
    - example `<vpu-file-source allowed-mime-types='image/png,text/plain'></vpu-file-source>` ... PNGs or TXTs only
    - example `<vpu-file-source allowed-mime-types='*/*'></vpu-file-source>` ... all file types (default)
- `disabled` (optional): disable input control
    - example `<vpu-file-source disabled></vpu-file-source>`
- `decompress-zip` (optional): decompress zip file and send the contained files (including files in folders)
    - example `<vpu-file-source decompress-zip></vpu-file-source>`
    - mime types of `allowed-mime-types` will also be checked for the files in the zip file
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
    - example `<vpu-file-source nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></vpu-file-source>`
    - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
    - example `<vpu-file-source nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></vpu-file-source>`
    - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/FileHandling.git
cd FileHandling
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a demo page.
