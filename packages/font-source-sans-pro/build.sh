#!/bin/bash

set -e

# Subset taken from google fonts: https://fonts.googleapis.com/css?family=Source+Sans+Pro
LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
LATIN_EXT="U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF"
VIETNAMESE="U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB"
GREEK="U+0370-03FF"
GREEK_EXT="U+1F00-1FFF"
CYRILLIC="U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"
CYRILLIC_EXT="U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F"
EXT="$VIETNAMESE,$GREEK,$GREEK_EXT,$CYRILLIC,$CYRILLIC_EXT"


function build() {
    INPUT_NAME=$1
    INPUT_FORMAT='otf'
    STYLE=$2
    WEIGHT=$3
    BASE_DIR="source-sans-pro-2.045R-ro-1.095R-it"
    CSS_FILE="files/$WEIGHT.css"

    echo "$WEIGHT-$STYLE"

    SUBSET="rest"
    pyftsubset \
    "$BASE_DIR/${INPUT_FORMAT^^}/SourceSansPro-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2" \
    --flavor=woff2 \
    --layout-features='*' \
    --unicodes="$EXT"

    echo "
@font-face {
    font-family: 'Source Sans Pro';
    font-style: $STYLE;
    font-weight: $WEIGHT;
    font-display: swap;
    src: url(source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2) format('woff2');
    unicode-range: $EXT;
}" >> "$CSS_FILE"

    SUBSET="base-ext"
    pyftsubset \
    "$BASE_DIR/${INPUT_FORMAT^^}/SourceSansPro-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2" \
    --flavor=woff2 \
    --layout-features='*' \
    --unicodes="$LATIN_EXT"

    echo "
@font-face {
    font-family: 'Source Sans Pro';
    font-style: $STYLE;
    font-weight: $WEIGHT;
    font-display: swap;
    src: url(source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2) format('woff2');
    unicode-range: $LATIN_EXT;
}" >> "$CSS_FILE"

    SUBSET="base"
    pyftsubset \
    "$BASE_DIR/${INPUT_FORMAT^^}/SourceSansPro-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2" \
    --flavor=woff2 \
    --layout-features='*' \
    --unicodes="$LATIN"

    echo "
@font-face {
    font-family: 'Source Sans Pro';
    font-style: $STYLE;
    font-weight: $WEIGHT;
    font-display: swap;
    src: url(source-sans-pro-$SUBSET-$WEIGHT-$STYLE.woff2) format('woff2');
    unicode-range: $LATIN;
}" >> "$CSS_FILE"

}

function build_variable() {
    INPUT_NAME=$1
    INPUT_FORMAT='otf'
    STYLE=$2
    CSS_FILE="files/variable.css"
    FLAVOR=woff2

    echo "variable-$STYLE"

    SUBSET="rest"
    pyftsubset \
    "$BASE_DIR/VAR/SourceSansVariable-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-variable-$SUBSET-$STYLE.$FLAVOR" \
    --flavor=$FLAVOR \
    --layout-features='*' \
    --unicodes="$EXT"

    echo "
@font-face {
    font-family: 'Source Sans Variable';
    font-style: $STYLE;
    font-weight: 200 900;
    font-stretch: normal;
    font-display: swap;
    src: url(source-sans-variable-$SUBSET-$STYLE.$FLAVOR) format('$FLAVOR');
    unicode-range: $EXT;
}" >> "$CSS_FILE"

    SUBSET="base-ext"
    pyftsubset \
    "$BASE_DIR/VAR/SourceSansVariable-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-variable-$SUBSET-$STYLE.$FLAVOR" \
    --flavor=$FLAVOR \
    --layout-features='*' \
    --unicodes="$LATIN_EXT"

    echo "
@font-face {
    font-family: 'Source Sans Variable';
    font-style: $STYLE;
    font-weight: 200 900;
    font-stretch: normal;
    font-display: swap;
    src: url(source-sans-variable-$SUBSET-$STYLE.$FLAVOR) format('$FLAVOR');
    unicode-range: $LATIN_EXT;
}" >> "$CSS_FILE"

    SUBSET="base"
    pyftsubset \
    "$BASE_DIR/VAR/SourceSansVariable-$INPUT_NAME.${INPUT_FORMAT,,}" \
    --output-file="files/source-sans-variable-$SUBSET-$STYLE.$FLAVOR" \
    --flavor=$FLAVOR \
    --layout-features='*' \
    --unicodes="$LATIN"

    echo "
@font-face {
    font-family: 'Source Sans Variable';
    font-style: $STYLE;
    font-weight: 200 900;
    font-stretch: normal;
    font-display: swap;
    src: url(source-sans-variable-$SUBSET-$STYLE.woff2) format('$FLAVOR');
    unicode-range: $LATIN;
}" >> "$CSS_FILE"
}


function main() {
    # Extract upstream release
    RELEASE="source-sans-pro-2.045R-ro-1.095R-it"

    [ -d "$RELEASE" ] || (
        wget -c "https://github.com/adobe-fonts/source-sans-pro/releases/download/2.045R-ro%2F1.095R-it/$RELEASE.zip";
        unzip "$RELEASE.zip"
        rm "$RELEASE.zip")

    BASE_DIR="$RELEASE"

    rm -rf files
    mkdir -p "files"

    build_variable "Roman" "normal"
    build_variable "Italic" "italic"

    build "ExtraLight" "normal" "200"
    build "ExtraLightIt" "italic" "200"

    build "Light" "normal" "300"
    build "LightIt" "italic" "300"

    build "Regular" "normal" "400"
    build "It" "italic" "400"

    build "Semibold" "normal" "600"
    build "SemiboldIt" "italic" "600"

    build "Bold" "normal" "700"
    build "BoldIt" "italic" "700"

    build "Black" "normal" "900"
    build "BlackIt" "italic" "900"

    cat files/200.css files/300.css files/400.css files/600.css files/700.css files/900.css > files/static.css

    rm -rf "$RELEASE"
}

main;