# QR code Scanner Web Component

[GitLab Repository](https://gitlab.tugraz.at/dbp/web-components/qr-code-scanner)

## Requirements
- Https

## Usage

```html
<dbp-qr-code-scanner></dbp-qr-code-scanner>
```

The QR code Scanner Web Component uses a camera device, which you can select(if you have more than one).
With this camera device you can scan a QR code. If a QR code is detected a event will be fired named: 
`'dbp-qr-code-scanner-data'`.
 In this event you can read the data of the qr code with: `'event.detail'`.


## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-qr-code-scanner lang="de"></dbp-qr-code-scanner>`
- `scan-is-ok` (optional, default: `false`): set to `true` or `false` for green or red border of the QR code. 
The colors are from css vars (`--dbp-success-bg-color` and `--dbp-danger-bg-color`) 
    - example `<dbp-person-select scan-is-ok></dbp-person-select>`
- `show-output` (optional, default: `false`): set to `true` for showing 
a box under the video canvas with the read QR code data
    - example `<dbp-qr-code-scanner show-output></dbp-qr-code-scanner>`
- `stop-scan` (optional, default: `false`): set to `true` when you don't want to start the QR code reader immediatly
after loaded. This attribute is also used to stop the QR code reader or if you don't need it anymore.
    - example `<dbp-qr-code-scanner stop-scan></dbp-qr-code-scanner>`
- `clip-mask` (optional, default: `true`): set to `false` when you don't want to use a QR code reader with a mask for better perfomance
    - example `<dbp-qr-code-scanner clip-mask></dbp-qr-code-scanner>`

## Events

- `'dbp-qr-code-scanner-data'`: Outgoing Event which is fired if a QR code is detected. The data of the detected QR code is in `event.detail`.

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/qr-code-scanner.git
cd qr-code-scanner
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# run tests
yarn test
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
- example: `<dbp-qr-code-scanner show-output></dbp-qr-code-scanner>`
