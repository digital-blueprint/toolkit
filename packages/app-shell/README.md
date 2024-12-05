# App Shell Component

A web component for building SPAs consisting of one topic with multiple
activities. Handles login, language selection, activity switching, menus etc.

You can install this component via npm:

```bash
npm i @dbp-toolkit/app-shell
```

## Usage

```html
<script type="module" src="node_modules/@dbp-toolkit/app-shell/dist/dbp-app-shell.js"></script>
<dbp-app-shell src="/example.topic.metadata.json"></dbp-app-shell>
```

Or directly via CDN:

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/app-shell@0.2.3/dist/dbp-app-shell.js"></script>
<dbp-app-shell src="/example.topic.metadata.json"></dbp-app-shell>
```

You need Keycloak and other parts to be in place to really make full use of the AppShell.
Best take a look on examples like [index.html](https://gitlab.tugraz.at/dbp/esign/signature/-/blob/main/examples/dbp-signature/index.html)
for more explanation.

## Attributes

- `provider-root` (optional): You need to set the `provider-root` attribute for the app-shell to "terminate" all provider events
  - If you don't want to set the app-shell as `provider-root` then you need to set the attributes `auth`,
    `requested-login-status` and `analytics-event` as attribute for the app-shell or in a `dbp-provider` above it 
  - example `<dbp-app-shell provider-root></dbp-app-shell>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-app-shell lang="de"></dbp-app-shell>`
- `src`: The path to a topic metadata file (json)
- `base-path` (optional, default: `/`): An absolute base path for routing
- `entry-point-url`: Entry point URL to access the API
- `keycloak-config`: An object with the following keys: url, realm, clientId, silentCheckSsoRedirectUri, scope
- `matomo-url` (optional): set to your *Matomo* server (required only for tracking)
    - example `<dbp-app-shell matomo-url="https://my-matomo.tld"></dbp-app-shell>`
- `matomo-site-id` (optional): set to your site id (required only for tracking)
    - example `<dbp-app-shell matomo-site-id="456789"></dbp-app-shell>`
- `no-welcome-page` (optional): skips the welcome page and welcome page isn't visible in menu
    - example `<dbp-app-shell no-welcome-page></dbp-app-shell>`
- `routing-url` (optional): the property can be sent by an activity with `sendSetPropertyEvent` to change the routing
    - for example if at the URL `https://server.com/en/activity-name` a `routing-url` of `path?query=1#hash` would
      result in a URL change to `https://server.com/en/activity-name/path?query=1#hash`, this would then in turn
      trigger a sending out of a `routing-url` and `routing-data` attribute (see below)

### Emitted attributes

The component emits `dbp-set-property` events for these attributes:

#### lang

The attribute `lang` is emitted to propagate a language change. Possible values are `en` and `de`.

#### requested-login-status

The attribute `requested-login-status` is emitted to propagate whether a user is logged in or not
Possible values are `logged-in` and `logged-out`.

#### routing-url

The attribute `routing-url` is emitted to propagate a routing change. The value is the new part of URL after the activity name.

For example for the URL `https://myhost.com/en/render-form/accessible-exams-form/demo-form?test=2&test2=7#324` it would
be `accessible-exams-form/demo-form?test=2&test2=7#324`.

#### routing-data

The attribute `routing-data` is emitted also to propagate a routing change, but with more structured information.

For example for the URL `https://myhost.com/en/render-form/accessible-exams-form/demo-form?test=2&test2=7#324` it would be:

```json
{
  "routingUrl": "accessible-exams-form/demo-form?test=2&test2=7#324",
  "activity": "render-form",
  "pathParts": [
    "accessible-exams-form",
    "demo-form"
  ],
  "search": "?test=2&test2=7",
  "hash": "#324"
}
```

### Emitted events

#### dbp-lang

The component emits a `dbp-lang` event when the language is changed (for example in the language picker).
The `details` attribute of the event is the language (possible values `en`, `de`).

### Slots

You use template tags to inject slots into the web component.
These templates will be converted to div containers when the page is loaded and will not show up before that.

#### Unnamed slot

The unnamed slot will be removed when the application is loaded and can be filled with a loading-spinner.

Example: `<app-shell><dbp-loading-spinner></dbp-loading-spinner></app-shell>`

#### name

The content of this slot will be shown left in the header and can be used to set a name (e.g. the name of the institution).

Example: `<app-shell><template slot="name">TU Graz<br />Graz University of Technology</template></app-shell>`

#### title

The content of this slot will be shown as big h1 headline instead of the `name` in the topic manifest file.

Example: `<app-shell><template slot="title">TU Graz Greenlight</template></app-shell>`

#### logo

The content of this slot will be shown right in the header and can be used to override the logo image.

Example: `<app-shell><template slot="logo"><img alt="logo" src="/path/to/logo.png" /></template></app-shell>`

#### header

The content of this slot will override the whole content of the header.
You will need to provide your own language selector and auth component.

Example: `<app-shell><template slot="header">My custom header</template></app-shell>`

#### footer-links

The content of this slot will override the whole content of the footer link section, for example to set custom links.

Example: `<app-shell><template slot="footer-links"><a target="_blank" rel="noopener" class="int-link-external" href="https://my-webpage.com">Link text</a></template></app-shell>`

#### footer

The content of this slot will override the whole content of the footer, for example to set custom links
and also overwrite the `dbp-build-info` tag.

Example: `<app-shell><template slot="footer"><a target="_blank" rel="noopener" class="int-link-external" href="https://my-webpage.com">Link text</a></template></app-shell>`

## Topic Metadata

```json
{
  "name": {
    "de": "Beispiel",
    "en": "Example"
  },
  "short_name": {
    "de": "Beispiel",
    "en": "Example"
  },
  "description": {
    "de": "Ich bin eine Beschreibung der Applikation",
    "en": "I am a description of this application"
  },
  "routing_name": "example",
  "activities": [
    {"path": "example.metadata.json", "visible": true}
  ],
  "attributes": []
}
```

## Activity Metadata

```json
{
  "element": "dbp-activity-example",
  "module_src": "dbp-activity-example.js",
  "routing_name": "activity-example",
  "name": {
    "de": "Beispielaktivität",
    "en": "Example Activity"
  },
  "short_name": {
    "de": "Beispielaktivität",
    "en": "Example Activity"
  },
  "description": {
    "de": "Eine Beschreibung",
    "en": "A Description"
  }
}
```

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/app-shell

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch

# run tests
npm test

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
