#!/bin/bash
# This script builds each package separately, which uncovers missing dependencies,
# which otherwise just happen to work because all dependencies are hoisted by default

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "${DIR}/.." && pwd)"
cd "${ROOT}"

rm -Rf node_modules
for d in ./toolkit-showcase ./packages/*; do
	# Special packages that don't have a build script
	if [ "$d" = "./packages/dev-utils" ] || [ "$d" = "./packages/font-source-sans-pro" ]; then
		continue
	fi
	cd "$d"
	rm -Rf node_modules
	npm ci
	# Make sure to fail if rollup reports unresolved imports
	npm run build -- --failAfterWarnings
	cd -
	rm -Rf node_modules
done
