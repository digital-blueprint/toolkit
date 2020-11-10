# Matomo Web Component

## Usage

```html
<dbp-matomo></dbp-matomo>
```

## Attributes

- `endpoint` (required): set to your *Matomo* server
    - example `<dbp-matomo endpoint="https://my-matomo.tld"></dbp-matomo>`
- `site-id` (required): set to your site id
    - example `<dbp-matomo site-id="456789"></dbp-matomo>`

## Tracking actions

```javascript
class Demo {

    track(action, message) {
        const matomo = this.shadowRoot.querySelector(this.constructor.getScopedTagName('dbp-matomo'));
        if (matomo !== null) {
            matomo.track(action, message);
        }
    }

    clickMe() {
        this.track('button clicked', 'alert()');
    }

}
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
