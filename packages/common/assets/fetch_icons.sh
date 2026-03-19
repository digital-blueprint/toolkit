#!/usr/bin/env bash

set -euo pipefail

URL="https://cdn.lineicons.com/5.1/lineicons-5.1-free.zip"

ZIP_FILE="archive.zip"
OUT_DIR="lineicons51"
FIN_DIR="lineicons_5"
RAW_ICON_PATH="./$OUT_DIR/free-svg-files/*/*/outlined/*.svg"

# Prevent overwriting existing files/directories
if [ -e "$ZIP_FILE" ]; then
	echo "Error: $ZIP_FILE already exists. Aborting."
	exit 1
fi

if [ -e "$OUT_DIR" ]; then
	echo "Error: $OUT_DIR already exists. Aborting."
	exit 1
fi

if [ -e "$FIN_DIR" ]; then
	echo "Error: $FIN_DIR already exists. Aborting."
	exit 1
fi

echo "Downloading zip file..."
curl -L "$URL" -o "$ZIP_FILE"

echo "Extracting with ouch..."
mkdir "$OUT_DIR"
ouch decompress "$ZIP_FILE" -d "$OUT_DIR"

echo "Flattening $OUT_DIR to $FIN_DIR..."
mkdir $FIN_DIR
cp $RAW_ICON_PATH ./$FIN_DIR

echo "Done. All new icons are in $FIN_DIR."
echo "You can remove $ZIP_FILE and the directory $OUT_DIR if you'd like."
