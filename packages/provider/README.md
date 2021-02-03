# Provider Web Components

[GitLab Repository](https://gitlab.tugraz.at/dbp/web-components/toolkit)

You can install this component via npm:

```bash
npm i @dbp-toolkit/provider
```

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/provider

# install dependencies (make sure you have npm version 4+ installed, so symlinks to the git submodules are created automatically)
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch

# run tests
yarn test
```

Jump to <http://localhost:8002> and you should get a demo page.

## Provider

### Usage

You can provide attributes (e.g. `global-name`) for components inside the provider:

```html
<provider global-name="value" global-name2="value2">
  <dbp-person-select subscribe="local-name:global-name"></dbp-person-select>
  <dbp-person-profile subscribe="local-name:global-name,local-name2:global-name2"></dbp-person-profile>
</provider>
<script type="module" src="node_modules/@dbp-toolkit/provider/dist/dbp-provider.js"></script>
```

### Attributes

- `init` (optional): set your vars to values
  - example `<provider init="foo=bar"></provider>`
- `id` (optional): set an id, useful for debugging
  - example `<provider id="p-1"></provider>`

## AdapterLitElement

This is a class you can derive your component class from instead of `LitElement`.

You can locally "subscribe" to attributes (e.g. `local-name`) that can be provided by a `dbp-provider` (e.g. `global-name`).
You need to make this available attributes as LitElement properties.

### Example

Multiple attributes can be subscribed when separated by a comma (`,`).

```html
<dbp-person-select subscribe="local-name:global-name,local-name2:global-name2"></dbp-person-select>
```

If `local-name` and `global-name` are the same you could also instead of `local-name:local-name` just write `local-name`:

```html
<dbp-person-select subscribe="local-name"></dbp-person-select>
```

### Inherent provider

AdapterLitElement are themselves provider that will provide all their own attributes to all the elements in their shadow dom.

In this example `dbp-auth-keycloak` would use the `set-property` event to propagate an `auth` property.
`dbp-person-select-demo` would act as provider for `auth`. `dbp-person-select` would subscribe to `auth` to receive
the bearer token via `this.auth.token`.

```html
<dbp-person-select-demo auth lang="de" entry-point-url="http://127.0.0.1:8000">
  <!-- #shadow-root -->
  <dbp-auth-keycloak></dbp-auth-keycloak>
  <dbp-person-select subscribe="auth" lang="${this.lang}" entry-point-url="${this.entryPointUrl}"></dbp-person-select>
</dbp-person-select-demo>
```
