# Changelog

## Unreleased

- Modal: add a `focusCloseButton()` method so consumers can move focus to the modal's close button, which is otherwise unreachable behind the shadow root boundary; this lets long modal forms offer a skip link to the close action

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
