# Use `just <recipe>` to run a recipe
# https://just.systems/man/en/

import "shared/justfile"

# By default, run the `--list` command
default:
    @just --list

# Variables

zellijSession := "dbp-toolkit"
