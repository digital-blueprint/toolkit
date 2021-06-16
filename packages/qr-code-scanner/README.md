# QR code Scanner Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/qr-code-scanner
```

## Requirements

For some browsers it might be necessary to host the html using this component via https.

## Usage

```html
<dbp-qr-code-scanner></dbp-qr-code-scanner>
<script type="module" src="node_modules/@dbp-toolkit/qr-code-scanner/dist/dbp-qr-code-scanner.js"></script>
```

Or directly via CDN:

```html
<dbp-qr-code-scanner></dbp-qr-code-scanner>
<script type="module" src="https://unpkg.com/@dbp-toolkit/qr-code-scanner@0.2.2/dist/dbp-qr-code-scanner.js"></script>
```

The QR code Scanner Web Component uses a camera device, which you can select (if you have more than one).
With this camera device you can scan a QR code. If a QR code is detected an event named `dbp-qr-code-scanner-data` will be fired.
In this event you can read the data of the qr code with `event.detail`.


## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-qr-code-scanner lang="de"></dbp-qr-code-scanner>`
- `match-regex` (optional, default: `.*`): a regular expression that when matching the QR code will result in the user getting feedback
- `show-output` (optional, default: `false`): set to `true` for showing 
a box under the video canvas with the read QR code data
    - example `<dbp-qr-code-scanner show-output></dbp-qr-code-scanner>`
- `stop-scan` (optional, default: `false`): set to `true` when you don't want to start the QR code reader immediatly
after loaded. This attribute is also used to stop the QR code reader or if you don't need it anymore.
    - example `<dbp-qr-code-scanner stop-scan></dbp-qr-code-scanner>`

## Events

- `'code-detected'`: Outgoing Event which is fired if a QR code is detected. The data of the detected QR code is in `event.detail`.
- `'scan-started`: Fired after the first image is drawn. Can be used to scrolling or other layout dependent tasks.

## Assets

- `qr-scanner/qr-scanner-worker.*` -> `dist/local/@dbp-toolkit/qr-code-scanner/`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/qr-code-scanner.git
cd qr-code-scanner

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.

## Camera for local development

You can use your desktop as a camera, to test the qr code reader

```bash
#install the virtual cam
sudo apt install ffmpeg v4l2loopback-dkms; sudo modprobe v4l2loopback

#start virtual cam - Dummy video device (0x0000)
ffmpeg -f x11grab -r 15 -s 1280x720 -i "${DISPLAY}+0,0" -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
```

Then you can place a QR Code in the left corner of your desktop.
You can try the webcomponent with this example QR Code.

![QR-Code-Example](qr-code-dummy.png)

### Hint

Add the attribute `show-output` for debugging propose.

Example: `<dbp-qr-code-scanner show-output></dbp-qr-code-scanner>`
