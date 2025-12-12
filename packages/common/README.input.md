## Select Web Component

You can use this web component to have select/dropdown with a menu of options (with optional icons).
Supports full keyboard navigation and “click outside to close,” and emits a change event when an option is selected.

### Key features

- Options via JSON: `{ name, title, iconName? }[]`
- Optional icons (uses `<dbp-icon>` when iconName is provided)
- Accessible: ARIA roles, arrow-key navigation, Escape to close

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/common@0.2.8/dist/components.js"></script>

<dbp-select id="actions" label="Actions"></dbp-select>
```

```js
const sel = document.getElementById('actions');
sel.setOptions([
    {name: 'add', title: 'Add', iconName: 'add'},
    {name: 'edit', title: 'Edit', disabled: true},
    {name: 'delete', title: 'Delete'},
]);
```
