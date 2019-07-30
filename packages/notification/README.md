## VPU Notification Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/Notification)

## Usage

```html
<vpu-notification></vpu-notification>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-notification lang="de" client-id="my-client-id"></vpu-notification>`

## Sending notifications 

```javascript
import { send } from './notification';

send({
    "summary": "Item deleted",
    "body": "Item foo was deleted!",
    "type": "info",
    "timeout": 5,
});
``` 

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/Notification.git
cd Notification
git submodule update --init

# we are creating the symbolic links to our git sub-modules
# (there was no proper script to do this automatically before a "node install"
npm run setup

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a demo page.
