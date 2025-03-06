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

Or you can include the JS files directly via CDN:

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/file-handling@0.2.5/dist/dbp-file-source.js"></script>
<script type="module" src="https://unpkg.com/@dbp-toolkit/file-handling@0.2.5/dist/dbp-file-sink.js"></script>
<script type="module" src="https://unpkg.com/@dbp-toolkit/file-handling@0.2.5/dist/dbp-clipboard.js"></script>
```

## FileSource

This web component allows the selection of local files via file dialog or drag and drop and to select and download
files from a [Nextcloud](https://nextcloud.com/) instance or to a dbp-clipboard.

### Usage

```html
<dbp-file-source></dbp-file-source>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-source lang="de"></dbp-file-source>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
    - example `<dbp-file-source allowed-mime-types='application/pdf'></dbp-file-source>` ... PDFs only
    - example `<dbp-file-source allowed-mime-types='image/*'></dbp-file-source>` ... images (of all subtypes) only
    - example `<dbp-file-source allowed-mime-types='image/png,text/plain'></dbp-file-source>` ... PNGs or TXTs only
    - example `<dbp-file-source allowed-mime-types='*/*'></dbp-file-source>` ... all file types (default)
- `max-file-size"` (optional): if set accepts only files with maximum of this size (in KB)
    - example `<dbp-file-source max-file-size="32000"></dbp-file-source>` ... only files with a max size of
      32 MB are allowed
      
- `enabled-targets` (optional, default: `local`): sets which sources are enabled
    - you can use `local`, `nextcloud` and `clipboard`
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

#### `dbp-file-source-dialog-closed`

This event is sent if the dialog was closed.

#### `dbp-file-source-file-upload-finished`

This event is sent if multiple files are selected.

#### `dbp-nextcloud-file-picker-number-files`

This event is sent from `nextcloud-file-picker` and is sent when files are picked and sends the number of selected files

