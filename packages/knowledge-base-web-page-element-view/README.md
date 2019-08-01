## VPU KnowledgeBaseWebPageElementView Web Component

[GitLab Repository](https://gitlab.tugraz.at/VPU/WebComponents/KnowledgeBaseWebPageElementView)

## Usage

```html
<vpu-knowledge-base-web-page-element-view></vpu-knowledge-base-web-page-element-view>
```

## Attributes

- `value`: path to the web page element
    - example `<vpu-knowledge-base-web-page-element-view value="path/to/my/article"></vpu-knowledge-base-web-page-element-view>`
- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<vpu-knowledge-base-web-page-element-view lang="de"></vpu-knowledge-base-web-page-element-view>`
- `entry-point-url` (optional, default is the TU Graz entry point url): entry point url to access the api
    - example `<vpu-knowledge-base-web-page-element-view entry-point-url="http://127.0.0.1:8000"></vpu-knowledge-base-web-page-element-view>`

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:VPU/WebComponents/KnowledgeBaseWebPageElementView.git
cd KnowledgeBaseWebPageElementView
git submodule update --init

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002 
npm run watch-local
```

Jump to <http://localhost:8002> and you should get a demo page.
