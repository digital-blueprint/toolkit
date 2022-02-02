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
    --dbp-override-base: white;
    --dbp-override-base-inverted: black;
    --dbp-override-text: black;
    --dbp-override-text-inverted: white;
    --dbp-override-text-muted: #767676;
    --dbp-override-accent: #c24f68;
    --dbp-override-primary-base: #2a4491;
    --dbp-override-primary-text: white;
    --dbp-override-primary-border: 1px solid #2a4491;
    --dbp-override-secondary-base: white;
    --dbp-override-secondary-text: black;
    --dbp-override-secondary-border: 1px solid black;
    --dbp-override-info: #2a4491;
    --dbp-override-success: #188018;
    --dbp-override-warning-as-text: #c15500;
    --dbp-override-warning: #f99a41;
    --dbp-override-danger: #de3535;
    --dbp-override-border: 1px solid black;
    --dbp-override-border-radius: 0px;
    --dbp-override-hover-base: black;
    --dbp-override-hover-text: white;

  }

  .dark-theme{
    --dbp-override-base: #151515;
    --dbp-override-base-inverted: white;
    --dbp-override-text: white;
    --dbp-override-text-inverted: #151515;
    --dbp-override-text-muted: #666666;
    --dbp-override-accent: #c24f68;
    --dbp-override-primary-base: #8ca4eb;
    --dbp-override-primary-text: #151515;
    --dbp-override-primary-border: 1px solid #8ca4eb;
    --dbp-override-secondary-base: #151515;
    --dbp-override-secondary-text: white;
    --dbp-override-secondary-border: 1px solid white;
    --dbp-override-info: #8ca4eb;
    --dbp-override-success: #7acc79;
    --dbp-override-warning-as-text: #f99a41;
    --dbp-override-warning: #f99a41;
    --dbp-override-danger: #de3535;
    --dbp-override-border: 1px solid white;
    --dbp-override-border-radius: 0px;
    --dbp-override-hover-base: white;
    --dbp-override-hover-text: #151515;

  }
</style>
<script type="module" src="node_modules/@dbp-toolkit/theme-switcher/dist/dbp-theme-switcher.js"></script>
```

Or you can include the JS files directly via CDN:

```html
<script type="module" src="https://unpkg.com/@dbp-toolkit/theme-switcher@0.0.1/dist/theme-switcher.js"></script>
```

## Theme Switcher

### Usage

```html
<dbp-theme-switcher></dbp-theme-switcher>
```

### Attributes

- `lang` (optional, default: `de`): set to `de` or `en` for German or English
    - example `<dbp-file-source lang="de"></dbp-file-source>`
- `themes`: An array with objects with properties: `class` (defines the class name which is append to the body), 
    `icon` (defines the icon which is used for presenting the theme), `name` (defines the displayed name),
    - if no or only one theme object is added, then the theme switcher would not be displayed.
      - example `<dbp-theme-switcher
        themes='[{"class": "light-theme", "icon": "sun", "name": "Light Mode"},
        {"class": "dark-theme", "icon": "night", "name": "Dark Mode"}]'>
        </dbp-theme-switcher>` 
- `darkModeThemeOverride` (optional)
    - Options:
      - `darkModeThemeOverride` not set: the theme switcher detects if the browser uses the dark mode and add 
         the `dark-theme` class automatically to the body if it is in the themes array and no user preference is set
      - `darkModeThemeOverride` is set: the theme switcher not detects the browser color mode
      - `darkModeThemeOverride` is set with a string: e.g.: `darkModeThemeOverride="dunkles-theme`, the theme switcher
         detects if the browser uses the dark mode and handles the given string as dark mode class
      

### Note
The classes should be defined outside of the body tag.

## Local development

```bash
# get the source
git clone git@gitlab.tugraz.at:dbp/web-components/toolkit.git
cd toolkit/packages/theme-switcher

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8002 
yarn run watch-local

# build local packages in dist directory
yarn run build
```

Jump to <http://localhost:8002> and you should get a demo page.
