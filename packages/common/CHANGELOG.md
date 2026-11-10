# Changelog

## Unreleased

- Translated: add an `inline` attribute to render the active language wrapper and its slotted content inline.
- Modal: add a `focusCloseButton()` method so consumers can move focus to the modal's close button, which is otherwise unreachable behind the shadow root boundary; this lets long modal forms offer a skip link to the close action
- Modal: print the whole content of an open modal instead of only the first page, and don't print the close button
- Modal: add a `print-content-only` attribute to hide the page behind an open modal while printing

## 0.3.16

- Utils: add function createUUID

## 0.3.15

- Modal: Add `title` slot to allow custom titles in the modal component

## 0.3.14

- Common: Fix `undefined notificationSlot` error in modal component

## 0.3.10

- `DBPLitElement` directly integrates the `routing-url` attribute and `this.getRoutingData()` can be used to get the structured data

## 0.3.7

- Modal: Add `isOpen` method and only open the modal if it is not already open in `open` method
