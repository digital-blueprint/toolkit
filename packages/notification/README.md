# Notification Web Component

## Usage

```html
<dbp-notification></dbp-notification>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-notification lang="de" client-id="my-client-id"></dbp-notification>`

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
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/notification
git submodule update --init

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
