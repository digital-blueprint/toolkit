## Resource Select Web Component

You can install this component via npm:

```bash
npm i @dbp-toolkit/resource-select
```

### Usage

```html
<dbp-resource-select></dbp-resource-select>
<script
    type="module"
    src="node_modules/@dbp-toolkit/resource-select/dist/dbp-resource-select.js"></script>
```

Or directly via CDN:

```html
<dbp-resource-select></dbp-resource-select>
<script
    type="module"
    src="https://unpkg.com/@dbp-toolkit/resource-select@latest/dist/dbp-resource-select.js"></script>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-resource-select lang="de"></dbp-resource-select>`
- `entry-point-url`: entry point url to access the api
    - example `<dbp-resource-select entry-point-url="http://127.0.0.1:8000"></dbp-resource-select>`
- `resource-path` (optional): path to the resource
    - example `<dbp-resource-select resource-path="base/people"></dbp-resource-select>`
- `value` (optional): api path of recource to preload the selector with
    - example `<dbp-resource-select value="/base/people/testuser"></dbp-resource-select>`
    - the `value` will also be set automatically when an organization is chosen in the selector
- `disabled` (optional): set to disable the selector
    - example `<dbp-resource-select disabled></dbp-resource-select>`

### Properties

- `valueObject` (optional): The resource object corresponding to `value`
- `auth` {object}: you need to set that object property for the auth token
    - example auth property: `{token: "THE_BEARER_TOKEN"}`
    - note: most often this should be a property that is not set directly, but subscribed at a provider

### Override Properties

- `buildUrl` - A function which takes the select and the base URL, can return a
  different URL for fetching the list of resources.
- `formatResource` - A function which takes the select and a resource, should
  return the text used for displaying the resource.

### Events

- `change` - Gets dispatched when either `value` or `valueObject` change.
    - `event.detail.value` - Same as the `value` property
    - `event.detail.object` - Same as the `valueObject` property
