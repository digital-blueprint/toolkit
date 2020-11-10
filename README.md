# Frontend Toolkit

## Overview

This repository uses [yarn 1.x](https://classic.yarnpkg.com) workspaces to link
multiple separate packages together and to hoist all shared dependencies to the
top level node_modules.

In addition we use [lerna](https://lerna.js.org/) for running commands for all contained packages (until we switch to yarn 2.x which should support this directly).

## Setup

```
yarn install
```

`cd packges/some-package` and continue development with `yarn run watch` etc.

## Other commands

* `yarn run test` -  Run test for all packages
* `yarn run clean` - Removes all `node_modules` directories.
