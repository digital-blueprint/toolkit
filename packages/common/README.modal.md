# Modal Web Component

You can use this web component to show content in a modal.
This web component has two function which can be called from outside: `open()` - which opens the modal and `close()` - which closes the modal.
You can add content to 3 slots: `header`, `content` and `footer`. The `header` and `footer` are optional.
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

## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-modal lang="de"></dbp-modal>`
- `modal-id`(default: `modal-id`, should unique): this is the modal css selector id
    - example `<dbp-modal modal-id="my-modal-123"></dbp-modal>`
- `title` (optional): sets the modal title
    - example `<dbp-modal title="This is my modal"></dbp-modal>`
- `width`, `height`, `min-width`, `min-height` (optional): set the size of a modal
    - example `<dbp-modal width="15px" height="100%"></dbp-modal>`
- `sticky-footer` (optional, boolean): set the footer to stick to the bottom of the modal

## CSS variables

You can customize the modal with the following css variables:

`--dbp-modal-width`: set modal width
`--dbp-modal-min-width` : set modal min width
`--dbp-modal-min-height` : set modal min height
`--dbp-modal-max-width` : set modal max width
`--dbp-modal-max-height` : set modal max height

`--dbp-modal-header-height` : set modal header height
`--dbp-modal-footer-height` : set modal footer height

`--dbp-modal-content-overflow-y` : set .modal-content overflow-y

`--dbp-modal-animation:` - You can set animation on modal opening. - The value can be `mmFadeIn`, `mmFadeOut`, `mmSlideIn`, `mmSlideOut`

## Callable functions

- `open()` opens a specific modal
    - `this._('#my-modal-webcomponent-id').open();`
- `close()` closes a specific modal
    - `this._('#my-modal-webcomponent-id').close();`

## Events

- `dbp-modal-closed` a event which is triggered if the modal is closed. in the detail attribute there is the modal-id of the closed modal. - `<dbp-modal @dbp-modal-closed="${(event) => {
this.doSomething(event);
}}"></dbp-modal>`
