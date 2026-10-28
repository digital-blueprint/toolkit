# Changelog

## Unreleased

The component is still in development, the notes below track what already works.

- Initial component boilerplate
- Added `dbp-authorization-subject-select`, a resource select searching people, user groups and
  dynamic user groups at once and merging the results into one dropdown
- Added `getGrantHolder()`, which turns a selected subject into the grant holder fields of
  `/authorization/resource-action-grants`
- Added loading of available roles for the configured compound authorization resource identifier
- Added a toggleable side panel listing the roles of the resource in the current language
- Added working demo. User can select `Resource types` and `Resources`.
- Added Roles side panel
- TODO: the dialog only renders the subject search, adding and listing grants is missing
