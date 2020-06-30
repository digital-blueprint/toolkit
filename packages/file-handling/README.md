# File handling web components

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/FileHandling)

## FileSource

This web component allows the selection of local files via file dialog or drag and drop and to select and download
files from a [Nextcloud](https://nextcloud.com/) instance.

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

### Outgoing Events

#### `vpu-file-source-file-selected`

This event is sent if a file was selected.

**Payload**: `{'file': File}` where `File` is the binary file that was selected

## FileSink

This web component is able to receive files and present as them as ZIP file download. 

### Usage

```html
<vpu-file-sink></vpu-file-sink>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-file-source lang="de"></vpu-file-source>`
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
    - example `<vpu-file-source nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></vpu-file-source>`
    - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
    - example `<vpu-file-source nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></vpu-file-source>`
    - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active

### Incoming Events

#### `vpu-file-sink-download-compressed-files`

If this event is received a *save-as* dialog will pop up to store a zip file of the received files.

##### Payload

`{'files': [File], 'filename': 'my-file.zip'}` where `[File]` is an array of binary files which should be
compressed and `filename` is the name of the zip file that should be suggested in the *save-as* dialog

##### Example

```javascript
const detail = { "files": files, "filename": "signed-documents.zip" };
const event = new CustomEvent("vpu-file-sink-download-compressed-files", { "detail": detail });
this._("#file-sink").dispatchEvent(event);
```

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

To use the Nextcloud functionality you need a running Nextcloud server with the
[webapppassword](https://gitlab.tugraz.at/VPU/Middleware/Nextcloud/webapppassword) Nextcloud app like this
[Nextcloud Development Environment](https://gitlab.tugraz.at/VPU/Middleware/Nextcloud/webapppassword/-/tree/master/docker). 
