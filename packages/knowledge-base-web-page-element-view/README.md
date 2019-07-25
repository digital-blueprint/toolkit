## VPU KnowledgeBaseWebPageElementView Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/KnowledgeBaseWebPageElementView)

## Usage

```html
<vpu-knowledge-base-web-page-element-view></vpu-knowledge-base-web-page-element-view>
```

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-knowledge-base-web-page-element-view lang="de" client-id="my-client-id"></vpu-knowledge-base-web-page-element-view>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/KnowledgeBaseWebPageElementView.git
cd KnowledgeBaseWebPageElementView
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
