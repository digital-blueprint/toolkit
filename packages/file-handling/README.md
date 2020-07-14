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
- `enabled-sources` (optional, default: `local`): sets which sources are enabled
    - you can use `local` and `nextcloud`
    - example `<vpu-file-source enabled-sources="local,nextcloud"></vpu-file-source>`
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
- `dialog-open` (optional): if this attribute is set the dialog for selecting local or Nextcloud files will open
    - example `<vpu-file-source dialog-open></vpu-file-source>`
- `text` (optional): the text that is shown above the button to select files
    - example `<vpu-file-source text="Please select some files"></vpu-file-source>`
- `button-label` (optional): the text that is shown on the button to select files
    - example `<vpu-file-source button-label="Select files"></vpu-file-source>`

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
    - example `<vpu-file-sink lang="de"></vpu-file-sink>`
- `enabled-destinations` (optional, default: `local`): sets which destination are enabled
    - you can use `local` and `nextcloud`
    - example `<vpu-file-sink enabled-destinations="local,nextcloud"></vpu-file-sink>`
- `filename` (optional, default: `files.zip`): sets a file name to use for downloading the zip file
    - example `<vpu-file-sink filename="signed-documents.zip"></vpu-file-sink>`
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
    - example `<vpu-file-sink nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></vpu-file-sink>`
    - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
    - example `<vpu-file-sink nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></vpu-file-sink>`
    - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active
- `text` (optional): the text that is shown above the button to download the zip file
    - example `<vpu-file-sink text="Download files as ZIP-file"></vpu-file-sink>`
- `button-label` (optional): the text that is shown on the button to download the zip file
    - example `<vpu-file-sink button-label="Download files"></vpu-file-sink>`

### Properties

- `files`: an array of File objects which should be downloaded in the dialog
    - if the property is set the dialog opens

## Local development

```bash
# get the source code
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
