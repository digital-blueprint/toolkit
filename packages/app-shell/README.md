# App Shell Component

[GitLab Repository](https://gitlab.tugraz.at/dbp/apps/AppShell)

A web component for building SPAs consisting of one topic with multiple
activities. Handles login, language selection, activity switching, menus etc.

## Usage

```html
<dbp-app-shell src="/example.topic.metadata.json"></dbp-app-shell>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-app-shell lang="de" </dbp-app-shell>`
- `src`: The path to a topic metadata file (json)
- `base-path` (optional, default: `/`): An absolute base path for routing
- `entry-point-url`: Entry point URL to access the API
- `keycloak-config`: An object with the following keys: url, realm, clientId, silentCheckSsoRedirectUri, scope
- `matomo-url` (optional): set to your *Matomo* server (required only for tracking)
    - example `<dbp-app-shell matomo-url="https://my-matomo.tld"></dbp-app-shell>`
- `matomo-site-id` (optional): set to your site id (required only for tracking)
    - example `<dbp-app-shell matomo-site-id="456789"></dbp-app-shell>`

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
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
