# Qr Code Scanner Web Component

[GitLab Repository](https://gitlab.tugraz.at/dbp/web-components/qr-code-scanner)

## Requirements
- Https

## Usage

```html
<dbp-qr-code-scanner></dbp-qr-code-scanner>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-qr-code-scanner lang="de" client-id="my-client-id"></dbp-notification>`


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
ffmpeg -f x11grab -r 15 -s 1280x720 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0
```

Then you can place a QR Code in the left corner of your desktop.
You can try the webcomponent with this example QR Code.

![QR-Code-Example](qr-code-dummy.png)

