# PdfViewer Web Component

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
<script type="module" src="https://unpkg.com/@dbp-toolkit/form-elements@0.2.0/dist/string.js"></script>
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

### String Element

- `rows` (optional, default: `1`): Number of rows for the text area (1 means a single-line input)
    - Type: Number
    - Example: `<dbp-form-string-element rows="3"></dbp-form-string-element>`

### Checkbox Element

- `checked`: Indicates if the checkbox is checked
    - Type: Boolean
    - Example: `<dbp-form-checkbox-element checked></dbp-form-checkbox-element>`

### Enum Element

```html
<dbp-form-enum-element
    ${ref(this.myComponentEnumRef)}
    subscribe="lang"
    name="myComponentEnum"
    label="My enum"
    value=${data.myComponentEnum || ''}
    required>
</dbp-form-enum-element>
```

#### Methods

- `setItems()`: Set the items to be displayed in the enum element

##### Example

```js
// Set items for the enum component
this.myComponentEnumRef.value.setItems({item1: 'Item 1', item2: 'Item 2'});
```

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
