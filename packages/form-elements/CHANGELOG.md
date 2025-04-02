# Changelog

## 0.2.14

- `dbp-form-checkbox-element` was renamed to `dbp-form-boolean-element` and will now accept
  the values `true` and `false` as strings and return the state in `data-value` as a boolean

## 0.2.13

- Add a `dbp-form-time-element` for inputs of type time

## 0.2.12

- Remove bullet points in error messages, place description above error messages

## 0.2.11

- Change position of error messages for better accessibility

## 0.2.10

- Fix an issue with unwanted reflection in `min` and `max` attributes in the date form element

## 0.2.9

- Add `min` and `max` attributes to date form element

## 0.2.8

- Add `disabled` attribute to all form elements

## 0.2.7

- Add `hidden` attribute to the form element and form view components

## 0.2.6

- The name of the custom validator functions has changed from `customValidationFnc` to `customValidator`

## 0.2.5

- Add form view components for the form elements

## 0.2.4

- Fix delayed value loading of the enums when `multiple` is set

## 0.2.3

- Add support for attribute `multiple` for enums
- Fix selection of input elements by label

## 0.2.2

- Add documentation and fix title in README

## 0.2.1

- The enum element will now set a default value if items were set by the `setItems()` method

## 0.2.0

- Migrate tag names from `dbp-*-element` to `dbp-form-*-element`, for example
  `dbp-string-element` to `dbp-form-string-element`

## 0.1.1

- Version bump for conformity

## 0.1.0

- Initial release
