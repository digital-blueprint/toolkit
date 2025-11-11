# Form Element Web Components

[GitHub](https://github.com/digital-blueprint/toolkit/tree/main/packages/form-elements) |
[NPM](https://www.npmjs.com/package/@dbp-toolkit/form-elements)

This package offers form components to be used to create an HTML form.

You can install this component via npm:

```bash
npm i @dbp-toolkit/form-elements
```

## Usage

```html
<dbp-form-string-element></dbp-form-string-element>
<script type="module" src="node_modules/@dbp-toolkit/form-elements/dist/string.js"></script>
```

Or directly via CDN:

```html
<dbp-form-string-element></dbp-form-string-element>
<script
    type="module"
    src="https://unpkg.com/@dbp-toolkit/form-elements@0.2.0/dist/string.js"></script>
```

## Attributes

Best look at [demo.js](./src/demo.js) for the example implementation.

### General Attributes

- `lang` (optional, default: `de`): Language setting
    - Type: String
    - Accepts: `de` (German) or `en` (English)
    - Example: `<element lang="en"></element>`
- `name`: Element name
    - Type: String
    - Used for identifying the form element
- `description`: Descriptive text for the element
    - Type: String
    - Provides additional context or explanation
- `label`: Display label for the element
    - Type: String
    - Text shown alongside or near the form element
- `value`: Current value of the element
    - Type: String
    - Reflects current input state
- `required`: Indicates if the element is mandatory
    - Type: Boolean
    - Determines if the field must be filled
- `hidden`: Indicates if the element is hidden
    - Type: Boolean
    - Hides the element if set to `true`
- `disabled`: Indicates if the element is disabled
    - Type: Boolean
    - Disables the element if set to `true`
- `customValidator`: Custom validation function
    - Type: Function
    - Example: `<element .customValidator=${(value, evaluationData) => {return value === 'test' ? ['My message'] : []}}></element>`
- `layout-type` (optional, available value: `inline`): Renders label and value the same line in `inline` style.
    - Type: String
    - Example with list: `<dbp-form-enum-view layout-type="inline"></dbp-form-enum-view>`

### String Element

- `rows` (optional, default: `1`): Number of rows for the text area (1 means a single-line input)
    - Type: Number
    - Example: `<dbp-form-string-element rows="3"></dbp-form-string-element>`
- `placeholder` (optional): Placeholder text for the input field
    - Type: Text
    - Example: `<dbp-form-string-element placeholder="Short phrase that hints at the expected data"></dbp-form-string-element>`
- `word-count-limit` (optional): Limit max word count for textarea
    - Type: Number
    - Example: `<dbp-form-string-element word-count-limit="300"></dbp-form-string-element>`

### Boolean Element

- `value`: Use the string `true` or `false` to set the value
    - Type: String
    - Example: `<dbp-form-boolean-element value="true"></dbp-form-boolean-element>`
- `state`: Instead of `value` you can also use `state` to set the state of the boolean element as a boolean
    - Type: Boolean
- `data-value`: Returns the state of the boolean element
    - Type: Boolean

#### Examples

The `change` event is fired when the state changes. The event contains the new state in `e.detail.state` as a boolean.

##### Boolean Element with String Value

```html
<dbp-form-boolean-element
    subscribe="lang"
    name="myBoolean"
    label="My label"
    description="My description"
    .value=${this.myBoolean ? 'true' : 'false'}
    @change="${(e) { console.log('state', e.detail.state); }}>
</dbp-form-boolean-element>
```

##### Boolean Element with Boolean State

```html
<dbp-form-boolean-element
    subscribe="lang"
    name="myBoolean"
    label="My label"
    description="My description"
    .state=${this.myBoolean}
    @change="${(e) { console.log('state', e.detail.state); }}>
</dbp-form-boolean-element>
```

### Date Element

- `min`: Indicates the minimum value that can be entered
    - Type: String/Date
- `max`: Indicates the maximum value that can be entered
    - Type: String/Date

### Enum Element

```html
<dbp-form-enum-element
    ${ref(this.myComponentEnumRef)}
    subscribe="lang"
    name="myComponentEnum"
    label="My enum"
    .value=${data.myComponentEnum || ''}
    .items=${{item1: 'Item 1', item2: 'Item 2'}}
    multiple
    required>
    <span slot="label">
        Label with HTML content. Can be used interchangeably the label property.
    </span>
</dbp-form-enum-element>
```

Please always use `.value` to set the value of the enum element, as it is a property and not an attribute.

- `items`: List of items to select from
    - Type: Object
    - Example: `<dbp-form-enum-element .items=${{item1: 'Item 1', item2: 'Item 2'}}></dbp-form-enum-element>`
- `multiple` (optional, default: `false`): Indicates if multiple items can be selected
    - Type: Boolean
    - Example: `<dbp-form-enum-element multiple></dbp-form-enum-element>`
- `display-mode` (optional, default: `dropdown`): Render as checkbox or radiobutton in `list` mode,
  select-element in `dropdown` mode or as tags in `tags` mode
    - Type: String
    - Example with list: `<dbp-form-enum-element display-mode="list"></dbp-form-enum-element>`
    - Example with tags: `<dbp-form-enum-element display-mode="tags"></dbp-form-enum-element>`
- `tagPlaceholder` (optional, default: `Please select an option`): Placeholder text to display when using `display-mode`=`tags`
    - Type: Object
    - Example: `<dbp-form-enum-element display-mode="tags" .tagPlaceholder=${{en: 'Select tags', de: 'Wähle Tags'}}></dbp-form-enum-element>`
- CSS custom properties for styling:
    - `--dbp-enum-label-gap`

## Form Views

They are a little similar to the form element components.
Best look at [demo.js](./src/demo.js) for the example implementation.

### General Attributes

- `lang` (optional, default: `de`): Language setting
    - Type: String
    - Accepts: `de` (German) or `en` (English)
    - Example: `<view lang="en"></view>`
- `label`: Display label for the view
    - Type: String
    - Text shown alongside or near the form view
- `value`: Current value of the view
    - Type: String
    - Reflects current input state
- `hidden`: Indicates if the view is hidden
    - Type: Boolean
    - Hides the view if set to `true`
- `layout-type` (optional, available value: `inline`): Renders label and value the same line in `inline` style.
    - Type: String
    - Example with list: `<dbp-form-enum-view layout-type="inline"></dbp-form-enum-view>`

### Enum Element

```html
<dbp-form-enum-view
    subscribe="lang"
    name="myComponentEnum"
    label="My enum"
    .value=${data.myComponentEnum || ''}
    .items=${{item1: 'Item 1', item2: 'Item 2'}}>
    <span slot="label">
        Label with HTML content. Can be used interchangeably the label property.
    </span>
</dbp-form-enum-view>
```

- `display-mode` (optional, available value: `tags`): `tags` mode renders values in tag style with background color.
    - Type: String
    - Example with list: `<dbp-form-enum-view display-mode="tags"></dbp-form-enum-view>`
- CSS custom properties for styling:
    - `--dbp-enum-label-gap`
    - `--dbp-enum-fieldset-line-height`
    - `--dbp-enum-tags-gap`
    - `--dbp-enum-tag-padding`
    - `--dbp-enum-tag-border-radius`
    - `--dbp-enum-tag-line-height`
    - `--dbp-enum-tag-bg-color`

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/form-elements

# install dependencies
npm install

# constantly build dist/bundle.js and run a local web-server on port 8002
npm run watch

# run tests
npm test

# build local packages in dist directory
npm run build
```

Jump to <http://localhost:8002> and you should get a demo page.
