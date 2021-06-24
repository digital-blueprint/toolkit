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
Best take a look on examples like [index.html](https://gitlab.tugraz.at/dbp/esign/signature/-/blob/master/examples/dbp-signature/index.html)
for more explanation.

## Attributes

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

### Emitted attributes

The component emits `dbp-set-property` events for these attributes:

- `lang` to propagate a language change (possible values `en`, `de`)
- `requested-login-status` (possible values `logged-in`, `logged-out`)

### Emitted events

#### dbp-lang

The component emits a `dbp-lang` event when the language is changed (for example in the language picker).
The `details` attribute of the event is the language (possible values `en`, `de`).

### Slots

You use the template tag to inject slots into the web component.
These templates will be converted to div containers when the page is loaded and will not show up before that.

#### Unnamed slot

The unnamed slot will be removed when the application is loaded and can be filled with a loading-spinner.

Example: `<app-shell><dbp-loading-spinner></dbp-loading-spinner></app-shell>`

#### name

The content of this slot will be shown left in the header and can be used to set a name (e.g. the name of the institution).

Example: `<app-shell><template slot="name">TU Graz<br />Graz University of Technology</template></app-shell>`

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
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/app-shell

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
