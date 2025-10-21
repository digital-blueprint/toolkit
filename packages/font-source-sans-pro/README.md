# Subsetted Version of Sans Source Pro 2

You can install this component via npm:

```bash
npm i @dbp-toolkit/font-source-sans-pro
```

You can also use the files directly from the [CDN](https://unpkg.com/browse/@dbp-toolkit/font-source-sans-pro/files/).

## FAQ

- Why?

    We mostly use a light variant (300) of Source Sans Pro in our CI and any newer
    version and any version not based on the OTF variant looks horrible on low DPI
    screens on Windows and, to some extend, on Linux as well.

- Why OTF and not TTF?

    The TTF variant is hard to read on Windows with a low-DPI screen and a font
    weight of 300, OTF looks good on the other hand.

- Do I need to do this for every font?

    https://github.com/fontsource/fontsource has nice subsetted npm packages for
    various fonts. I'd try that first.

    Also see https://markoskon.com/creating-font-subsets for a nice article on the
    topic of subsetting.

## Rebuilding the fonts

- `uv sync`
- `uv run bash build.sh`
