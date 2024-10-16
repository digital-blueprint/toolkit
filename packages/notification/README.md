# Notification Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/notification
```

## Usage

```html
<dbp-notification></dbp-notification>
<script type="module" src="node_modules/@dbp-toolkit/notification/dist/dbp-notification.js"></script>
```

Or directly via CDN:

```html
<dbp-notification></dbp-notification>
<script type="module" src="https://unpkg.com/@dbp-toolkit/notification@0.2.2/dist/dbp-notification.js"></script>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-notification lang="de" client-id="my-client-id"></dbp-notification>`

## Sending notifications

```javascript
import { send } from './notification';

...
async <your_function_name>(event) {
    send({
        "summary": "Item deleted",
        "body": "Item foo was deleted!",
        "type": "info",
        "icon": "download",             // optional - name of the icon
        "replaceId": "download-event",  // optional - if set, the notification with this id will be replaced
        "timeout": 5,                   // optional - if set, the notification will be removed after this time in seconds
    });
}
...

render() {
        let loggedIn = this.auth && this.auth.token;
        let i18n = this._i18n;

        return html`
            ...
            <button id="send-button" @click="${this.<your_function_name>}" class ="button">
                ${i18n.t('<your_text>')}
            </button>
            ...
        `
}
```

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/notification

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002
npm run watch

# run tests
npm test

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a demo page.
