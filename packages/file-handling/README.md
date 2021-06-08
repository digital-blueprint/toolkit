# File handling web components

You can install these components via npm:

```bash
npm i @dbp-toolkit/file-handling
```

After you have installed the file handling components via npm you can use this example to get a button
that opens the file source dialog. After you have selected a file you will see it in your browser log,
and the file sink dialog will open, so you are able to store the file again.

```html
<button onclick="openFilePicker()">Open file picker</button>
<dbp-file-source lang="en"></dbp-file-source>
<dbp-file-sink lang="en"></dbp-file-sink>

<script>
    const fileSource = document.querySelector("dbp-file-source");
    const fileSink = document.querySelector("dbp-file-sink");

    // Listen to the event from file source
    fileSource.addEventListener("dbp-file-source-file-selected", (ev) => {
        const file = ev.detail.file;
        console.log("File selected: ", file)

        // This will open the file sink dialog
        fileSink.files = [file];
    }); 

    function openFilePicker() {
        // This will open the file source dialog
        fileSource.setAttribute("dialog-open", "");
    }
</script>
<script type="module" src="node_modules/@dbp-toolkit/file-handling/dist/dbp-file-source.js"></script>
<script type="module" src="node_modules/@dbp-toolkit/file-handling/dist/dbp-file-sink.js"></script>
```

## FileSource

