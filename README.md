# Frontend Toolkit

[GitHub](https://github.com/digital-blueprint/toolkit) |
[Toolkit Showcase Development](https://dbp-dev.tugraz.at/apps/toolkit-showcase/) |
[Toolkit Showcase Demo](https://dbp-demo.tugraz.at/apps/toolkit-showcase/)

[![Build, Test and Publish](https://github.com/digital-blueprint/toolkit/actions/workflows/build-test-publish.yml/badge.svg)](https://github.com/digital-blueprint/toolkit/actions/workflows/build-test-publish.yml)

## Overview

This repository uses workspaces to link multiple separate packages together and
to hoist all shared dependencies to the top level node_modules.

In addition, we use [lerna](https://lerna.js.org/) for running commands for all contained packages.

## Setup

```
npm install
```

`cd packges/some-package` and continue development with `npm run watch` etc.

> [!TIP]
> Make sure that the `toolkit-showcase` package has your package as dependency!

## Other commands

- `npm run test` - Run test for all packages
- `npm run clean` - Removes all `node_modules` directories.

## Publishing packages to npmjs.com

There is an automatic publishing process initiated for each package if code is pushed
to the `main` branch, if the package isn't set to private in its `package.json` and
the version number in its `package.json` is higher than the version number on npmjs.com.

## Reserved attributes

| Attribute                     | Description                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `subscribe`                   | Used in all components to subscribe to attributes set by a provider             |
| `unsubscribe`                 | Reserved for future use                                                         |
| `auth`                        | Authentication information, set by the authentication component                 |
| `lang`                        | Currently selected language, set by the language selector                       |
| `lang-dir`                    | Location of the i18n language file where all required i18n translations are     |
| `entry-point-url`             | Entry point url for all api requests                                            |
| `requested-login-status`      | Used by the login buttons to trigger a login in auth components                 |
| `initial-file-handling-state` | Used by the file-handling component to sync file source/sink at first time open |
| `clipboard-files`             | Used by the file-handling component to use the clipboard source and sink        |
| `analytics-event`             | Used to send analytics events to the Matomo component                           |

## Reserved events

| Event              | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `dbp-subscribe`    | Event to tell a provider that the component wants to subscribe to an attribute     |
| `dbp-unsubscribe`  | Event to tell a provider that the component wants to unsubscribe from an attribute |
| `dbp-set-property` | Event to tell a provider that a property should be changed                         |
