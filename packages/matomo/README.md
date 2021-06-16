# Matomo Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/matomo
```

## Usage

```html
<dbp-matomo></dbp-matomo>
<script type="module" src="node_modules/@dbp-toolkit/matomo/dist/dbp-matomo.js"></script>
```

Or directly via CDN:

```html
<dbp-matomo></dbp-matomo>
<script type="module" src="https://unpkg.com/@dbp-toolkit/matomo@0.2.4/dist/dbp-matomo.js"></script>
```

## Attributes

- `endpoint` (required): set to your *Matomo* server
    - example `<dbp-matomo endpoint="https://my-matomo.tld"></dbp-matomo>`
- `site-id` (required): set to your site id
    - example `<dbp-matomo site-id="456789"></dbp-matomo>`
- `auth` object: you need to set that object property for the login-status
  - example auth property: `{'login-status': 'logged-in'}`
  - note: most often this should be an attribute that is not set directly, but subscribed at a provider
- `analytics-event` object: for sending Matomo events

### Emitted attributes

The component receives a `analytics-event` attribute to send Matomo events.
It looks like this:

```json
{
  "category": "the category of the event",
  "action": "the action of the event",
  "name": "the name of the event",
  "value": "the value of the event"
}
```

## Tracking actions

```html
<dbp-provider analytics-event>
  <dbp-matomo subscribe="analytics-event"></dbp-matomo>
  <your-dbp-adapter-limt-element-component></your-dbp-adapter-limt-element-component>
</dbp-provider>
```

In your AdapterLitElement component:

```javascript
this.sendSetPropertyEvent('analytics-event', {'category': 'my category', 'action': 'my action'});
``` 

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/matomo

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