This web component allows the selection of local files via file dialog or drag and drop and to select and download
files from a [Nextcloud](https://nextcloud.com/) instance.

### Usage

```html
<dbp-file-source></dbp-file-source>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-source lang="de"></dbp-file-source>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
    - example `<dbp-file-source allowed-mime-types='application/pdf'></dbp-file-source>` ... PDFs only
    - example `<dbp-file-source allowed-mime-types='image/*'></dbp-file-source>` ... images (of all sub types) only
    - example `<dbp-file-source allowed-mime-types='image/png,text/plain'></dbp-file-source>` ... PNGs or TXTs only
    - example `<dbp-file-source allowed-mime-types='*/*'></dbp-file-source>` ... all file types (default)
- `enabled-targets` (optional, default: `local`): sets which sources are enabled
    - you can use `local` and `nextcloud`
    - example `<dbp-file-source enabled-targets="local,nextcloud"></dbp-file-source>`
- `disabled` (optional): disable input control
    - example `<dbp-file-source disabled></dbp-file-source>`
- `decompress-zip` (optional): decompress zip file and send the contained files (including files in folders)
    - example `<dbp-file-source decompress-zip></dbp-file-source>`
    - mime types of `allowed-mime-types` will also be checked for the files in the zip file
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
    - example `<dbp-file-source nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></dbp-file-source>`
    - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
    - example `<dbp-file-source nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></dbp-file-source>`
    - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-file-url` (optional): Nextcloud File Url to use with the Nextcloud file picker
    - example `<dbp-file-source nextcloud-file-url="http://localhost:8081/apps/files/?dir="></dbp-file-source>`
- `nextcloud-auth-info` (optional): Additional authentication information text that is shown in the Nextcloud file picker
    - example `<dbp-file-source nextcloud-auth-info="You need special permissions for this function"></dbp-file-source>`
- `dialog-open` (optional): if this attribute is set at runtime the dialog for selecting local or Nextcloud files will open
    - example `document.querySelector("dbp-file-source").setAttribute("dialog-open", "")`
- `text` (optional): the text that is shown above the button to select files
    - example `<dbp-file-source text="Please select some files"></dbp-file-source>`
- `button-label` (optional): the text that is shown on the button to select files
    - example `<dbp-file-source button-label="Select files"></dbp-file-source>`
- `initial-file-handling-state` (optional): An  object: `initial-file-handling-state' = {target: "", path: ""}` for initial opening behaviour.
  This is supported by the provider! Use this object to sync file source and file sink on one page at first time open.
    - example `<dbp-file-source initial-file-handling-state="{target: 'local', path:'my/server/path'}"></dbp-file-source>`
    - example provider `<dbp-file-source subscribe="initial-file-handling-state"></dbp-file-source>`

### Emitted attributes

The component emits a `dbp-set-property` event for the attribute `initial-file-handling-state`:

- `initial-file-handling-state.target`: Target that should be selected the first time (possible values `local`, `nextcloud`)
- `initial-file-handling-state.path`:  Path to initially jump to (only supported by target `nextcloud`)

### Outgoing Events

#### `dbp-file-source-file-selected`

This event is sent if a file was selected.

#### `dbp-file-source-file-upload-finished`

This event is sent if multiple files are selected.

#### `dbp-nextcloud-file-picker-number-files`

This event is sent from nextcloudfilepicker and is send when files are picked and sends the number of selected files

**Payload**: `{'file': File}` where [File](https://developer.mozilla.org/en-US/docs/Web/API/File) is the binary file that was selected

### Exposed CSS variables

- `--dbp-override-image-nextcloud` is used to override the cloud image on the connection screen
  - example CSS: `html { --dbp-override-image-nextcloud: url(/icons/nextcloud.svg); }`

## FileSink

This web component is able to receive files and present as them as ZIP file download or upload
files to a [Nextcloud](https://nextcloud.com/) instance. 

### Usage

```html
<dbp-file-sink></dbp-file-sink>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-sink lang="de"></dbp-file-sink>`
- `enabled-targets` (optional, default: `local`): sets which destination are enabled
    - you can use `local` and `nextcloud`
    - example `<dbp-file-sink enabled-targets="local,nextcloud"></dbp-file-sink>`
- `filename` (optional, default: `files.zip`): sets a file name to use for downloading the zip file
    - example `<dbp-file-sink filename="signed-documents.zip"></dbp-file-sink>`
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
    - example `<dbp-file-sink nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></dbp-file-sink>`
    - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
    - example `<dbp-file-sink nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></dbp-file-sink>`
    - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-file-url` (optional): Nextcloud File Url to use with the Nextcloud file picker
    - example `<dbp-file-sink nextcloud-file-url="http://localhost:8081/apps/files/?dir="></dbp-file-sink>`
- `nextcloud-auth-info` (optional): Additional authentication information text that is shown in the Nextcloud file picker
    - example `<dbp-file-sink nextcloud-auth-info="You need special permissions for this function"></dbp-file-sink>`
- `text` (optional): the text that is shown above the button to download the zip file
    - example `<dbp-file-sink text="Download files as ZIP-file"></dbp-file-sink>`
- `button-label` (optional): the text that is shown on the button to download the zip file
    - example `<dbp-file-sink button-label="Download files"></dbp-file-sink>`
- `initial-file-handling-state` (optional): An  object: `initial-file-handling-state' = {target: "", path: ""}` for initial opening behaviour.
  This is supported by the provider! Use this object to sync file source and file sink on one page at first time open.
  - example `<dbp-file-source initial-file-handling-state="{target: 'local', path:'my/server/path'}"></dbp-file-source>`
  - example provider `<dbp-file-source subscribe="initial-file-handling-state"></dbp-file-source>`

### Emitted attributes

The component emits a `dbp-set-property` event for the attribute `initial-file-handling-state`:

- `initial-file-handling-state.target`: Target that should be selected the first time (possible values `local`, `nextcloud`)
- `initial-file-handling-state.path`:  Path to initially jump to (only supported by target `nextcloud`)

### Properties

- `files`: an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which should be downloaded in the dialog
    - if the property is set the dialog opens
    - example: `document.querySelector("dbp-file-sink").files = [file]` where `file` is your File object

### Exposed CSS variables

- `--dbp-override-image-nextcloud` is used to override the cloud image on the connection screen
  - example CSS: `html { --dbp-override-image-nextcloud: url(/icons/nextcloud.svg); }`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/file-handling

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.

To use the Nextcloud functionality you need a running Nextcloud server with the
[webapppassword](https://gitlab.tugraz.at/dbp/nextcloud/webapppassword) Nextcloud app like this
[Nextcloud Development Environment](https://gitlab.tugraz.at/dbp/nextcloud/webapppassword/-/tree/master/docker). 
