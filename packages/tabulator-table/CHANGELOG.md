# Changelog

## Unreleased (0.1.7)

- Render the title of sortable column headers as a button, so sorting can be triggered with the keyboard
- Announce sort changes through an `aria-live` region
- Fix the Excel export using the column `titleFormatter` as a spreadsheet header label
- Add `pagination-size-storage-key` for application-scoped pagination-size persistence
- Add the current page and pagination size to pagination event details and emit an event when the page-size selector changes
- Fix the active column sorting marker for ascending and descending sorting