**Payload**: `{'file': File}` where [File](https://developer.mozilla.org/en-US/docs/Web/API/File) is the binary file that was selected

### Exposed CSS variables

- `--dbp-override-image-nextcloud` is used to override the cloud image on the connection screen
  - example CSS: `html { --dbp-override-image-nextcloud: url(/icons/nextcloud.svg); }`

## FileSink

This web component is able to receive files and present as them as ZIP file download or upload
files to a [Nextcloud](https://nextcloud.com/) instance or to a dbp-clipboard. 

### Usage

```html
<dbp-file-sink></dbp-file-sink>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-sink lang="de"></dbp-file-sink>`
- `enabled-targets` (optional, default: `local`): sets which destination are enabled
    - you can use `local`, `nextcloud` and `clipboard`
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

### Outgoing Events

#### `dbp-file-sink-dialog-closed`

This event is sent if the dialog was closed.

### Properties

- `files`: an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which should be downloaded in the dialog
    - if the property is set the dialog opens
    - example: `document.querySelector("dbp-file-sink").files = [file]` where `file` is your File object

### Exposed CSS variables

- `--dbp-override-image-nextcloud` is used to override the cloud image on the connection screen
  - example CSS: `html { --dbp-override-image-nextcloud: url(/icons/nextcloud.svg); }`

## Clipboard

This web component is for a clipboard which saves the files to a provider. These files are available till the page is reload or the browser is closed.

### Depencencies
This web component can only used if a `dbp-provider` is around it.<br>
This web component depends on:
- `dbp-file-sink`
- `dbp-file-source`

### Usage

```html
<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name">
</dbp-clipboard>
```

### Attributes

- `clipboardFiles` is the object which should be subscribed to the provider to receive and send the clipboard files
  to the provider.
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name"></dbp-clipboard>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" lang="de"></dbp-clipboard>`
- `enabled-targets` (optional, default: `local`): sets which destination are enabled
  - you can use `local` and `nextcloud`
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" enabled-targets="local,nextcloud"></dbp-clipboard>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" allowed-mime-types='application/pdf'></dbp-clipboard>` ... PDFs only
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" allowed-mime-types='image/*'></dbp-clipboard>` ... images (of all subtypes) only
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name"e allowed-mime-types='image/png,text/plain'></dbp-clipboard>` ... PNGs or TXTs only
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" allowed-mime-types='*/*'></dbp-clipboard>` ... all file types (default)
- `mode` (optional, default: `MODE_TABLE_ONLY`): the clipboard can be used in three different contexts:
  only showing the clipboard content, in the file-source context and in the file-sink context.
  - you can use `MODE_TABLE_ONLY`, `MODE_FILE_SINK` or `MODE_FILE_SOURCE`
  - example `<dbp-clipboard mode="MODE_TABLE_ONLY></dbp-clipboard>` ... only the table will be shown
  - example `<dbp-clipboard mode="MODE_FILE_SINK></dbp-clipboard>` ... the file-sink text and functionality is turned on
  - example `<dbp-clipboard mode="MODE_FILE_SOURCE></dbp-clipboard>` ... the file-source text and functionality is turned on
- `filesToSave` this attribute is used by the `dbp-file-sink` to set the files in an array, 
  which should be saved to the clipboard to the `dbp-clipboard` web component
- `allow-nesting` (optional): is an boolean for demo purposes or special use cases. 
  It availables the clipboard in the file-source and file-sink in the clipboard itself.
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" allow-nesting></dbp-clipboard>` ... all file types (default)
- `nextcloud-auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" nextcloud-auth-url="http://localhost:8081/index.php/apps/webapppassword"></dbp-clipboard>`
  - `nextcloud-web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></dbp-clipboard>`
  - `nextcloud-auth-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-file-url` (optional): Nextcloud File Url to use with the Nextcloud file picker
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" nextcloud-file-url="http://localhost:8081/apps/files/?dir="></dbp-clipboard>`
- `nextcloud-auth-info` (optional): Additional authentication information text that is shown in the Nextcloud file picker
  - example `<dbp-clipboard subscribe="clipboard-files:clipboard-files-global-name" nextcloud-auth-info="You need special permissions for this function"></dbp-clipboard>`
  
  
### Exposed CSS variables

- `--dbp-override-image-nextcloud` is used to override the cloud image on the connection screen
  - example CSS: `html { --dbp-override-image-nextcloud: url(/icons/nextcloud.svg); }`

## Nextcloud file picker

The `dbp-nextcloud-file-picker` component is currently used by the file sink, file source and
clipboard components. There is a slot you can use to override to provide additional information.

### Usage

```html
<dbp-nextcloud-file-picker></dbp-nextcloud-file-picker>
```

### Attributes
lang: {type: String},
authUrl: {type: String, attribute: 'auth-url'},
webDavUrl: {type: String, attribute: 'web-dav-url'},
nextcloudFileURL: {type: String, attribute: 'nextcloud-file-url'},
nextcloudName: {type: String, attribute: 'nextcloud-name'},
authInfo: {type: String, attribute: 'auth-info'},
directoryPath: {type: String, attribute: 'directory-path'},
allowedMimeTypes: {type: String, attribute: 'allowed-mime-types'},
directoriesOnly: {type: Boolean, attribute: 'directories-only'},
maxSelectedItems: {type: Number, attribute: 'max-selected-items'}

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
  - example `<dbp-file-source lang="de"></dbp-file-source>`
- `allowed-mime-types` (optional): if set accepts only files matching mime types
  - example `<dbp-file-source allowed-mime-types='application/pdf'></dbp-file-source>` ... PDFs only
  - example `<dbp-file-source allowed-mime-types='image/*'></dbp-file-source>` ... images (of all subtypes) only
  - example `<dbp-file-source allowed-mime-types='image/png,text/plain'></dbp-file-source>` ... PNGs or TXTs only
  - example `<dbp-file-source allowed-mime-types='*/*'></dbp-file-source>` ... all file types (default)

- `auth-url` (optional): Nextcloud Auth Url to use with the Nextcloud file picker
  - example `<dbp-file-source auth-url="http://localhost:8081/index.php/apps/webapppassword"></dbp-file-source>`
  - `web-dav-url` also needs to be set for the Nextcloud file picker to be active
- `web-dav-url` (optional): Nextcloud WebDav Url to use with the Nextcloud file picker
  - example `<dbp-file-source nextcloud-web-dav-url="http://localhost:8081/remote.php/dav/files"></dbp-file-source>`
  - `auth-url` also needs to be set for the Nextcloud file picker to be active
- `nextcloud-file-url` (optional): Nextcloud File Url to use with the Nextcloud file picker
  - example `<dbp-file-source nextcloud-file-url="http://localhost:8081/apps/files/?dir="></dbp-file-source>`
- `auth-info` (optional): Additional authentication information text that is shown in the Nextcloud file picker
  - example `<dbp-file-source auth-info="You need special permissions for this function"></dbp-file-source>`
- `diectory-path` (optional): Allows you to set an specific initial path for your nextcloud, 
  if this path isn't found the path is set to default `\`
  - example `<dbp-nextcloud-file-picker directory-path="\your-folder\your-subfolder"></dbp-nextcloud-file-picker>`
- `directories-only` (optional): A Boolean to specify if you want to select a directory or files
  Use `directories-only` for fileupload, and without for file selecting
  - example `<dbp-nextcloud-file-picker directories-only></dbp-nextcloud-file-picker>`
- `max-selected-items` (optional, default: `true`): A number to specify how many files can be selected, 
  set to true if you don't want to specify a number
  - example `<dbp-nextcloud-file-picker max-selected-items="5"></dbp-nextcloud-file-picker>`

### Outgoing Events

#### `dbp-nextcloud-file-picker-number-files`

This event is sent if one or more files are downloaded, the payload has the number of uploaded files.
**Payload**: `{"count": files.length}`

#### `dbp-nextcloud-file-picker-file-downloaded` 

This event is sent if one file is downloaded, the payload has the `file`, `fileData` and the max number of uploaded files.
**Payload**: `{"file": file, "data": fileData, "maxUpload": maxUpload}`

#### `dbp-nextcloud-file-picker-file-uploaded`

Send the directory to `file-sink`
**Payload**: `{path: path}` 

#### `dbp-nextcloud-file-picker-file-uploaded-finished`

This event is sent if the file upload is finished
**Payload**: `{this.uploadCount}`


### Slots

You use template tags to inject slots into the web component.
These templates will be converted to div containers when the page is loaded and will not show up before that.

#### auth-info

The content of this slot will be shown below the other text on the Nextcloud file picker connection page.

Example:

```html
<dbp-nextcloud-file-picker lang="de">
  <template slot="auth-info">
    <dbp-translated subscribe="lang">
      <div slot="de">
        Für diese Funktion ist ein Bediensteten Account nötig!
      </div>
      <div slot="en">
        An employee account is required for this function!
      </div>
    </dbp-translated>
  </template>
</dbp-nextcloud-file-picker>
```

Most likely you will override this slot across more webcomponents.

Example for `dbp-file-sink`:

```html
<dbp-file-sink lang="de" html-overrides="global-override"></dbp-file-sink>

<template id="global-override">
  <template id="dbp-nextcloud-file-picker">
    <div slot="auth-info">
      <dbp-translated subscribe="lang">
        <div slot="de">
            Für diese Funktion ist ein Bediensteten Account nötig!
        </div>
        <div slot="en">
            An employee account is required for this function!
        </div>
      </dbp-translated>
    </div>
  </template>
</template>
```

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/file-handling

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a demo page.

To use the Nextcloud functionality you need a running Nextcloud server with the
[webapppassword](https://gitlab.tugraz.at/dbp/nextcloud/webapppassword) Nextcloud app like this
[Nextcloud Development Environment](https://gitlab.tugraz.at/dbp/nextcloud/webapppassword/-/tree/master/docker). 
