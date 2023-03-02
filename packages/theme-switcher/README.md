# Theme-Switcher web component

This web component allows to switch between multiple predefined themes and can detect browsers default theme.

## Installation

You can install these components via npm:

```bash
npm i @dbp-toolkit/theme-switcher
```

After you have installed the theme-switcher component via npm you can use this example to get a button
that opens a dialogue with multiple themes. After you have selected a theme the class of the theme is 
applied to the body of your html document. To add a style to the specific class you have to 

```html
<dbp-theme-switcher 
        themes='[{"class": "light-theme", "icon": "sun", "name": "Light Mode"}, 
        {"class": "dark-theme", "icon": "night", "name": "Dark Mode"}]'>
</dbp-theme-switcher>


<style>
  .light-theme{
            --dbp-override-background: white;
            --dbp-override-content: black;

            --dbp-override-primary: #2a4491;
            --dbp-override-secondary: black;
            --dbp-override-secondary-surface: white;
            --dbp-override-on-secondary-surface: black;
            --dbp-override-secondary-surface-border-color: black;

            --dbp-override-muted: #767676;
            --dbp-override-accent: #c24f68;
            --dbp-override-info: #2a4491;
            --dbp-override-success: #188018;
            --dbp-override-warning: #c15500;
            --dbp-override-warning-surface: #ffad4d;
            --dbp-override-on-warning-surface: black;
            --dbp-override-danger: #de3535;

            --dbp-override-border: 1px solid black;

            --dbp-override-hover-background-color: black;
            --dbp-override-hover-color: white;
        }

        .dark-theme{
            --dbp-override-background: #151515;
            --dbp-override-content: white;

            --dbp-override-primary: #8ca4eb;
            --dbp-override-secondary: white;
            --dbp-override-secondary-surface: #151515;
            --dbp-override-on-secondary-surface: white;
            --dbp-override-secondary-surface-border-color: #151515;

            --dbp-override-muted: #666666;
            --dbp-override-accent: #c24f68;
            --dbp-override-info: #8ca4eb;
            --dbp-override-success: #7acc79;
            --dbp-override-warning: #f99a41;
            --dbp-override-on-warning-surface: black;
            --dbp-override-danger: #de3535;

            --dbp-override-border: 1px solid white;

            --dbp-override-hover-background-color: white;
            --dbp-override-hover-color: #151515;
        }
</style>
<script type="module" src="node_modules/@dbp-toolkit/theme-switcher/dist/dbp-theme-switcher.js"></script>
```

Or you can include the JS files directly via CDN:

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/theme-switcher@0.0.1/dist/theme-switcher.js"></script>
```

## Usage

```html
<dbp-theme-switcher></dbp-theme-switcher>
```

## Usage in an application with appshell
If you want to use multiple themes in the appshell, then you have to define the classes inside the `<head>` tag inside the `<style>` tag.

Then add the themes attribute with your themes to the application tag in the `<body>` tag.

### Themes attribute

The themes attribute is organized as an array with objects. The objects have following properties: class(name of the class added to the style tag), 
icon (name of an icon, which is displayed infront of the Theme name) and name(Friendly name of your theme).

Attention! Currently we don't support translation of the friendly name, so choose an across languages name.

```html

        themes='[{"class": "name-of-your-class", "icon": "name-of-the-icon", "name": "Friendly name of your theme"}, 
        {"class": "name-of-another-class", "icon": "name-of-the-icon", "name": "Friendly name of another theme"}]'

```

### Example
A full example can be found in each application in the `index.html` of the `app-template` folder. (E.g. [Greenlight app-template](https://gitlab.tugraz.at/dbp/greenlight/greenlight/-/blob/main/app-template/index.html))



## Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-source lang="de"></dbp-file-source>`
- `themes`: An array with objects with properties: `class` (defines the class name which is append to the body), 
    `icon` (defines the icon which is used for presenting the theme), `name` (defines the displayed name),
    - if no or only one theme object is added, then the theme switcher would not be displayed.
      - example `<dbp-theme-switcher
        themes='[{"class": "light-theme", "icon": "sun", "name": "Light Mode"},
        {"class": "dark-theme", "icon": "night", "name": "Dark Mode"}]'>
        </dbp-theme-switcher>` 
- `dark-mode-theme-override` (optional)
    - Options:
      - `dark-mode-theme-override` not set: the theme switcher detects if the browser uses the dark mode and add 
         the `dark-theme` class automatically to the body if it is in the themes array and no user preference is set
      - `dark-mode-theme-override` is set: the theme switcher not detects the browser color mode
      - `dark-mode-theme-override` is set with a string: e.g.: `dark-mode-theme-override="dunkles-theme`, the theme switcher
         detects if the browser uses the dark mode and handles the given string as dark mode class
- `dropdown-right` (optional, default: `false`): boolean which indicates that you want the dropdown from the theme menu on the right side, default on the left side
  - example: `<dbp-file-source dropdown-right></dbp-file-source>`
      

## Note
The classes should be defined outside the body tag.

## Local development

```bash
# get the source
git clone git@github.com:digital-blueprint/toolkit.git
cd toolkit/packages/theme-switcher

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
