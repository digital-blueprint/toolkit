# App Shell Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/Apps/AppShell)

A web component for building SPAs consisting of one topic with multiple
activities. Handles login, language selection, activity switching, menus etc.

## Usage

```html
<vpu-app-shell src="/example.topic.metadata.json"></vpu-app-shell>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-app-shell lang="de" </vpu-app-shell>`
- `src`: The path to a topic metadata file (json)
- `base-path` (optional, default: `/`: An absolute base path for routing
- `entry-point-url`: Entry point URL to access the API
- `keycloak-config`: See `vpu-auth` for details

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
    {"path": "example.metadata.json", visible: true}
  ],
  "attributes": []
}
```

## Activity Metada

```json
{
  "element": "vpu-activity-example",
  "module_src": "vpu-activity-example.js",
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
git clone git@gitlab.tugraz.at:VPU/Apps/AppShell.git
cd AppShell
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002
npm run watch
```

Jump to <http://localhost:8002> and you should get a Single Sign On login page.
