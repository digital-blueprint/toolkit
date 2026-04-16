# Agents Instructions

## Important Notes for AI Assistants

- Only use English variables and comments in the code.
- Always write clear and concise comments for complex logic, start comments with uppercase letters.
- If you can use existing dbp-icons, use them instead of creating new icons.
    - Always loon at `./packages/common/src/demo/icon-names.js` for existing icons.
- Everything needs to be properly translated with i18next.
- For dialogs always use dbp-modal.
- Don't update files in `dist/` folders as they are generated from the source files in the `src/` folders
- Packages are placed in the `packages/` folder, each package has its own `src/` and `dist/` folder.
  - The `src/` folder contains the source code, while the `dist/` folder contains the compiled code that is used in the toolkit.
  - Never commit the `dist/` folder, as it is generated from the `src/` folder and can be easily regenerated.
- When creating a new package in the `packages/` folder, make sure to add it to the `toolkit-showcase` package as a dependency,
  so that it can be used in the showcase.
  - Also make sure there is a proper `.gitignore` file in the new package that ignores the `dist/` folder and any other
    files that shouldn't be committed. Look at `packages/app-shell/.gitignore` for an example.
