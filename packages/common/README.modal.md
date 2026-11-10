## Modal Web Component

You can use this web component to show content in a modal.
Use `open()` and `close()` to control the modal (see callable functions below).
Slots: `title`, `header`, `content`, `footer`, and optional `info-panel` (with the `info-panel` attribute).
Slotted content can be styled from outside with css.

```html
<script
    type="module"
    src="https://unpkg.com/browse/@dbp-toolkit/common@0.3.5/src/modal.js"></script>

<dbp-button
    type="is-primary"
    id="modal-trigger-basic"
    value="open modal"
    no-spinner-on-click
    @click="${() => this._('#my-modal-basic').open() }"></dbp-button>

<dbp-modal
    id="my-modal-basic"
    class="modal modal--basic"
    modal-id="my-modal-basic"
    title="The title of the modal"
    subscribe="lang">
    <div slot="title" class="title">This overrides the title attribute</div>
    <div slot="header" class="header">
        <h3>Person name</h3>
        <dbp-icon name="cog"></dbp-icon>
    </div>
    <div slot="content">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
    </div>
    <menu slot="footer" class="footer-menu">
        <dbp-button @click="${() => { this._('#my-modal-basic').close(); }}">Cancel</dbp-button>
        <dbp-button type="is-primary">Submit</dbp-button>
    </menu>
</dbp-modal>
```

Info panel example:

```html
<dbp-modal id="details" class="modal--info" modal-id="details" title="Details" info-panel>
    <div slot="content">Main content</div>
    <div slot="info-panel">Additional information</div>
</dbp-modal>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-modal lang="de"></dbp-modal>`
- `modal-id`(default: `dbp-modal-id`, should be unique): this is the modal css selector id
    - example `<dbp-modal modal-id="my-modal-123"></dbp-modal>`
- `title` (optional): sets the modal title
    - example `<dbp-modal title="This is my modal"></dbp-modal>`
- `width`, `height`, `min-width`, `min-height` (optional): set the size of a modal
    - example `<dbp-modal width="15px" height="100%"></dbp-modal>`
- `sticky-footer` (optional, boolean): set the footer to stick to the bottom of the modal
- `full-height-line` (optional, boolean): show an opt-in vertical line that spans from the top to the bottom of the modal
    - example `<dbp-modal full-height-line></dbp-modal>`
- `print-content-only` (optional, boolean): only print the modal when it's open and the page is printed, the page behind the modal is hidden while printing
    - example `<dbp-modal print-content-only></dbp-modal>`
- `info-panel` (optional, boolean): enables the `info-panel` slot; add `class="modal--info"` for the expandable layout

### CSS variables

You can customize the modal with the following css variables:

`--dbp-modal-width`: set modal width
`--dbp-modal-min-width` : set modal min width
`--dbp-modal-min-height` : set modal min height
`--dbp-modal-max-width` : set modal max width
`--dbp-modal-max-height` : set modal max height

`--dbp-modal-header-height` : set modal header height
`--dbp-modal-footer-height` : set modal footer height

`--dbp-modal-content-overflow-y` : set .modal-content overflow-y

`--dbp-modal-full-height-line-left` : set the horizontal position of the `full-height-line` separator
`--dbp-modal-full-height-line-border` : set the border style of the `full-height-line` separator
`--dbp-modal-full-height-line-display` : set the display value of the `full-height-line` separator, defaults to `block` when `full-height-line` is set

`--dbp-modal-animation:` - You can set animation on modal opening. - The value can be `mmFadeIn`, `mmFadeOut`, `mmSlideIn`, `mmSlideOut`

### Callable functions

- `open()` opens a specific modal
    - `this._('#my-modal-webcomponent-id').open();`
- `close()` closes a specific modal
    - `this._('#my-modal-webcomponent-id').close();`
- `isOpen()` returns whether the modal is open
- `focusCloseButton()` focuses the modal's close button
- `toggleInfoPanel()` expands or collapses the info panel (requires attribute `info-panel` and slotted content)
    - `this._('#details').toggleInfoPanel();`

### Events

- `dbp-modal-closed` a event which is triggered if the modal is closed. in the detail attribute there is the modal-id of the closed modal. - `<dbp-modal @dbp-modal-closed="${(event) => {
this.doSomething(event);
}}"></dbp-modal>`

Toggling the info panel does not emit a separate event.
