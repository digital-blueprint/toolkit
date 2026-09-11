## Select Web Component

You can use this web component to have select/dropdown with a menu of options (with optional icons).
Supports full keyboard navigation and “click outside to close,” and emits a change event when an option is selected.

### Key features

- Options via JSON: `{value, title, iconName? }[]`
- Optional icons (uses `<dbp-icon>` when iconName is provided)
- Accessible: ARIA roles, arrow-key navigation, Escape to close

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/common@0.2.8/dist/components.js"></script>

<dbp-select id="actions" label="Actions"></dbp-select>
```

```js
const sel = document.getElementById('actions');
sel.setOptions([
    {value: 'add', title: 'Add', iconName: 'add'},
    {value: 'edit', title: 'Edit', disabled: true},
    {value: 'delete', title: 'Delete'},
]);
```

### Attributes & Properties

| Attribute / Property | Type              | Default   | Description                                                                                                           |
| -------------------- | ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `label`              | `String`          | `' '`     | Label text displayed on the trigger button.                                                                           |
| `align`              | `String`          | `'right'` | Alignment of the dropdown menu relative to the trigger. Accepts `'left'` or `'right'`.                                |
| `allow-expand`       | Boolean attribute | —         | When present, the trigger button stretches to full width of its container, with the chevron pushed to the right edge. |
| `no-wrap`            | Boolean attribute | —         | Keeps the trigger label on a single line. When it does not fit, the label is truncated with an ellipsis.              |

### Label wrapping

By default the trigger label wraps onto multiple lines when the available width is
not enough to show it on a single line, so the full selected value stays readable.
The select is only as wide as its trigger button but never wider than its parent,
so placing it in a narrower container makes the label wrap and pushes the chevron
to the trailing edge.

Add the `no-wrap` attribute to keep the label on a single line instead (useful for
fixed-height contexts such as toolbars or short action menus); in that case an
overflowing label is truncated with an ellipsis.

```html
<!-- Wraps by default -->
<dbp-select id="profile" label="A very long profile name that needs wrapping"></dbp-select>

<!-- Stays on a single line, truncated with an ellipsis if too long -->
<dbp-select id="actions" label="Actions" no-wrap></dbp-select>
```

### CSS Custom Properties

| Property                  | Default      | Description                                                                                             |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `--dbp-select-menu-left`  | `0` / `auto` | Left offset of the dropdown menu. Controlled automatically by `align`; override to fine-tune position.  |
| `--dbp-select-menu-right` | `auto` / `0` | Right offset of the dropdown menu. Controlled automatically by `align`; override to fine-tune position. |
